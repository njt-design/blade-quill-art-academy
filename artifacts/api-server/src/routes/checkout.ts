import { Router, type IRouter, type Request, type Response } from "express";
import { supabase } from "@workspace/db";
import Stripe from "stripe";
import crypto from "crypto";
import {
  CreateCheckoutSessionBody,
  GetOrderSuccessQueryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

const NODE_ENV = process.env.NODE_ENV ?? "production";

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  return new Stripe(key);
}

function getBaseUrl(req: Request): string {
  const host = (req.headers["x-forwarded-host"] as string) || (req.headers.host as string) || "localhost";
  const proto = (req.headers["x-forwarded-proto"] as string) || "https";
  return `${proto}://${host}`;
}

function generateDownloadToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

function getTokenExpiry(): string {
  const expiry = new Date();
  expiry.setHours(expiry.getHours() + 48);
  return expiry.toISOString();
}

async function fulfillOrder(sessionId: string, customerEmail: string | null): Promise<void> {
  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("stripe_session_id", sessionId)
    .single();

  if (!order) return;
  if (order.status === "paid") return;

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", order.product_id)
    .single();

  const updates: Record<string, unknown> = {
    status: "paid",
    ...(customerEmail ? { customer_email: customerEmail } : {}),
  };

  if (product && (product.category === "digital" || product.category === "curriculum") && product.download_url) {
    updates.download_token = generateDownloadToken();
    updates.download_token_expires_at = getTokenExpiry();
  }

  await supabase
    .from("orders")
    .update(updates)
    .eq("stripe_session_id", sessionId);
}

router.post("/checkout", async (req: Request, res: Response): Promise<void> => {
  try {
    const body = CreateCheckoutSessionBody.parse(req.body);

    const { data: product, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", body.productId)
      .single();

    if (error || !product) {
      res.status(400).json({ error: "Product not found" });
      return;
    }

    if (!product.in_stock) {
      res.status(400).json({ error: "Product is out of stock" });
      return;
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      res.status(500).json({ error: "Payment system not configured. Please add STRIPE_SECRET_KEY." });
      return;
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
              images: product.image_url ? [product.image_url] : [],
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

    await supabase.from("orders").insert({
      stripe_session_id: session.id,
      product_id: product.id,
      status: "pending",
    });

    res.json({ url: session.url!, sessionId: session.id });
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "ZodError") {
      res.status(400).json({ error: "Invalid request" });
      return;
    }
    console.error("Checkout error:", err);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});

router.get("/checkout/success", async (req: Request, res: Response): Promise<void> => {
  try {
    const { session_id } = GetOrderSuccessQueryParams.parse(req.query);

    if (!process.env.STRIPE_SECRET_KEY) {
      res.status(503).json({ error: "Payment verification unavailable" });
      return;
    }

    const stripe = getStripe();

    let session: Stripe.Checkout.Session;
    try {
      session = await stripe.checkout.sessions.retrieve(session_id);
    } catch (stripeErr) {
      console.error("Stripe session retrieval error:", stripeErr);
      res.status(400).json({ error: "Invalid session ID" });
      return;
    }

    if (session.payment_status !== "paid") {
      res.status(402).json({ error: "Payment not confirmed" });
      return;
    }

    await fulfillOrder(session_id, session.customer_details?.email ?? null);

    const { data: order } = await supabase
      .from("orders")
      .select("*")
      .eq("stripe_session_id", session_id)
      .single();

    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    const { data: product } = await supabase
      .from("products")
      .select("*")
      .eq("id", order.product_id)
      .single();

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    let downloadUrl: string | null = null;
    if (order.download_token && order.download_token_expires_at) {
      const now = new Date();
      if (new Date(order.download_token_expires_at) > now) {
        downloadUrl = `/api/download/${order.download_token}`;
      }
    }

    res.json({
      productName: product.name,
      productCategory: product.category,
      gumroadUrl: product.gumroad_url ?? null,
      downloadUrl,
      email: order.customer_email ?? null,
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "ZodError") {
      res.status(400).json({ error: "Invalid request" });
      return;
    }
    console.error("Order success error:", err);
    res.status(500).json({ error: "Failed to retrieve order" });
  }
});

router.post("/stripe/webhook", async (req: Request, res: Response): Promise<void> => {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!process.env.STRIPE_SECRET_KEY) {
    res.status(503).send("Payment system not configured");
    return;
  }

  const stripe = getStripe();

  let event: Stripe.Event;

  if (webhookSecret) {
    const sig = req.headers["stripe-signature"];
    if (!sig) {
      res.status(400).send("Missing stripe-signature header");
      return;
    }
    try {
      event = stripe.webhooks.constructEvent(req.body as Buffer, sig as string, webhookSecret);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      console.error("Webhook signature verification failed:", message);
      res.status(400).send(`Webhook error: ${message}`);
      return;
    }
  } else if (NODE_ENV === "development") {
    try {
      event = JSON.parse(req.body.toString()) as Stripe.Event;
      console.warn("STRIPE_WEBHOOK_SECRET not set — skipping signature verification (development only)");
    } catch {
      res.status(400).send("Invalid JSON payload");
      return;
    }
  } else {
    console.error("STRIPE_WEBHOOK_SECRET is required in production");
    res.status(400).send("Webhook secret not configured");
    return;
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.payment_status === "paid") {
      try {
        await fulfillOrder(session.id, session.customer_details?.email ?? null);
        console.log(`Order fulfilled for session ${session.id}`);
      } catch (err) {
        console.error("Fulfillment error:", err);
        res.status(500).send("Fulfillment error");
        return;
      }
    }
  }

  if (event.type === "checkout.session.async_payment_succeeded") {
    const session = event.data.object as Stripe.Checkout.Session;
    try {
      await fulfillOrder(session.id, session.customer_details?.email ?? null);
    } catch (err) {
      console.error("Async fulfillment error:", err);
      res.status(500).send("Fulfillment error");
      return;
    }
  }

  res.json({ received: true });
});

router.get("/download/:token", async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.params;

    const { data: order } = await supabase
      .from("orders")
      .select("*")
      .eq("download_token", token)
      .single();

    if (!order) {
      res.status(404).json({ error: "Invalid or expired download link" });
      return;
    }

    if (order.status !== "paid") {
      res.status(402).json({ error: "Payment not confirmed for this download" });
      return;
    }

    if (!order.download_token_expires_at || new Date(order.download_token_expires_at) < new Date()) {
      res.status(410).json({ error: "Download link has expired" });
      return;
    }

    const { data: product } = await supabase
      .from("products")
      .select("*")
      .eq("id", order.product_id)
      .single();

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    if (!product.download_url) {
      res.status(404).json({ error: "No download file available for this product" });
      return;
    }

    res.redirect(302, product.download_url);
  } catch (err) {
    console.error("Download error:", err);
    res.status(500).json({ error: "Download failed" });
  }
});

export default router;
