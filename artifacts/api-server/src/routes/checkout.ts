import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { productsTable, ordersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import Stripe from "stripe";
import {
  CreateCheckoutSessionBody,
  GetOrderSuccessQueryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  return new Stripe(key, { apiVersion: "2025-02-24.acacia" });
}

function getBaseUrl(req: any): string {
  const host = req.headers["x-forwarded-host"] || req.headers.host || "localhost";
  const proto = req.headers["x-forwarded-proto"] || "https";
  return `${proto}://${host}`;
}

router.post("/checkout", async (req, res) => {
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

    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
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

router.get("/checkout/success", async (req, res) => {
  try {
    const { session_id } = GetOrderSuccessQueryParams.parse(req.query);

    const orderRows = await db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.stripeSessionId, session_id));

    if (orderRows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    const order = orderRows[0];

    if (process.env.STRIPE_SECRET_KEY) {
      try {
        const stripe = getStripe();
        const session = await stripe.checkout.sessions.retrieve(session_id);
        if (session.payment_status === "paid" && order.status !== "paid") {
          await db
            .update(ordersTable)
            .set({ status: "paid", customerEmail: session.customer_details?.email ?? undefined })
            .where(eq(ordersTable.stripeSessionId, session_id));
          order.status = "paid";
          order.customerEmail = session.customer_details?.email ?? null;
        }
      } catch (stripeErr) {
        console.error("Stripe session retrieval error:", stripeErr);
      }
    }

    const productRows = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, order.productId));

    if (productRows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    const product = productRows[0];

    res.json({
      productName: product.name,
      productCategory: product.category,
      gumroadUrl: product.gumroadUrl ?? null,
      downloadUrl: product.downloadUrl ?? null,
      email: order.customerEmail ?? null,
    });
  } catch (err: any) {
    if (err?.name === "ZodError") {
      return res.status(400).json({ error: "Invalid request" });
    }
    res.status(500).json({ error: "Failed to retrieve order" });
  }
});

export default router;
