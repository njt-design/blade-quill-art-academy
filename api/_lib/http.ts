import type { VercelRequest, VercelResponse } from "@vercel/node";
import { CheckoutError } from "../../lib/checkout/src/index";

export function siteBaseUrl(req: VercelRequest): string {
  const protoHeader = req.headers["x-forwarded-proto"];
  const proto =
    (Array.isArray(protoHeader) ? protoHeader[0] : protoHeader)
      ?.split(",")[0]
      ?.trim() || "https";
  const hostHeader = req.headers["x-forwarded-host"] || req.headers.host;
  const host = (Array.isArray(hostHeader) ? hostHeader[0] : hostHeader)
    ?.split(",")[0]
    ?.trim();
  if (host) return `${proto}://${host}`;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return "https://blade-quill-art-academy.vercel.app";
}

export function sendCheckoutError(res: VercelResponse, err: unknown): void {
  if (err instanceof CheckoutError) {
    res.status(err.status).json({ error: err.message });
    return;
  }
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
}

export async function readRawBody(req: VercelRequest): Promise<Buffer> {
  if (Buffer.isBuffer(req.body)) return req.body;
  if (typeof req.body === "string") return Buffer.from(req.body);
  if (req.body && typeof req.body === "object") {
    return Buffer.from(JSON.stringify(req.body));
  }

  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}
