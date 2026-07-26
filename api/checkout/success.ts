/**
 * GET /api/checkout/success?session_id=...
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getOrderSuccess } from "../../lib/checkout/src/index";
import { sendCheckoutError } from "../_lib/http";

export default async function handler(req: VercelRequest, res: VercelResponse) {
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
