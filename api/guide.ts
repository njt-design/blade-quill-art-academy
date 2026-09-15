/**
 * /api/guide — content for the owner "How To" page (/guide).
 *
 * GET only. The caller must be signed in to Tina: we accept
 * `Authorization: Bearer <tina id_token>` or the bq_insights cookie minted
 * by POST /api/insights/session, and verify it against Tina Cloud before
 * returning anything. Unauthenticated requests get a 401 and no content —
 * the Loom links never leave the server otherwise.
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  assertTinaAuthorized,
  getGuideContent,
  InsightsAuthError,
  resolveAuthorization,
} from "../lib/insights/src/index";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "private, no-store");
  res.setHeader("X-Robots-Tag", "noindex, nofollow");

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const clientIdParam = req.query.clientID;
    const clientId =
      (typeof clientIdParam === "string" ? clientIdParam : undefined) ||
      process.env.TINA_PUBLIC_CLIENT_ID;

    await assertTinaAuthorized({
      clientId,
      authorization: resolveAuthorization({
        authorization: req.headers.authorization,
        cookie: req.headers.cookie,
      }),
    });

    res.status(200).json(getGuideContent());
  } catch (err) {
    if (
      err instanceof InsightsAuthError ||
      (err instanceof Error && err.name === "InsightsAuthError")
    ) {
      const status = (err as InsightsAuthError).status || 401;
      res.status(status).json({ error: err.message });
      return;
    }
    console.error(err);
    res.status(500).json({ error: "Failed to load the guide" });
  }
}
