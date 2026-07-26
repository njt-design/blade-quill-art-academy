/**
 * GET /api/download/:token — redirect to the snapshotted download URL after paid order.
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { resolveDownloadRedirect } from "../../lib/checkout/src/index";
import { sendCheckoutError } from "../_lib/http";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const token =
      typeof req.query.token === "string"
        ? req.query.token
        : Array.isArray(req.query.token)
          ? String(req.query.token[0] ?? "")
          : "";
    const url = await resolveDownloadRedirect(token);
    res.redirect(302, url);
  } catch (err) {
    sendCheckoutError(res, err);
  }
}
