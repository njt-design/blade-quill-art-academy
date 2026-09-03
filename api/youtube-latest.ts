/**
 * GET /api/youtube-latest — the newest upload on the Blade & Quill YouTube
 * channel, for the Education page's "Newest video" feature. No API key:
 * tries the public RSS feed first, then scrapes the channel /videos tab.
 *
 * Cached at the edge for 15 min (stale-while-revalidate 1 h) so every page
 * view doesn't hit YouTube.
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { fetchLatestYoutubeVideo } from "../lib/youtube/src/index";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const video = await fetchLatestYoutubeVideo();
  if (!video) {
    res.status(502).json({ error: "Could not reach YouTube" });
    return;
  }

  res.setHeader("Cache-Control", "s-maxage=900, stale-while-revalidate=3600");
  res.status(200).json(video);
}
