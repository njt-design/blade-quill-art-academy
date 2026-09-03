/**
 * Newest-video lookup for the Blade & Quill YouTube channel — no API key.
 *
 * Two strategies, tried in order:
 *  1. The public RSS feed (feeds/videos.xml?channel_id=…) — clean Atom XML,
 *     but some hosts/datacenter IPs get a 404 from YouTube.
 *  2. Scraping the channel's /videos tab HTML — the first `lockupViewModel`
 *     in `ytInitialData` is the newest upload (the grid is newest-first).
 *
 * Used by api/youtube-latest.ts (Vercel) and the api-server dev route.
 */

export interface LatestYoutubeVideo {
  videoId: string;
  title: string;
  url: string;
  /** ISO date — only available from the RSS feed. */
  publishedAt: string | null;
  /** Human-readable age (e.g. "3 weeks ago") — only from the HTML scrape. */
  publishedText: string | null;
  thumbnailUrl: string;
  channelUrl: string;
}

const DEFAULT_CHANNEL_ID = "UCVqapFt9h7Y1KNQw3MWqI2A";
const DEFAULT_CHANNEL_URL = "https://www.youtube.com/c/BladeQuillartacademy";

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";

const FETCH_TIMEOUT_MS = 8000;

function channelId(): string {
  return process.env.YOUTUBE_CHANNEL_ID?.trim() || DEFAULT_CHANNEL_ID;
}

function channelUrl(): string {
  return process.env.YOUTUBE_CHANNEL_URL?.trim() || DEFAULT_CHANNEL_URL;
}

async function fetchText(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": USER_AGENT,
        "Accept-Language": "en-US,en;q=0.9",
      },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

/** Decode YouTube's JSON-embedded string escapes (\u0026, \", …). */
function decodeJsonString(raw: string): string {
  try {
    return JSON.parse(`"${raw}"`) as string;
  } catch {
    return raw;
  }
}

function matchTag(xml: string, tag: string): string | null {
  const m = xml.match(
    new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`)
  );
  return m ? m[1].trim() : null;
}

function stripCdata(value: string): string {
  const m = value.match(/^<!\[CDATA\[([\s\S]*?)\]\]>$/);
  return m ? m[1] : value;
}

function parseRss(xml: string): Omit<
  LatestYoutubeVideo,
  "url" | "thumbnailUrl" | "channelUrl" | "publishedText"
> | null {
  const entry = xml.match(/<entry>([\s\S]*?)<\/entry>/);
  if (!entry) return null;
  const body = entry[1];
  const videoId = matchTag(body, "yt:videoId");
  const title = matchTag(body, "title");
  if (!videoId || !title) return null;
  return {
    videoId,
    title: stripCdata(title),
    publishedAt: matchTag(body, "published"),
  };
}

/**
 * Parse the channel /videos page. The newest upload is the first
 * `lockupViewModel`; its metadata rows carry view count + age.
 */
function parseVideosPage(html: string): Omit<
  LatestYoutubeVideo,
  "url" | "thumbnailUrl" | "channelUrl" | "publishedAt"
> | null {
  const start = html.indexOf('"lockupViewModel"');
  if (start < 0) return null;
  // One lockup is a few KB of JSON — cap the search window generously.
  const seg = html.slice(start, start + 40000);

  const vidMatch =
    seg.match(/i\.ytimg\.com\/vi\/([\w-]{11})\//) ??
    seg.match(/"videoId":"([\w-]{11})"/);
  if (!vidMatch) return null;

  const titleMatch = seg.match(
    /"lockupMetadataViewModel":\{"title":\{"content":"((?:[^"\\]|\\.)*)"/
  );

  let publishedText: string | null = null;
  const ageMatch = seg.match(
    /"accessibilityLabel":"((?:[^"\\]|\\.)*?ago)"/
  );
  if (ageMatch) publishedText = decodeJsonString(ageMatch[1]);

  return {
    videoId: vidMatch[1],
    title: titleMatch ? decodeJsonString(titleMatch[1]) : "",
    publishedText,
  };
}

/**
 * Resolve the channel's newest upload. Returns null when YouTube is
 * unreachable or the markup changes beyond recognition — callers should
 * fall back to a pinned video in that case.
 */
export async function fetchLatestYoutubeVideo(): Promise<LatestYoutubeVideo | null> {
  const channel = channelUrl();

  const rss = await fetchText(
    `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId()}`
  );
  const fromRss = rss ? parseRss(rss) : null;
  if (fromRss) {
    return {
      ...fromRss,
      publishedText: null,
      url: `https://www.youtube.com/watch?v=${fromRss.videoId}`,
      thumbnailUrl: `https://i.ytimg.com/vi/${fromRss.videoId}/hqdefault.jpg`,
      channelUrl: channel,
    };
  }

  const videosUrl = `${channel.replace(/\/$/, "")}/videos`;
  const html = await fetchText(videosUrl);
  const fromHtml = html ? parseVideosPage(html) : null;
  if (fromHtml && fromHtml.title) {
    return {
      ...fromHtml,
      publishedAt: null,
      url: `https://www.youtube.com/watch?v=${fromHtml.videoId}`,
      thumbnailUrl: `https://i.ytimg.com/vi/${fromHtml.videoId}/hqdefault.jpg`,
      channelUrl: channel,
    };
  }

  return null;
}
