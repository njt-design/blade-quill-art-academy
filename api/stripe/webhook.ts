/**
 * POST /api/stripe/webhook — Stripe signed webhook for order fulfillment.
 *
 * Env: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, SUPABASE_*
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { handleStripeWebhook } from "../../lib/checkout/src/index";
import { readRawBody, sendCheckoutError } from "../_lib/http";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).send("Method not allowed");
    return;
  }

  try {
    const rawBody = await readRawBody(req);
    const result = await handleStripeWebhook({
      rawBody,
      signature: req.headers["stripe-signature"],
      allowUnsignedInDev: false,
    });
    res.status(200).json(result);
  } catch (err) {
    sendCheckoutError(res, err);
  }
}
