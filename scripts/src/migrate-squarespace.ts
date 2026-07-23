/**
 * One-shot Squarespace scraper for bladeandquillartacademy.com.
 *
 * For every in-scope page (tutorials are intentionally excluded) it:
 *   1. fetches the live HTML,
 *   2. extracts Squarespace CDN images (with alt text / figcaptions) and
 *      downloadable /s/ file links,
 *   3. downloads each asset into the frontend's public folder
 *      (images  -> artifacts/blade-quill/public/images/squarespace/<page>/
 *       files   -> artifacts/blade-quill/public/files/),
 *   4. writes scripts/src/squarespace-manifest.json mapping every old
 *      Squarespace URL to its new local path.
 *
 * Run with:  pnpm --filter @workspace/scripts run migrate:squarespace
 */

import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SITE = "https://bladeandquillartacademy.com";

/** Pages to migrate. All tutorial pages/series are deliberately excluded. */
const PAGES = [
  "", // homepage
  "about-corinne",
  "contact",
  "digital-paintings",
  "free-coloring-pages-downloads",
  "resources",
  "important-links-page",
  "lheeloo-luna-cartoon-book",
  "krita-quick-start-guide-ebook",
  "super-fun-activity-book",
  "the-making-of-lheeloo-and-luna",
  "lheeloo-and-luna-extra-posts",
];

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../..");
const PUBLIC_DIR = path.join(REPO_ROOT, "artifacts/blade-quill/public");
const IMAGES_ROOT = path.join(PUBLIC_DIR, "images/squarespace");
const FILES_ROOT = path.join(PUBLIC_DIR, "files");
const MANIFEST_PATH = path.join(__dirname, "squarespace-manifest.json");

interface ManifestEntry {
  page: string;
  kind: "image" | "file";
  oldUrl: string;
  /** Site-absolute path, e.g. /images/squarespace/digital-paintings/dragon.jpg */
  newPath: string;
  alt?: string;
  caption?: string;
}

const decodeEntities = (s: string) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&rsquo;|&#8217;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&mdash;|&#8212;/g, "—")
    .trim();

const stripTags = (s: string) => decodeEntities(s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " "));

/** Turn a CDN filename like "STEAMPUNK+CAT.jpg" into "steampunk-cat.jpg". */
function sanitizeFilename(rawName: string): string {
  const decoded = decodeURIComponent(rawName.replace(/\+/g, " "));
  const ext = path.extname(decoded).toLowerCase();
  const base = path
    .basename(decoded, path.extname(decoded))
    .toLowerCase()
    .replace(/['’!]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `${base || "asset"}${ext}`;
}

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (migration script)" } });
  if (!res.ok) throw new Error(`GET ${url} -> ${res.status}`);
  return res.text();
}

async function download(url: string, dest: string): Promise<void> {
  if (existsSync(dest)) return;
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (migration script)" } });
  if (!res.ok) throw new Error(`GET ${url} -> ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await mkdir(path.dirname(dest), { recursive: true });
  await writeFile(dest, buf);
}

interface ExtractedImage {
  url: string;
  alt?: string;
  caption?: string;
}

/** Pull CDN images (with nearby alt/figcaption) out of a page's HTML. */
function extractImages(html: string): ExtractedImage[] {
  const found = new Map<string, ExtractedImage>();

  // <figure> blocks give us captions when present.
  for (const fig of html.match(/<figure[\s\S]*?<\/figure>/g) ?? []) {
    const src = fig.match(/data-src="(https:\/\/images\.squarespace-cdn\.com[^"?]+)/);
    if (!src) continue;
    const alt = fig.match(/alt="([^"]*)"/);
    const cap = fig.match(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/);
    const entry: ExtractedImage = { url: src[1] };
    if (alt?.[1]) entry.alt = decodeEntities(alt[1]);
    const capText = cap ? stripTags(cap[1]) : "";
    if (capText) entry.caption = capText;
    found.set(entry.url, entry);
  }

  // Any remaining lazy-loaded images outside <figure> wrappers.
  for (const m of html.matchAll(/<img[^>]+data-src="(https:\/\/images\.squarespace-cdn\.com[^"?]+)"[^>]*>/g)) {
    const url = m[1];
    if (found.has(url)) continue;
    const alt = m[0].match(/alt="([^"]*)"/);
    const entry: ExtractedImage = { url };
    if (alt?.[1]) entry.alt = decodeEntities(alt[1]);
    found.set(url, entry);
  }

  return [...found.values()];
}

/** Pull downloadable /s/ file links out of a page's HTML. */
function extractFileLinks(html: string): string[] {
  const files = new Set<string>();
  for (const m of html.matchAll(/href="(\/s\/[^"]+)"/g)) files.add(m[1]);
  return [...files];
}

async function main() {
  const manifest: ManifestEntry[] = [];
  const seenUrls = new Map<string, string>(); // oldUrl -> newPath (first page wins)
  const usedPaths = new Set<string>();

  /** Distinct assets can share a CDN filename — suffix -2, -3, … to keep them apart. */
  const uniquePath = (wanted: string): string => {
    if (!usedPaths.has(wanted)) {
      usedPaths.add(wanted);
      return wanted;
    }
    const ext = path.extname(wanted);
    const stem = wanted.slice(0, -ext.length || undefined);
    for (let i = 2; ; i++) {
      const candidate = `${stem}-${i}${ext}`;
      if (!usedPaths.has(candidate)) {
        usedPaths.add(candidate);
        return candidate;
      }
    }
  };

  for (const slug of PAGES) {
    const pageKey = slug || "home";
    const url = `${SITE}/${slug}`;
    console.log(`\n→ ${url}`);
    let html: string;
    try {
      html = await fetchText(url);
    } catch (err) {
      console.error(`  ✗ failed to fetch page: ${err}`);
      continue;
    }

    for (const img of extractImages(html)) {
      let newPath = seenUrls.get(img.url);
      if (!newPath) {
        const name = sanitizeFilename(img.url.split("/").pop() ?? "asset");
        newPath = uniquePath(`/images/squarespace/${pageKey}/${name}`);
        try {
          await download(img.url, path.join(PUBLIC_DIR, newPath.slice(1)));
          console.log(`  ✓ image ${newPath}`);
        } catch (err) {
          console.error(`  ✗ image ${img.url}: ${err}`);
          continue;
        }
        seenUrls.set(img.url, newPath);
      }
      manifest.push({ page: pageKey, kind: "image", oldUrl: img.url, newPath, ...(img.alt ? { alt: img.alt } : {}), ...(img.caption ? { caption: img.caption } : {}) });
    }

    for (const file of extractFileLinks(html)) {
      const oldUrl = `${SITE}${file}`;
      let newPath = seenUrls.get(oldUrl);
      if (!newPath) {
        const name = sanitizeFilename(file.split("/").pop() ?? "file");
        newPath = uniquePath(`/files/${name}`);
        try {
          await download(oldUrl, path.join(PUBLIC_DIR, newPath.slice(1)));
          console.log(`  ✓ file  ${newPath}`);
        } catch (err) {
          console.error(`  ✗ file  ${oldUrl}: ${err}`);
          continue;
        }
        seenUrls.set(oldUrl, newPath);
      }
      manifest.push({ page: pageKey, kind: "file", oldUrl, newPath });
    }
  }

  await mkdir(IMAGES_ROOT, { recursive: true });
  await mkdir(FILES_ROOT, { recursive: true });
  await writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n");
  console.log(`\n✅ ${manifest.length} manifest entries written to ${path.relative(REPO_ROOT, MANIFEST_PATH)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
