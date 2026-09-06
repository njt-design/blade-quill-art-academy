/**
 * GET /api/download/:token — deliver a paid order's files.
 *
 *   ?file=<index>  → 302 to a short-lived signed URL for one file
 *   ?all=1         → streamed zip of every file in the order
 *   (none)         → single-file orders redirect; multi-file orders zip
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { serveDownload } from "../../lib/checkout/src/index";
import { sendCheckoutError } from "../_lib/http";

function firstString(value: string | string[] | undefined): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return String(value[0] ?? "");
  return "";
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const token = firstString(req.query.token);
    const fileRaw = firstString(req.query.file);
    const fileIndex = fileRaw === "" ? undefined : Number(fileRaw);
    const all = ["1", "true", "yes"].includes(firstString(req.query.all).toLowerCase());
    await serveDownload(token, { fileIndex, all }, res);
  } catch (err) {
    if (res.headersSent) {
      console.error("Download failed mid-stream:", err);
      res.end();
      return;
    }
    sendCheckoutError(res, err);
  }
}
