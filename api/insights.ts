/**
 * GET /api/insights — Tina-authenticated Owner Studio metrics.
 *
 * Query: clientID (Tina), range (7|28|90)
 * Header: Authorization: Bearer <tina id_token>
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getInsights, InsightsAuthError } from "../lib/insights/src/index";

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

    const authHeader = req.headers.authorization;
    const authorization = Array.isArray(authHeader) ? authHeader[0] : authHeader;

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
