import { useEffect, type ReactNode } from "react";
import { Redirect, useLocation } from "wouter";
import { HIDDEN_PATH_REDIRECTS, isHiddenPath } from "@/lib/hidden-pages";
import NotFound from "@/pages/not-found";

/**
 * Route gate for pages listed in lib/hidden-pages.ts: renders the page
 * normally, or — while it's hidden — a redirect / the 404 page with noindex.
 */
export function HiddenPage({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const hidden = isHiddenPath(location);
  const redirectTo = hidden ? HIDDEN_PATH_REDIRECTS[location] : undefined;

  useEffect(() => {
    if (!hidden) return;
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => meta.remove();
  }, [hidden]);

  if (!hidden) return <>{children}</>;
  if (redirectTo) return <Redirect to={redirectTo} replace />;
  return <NotFound />;
}
