/**
 * POST /api/checkout — create a Stripe Checkout Session from Tina product price.
 *
 * Env: STRIPE_SECRET_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
 *      TINA_PUBLIC_CLIENT_ID, TINA_TOKEN (or TINA_PUBLIC_READONLY_TOKEN)
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createCheckoutSession } from "../lib/checkout/src/index";
import { sendCheckoutError, siteBaseUrl } from "./_lib/http";

export default async function handler(req: VercelRequest, res: VercelResponse) {
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
