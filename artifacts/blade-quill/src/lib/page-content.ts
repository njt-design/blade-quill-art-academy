/**
 * Static loading of block-based pages (content/pages/*.json), bundled at
 * build time via Vite. Query generation lives in page-queries.ts.
 */

import { corePageRoute, isCorePageSlug, newPagePath } from "./page-queries";

export {
  CORE_PAGE_SLUGS,
  corePageRoute,
  isCorePageSlug,
  landingPageQuery,
  landingPageTypename,
  newPagePath,
  PARENT_PAGE_SLUGS,
  sitePageQuery,
} from "./page-queries";

const pageModules = import.meta.glob("../../content/pages/*.json", {
  eager: true,
}) as Record<string, { default?: Record<string, unknown> } & Record<string, unknown>>;

export function normalizeSlug(slug: string): string {
  return slug.replace(/\.json$/i, "").replace(/^\//, "");
}

export function getPageData(slug: string): Record<string, unknown> | null {
  const base = normalizeSlug(slug);
  const key = Object.keys(pageModules).find((k) => k.endsWith(`/${base}.json`));
  if (!key) return null;
  const mod = pageModules[key];
  return (mod.default ?? mod) as Record<string, unknown>;
}

/** Canonical public URL for any page slug — core route, or the New Page's parent-based path. */
export function getPagePath(slug: string): string {
  const base = normalizeSlug(slug);
  if (isCorePageSlug(base)) return corePageRoute(base);
  return newPagePath(base, getPageData(base)?.parent);
}

export interface NestedPageRoute {
  /** e.g. "/education/summer-workshop" */
  path: string;
  slug: string;
}

/**
 * Routes for every New Page that lives under a core page. Registered ahead of
 * the core routes so /education/summer-workshop reaches the page, not a 404.
 */
export function getNestedPageRoutes(): NestedPageRoute[] {
  const routes: NestedPageRoute[] = [];
  for (const key of Object.keys(pageModules)) {
    const slug = normalizeSlug(key.split("/").pop() ?? "");
    if (!slug || isCorePageSlug(slug)) continue;
    const path = getPagePath(slug);
    if (!path.startsWith("/p/")) routes.push({ path, slug });
  }
  return routes;
}
