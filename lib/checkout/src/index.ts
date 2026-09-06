import type { ServerResponse } from "node:http";
import type Stripe from "stripe";
import { getStripe, hasStripe, hasSupabase } from "./clients";
import {
  getDownloadableOrder,
  pickFile,
  signFileUrl,
  streamOrderArchive,
} from "./downloads";
import {
  fulfillOrder,
  getOrderBySessionId,
  insertPendingOrder,
  orderFiles,
} from "./orders";
import { findTinaProductById } from "./tina-product";
import {
  CheckoutError,
  type CreateCheckoutResult,
  type OrderDownloadLink,
  type OrderSuccessResult,
} from "./types";

export { CheckoutError, DOWNLOADABLE_CATEGORIES } from "./types";
export type {
  CheckoutProduct,
  CreateCheckoutResult,
  DownloadFile,
  OrderDownloadLink,
  OrderSuccessResult,
} from "./types";
export { DOWNLOADS_BUCKET, getDownloadableOrder, streamOrderArchive } from "./downloads";

function requirePaymentsConfigured(): void {
  if (!hasStripe()) {
    throw new CheckoutError(
      "not_configured",
      "Payment system not configured. Please add STRIPE_SECRET_KEY.",
      500
    );
  }
  if (!hasSupabase()) {
    throw new CheckoutError(
      "not_configured",
      "Order storage not configured. Please add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
      500
    );
  }
}

export async function createCheckoutSession(input: {
  productId: number;
  quantity: number;
  baseUrl: string;
  /** Optional Tina filename slug — O(1) path lookup for large catalogs. */
  productSlug?: string;
}): Promise<CreateCheckoutResult> {
  requirePaymentsConfigured();

  if (
    !Number.isInteger(input.productId) ||
    input.productId <= 0 ||
    !Number.isInteger(input.quantity) ||
    input.quantity < 1
  ) {
    throw new CheckoutError("invalid_request", "Invalid request", 400);
  }

  const product = await findTinaProductById(
    input.productId,
    input.baseUrl,
    input.productSlug
  );
  if (!product) {
    throw new CheckoutError("product_not_found", "Product not found", 400);
  }
  if (!product.inStock) {
    throw new CheckoutError("out_of_stock", "Product is out of stock", 400);
  }

  const stripe = getStripe();
  const unitAmount = Math.round(product.price * 100);
  if (!Number.isFinite(unitAmount) || unitAmount < 50) {
    // Stripe minimum is typically $0.50 USD
    throw new CheckoutError("invalid_request", "Product price is invalid", 400);
  }

  const cancelPath = product.slug
    ? `/shop/${product.slug}`
    : `/shop/${product.productId}`;

  let session: Awaited<ReturnType<Stripe["checkout"]["sessions"]["create"]>>;
  try {
    session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.name,
              description: product.description,
              ...(product.imageUrl ? { images: [product.imageUrl] } : {}),
            },
            unit_amount: unitAmount,
          },
          quantity: input.quantity,
        },
      ],
      mode: "payment",
      success_url: `${input.baseUrl}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${input.baseUrl}${cancelPath}`,
      metadata: {
        productId: String(product.productId),
        productSlug: product.slug,
      },
    });
  } catch (err) {
    console.error("Stripe session create failed:", err);
    throw new CheckoutError(
      "internal",
      "Failed to create checkout session",
      500
    );
  }

  if (!session.url) {
    throw new CheckoutError("internal", "Failed to create checkout session", 500);
  }

  try {
    await insertPendingOrder(session.id, product);
  } catch (err) {
    // Order storage failed after the Stripe session was created. Expire the
    // session so the buyer can't pay for an order we have no record of.
    console.error("Pending order insert failed:", err);
    try {
      await stripe.checkout.sessions.expire(session.id);
    } catch (expireErr) {
      console.error("Failed to expire orphaned session", session.id, expireErr);
    }
    throw new CheckoutError(
      "internal",
      "Failed to create checkout session",
      500
    );
  }

  return { url: session.url, sessionId: session.id };
}

