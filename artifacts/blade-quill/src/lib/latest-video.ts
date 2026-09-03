import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";

/**
 * The newest upload on the Blade & Quill YouTube channel, written to
 * /latest-video.json at build time by scripts/write-latest-video.mjs
 * (the site is static and the Vercel Hobby function budget is full, so
 * this refreshes on every deploy — including every Tina CMS save — rather
 * than per page view). Returns null when the file is missing or malformed —
 * callers fall back to a pinned video so the section always renders.
 */
export interface LatestVideo {
  videoId: string;
  title: string;
  url: string;
  publishedAt: string | null;
  publishedText: string | null;
  thumbnailUrl: string;
  channelUrl: string;
}

export const YOUTUBE_CHANNEL_URL =
  "https://www.youtube.com/c/BladeQuillartacademy";

async function fetchLatestVideo(): Promise<LatestVideo | null> {
  try {
    const res = await fetch("/latest-video.json");
    if (!res.ok) return null;
    const data = (await res.json()) as Partial<LatestVideo>;
    if (!data.videoId || !data.url) return null;
    return data as LatestVideo;
  } catch {
    return null;
  }
}

export function useLatestVideo(): LatestVideo | null {
  const { data } = useQuery({
    queryKey: ["youtube-latest"],
    queryFn: fetchLatestVideo,
    // Static file refreshed at build time — cache for the session.
    staleTime: Infinity,
    retry: false,
  });
  return data ?? null;
}

/** Extract a video ID from a watch/share/embed URL. */
export function extractYoutubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match?.[1] ?? null;
}

/** "3 weeks ago" — prefers YouTube's own label, derived from the date otherwise. */
export function formatPublishedAgo(video: LatestVideo): string | null {
  if (video.publishedText) return video.publishedText;
  if (!video.publishedAt) return null;
  const date = new Date(video.publishedAt);
  if (Number.isNaN(date.getTime())) return null;
  return `${formatDistanceToNow(date)} ago`;
}
