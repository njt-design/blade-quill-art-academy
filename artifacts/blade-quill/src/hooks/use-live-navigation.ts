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

// The bundled seed never changes at runtime, so build it once — a stable
// identity keeps useTina from re-processing it on every render.
const NAV_SEED = {
  navigation: { ...getNavigationData(), __typename: "Navigation" as const },
};
const NAV_VARIABLES = { relativePath: "main.json" };

/**
 * The CMS-managed navigation document, with links resolved to public URLs.
 * Seeds from the JSON bundled at build time, stays editable live inside the
 * Tina editor, and refreshes from Tina Cloud on the public site (same
 * pattern as pages — see use-live-tina.ts).
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
    items: resolveNavLinks(nav.items),
    footerColumns: resolveNavColumns(nav.footerColumns),
  };
}
