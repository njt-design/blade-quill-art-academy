/**
 * Local dev mirror of the Vercel function api/guide.ts — password gate for
 * the owner editing guide (/guide). Same shared logic from @workspace/insights.
 */
import { Router, type IRouter, type Request, type Response } from "express";
import {
  buildGuideSessionCookie,
  clearGuideSessionCookie,
  hasValidGuideSession,
  verifyGuidePassword,
} from "@workspace/insights";

const router: IRouter = Router();

router.get("/guide", (req: Request, res: Response): void => {
  if (hasValidGuideSession(req.headers.cookie)) {
    res.json({ ok: true });
  } else {
    res.status(401).json({ error: "Not signed in" });
  }
});

router.post("/guide", (req: Request, res: Response): void => {
  const result = verifyGuidePassword((req.body as { password?: unknown })?.password);

  if (result === "unconfigured") {
    res.status(500).json({ error: "Guide password is not configured" });
    return;
  }
  if (result === "invalid") {
    res.status(401).json({ error: "That password isn't right — try again." });
    return;
  }

  res.setHeader("Set-Cookie", buildGuideSessionCookie());
  res.json({ ok: true });
});

router.delete("/guide", (_req: Request, res: Response): void => {
  res.setHeader("Set-Cookie", clearGuideSessionCookie());
  res.json({ ok: true });
});

export default router;
