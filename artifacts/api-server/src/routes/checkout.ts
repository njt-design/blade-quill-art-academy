import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { productsTable, ordersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import Stripe from "stripe";
import crypto from "crypto";
import {
  CreateCheckoutSessionBody,
  GetOrderSuccessQueryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  return new Stripe(key, { apiVersion: "2025-02-24.acacia" });
}

function getBaseUrl(req: Request): string {
  const host = (req.headers["x-forwarded-host"] as string) || (req.headers.host as string) || "localhost";
  const proto = (req.headers["x-forwarded-proto"] as string) || "https";
  return `${proto}://${host}`;
}

function generateDownloadToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

function getTokenExpiry(): Date {
  const expiry = new Date();
  expiry.setHours(expiry.getHours() + 48);
  return expiry;
}

async function fulfillOrder(sessionId: string, customerEmail: string | null): Promise<void> {
  const orderRows = await db
    .select()
    .from(ordersTable)
    .where(eq(ordersTable.stripeSessionId, sessionId));

  if (orderRows.length === 0) return;
  const order = orderRows[0];
  if (order.status === "paid") return;

  const productRows = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.id, order.productId));

  const product = productRows[0];

  const updates: Partial<typeof ordersTable.$inferInsert> = {
    status: "paid",
    customerEmail: customerEmail ?? undefined,
  };

  if (product && (product.category === "digital" || product.category === "curriculum") && product.downloadUrl) {
    updates.downloadToken = generateDownloadToken();
    updates.downloadTokenExpiresAt = getTokenExpiry();
  }

  await db
    .update(ordersTable)
    .set(updates)
    .where(eq(ordersTable.stripeSessionId, sessionId));
}

router.post("/checkout", async (req: Request, res: Response) => {
  try {
    const body = CreateCheckoutSessionBody.parse(req.body);

    const rows = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, body.productId));

    if (rows.length === 0) {
      return res.status(400).json({ error: "Product not found" });
    }

    const product = rows[0];
    if (!product.inStock) {
      return res.status(400).json({ error: "Product is out of stock" });
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({ error: "Payment system not configured. Please add STRIPE_SECRET_KEY." });
    }

    const stripe = getStripe();
    const baseUrl = getBaseUrl(req);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.name,
              description: product.description,
              images: product.imageUrl ? [product.imageUrl] : [],
            },
            unit_amount: Math.round(parseFloat(product.price) * 100),
          },
          quantity: body.quantity,
        },
      ],
      mode: "payment",
      success_url: `${baseUrl}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/shop/${product.id}`,
    });

    await db.insert(ordersTable).values({
      stripeSessionId: session.id,
      productId: product.id,
      status: "pending",
    });

    res.json({ url: session.url!, sessionId: session.id });
  } catch (err: any) {
    if (err?.name === "ZodError") {
      return res.status(400).json({ error: "Invalid request" });
    }
    console.error("Checkout error:", err);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});

router.get("/checkout/success", async (req: Request, res: Response) => {
  try {
    const { session_id } = GetOrderSuccessQueryParams.parse(req.query);

    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(503).json({ error: "Payment verification unavailable" });
    }

    const stripe = getStripe();

    let session: Stripe.Checkout.Session;
    try {
      session = await stripe.checkout.sessions.retrieve(session_id);
    } catch (stripeErr) {
      console.error("Stripe session retrieval error:", stripeErr);
      return res.status(400).json({ error: "Invalid session ID" });
    }

    if (session.payment_status !== "paid") {
      return res.status(402).json({ error: "Payment not confirmed" });
    }

    await fulfillOrder(session_id, session.customer_details?.email ?? null);

    const orderRows = await db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.stripeSessionId, session_id));

    if (orderRows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    const order = orderRows[0];

    const productRows = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, order.productId));

    if (productRows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    const product = productRows[0];

    let downloadUrl: string | null = null;
    if (order.downloadToken && order.downloadTokenExpiresAt) {
      const now = new Date();
      if (order.downloadTokenExpiresAt > now) {
        downloadUrl = `/api/download/${order.downloadToken}`;
      }
    }

    res.json({
      productName: product.name,
      productCategory: product.category,
      gumroadUrl: product.gumroadUrl ?? null,
      downloadUrl,
      email: order.customerEmail ?? null,
    });
  } catch (err: any) {
    if (err?.name === "ZodError") {
      return res.status(400).json({ error: "Invalid request" });
    }
    console.error("Order success error:", err);
    res.status(500).json({ error: "Failed to retrieve order" });
  }
});

router.post("/stripe/webhook", async (req: Request, res: Response) => {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(503).send("Payment system not configured");
  }

  const stripe = getStripe();

  let event: Stripe.Event;

  if (webhookSecret) {
    const sig = req.headers["stripe-signature"];
    if (!sig) {
      return res.status(400).send("Missing stripe-signature header");
    }
    try {
      event = stripe.webhooks.constructEvent(req.body as Buffer, sig, webhookSecret);
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook error: ${err.message}`);
    }
  } else {
    try {
      event = JSON.parse(req.body.toString()) as Stripe.Event;
      console.warn("STRIPE_WEBHOOK_SECRET not set — skipping signature verification (dev mode only)");
    } catch {
      return res.status(400).send("Invalid JSON payload");
    }
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.payment_status === "paid") {
      try {
        await fulfillOrder(session.id, session.customer_details?.email ?? null);
        console.log(`Order fulfilled for session ${session.id}`);
      } catch (err) {
        console.error("Fulfillment error:", err);
        return res.status(500).send("Fulfillment error");
      }
    }
  }

  if (event.type === "checkout.session.async_payment_succeeded") {
    const session = event.data.object as Stripe.Checkout.Session;
    try {
      await fulfillOrder(session.id, session.customer_details?.email ?? null);
    } catch (err) {
      console.error("Async fulfillment error:", err);
      return res.status(500).send("Fulfillment error");
    }
  }

  res.json({ received: true });
});

router.get("/download/:token", async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    const orderRows = await db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.downloadToken, token));

    if (orderRows.length === 0) {
      return res.status(404).json({ error: "Invalid or expired download link" });
    }

    const order = orderRows[0];

    if (order.status !== "paid") {
      return res.status(402).json({ error: "Payment not confirmed for this download" });
    }

    if (!order.downloadTokenExpiresAt || order.downloadTokenExpiresAt < new Date()) {
      return res.status(410).json({ error: "Download link has expired" });
    }

    const productRows = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, order.productId));

    if (productRows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    const product = productRows[0];

    if (!product.downloadUrl) {
      return res.status(404).json({ error: "No download file available for this product" });
    }

    res.redirect(302, product.downloadUrl);
  } catch (err) {
    console.error("Download error:", err);
    res.status(500).json({ error: "Download failed" });
  }
});

export default router;
