/**
 * GET /api/insights — Tina-authenticated Owner Studio metrics.
 *
 * Query: clientID (Tina), range (7|28|90)
 * Auth: Authorization: Bearer <tina id_token> OR bq_insights cookie
 *       from POST /api/insights/session
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  getInsights,
  InsightsAuthError,
  resolveAuthorization,
} from "../lib/insights/src/index";

export default async function handler(req: VercelRequest, res: VercelResponse) {
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

    const authorization = resolveAuthorization({
      authorization: req.headers.authorization,
      cookie: req.headers.cookie,
    });

    const data = await getInsights({
      clientId,
      authorization,
      rangeDays: req.query.range,
    });
    res.status(200).json(data);
  } catch (err) {
    if (
      err instanceof InsightsAuthError ||
      (err instanceof Error && err.name === "InsightsAuthError")
    ) {
      const status =
        err instanceof InsightsAuthError
          ? err.status
          : (err as InsightsAuthError).status || 401;
      res.status(status).json({ error: err.message });
      return;
    }
    console.error(err);
    res.status(500).json({ error: "Failed to load insights" });
  }
}
