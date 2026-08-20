/**
 * Per-page document head management for the SPA: browser-tab title,
 * meta description, and Open Graph / Twitter tags.
 *
 * Pages call useSeo() with their CMS "Search Listing (SEO)" fields (falling
 * back to their regular title/excerpt/description). Google indexes these
 * fine as it renders JavaScript; static social-link previews would need
 * prerendering, which is a separate follow-up.
 */
import { useEffect } from "react";

const SITE_NAME = "Blade & Quill";

/** CMS "Search Listing (SEO)" group shape (tina/seo.ts). */
export interface CmsSeo {
  metaTitle?: string | null;
  metaDescription?: string | null;
}

export interface UseSeoInput {
  /** Page title without the site name (appended automatically). */
  title?: string | null;
  description?: string | null;
  /** Social-preview image (site path or absolute URL). */
  image?: string | null;
  type?: "website" | "article" | "product";
}

/** Flatten a Tina rich-text (Slate) value — or plain string — into text. */
export function richTextToPlain(value: unknown): string {
  if (typeof value === "string") return value.replace(/\s+/g, " ").trim();
  const out: string[] = [];
  const visit = (node: unknown): void => {
    if (node == null) return;
    if (Array.isArray(node)) {
      for (const item of node) visit(item);
      return;
    }
    if (typeof node === "object") {
      const rec = node as Record<string, unknown>;
      if (typeof rec.text === "string") out.push(rec.text);
      visit(rec.children);
    }
  };
  visit(value);
  return out.join(" ").replace(/\s+/g, " ").trim();
}

interface HeadDefaults {
  title: string;
  description: string;
}

let defaults: HeadDefaults | null = null;

function getDefaults(): HeadDefaults {
  if (!defaults) {
    defaults = {
      title: document.title,
      description:
        document
          .querySelector('meta[name="description"]')
          ?.getAttribute("content") ?? "",
    };
  }
  return defaults;
}

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(
    `meta[${attr}="${key}"]`
  );
  if (!content) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function toAbsoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${window.location.origin}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

function applySeo(input: UseSeoInput) {
  const base = getDefaults();

  const rawTitle = input.title?.trim() ?? "";
  const fullTitle = rawTitle
    ? rawTitle.includes(SITE_NAME)
      ? rawTitle
      : `${rawTitle} — ${SITE_NAME}`
    : base.title;
  const description = input.description?.trim() || base.description;

  document.title = fullTitle;
  upsertMeta("name", "description", description);
  upsertMeta("property", "og:site_name", `${SITE_NAME} Art Academy`);
  upsertMeta("property", "og:title", fullTitle);
  upsertMeta("property", "og:description", description);
  upsertMeta("property", "og:type", input.type ?? "website");
  upsertMeta("property", "og:url", window.location.href);
  upsertMeta(
    "property",
    "og:image",
    input.image?.trim() ? toAbsoluteUrl(input.image.trim()) : ""
  );
  upsertMeta(
    "name",
    "twitter:card",
    input.image?.trim() ? "summary_large_image" : "summary"
  );
}

function restoreDefaults() {
  const base = getDefaults();
  document.title = base.title;
  upsertMeta("name", "description", base.description);
  upsertMeta("property", "og:title", base.title);
  upsertMeta("property", "og:description", base.description);
  upsertMeta("property", "og:type", "website");
  upsertMeta("property", "og:image", "");
  upsertMeta("name", "twitter:card", "summary");
}

/**
 * Set the document head for the current page. Values update live (e.g. while
 * editing in Tina) and reset to the site defaults when the page unmounts.
 */
export function useSeo(input: UseSeoInput): void {
  const { title, description, image, type } = input;
  useEffect(() => {
    applySeo({ title, description, image, type });
    return () => restoreDefaults();
  }, [title, description, image, type]);
}
