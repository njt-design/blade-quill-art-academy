/**
 * AI-generated SEO metadata suggestions (Claude / Anthropic).
 *
 * Shared by the Vercel function (api/seo-suggest.ts) and the local Express
 * api-server (artifacts/api-server/src/routes/seo.ts). The Tina admin posts
 * the document's title + extracted plain text; this module asks Claude for a
 * search-optimized meta title and meta description.
 *
 * Env:
 *   ANTHROPIC_API_KEY  — required. Anthropic API key.
 *   SEO_SUGGEST_MODEL  — optional model override (default: claude-haiku-4-5).
 *   ANTHROPIC_BASE_URL — optional API base override (tests / proxies).
 */

export type SeoSuggestKind = "page" | "post" | "product";

export interface SeoSuggestInput {
  kind: SeoSuggestKind;
  title: string;
  contentText: string;
  /** Live URL path of the document (e.g. /blog/my-post), when known. */
  url?: string;
}

export interface SeoSuggestion {
  metaTitle: string;
  metaDescription: string;
}

export class SeoSuggestError extends Error {
  status: number;
  constructor(message: string, status = 500) {
    super(message);
    this.name = "SeoSuggestError";
    this.status = status;
  }
}

const META_TITLE_MAX = 60;
const META_DESCRIPTION_MAX = 160;
const TITLE_INPUT_MAX = 300;
const CONTENT_INPUT_MAX = 6000;
const URL_INPUT_MAX = 300;

const DEFAULT_MODEL = "claude-haiku-4-5";
const DEFAULT_BASE_URL = "https://api.anthropic.com";
const ANTHROPIC_VERSION = "2023-06-01";

const KIND_LABEL: Record<SeoSuggestKind, string> = {
  page: "page of the website",
  post: "blog article",
  product: "product page in the online shop",
};

/** Validate + clamp the request body. Returns null when the shape is wrong. */
export function parseSeoSuggestBody(body: unknown): SeoSuggestInput | null {
  if (typeof body !== "object" || body === null) return null;
  const { kind, title, contentText, url } = body as Record<string, unknown>;
  if (kind !== "page" && kind !== "post" && kind !== "product") return null;
  if (typeof title !== "string" && typeof contentText !== "string") return null;

  const cleanTitle = (typeof title === "string" ? title : "")
    .trim()
    .slice(0, TITLE_INPUT_MAX);
  const cleanContent = (typeof contentText === "string" ? contentText : "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, CONTENT_INPUT_MAX);
  if (!cleanTitle && !cleanContent) return null;

  const input: SeoSuggestInput = {
    kind,
    title: cleanTitle,
    contentText: cleanContent,
  };
  if (typeof url === "string" && url.trim()) {
    input.url = url.trim().slice(0, URL_INPUT_MAX);
  }
  return input;
}

/** Cut at a word boundary so clipped copy never ends mid-word. */
function truncateAtWord(text: string, max: number): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max + 1);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut.slice(0, max))
    .replace(/[\s,;:—–-]+$/, "")
    .trim();
}

function buildUserPrompt(input: SeoSuggestInput): string {
  return [
    `Write search-engine metadata for this ${KIND_LABEL[input.kind]}.`,
    "",
    `Title: ${input.title || "(untitled)"}`,
    ...(input.url ? [`URL path: ${input.url}`] : []),
    "Content:",
    input.contentText || "(no body content yet — work from the title)",
    "",
    'Respond with only a JSON object, exactly like {"metaTitle": "...", "metaDescription": "..."}.',
    "Rules:",
    `- metaTitle: at most ${META_TITLE_MAX} characters. Front-load the main topic in natural language. No clickbait, no quotes. Do NOT include the site name — it is appended automatically.`,
    `- metaDescription: 120 to 155 characters. One or two sentences that accurately summarize the content and give a reason to click. No hashtags, no emoji.`,
  ].join("\n");
}

const SYSTEM_PROMPT =
  "You are an SEO copywriter for Blade & Quill Art Academy — the website of " +
  "author-illustrator Corinne, creator of the Lheeloo & Luna children's book " +
  "series, Krita digital-art tutorials, free guides, and an online shop. You " +
  "write accurate, natural, search-optimized metadata based only on the " +
  "content you are given. You respond with only a JSON object — no code " +
  "fences, no commentary.";

/** Pull {"metaTitle","metaDescription"} out of the model reply, tolerating fences. */
function parseSuggestionText(raw: string): SeoSuggestion | null {
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    const parsed = JSON.parse(match[0]) as Record<string, unknown>;
    const metaTitle =
      typeof parsed.metaTitle === "string" ? parsed.metaTitle.trim() : "";
    const metaDescription =
      typeof parsed.metaDescription === "string"
        ? parsed.metaDescription.trim()
        : "";
    if (!metaTitle && !metaDescription) return null;
    return { metaTitle, metaDescription };
  } catch {
    return null;
  }
}

export async function generateSeoSuggestion(
  input: SeoSuggestInput
): Promise<SeoSuggestion> {
  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (!apiKey) {
    throw new SeoSuggestError(
      "AI suggestions are not set up yet — add ANTHROPIC_API_KEY to the server environment.",
      503
    );
  }
  const model = process.env.SEO_SUGGEST_MODEL?.trim() || DEFAULT_MODEL;
  const baseUrl = (
    process.env.ANTHROPIC_BASE_URL?.trim() || DEFAULT_BASE_URL
  ).replace(/\/$/, "");

  let res: Response;
  try {
    res = await fetch(`${baseUrl}/v1/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": ANTHROPIC_VERSION,
      },
      body: JSON.stringify({
        model,
        max_tokens: 500,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: buildUserPrompt(input) }],
      }),
    });
  } catch (err) {
    console.error("Anthropic request failed:", err);
    throw new SeoSuggestError("Could not reach the AI service.", 502);
  }

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error("Anthropic error:", res.status, detail.slice(0, 500));
    throw new SeoSuggestError(
      res.status === 401 || res.status === 403
        ? "The AI service rejected the API key — check ANTHROPIC_API_KEY."
        : "The AI service returned an error. Please try again.",
      502
    );
  }

  const payload = (await res.json().catch(() => null)) as {
    content?: Array<{ type?: string; text?: string }>;
  } | null;
  const text =
    payload?.content
      ?.filter((part) => part?.type === "text" && typeof part.text === "string")
      .map((part) => part.text)
      .join("\n") ?? "";

  const suggestion = parseSuggestionText(text);
  if (!suggestion) {
    console.error("Unparseable AI reply:", text.slice(0, 500));
    throw new SeoSuggestError(
      "The AI reply could not be understood. Please try again.",
      502
    );
  }

  return {
    metaTitle: truncateAtWord(suggestion.metaTitle, META_TITLE_MAX),
    metaDescription: truncateAtWord(
      suggestion.metaDescription,
      META_DESCRIPTION_MAX
    ),
  };
}
