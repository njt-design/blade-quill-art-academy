import { useLiveTina } from "@/hooks/use-live-tina";
import {
  getNavigationData,
  navigationQuery,
  resolveNavColumns,
  resolveNavLinks,
  type NavigationData,
  type ResolvedNavColumn,
  type ResolvedNavLink,
} from "@/lib/navigation-content";
import { getPagePath } from "@/lib/page-content";
import { isHiddenPath } from "@/lib/hidden-pages";

// The bundled seed never changes at runtime, so build it once — a stable
// identity keeps useTina from re-processing it on every render.
const NAV_SEED = {
  navigation: { ...getNavigationData(), __typename: "Navigation" as const },
};
const NAV_VARIABLES = { relativePath: "main.json" };

/**
 * Drop links to hidden pages (lib/hidden-pages.ts). A hidden parent's
 * visible children move up a level so they stay reachable.
 */
function withoutHiddenLinks(links: ResolvedNavLink[]): ResolvedNavLink[] {
  return links.flatMap((link) => {
    const children = withoutHiddenLinks(link.children);
    if (!link.external && isHiddenPath(link.href)) return children;
    if (!link.href && children.length === 0) return [];
    return [{ ...link, children }];
  });
}

function withoutHiddenColumns(columns: ResolvedNavColumn[]): ResolvedNavColumn[] {
  return columns
    .map((col) => ({ ...col, links: withoutHiddenLinks(col.links) }))
    .filter((col) => col.links.length > 0);
}

/**
 * The CMS-managed navigation document, with links resolved to public URLs.
 * Seeds from the JSON bundled at build time, stays editable live inside the
 * Tina editor, and refreshes from Tina Cloud on the public site via
 * useLiveTina (focus / visibility refetch + editor polling included).
 */
export function useLiveNavigation(): {
  items: ResolvedNavLink[];
  footerColumns: ResolvedNavColumn[];
} {
  const { data } = useLiveTina({
    query: navigationQuery,
    variables: NAV_VARIABLES,
    data: NAV_SEED,
  });

  const nav =
    ((data as Record<string, unknown>).navigation as NavigationData | null) ??
    NAV_SEED.navigation;

  return {
    items: withoutHiddenLinks(resolveNavLinks(nav.items, getPagePath)),
    footerColumns: withoutHiddenColumns(resolveNavColumns(nav.footerColumns, getPagePath)),
  };
}
