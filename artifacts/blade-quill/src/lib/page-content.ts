/**
 * Static loading of block-based pages (content/pages/*.json), bundled at
 * build time via Vite. Query generation lives in page-queries.ts.
 */

export {
  CORE_PAGE_SLUGS,
  corePageRoute,
  isCorePageSlug,
  landingPageQuery,
  landingPageTypename,
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
