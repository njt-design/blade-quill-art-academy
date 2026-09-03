/**
 * /api/tina/* — same-origin proxy for the Tina Cloud content API.
 *
 * Why this exists: Tina Cloud currently corrupts zstd-compressed responses
 * (the binary frame is UTF-8-mangled server-side), so browsers that
 * advertise zstd (Chrome 123+, recent Edge/Firefox) fail larger GraphQL
 * responses with ERR_CONTENT_DECODING_FAILED — breaking the Tina admin and
 * the site's live content refresh. This proxy forwards requests server-side
 * negotiating gzip only, which Tina serves correctly. See
 * docs/tina-cloud-zstd-issue.md for the full diagnosis.
 *
 * Routing: zero-config /api functions don't support catch-all brackets, so
 * vercel.json rewrites /api/tina/:path* → /api/tina-proxy?__path=:path*.
 *
 * Used by:
 * - src/lib/tina-live.ts (public site live-refresh, read-only token)
 * - the prebuilt Tina admin (tinaioConfig.contentApiUrlOverride in
 *   tina/config.ts), including its branch/status endpoints
 *
 * Only paths under this project's client ID are proxied. CORS is open so
 * preview deployments' admins (served from other origins) can use it.
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";

const TINA_CONTENT_API = "https://content.tinajs.io";

/** Public by design — embedded in every browser bundle. */
const FALLBACK_CLIENT_ID = "66c31af8-a8db-4a0b-9eab-17bd12d7d5e2";

function corsHeaders(res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-API-KEY"
  );
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  corsHeaders(res);

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "GET" && req.method !== "POST") {
    res.setHeader("Allow", "GET, POST, OPTIONS");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const clientId = process.env.TINA_PUBLIC_CLIENT_ID || FALLBACK_CLIENT_ID;
  const raw = req.query.__path;
  const subPath = (Array.isArray(raw) ? raw.join("/") : raw ?? "").replace(
    /^\/+/,
    ""
  );

  // Only proxy this project's content-API surface (GraphQL, branch list/
  // create, index status) — never an open proxy.
  const allowed =
    subPath.startsWith(`2.4/content/${clientId}/`) ||
    subPath.startsWith(`github/${clientId}/`) ||
    subPath.startsWith(`db/${clientId}/`);
  if (!allowed) {
    res.status(403).json({ error: "Not a proxied Tina path" });
    return;
  }

  try {
    const headers: Record<string, string> = {
      // gzip only — Tina's zstd path corrupts the body (undici decodes
      // gzip transparently, so the body below is always plain JSON).
      "Accept-Encoding": "gzip",
    };
    const apiKey = req.headers["x-api-key"];
    if (typeof apiKey === "string") headers["X-API-KEY"] = apiKey;
    if (req.headers.authorization) {
      headers["Authorization"] = req.headers.authorization;
    }
    if (typeof req.headers.cookie === "string") {
      headers["Cookie"] = req.headers.cookie;
    }

    const hasBody = req.method === "POST" && req.body != null;
    if (hasBody) headers["Content-Type"] = "application/json";

    const upstream = await fetch(`${TINA_CONTENT_API}/${subPath}`, {
      method: req.method,
      headers,
      body: hasBody ? JSON.stringify(req.body) : undefined,
    });

    const text = await upstream.text();
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Cache-Control", "no-store");
    res.status(upstream.status).send(text);
  } catch (err) {
    console.error("tina-proxy upstream failure:", err);
    res.status(502).json({ error: "Tina Cloud unreachable" });
  }
}
