import { Router, type IRouter, type Request, type Response } from "express";
import { getInsights, InsightsAuthError } from "@workspace/insights";

const router: IRouter = Router();

router.get("/insights", async (req: Request, res: Response): Promise<void> => {
  try {
    const clientIdParam = req.query.clientID;
    const clientId =
      (typeof clientIdParam === "string" ? clientIdParam : undefined) ||
      process.env.TINA_PUBLIC_CLIENT_ID;

    const data = await getInsights({
      clientId,
      authorization: req.headers.authorization,
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
