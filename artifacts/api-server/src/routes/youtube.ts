import { Router, type IRouter, type Request, type Response } from "express";
import { fetchLatestYoutubeVideo } from "@workspace/youtube";

/** Local-dev mirror of the Vercel function api/youtube-latest.ts. */
const router: IRouter = Router();

router.get("/youtube-latest", async (_req: Request, res: Response): Promise<void> => {
  try {
    const video = await fetchLatestYoutubeVideo();
    if (!video) {
      res.status(502).json({ error: "Could not reach YouTube" });
      return;
    }
    res.setHeader("Cache-Control", "public, max-age=900");
    res.json(video);
  } catch {
    res.status(502).json({ error: "Could not reach YouTube" });
  }
});

export default router;
