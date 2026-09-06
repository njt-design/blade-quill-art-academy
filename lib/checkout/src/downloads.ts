/**
 * Post-purchase download delivery.
 *
 * A paid order with downloadable files gets a 48-hour `download_token`.
 * Buyers hit `/api/download/<token>` with:
 *   - `?file=<index>` → 302 to a short-lived signed URL for that one file
 *   - `?all=1`        → streamed zip of every file
 *   - nothing         → single file: redirect; multiple: zip
 *
 * File paths that are bare object keys live in the private Supabase Storage
 * bucket; legacy `https://…` / `/files/…` values pass through unchanged.
 */
import { Readable } from "node:stream";
import type { ServerResponse } from "node:http";
import archiver from "archiver";
import { getSupabase } from "./clients";
import { getOrderByDownloadToken, orderFiles, type OrderRow } from "./orders";
import { CheckoutError, type DownloadFile } from "./types";

/** Private Supabase Storage bucket holding paid product files. */
export const DOWNLOADS_BUCKET =
  process.env.DOWNLOADS_BUCKET?.trim() || "product-downloads";
/** Signed URLs are effectively single-use; keep them short-lived. */
const SIGNED_URL_TTL_SECONDS = 60;

export function isExternalPath(path: string): boolean {
  return /^https?:\/\//i.test(path) || path.startsWith("/");
}

export function fileBasename(path: string): string {
  return path.split("/").pop() || "download";
}

/** Validate a token → paid, unexpired order with at least one file. */
export async function getDownloadableOrder(token: string): Promise<{
  order: OrderRow;
  files: DownloadFile[];
}> {
  if (!token) {
    throw new CheckoutError("download_invalid", "Invalid or expired download link", 404);
  }
  const order = await getOrderByDownloadToken(token);
  if (!order) {
    throw new CheckoutError("download_invalid", "Invalid or expired download link", 404);
  }
  if (order.status !== "paid") {
    throw new CheckoutError("download_unpaid", "Payment not confirmed for this download", 402);
  }
  if (
    !order.download_token_expires_at ||
    new Date(order.download_token_expires_at) < new Date()
  ) {
    throw new CheckoutError("download_expired", "Download link has expired", 410);
  }
  const files = orderFiles(order);
  if (files.length === 0) {
    throw new CheckoutError("download_missing", "No download file available for this product", 404);
  }
  return { order, files };
}

/** Exchange one file path for a URL the browser can fetch right now. */
export async function signFileUrl(path: string): Promise<string> {
  const value = path.trim();
  if (isExternalPath(value)) return value;

  const objectPath = value.replace(/^\/+/, "");
  const { data, error } = await getSupabase()
    .storage.from(DOWNLOADS_BUCKET)
    .createSignedUrl(objectPath, SIGNED_URL_TTL_SECONDS, {
      download: fileBasename(objectPath),
    });
  if (error || !data?.signedUrl) {
    console.error(`Signed URL failed for ${DOWNLOADS_BUCKET}/${objectPath}:`, error);
    throw new CheckoutError("download_missing", "No download file available for this product", 404);
  }
  return data.signedUrl;
}

/** Pick the file for `?file=<index>`; undefined index → only-file or error. */
export function pickFile(files: DownloadFile[], index: number | undefined): DownloadFile {
  if (index === undefined) {
    if (files.length === 1) return files[0];
    throw new CheckoutError("invalid_request", "Specify which file to download", 400);
  }
  if (!Number.isInteger(index) || index < 0 || index >= files.length) {
    throw new CheckoutError("download_invalid", "Invalid or expired download link", 404);
  }
  return files[index];
}

function safeZipName(name: string): string {
  return (
    name
      .replace(/[^\w.\- ]+/g, "-")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 80) || "download"
  );
}

/** Unique entry names inside the zip, preferring the real filename. */
function zipEntryNames(files: DownloadFile[]): string[] {
  const seen = new Map<string, number>();
  return files.map((f) => {
    const base = safeZipName(fileBasename(f.path));
    const n = seen.get(base) ?? 0;
    seen.set(base, n + 1);
    if (n === 0) return base;
    const dot = base.lastIndexOf(".");
    return dot > 0
      ? `${base.slice(0, dot)} (${n + 1})${base.slice(dot)}`
      : `${base} (${n + 1})`;
  });
}

async function openFileStream(path: string): Promise<Readable> {
  const url = await signFileUrl(path);
  const res = await fetch(url);
  if (!res.ok || !res.body) {
    console.error(`Fetch for zip entry failed: ${path} → ${res.status}`);
    throw new CheckoutError("download_missing", "A file in this bundle is unavailable", 502);
  }
  // Node's Readable.fromWeb accepts the web ReadableStream from fetch.
  return Readable.fromWeb(res.body as unknown as Parameters<typeof Readable.fromWeb>[0]);
}

/**
 * Stream every file in the order as one zip. Works with any Node
 * ServerResponse (Vercel and Express both expose one).
 *
 * Files are stored, not deflated: PDFs/ZIPs are already compressed and this
 * keeps CPU time near zero.
 */
export async function streamOrderArchive(
  order: OrderRow,
  files: DownloadFile[],
  res: ServerResponse
): Promise<void> {
  const zipName = `${safeZipName(order.product_slug || order.product_name || "download")}.zip`;
  const names = zipEntryNames(files);

  // Open the first stream before sending headers so a missing file still
  // yields a proper error status instead of a truncated zip.
  const first = await openFileStream(files[0].path);

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/zip");
  res.setHeader("Content-Disposition", `attachment; filename="${zipName}"`);
  res.setHeader("Cache-Control", "private, no-store");

  const archive = archiver("zip", { store: true });
  const finished = new Promise<void>((resolve, reject) => {
    res.on("close", resolve);
    res.on("finish", resolve);
    archive.on("error", reject);
    archive.on("warning", (err) => console.warn("zip warning:", err));
  });
  archive.pipe(res);

  archive.append(first, { name: names[0] });
  for (let i = 1; i < files.length; i++) {
    archive.append(await openFileStream(files[i].path), { name: names[i] });
  }
  await archive.finalize();
  await finished;
}
