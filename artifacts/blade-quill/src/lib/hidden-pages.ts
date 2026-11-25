/**
 * Pages temporarily hidden from the public site. Their page files, blocks,
 * and CMS content stay in place; while hidden they:
 *  - drop out of the header menu and footer columns (use-live-navigation.ts),
 *  - render the 404 page with a noindex tag (HiddenPage in App.tsx),
 *  - lose CTAs that point at them (home hero, pillars, about hero, ...).
 *
 * They stay visible inside the Tina visual editor so their content can still
 * be edited.
 *
 * To restore a page: remove its path here AND its X-Robots-Tag header entry
 * in /vercel.json.
 */
import { isInTinaEditor } from "./tina-live";

/** Each entry also hides everything beneath it (e.g. /shop → /shop/:id). */
export const HIDDEN_PATHS = ["/shop", "/cart", "/education", "/publishers"] as const;

/** Stays reachable even though it lives under a hidden path (Stripe returns here). */
const ALWAYS_VISIBLE_PATHS = ["/shop/success"];

/** Where a hidden page sends visitors instead of the 404 page. */
export const HIDDEN_PATH_REDIRECTS: Record<string, string> = {
  "/publishers": "/contact?tab=publishers",
};

function normalizePath(href: string): string {
  const path = href.split(/[?#]/)[0] || "/";
  return path.length > 1 ? path.replace(/\/+$/, "") : path;
}

export function isHiddenPath(href: string | null | undefined): boolean {
  if (!href || /^[a-z]+:/i.test(href)) return false;
  if (isInTinaEditor()) return false;
  const path = normalizePath(href);
  if (ALWAYS_VISIBLE_PATHS.includes(path)) return false;
  return HIDDEN_PATHS.some((hidden) => path === hidden || path.startsWith(`${hidden}/`));
}
