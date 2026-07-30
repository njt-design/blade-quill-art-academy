import { Router, type IRouter, type Request, type Response } from "express";
import {
  assertTinaAuthorized,
  buildInsightsSessionCookie,
  clearInsightsSessionCookie,
  getInsights,
  InsightsAuthError,
  resolveAuthorization,
} from "@workspace/insights";

const router: IRouter = Router();

router.post("/insights/session", async (req: Request, res: Response): Promise<void> => {
  try {
    const idToken =
      typeof req.body?.idToken === "string" ? req.body.idToken.trim() : "";
    if (!idToken) {
      res.status(400).json({ error: "idToken is required" });
      return;
    }
    const clientId =
      (typeof req.body?.clientID === "string" ? req.body.clientID : undefined) ||
      process.env.TINA_PUBLIC_CLIENT_ID;

    await assertTinaAuthorized({
      clientId,
      authorization: `Bearer ${idToken}`,
    });
    res.setHeader("Set-Cookie", buildInsightsSessionCookie(idToken));
    res.json({ ok: true });
  } catch (err) {
    if (err instanceof InsightsAuthError) {
      res.status(err.status).json({ error: err.message });
      return;
    }
    console.error(err);
    res.status(500).json({ error: "Failed to create insights session" });
  }
});

router.delete("/insights/session", (_req: Request, res: Response): void => {
  res.setHeader("Set-Cookie", clearInsightsSessionCookie());
  res.json({ ok: true });
});

router.get("/insights", async (req: Request, res: Response): Promise<void> => {
  try {
    const clientIdParam = req.query.clientID;
    const clientId =
      (typeof clientIdParam === "string" ? clientIdParam : undefined) ||
      process.env.TINA_PUBLIC_CLIENT_ID;

    const data = await getInsights({
      clientId,
      authorization: resolveAuthorization({
        authorization: req.headers.authorization,
        cookie: req.headers.cookie,
      }),
      rangeDays: req.query.range,
    });
    res.json(data);
  } catch (err) {
    if (err instanceof InsightsAuthError) {
      res.status(err.status).json({ error: err.message });
      return;
    }
    console.error(err);
    res.status(500).json({ error: "Failed to load insights" });
  }
});

export default router;
