/**
 * GraphQL query + link resolution for the Navigation singleton
 * (content/navigation/main.json). Static loading lives in
 * navigation-content.ts. (This module is intentionally free of Vite-only
 * APIs so it can also run under Node for schema validation.)
 */

import { corePageRoute, isCorePageSlug } from "./page-queries";

/**
 * A nav link as stored in Tina. `page` is a document path string in the
 * bundled JSON (e.g. "content/pages/about.json") but a resolved document
 * object (with `_sys`) when it comes back from the GraphQL API.
 */
export interface NavLinkData {
  label?: string | null;
  linkType?: string | null;
  href?: string | null;
  page?: string | { _sys?: { filename?: string | null } | null } | null;
  children?: Array<NavLinkData | null> | null;
}

export interface NavColumnData {
  heading?: string | null;
  links?: Array<NavLinkData | null> | null;
}

export interface NavigationData {
  items?: Array<NavLinkData | null> | null;
  footerColumns?: Array<NavColumnData | null> | null;
}

/** A nav link ready to render: label + resolved URL. */
export interface ResolvedNavLink {
  label: string;
  /** null when the item has no destination (e.g. a dropdown-only parent). */
  href: string | null;
  external: boolean;
  children: ResolvedNavLink[];
}

export interface ResolvedNavColumn {
  heading: string;
  links: ResolvedNavLink[];
}

const NAV_LINK_SELECTION =
  "label linkType href page { ... on Document { _sys { filename } } }";

/** Query for the "navigation" singleton collection. */
export const navigationQuery = `
  query navigation($relativePath: String!) {
    navigation(relativePath: $relativePath) {
      ... on Document { _sys { filename basename path relativePath } id }
      __typename
      items {
        ${NAV_LINK_SELECTION}
        children {
          ${NAV_LINK_SELECTION}
        }
      }
      footerColumns {
        heading
        links {
          ${NAV_LINK_SELECTION}
        }
      }
    }
  }
`;

/** Slug (filename without extension) of a page reference, in either form. */
function pageSlug(page: NavLinkData["page"]): string | null {
  if (!page) return null;
  if (typeof page === "string") {
    const base = page.split("/").pop() ?? "";
    return base.replace(/\.json$/i, "") || null;
  }
  return page._sys?.filename ?? null;
}

/** Public URL for a page slug (mirrors the Tina router config). */
export function pageHref(slug: string): string {
  return isCorePageSlug(slug) ? corePageRoute(slug) : `/p/${slug}`;
}

function resolveHref(link: NavLinkData): { href: string | null; external: boolean } {
  if (link.linkType === "external") {
    return { href: link.href || null, external: true };
  }
  const slug = pageSlug(link.page);
  if (link.linkType === "page") {
    return { href: slug ? pageHref(slug) : null, external: false };
  }
  // "path" (or legacy items without a linkType): explicit href wins,
  // page reference is the fallback. Full URLs still open externally.
  const href = link.href || (slug ? pageHref(slug) : null);
  return { href, external: Boolean(href && /^https?:\/\//i.test(href)) };
}

function resolveLink(link: NavLinkData | null | undefined): ResolvedNavLink | null {
  if (!link?.label) return null;
  const { href, external } = resolveHref(link);
  const children = resolveNavLinks(link.children);
  if (!href && children.length === 0) return null;
  return { label: link.label, href, external, children };
}

export function resolveNavLinks(
  links: Array<NavLinkData | null> | null | undefined
): ResolvedNavLink[] {
  return (links ?? [])
    .map(resolveLink)
    .filter((l): l is ResolvedNavLink => l !== null);
}

export function resolveNavColumns(
  columns: Array<NavColumnData | null> | null | undefined
): ResolvedNavColumn[] {
  return (columns ?? [])
    .filter((c): c is NavColumnData => Boolean(c?.heading))
    .map((c) => ({ heading: c.heading as string, links: resolveNavLinks(c.links) }))
    .filter((c) => c.links.length > 0);
}
