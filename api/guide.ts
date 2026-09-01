/**
 * /api/guide — password gate for the owner editing guide (/guide).
 *
 * Method-routed on a single endpoint:
 * - GET    → 200 when the bq_guide session cookie is valid, else 401
 * - POST   → body { password }; verifies GUIDE_PASSWORD and sets the cookie
 * - DELETE → clears the cookie (sign out)
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  buildGuideSessionCookie,
  clearGuideSessionCookie,
  hasValidGuideSession,
  verifyGuidePassword,
} from "../lib/insights/src/index";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "GET") {
    if (hasValidGuideSession(req.headers.cookie)) {
      res.status(200).json({ ok: true });
    } else {
      res.status(401).json({ error: "Not signed in" });
    }
    return;
  }

  if (req.method === "DELETE") {
    res.setHeader("Set-Cookie", clearGuideSessionCookie());
    res.status(200).json({ ok: true });
    return;
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST, DELETE");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const body = (req.body ?? {}) as { password?: unknown };
  const result = verifyGuidePassword(body.password);

  if (result === "unconfigured") {
    res.status(500).json({ error: "Guide password is not configured" });
    return;
  }
  if (result === "invalid") {
    res.status(401).json({ error: "That password isn't right — try again." });
    return;
  }

  res.setHeader("Set-Cookie", buildGuideSessionCookie());
  res.status(200).json({ ok: true });
}