export async function getOrderSuccess(
  sessionId: string
): Promise<OrderSuccessResult> {
  requirePaymentsConfigured();
  if (!sessionId) {
    throw new CheckoutError("invalid_request", "Invalid request", 400);
  }

  const stripe = getStripe();
  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId);
  } catch {
    throw new CheckoutError("invalid_session", "Invalid session ID", 400);
  }

  if (session.payment_status !== "paid") {
    throw new CheckoutError(
      "payment_unconfirmed",
      "Payment not confirmed",
      402
    );
  }

  const order = await fulfillOrder(
    sessionId,
    session.customer_details?.email ?? null
  );
  if (!order) {
    throw new CheckoutError("order_not_found", "Order not found", 404);
  }

  let downloads: OrderDownloadLink[] = [];
  let downloadAllUrl: string | null = null;
  const tokenLive =
    order.download_token &&
    order.download_token_expires_at &&
    new Date(order.download_token_expires_at) > new Date();
  if (tokenLive) {
    const base = `/api/download/${order.download_token}`;
    downloads = orderFiles(order).map((f, i) => ({
      label: f.label,
      url: `${base}?file=${i}`,
    }));
    if (downloads.length > 1) downloadAllUrl = `${base}?all=1`;
  }

  return {
    productName: order.product_name || "Your purchase",
    productCategory: order.product_category || "digital",
    gumroadUrl: order.gumroad_url,
    downloadUrl: downloads.length === 1 ? downloads[0].url : null,
    downloads,
    downloadAllUrl,
    email: order.customer_email,
  };
}

export async function handleStripeWebhook(input: {
  rawBody: Buffer | string;
  signature: string | string[] | undefined;
  allowUnsignedInDev?: boolean;
}): Promise<{ received: true }> {
  requirePaymentsConfigured();
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  const nodeEnv = process.env.NODE_ENV ?? "production";

  let event: Stripe.Event;

  if (webhookSecret) {
    if (!input.signature) {
      throw new CheckoutError(
        "invalid_request",
        "Missing stripe-signature header",
        400
      );
    }
    try {
      event = stripe.webhooks.constructEvent(
        input.rawBody,
        input.signature,
        webhookSecret
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      throw new CheckoutError(
        "invalid_request",
        `Webhook error: ${message}`,
        400
      );
    }
  } else if (input.allowUnsignedInDev && nodeEnv === "development") {
    const text =
      typeof input.rawBody === "string"
        ? input.rawBody
        : input.rawBody.toString("utf8");
    try {
      event = JSON.parse(text) as Stripe.Event;
      console.warn(
        "STRIPE_WEBHOOK_SECRET not set — skipping signature verification (development only)"
      );
    } catch {
      throw new CheckoutError("invalid_request", "Invalid JSON payload", 400);
    }
  } else {
    throw new CheckoutError(
      "not_configured",
      "Webhook secret not configured",
      400
    );
  }

  if (
    event.type === "checkout.session.completed" ||
    event.type === "checkout.session.async_payment_succeeded"
  ) {
    const session = event.data.object as Stripe.Checkout.Session;
    const shouldFulfill =
      event.type === "checkout.session.async_payment_succeeded" ||
      session.payment_status === "paid";
    if (shouldFulfill) {
      await fulfillOrder(session.id, session.customer_details?.email ?? null);
    }
  }

  return { received: true };
}

/**
 * Resolve a download request into either a redirect URL (one file) or a
 * streamed zip (many files). `fileIndex` selects one file; `all` forces the
 * zip. Used by /api/download/[token] on Vercel and the Express dev server.
 */
export async function serveDownload(
  token: string,
  opts: { fileIndex?: number; all?: boolean },
  res: ServerResponse
): Promise<void> {
  requirePaymentsConfigured();
  const { order, files } = await getDownloadableOrder(token);

  const wantsZip = opts.all || (opts.fileIndex === undefined && files.length > 1);
  if (wantsZip) {
    await streamOrderArchive(order, files, res);
    return;
  }

  const file = pickFile(files, opts.fileIndex);
  const url = await signFileUrl(file.path);
  res.statusCode = 302;
  res.setHeader("Location", url);
  res.setHeader("Cache-Control", "private, no-store");
  res.end();
}

/**
 * Back-compat: resolve a token to a single redirect URL. Multi-file orders
 * resolve to their first file; prefer `serveDownload`.
 */
export async function resolveDownloadRedirect(token: string): Promise<string> {
  requirePaymentsConfigured();
  const { files } = await getDownloadableOrder(token);
  return signFileUrl(files[0].path);
}

/** Re-export for callers that need a session lookup without fulfillment. */
export { getOrderBySessionId, fulfillOrder };
export { findTinaProductById } from "./tina-product";
