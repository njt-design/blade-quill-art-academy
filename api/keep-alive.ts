/**
 * GET /api/keep-alive — queries Supabase so the free-tier project is not
 * paused for inactivity (Supabase pauses after 7 idle days; it happened once
 * on 2026-09-06 and took checkout down).
 *
 * Called by two independent schedulers:
 *   - Vercel Cron, daily 13:00 UTC (vercel.json "crons")
 *   - GitHub Actions, daily 01:00 UTC (.github/workflows/supabase-keep-alive.yml)
 *
 * CRON_SECRET is optional and is NOT created automatically — if you add it to
 * the Vercel project, Vercel sends it as Authorization: Bearer $CRON_SECRET and
 * the GitHub workflow needs the same value as a repo secret.
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
    // Vercel Cron sets x-vercel-cron-schedule; anything else is external
    // (GitHub Actions, manual). Makes the two schedulers distinguishable in logs.
    const source = req.headers["x-vercel-cron-schedule"] ? "vercel-cron" : "external";
    console.log(`keep-alive: Supabase ping ok (${source})`);
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("keep-alive:", err);
    res.status(500).json({ ok: false, error: "Keep-alive failed" });
  }
}
