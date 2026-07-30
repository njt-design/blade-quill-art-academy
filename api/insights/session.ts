/**
 * POST /api/insights/session — validate Tina token and set httpOnly cookie
 * so /insights (and its iframe) can call GET /api/insights without relying
 * solely on localStorage in the browser.
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  assertTinaAuthorized,
  buildInsightsSessionCookie,
  clearInsightsSessionCookie,
  InsightsAuthError,
} from "../../lib/insights/src/index";

export default async function handler(req: VercelRequest, res: VercelResponse) {
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
    res.status(500).json({ error: "Failed to create insights session" });
  }
}
