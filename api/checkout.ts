/**
 * /api/checkout — Stripe Checkout, two routes in one function (Vercel Hobby
 * caps deployments at 12 serverless functions):
 * - POST /api/checkout                     → create a Checkout Session from the
 *                                             Tina product price
 * - GET  /api/checkout/success?session_id= → order summary + download links
 *         (reached via the vercel.json rewrite to /api/checkout?__route=success)
 *
 * Env: STRIPE_SECRET_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
 *      TINA_PUBLIC_CLIENT_ID, TINA_TOKEN (or TINA_PUBLIC_READONLY_TOKEN)
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createCheckoutSession, getOrderSuccess } from "../lib/checkout/src/index";
import { sendCheckoutError, siteBaseUrl } from "./_lib/http";

async function successHandler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const sessionId =
      typeof req.query.session_id === "string" ? req.query.session_id : "";
    const result = await getOrderSuccess(sessionId);
    res.status(200).json(result);
  } catch (err) {
    sendCheckoutError(res, err);
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // /api/checkout/success arrives here via the vercel.json rewrite.
  if (req.query.__route === "success") {
    return successHandler(req, res);
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const body = (req.body ?? {}) as {
      productId?: unknown;
      quantity?: unknown;
      productSlug?: unknown;
    };
    const productId = Number(body.productId);
    const quantity = Number(body.quantity);
    const productSlug =
      typeof body.productSlug === "string" ? body.productSlug : undefined;
    const result = await createCheckoutSession({
      productId,
      quantity,
      productSlug,
      baseUrl: siteBaseUrl(req),
    });
    res.status(200).json(result);
  } catch (err) {
    sendCheckoutError(res, err);
  }
}
