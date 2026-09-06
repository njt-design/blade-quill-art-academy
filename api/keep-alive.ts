/**
 * GET /api/keep-alive — daily Vercel Cron that queries Supabase so the
 * free-tier project is not paused for inactivity.
 *
 * Vercel sends Authorization: Bearer $CRON_SECRET when that env var is set
 * (created automatically once a cron is configured).
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getSupabase } from "../lib/checkout/src/clients";

function bearerToken(req: VercelRequest): string | undefined {
  const header = req.headers.authorization;
  const value = Array.isArray(header) ? header[0] : header;
  if (!value?.startsWith("Bearer ")) return undefined;
  return value.slice("Bearer ".length);
}

function isAuthorized(req: VercelRequest): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) {
    if (process.env.VERCEL) {
      console.warn("keep-alive: CRON_SECRET is not set; allowing request");
    }
    return true;
  }
  return bearerToken(req) === secret;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  if (!isAuthorized(req)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const supabase = getSupabase();
    const { error } = await supabase.from("orders").select("id").limit(1);
    if (error) {
      console.error("keep-alive: Supabase ping failed:", error.message);
      res.status(502).json({ ok: false, error: "Supabase ping failed" });
      return;
    }
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("keep-alive:", err);
    res.status(500).json({ ok: false, error: "Keep-alive failed" });
  }
}
