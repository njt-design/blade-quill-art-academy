import { Router, type IRouter, type Request, type Response } from "express";
import { assertTinaAuthorized, InsightsAuthError } from "@workspace/insights";
import {
  generateSeoSuggestion,
  parseSeoSuggestBody,
  SeoSuggestError,
} from "@workspace/seo-suggest";

const router: IRouter = Router();

/** Local-dev mirror of the Vercel function api/seo-suggest.ts. */
router.post("/seo-suggest", async (req: Request, res: Response): Promise<void> => {
  try {
    await assertTinaAuthorized({
      clientId: process.env.TINA_PUBLIC_CLIENT_ID,
      authorization: req.headers.authorization,
    });

    const input = parseSeoSuggestBody(req.body);
    if (!input) {
      res.status(400).json({ error: "Invalid request" });
      return;
    }

    const suggestion = await generateSeoSuggestion(input);
    res.json(suggestion);
  } catch (err) {
    if (err instanceof InsightsAuthError) {
      res.status(err.status).json({ error: err.message });
      return;
    }
    if (err instanceof SeoSuggestError) {
      res.status(err.status).json({ error: err.message });
      return;
    }
    console.error("SEO suggest error:", err);
    res.status(500).json({ error: "Failed to generate SEO suggestions" });
  }
});

export default router;
