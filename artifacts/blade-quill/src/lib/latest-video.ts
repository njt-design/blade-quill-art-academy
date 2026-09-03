import { useQuery } from "@tanstack/react-query";

/**
 * The newest upload on the Blade & Quill YouTube channel, resolved
 * server-side by /api/youtube-latest (RSS feed, then channel-page scrape).
 * Returns null when YouTube is unreachable — callers fall back to a
 * pinned video so the section always renders.
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
    const res = await fetch("/api/youtube-latest");
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
    // The endpoint itself caches for 15 min — no need to refetch often.
    staleTime: 15 * 60 * 1000,
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
