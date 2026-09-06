#!/usr/bin/env node
/**
 * Fetch the newest Blade & Quill YouTube upload and write it to
 * artifacts/blade-quill/public/latest-video.json before `vite build`.
 *
 * Why build-time: the site is a static SPA and the Vercel Hobby plan caps
 * deployments at 12 serverless functions (all in use), so a runtime
 * /api/youtube-latest function isn't an option. Every Tina CMS save commits
 * to main and triggers a Vercel rebuild, so the featured video refreshes on
 * each site edit; the Education page block also has a manual YouTube URL
 * override field.
 *
 * No API key — two strategies, tried in order:
 *  1. The public RSS feed (feeds/videos.xml?channel_id=…) — clean Atom XML,
 *     but some hosts/datacenter IPs get a 404 from YouTube.
 *  2. Scraping the channel's /videos tab HTML — the first `lockupViewModel`
 *     in the page data is the newest upload (the grid is newest-first).
 *
 * Never fails the build: on any error the previously committed JSON stays
 * in place and the script exits 0.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "artifacts/blade-quill/public/latest-video.json");

const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID?.trim() || "UCVqapFt9h7Y1KNQw3MWqI2A";
const CHANNEL_URL =
  process.env.YOUTUBE_CHANNEL_URL?.trim() || "https://www.youtube.com/c/BladeQuillartacademy";

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";
const FETCH_TIMEOUT_MS = 8000;

async function fetchText(url) {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": USER_AGENT, "Accept-Language": "en-US,en;q=0.9" },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

/** Decode YouTube's JSON-embedded string escapes (\u0026, \", …). */
function decodeJsonString(raw) {
  try {
    return JSON.parse(`"${raw}"`);
  } catch {
    return raw;
  }
}

function matchTag(xml, tag) {
  const m = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
  return m ? m[1].trim() : null;
}

function stripCdata(value) {
  const m = value.match(/^<!\[CDATA\[([\s\S]*?)\]\]>$/);
  return m ? m[1] : value;
}

function parseRss(xml) {
  const entry = xml.match(/<entry>([\s\S]*?)<\/entry>/);
  if (!entry) return null;
  const videoId = matchTag(entry[1], "yt:videoId");
  const title = matchTag(entry[1], "title");
  if (!videoId || !title) return null;
  return {
    videoId,
    title: stripCdata(title),
    publishedAt: matchTag(entry[1], "published"),
    publishedText: null,
  };
}

/**
 * Parse the channel /videos page. The newest upload is the first
 * `lockupViewModel`; its metadata rows carry view count + age.
 */
function parseVideosPage(html) {
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
  if (!titleMatch) return null;

  let publishedText = null;
  const ageMatch = seg.match(/"accessibilityLabel":"((?:[^"\\]|\\.)*?ago)"/);
  if (ageMatch) publishedText = decodeJsonString(ageMatch[1]);

  return {
    videoId: vidMatch[1],
    title: decodeJsonString(titleMatch[1]),
    publishedAt: null,
    publishedText,
  };
}

async function fetchLatestYoutubeVideo() {
  const rss = await fetchText(
    `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`
  );
  const fromRss = rss ? parseRss(rss) : null;
  if (fromRss) return fromRss;

  const html = await fetchText(`${CHANNEL_URL.replace(/\/$/, "")}/videos`);
  return html ? parseVideosPage(html) : null;
}

try {
  const video = await fetchLatestYoutubeVideo();
  if (!video) {
    console.warn(
      "⚠ write-latest-video: YouTube unreachable — keeping the previously committed latest-video.json"
    );
    process.exit(0);
  }

  const payload = {
    videoId: video.videoId,
    title: video.title,
    url: `https://www.youtube.com/watch?v=${video.videoId}`,
    publishedAt: video.publishedAt,
    publishedText: video.publishedText,
    thumbnailUrl: `https://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`,
    channelUrl: CHANNEL_URL,
    generatedAt: new Date().toISOString(),
  };

  const previous = existsSync(out) ? readFileSync(out, "utf8") : "";
  if (previous && previous === JSON.stringify(payload, null, 2) + "\n") {
    console.log(`✓ latest-video.json already current (${payload.title})`);
  } else {
    writeFileSync(out, JSON.stringify(payload, null, 2) + "\n");
    console.log(`✓ Wrote latest-video.json — "${payload.title}" (${payload.videoId})`);
  }
} catch (err) {
  console.warn(`⚠ write-latest-video: ${err?.message ?? err} — keeping existing file`);
}
process.exit(0);
