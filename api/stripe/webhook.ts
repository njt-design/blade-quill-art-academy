/**
 * POST /api/stripe/webhook — Stripe signed webhook for order fulfillment.
 *
 * Uses the Web-standard handler signature (not VercelRequest) because Stripe
 * signs the exact raw bytes it sends. Vercel's Node request helpers pre-parse
 * JSON bodies into `req.body`, and re-serializing that object drops the
 * whitespace Stripe includes, so signature verification fails on every real
 * event. `request.text()` here is guaranteed to be the untouched body.
 *
 * Env: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, SUPABASE_*
 */
import {
  CheckoutError,
  handleStripeWebhook,
} from "../../lib/checkout/src/index";

export async function POST(request: Request): Promise<Response> {
  try {
    const rawBody = await request.text();
    const result = await handleStripeWebhook({
      rawBody,
      signature: request.headers.get("stripe-signature") ?? undefined,
      allowUnsignedInDev: false,
    });
    return Response.json(result);
  } catch (err) {
    if (err instanceof CheckoutError) {
      return Response.json({ error: err.message }, { status: err.status });
    }
    console.error(err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export function GET(): Response {
  return new Response("Method not allowed", {
    status: 405,
    headers: { Allow: "POST" },
  });
}
