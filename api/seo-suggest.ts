/**
 * POST /api/seo-suggest — AI-suggested SEO metadata for the Tina admin.
 *
 * Body:  { kind: "page" | "post" | "product", title, contentText, url? }
 * Auth:  Authorization: Bearer <tina id_token> (same Tina Cloud session check
 *        as /api/insights — only signed-in CMS editors can call this).
 * Reply: { metaTitle, metaDescription }
 *
 * Required env: ANTHROPIC_API_KEY (see lib/seo-suggest).
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  assertTinaAuthorized,
  InsightsAuthError,
} from "../lib/insights/src/index";
import {
  generateSeoSuggestion,
  parseSeoSuggestBody,
  SeoSuggestError,
} from "../lib/seo-suggest/src/index";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

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
    res.status(200).json(suggestion);
  } catch (err) {
    if (
      err instanceof InsightsAuthError ||
      (err instanceof Error && err.name === "InsightsAuthError")
    ) {
      const status = (err as InsightsAuthError).status || 401;
      res.status(status).json({ error: err.message });
      return;
    }
    if (
      err instanceof SeoSuggestError ||
      (err instanceof Error && err.name === "SeoSuggestError")
    ) {
      const status = (err as SeoSuggestError).status || 500;
      res.status(status).json({ error: err.message });
      return;
    }
    console.error("SEO suggest error:", err);
    res.status(500).json({ error: "Failed to generate SEO suggestions" });
  }
}
