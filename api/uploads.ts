/**
 * POST /api/uploads — mint a signed upload URL into the private downloads
 * bucket for the Tina admin's "Download Files" field.
 *
 * The browser then PUTs the file straight to Supabase Storage, so large files
 * never pass through this function. Only a signed-in Tina editor can call it
 * (same identity check as /api/insights).
 *
 * Request:  { fileName: string, contentType?: string, folder?: string }
 * Response: { path: string, uploadUrl: string }
 *
 * Env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, TINA_PUBLIC_CLIENT_ID
 */
import { createClient } from "@supabase/supabase-js";
import { DOWNLOADS_BUCKET } from "../lib/checkout/src/index";
import { InsightsAuthError, assertTinaAuthorized } from "../lib/insights/src/auth";

const ALLOWED_EXTENSIONS = new Set(["pdf", "zip", "epub"]);
const MIME_BY_EXT: Record<string, string> = {
  pdf: "application/pdf",
  zip: "application/zip",
  epub: "application/epub+zip",
};

function slugSegment(value: string, fallback: string): string {
  const cleaned = value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w.\- ]+/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[.-]+|[.-]+$/g, "");
  return cleaned.slice(0, 80) || fallback;
}

function json(body: unknown, status = 200): Response {
  return Response.json(body, { status });
}

export async function POST(request: Request): Promise<Response> {
  try {
    await assertTinaAuthorized({
      clientId: process.env.TINA_PUBLIC_CLIENT_ID,
      authorization: request.headers.get("authorization") ?? undefined,
    });
  } catch (err) {
    const status = err instanceof InsightsAuthError ? err.status : 401;
    const message = err instanceof Error ? err.message : "Unauthorized";
    return json({ error: message }, status);
  }

  const url = process.env.SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) {
    return json({ error: "Storage is not configured" }, 500);
  }

  let body: { fileName?: unknown; contentType?: unknown; folder?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const rawName = typeof body.fileName === "string" ? body.fileName.trim() : "";
  if (!rawName) return json({ error: "fileName is required" }, 400);

  const dot = rawName.lastIndexOf(".");
  const ext = dot > 0 ? rawName.slice(dot + 1).toLowerCase() : "";
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return json(
      { error: `Only ${[...ALLOWED_EXTENSIONS].map((e) => "." + e).join(", ")} files can be uploaded` },
      400
    );
  }

  const stem = slugSegment(rawName.slice(0, dot), "file");
  const folder = slugSegment(typeof body.folder === "string" ? body.folder : "", "products");
  const objectPath = `${folder}/${stem}.${ext}`;
  const contentType =
    typeof body.contentType === "string" && body.contentType.trim()
      ? body.contentType.trim()
      : MIME_BY_EXT[ext];

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await supabase.storage
    .from(DOWNLOADS_BUCKET)
    .createSignedUploadUrl(objectPath, { upsert: true });
  if (error || !data?.signedUrl) {
    console.error("createSignedUploadUrl failed:", error);
    return json({ error: "Could not prepare upload" }, 500);
  }

  return json({ path: objectPath, uploadUrl: data.signedUrl, contentType });
}

export function GET(): Response {
  return new Response("Method not allowed", {
    status: 405,
    headers: { Allow: "POST" },
  });
}
