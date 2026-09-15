/**
 * Local dev mirror of the Vercel function api/guide.ts — Tina-authenticated
 * content for the owner "How To" page (/guide). Same shared logic from
 * @workspace/insights.
 */
import { Router, type IRouter, type Request, type Response } from "express";
import {
  assertTinaAuthorized,
  getGuideContent,
  InsightsAuthError,
  resolveAuthorization,
} from "@workspace/insights";

const router: IRouter = Router();

router.get("/guide", async (req: Request, res: Response): Promise<void> => {
  res.setHeader("Cache-Control", "private, no-store");
  res.setHeader("X-Robots-Tag", "noindex, nofollow");
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

    res.json(getGuideContent());
  } catch (err) {
    if (err instanceof InsightsAuthError) {
      res.status(err.status).json({ error: err.message });
      return;
    }
    console.error(err);
    res.status(500).json({ error: "Failed to load the guide" });
  }
});

export default router;
