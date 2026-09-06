/**
 * Admin-side uploads into the private downloads bucket.
 *
 * Used by the Tina "Download Files" widget: it asks for a signed upload URL,
 * then PUTs the file straight to Supabase Storage from the browser so large
 * files never pass through a serverless function. Callers must authenticate
 * the editor first (see /api/uploads → assertTinaAuthorized).
 */
import { getSupabase } from "./clients";
import { DOWNLOADS_BUCKET } from "./downloads";
import { CheckoutError } from "./types";

const ALLOWED_EXTENSIONS = ["pdf", "zip", "epub"] as const;
const MIME_BY_EXT: Record<string, string> = {
  pdf: "application/pdf",
  zip: "application/zip",
  epub: "application/epub+zip",
};

export interface PrepareUploadInput {
  fileName?: unknown;
  contentType?: unknown;
  /** Usually the product name; slugified into the first path segment. */
  folder?: unknown;
}

export interface PrepareUploadResult {
  /** Object key inside the bucket — store this in Tina as the file value. */
  path: string;
  /** PUT the file here with `x-upsert: true` and the content type below. */
  uploadUrl: string;
  contentType: string;
}

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

export async function prepareDownloadUpload(
  input: PrepareUploadInput
): Promise<PrepareUploadResult> {
  const rawName = typeof input.fileName === "string" ? input.fileName.trim() : "";
  if (!rawName) {
    throw new CheckoutError("invalid_request", "fileName is required", 400);
  }

  const dot = rawName.lastIndexOf(".");
  const ext = dot > 0 ? rawName.slice(dot + 1).toLowerCase() : "";
  if (!(ALLOWED_EXTENSIONS as readonly string[]).includes(ext)) {
    throw new CheckoutError(
      "invalid_request",
      `Only ${ALLOWED_EXTENSIONS.map((e) => "." + e).join(", ")} files can be uploaded`,
      400
    );
  }

  const stem = slugSegment(rawName.slice(0, dot), "file");
  const folder = slugSegment(
    typeof input.folder === "string" ? input.folder : "",
    "products"
  );
  const path = `${folder}/${stem}.${ext}`;
  const contentType =
    typeof input.contentType === "string" && input.contentType.trim()
      ? input.contentType.trim()
      : MIME_BY_EXT[ext];

  const { data, error } = await getSupabase()
    .storage.from(DOWNLOADS_BUCKET)
    .createSignedUploadUrl(path, { upsert: true });
  if (error || !data?.signedUrl) {
    console.error("createSignedUploadUrl failed:", error);
    throw new CheckoutError("upload_failed", "Could not prepare upload", 500);
  }

  return { path, uploadUrl: data.signedUrl, contentType };
}
