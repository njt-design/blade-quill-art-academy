/**
 * /api/insights — Tina-authenticated Owner Studio metrics + session.
 *
 * Two routes in one function (Vercel Hobby caps deployments at 12
 * serverless functions):
 * - GET  /api/insights                    → metrics (query: clientID, range)
 * - *    /api/insights/session            → session cookie management
 *         (reached via the vercel.json rewrite to /api/insights?__route=session)
 *
 * Auth: Authorization: Bearer <tina id_token> OR bq_insights cookie
 *       from POST /api/insights/session
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  assertTinaAuthorized,
  buildInsightsSessionCookie,
  clearInsightsSessionCookie,
  getInsights,
  InsightsAuthError,
  resolveAuthorization,
} from "../lib/insights/src/index";

function insightsAuthErrorStatus(err: unknown): number | null {
  if (
    err instanceof InsightsAuthError ||
    (err instanceof Error && err.name === "InsightsAuthError")
  ) {
    return err instanceof InsightsAuthError
      ? err.status
      : (err as InsightsAuthError).status || 401;
  }
  return null;
}

/**
 * POST /api/insights/session — validate Tina token and set httpOnly cookie
 * so /insights (and its iframe) can call GET /api/insights without relying
 * solely on localStorage in the browser. DELETE clears the cookie.
 */
async function sessionHandler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "DELETE") {
    res.setHeader("Set-Cookie", clearInsightsSessionCookie());
    res.status(200).json({ ok: true });
    return;
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, DELETE");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const body = (req.body ?? {}) as { idToken?: string; clientID?: string };
    const idToken =
      typeof body.idToken === "string" ? body.idToken.trim() : "";
    if (!idToken) {
      res.status(400).json({ error: "idToken is required" });
      return;
    }

    const clientId =
      (typeof body.clientID === "string" ? body.clientID : undefined) ||
      process.env.TINA_PUBLIC_CLIENT_ID;

    await assertTinaAuthorized({
      clientId,
      authorization: `Bearer ${idToken}`,
    });

    res.setHeader("Set-Cookie", buildInsightsSessionCookie(idToken));
    res.status(200).json({ ok: true });
  } catch (err) {
    const status = insightsAuthErrorStatus(err);
    if (status !== null) {
      res.status(status).json({ error: (err as Error).message });
      return;
    }
    console.error(err);
    res.status(500).json({ error: "Failed to create insights session" });
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // /api/insights/session arrives here via the vercel.json rewrite.
  if (req.query.__route === "session") {
    return sessionHandler(req, res);
  }

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
    const status = insightsAuthErrorStatus(err);
    if (status !== null) {
      res.status(status).json({ error: (err as Error).message });
      return;
    }
    console.error(err);
    res.status(500).json({ error: "Failed to load insights" });
  }
}
