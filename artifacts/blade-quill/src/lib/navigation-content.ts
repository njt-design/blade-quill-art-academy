/**
 * Static loading of the Navigation singleton (content/navigation/main.json),
 * bundled at build time via Vite. Query generation and link resolution live
 * in navigation-queries.ts.
 */

import type { NavigationData } from "./navigation-queries";

export {
  navigationQuery,
  pageHref,
  resolveNavColumns,
  resolveNavLinks,
  type NavColumnData,
  type NavigationData,
  type NavLinkData,
  type ResolvedNavColumn,
  type ResolvedNavLink,
} from "./navigation-queries";

const navModules = import.meta.glob("../../content/navigation/*.json", {
  eager: true,
}) as Record<string, { default?: NavigationData } & NavigationData>;

export function getNavigationData(): NavigationData {
  const key = Object.keys(navModules).find((k) => k.endsWith("/main.json"));
  if (!key) return {};
  const mod = navModules[key];
  return (mod.default ?? mod) as NavigationData;
}
