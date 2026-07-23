import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation } from "wouter";

/**
 * Reset window scroll to the top on every client-side route change.
 * Without this, wouter keeps the previous page's scroll offset — so
 * navigating from a mid-page product card lands you at the footer of
 * the detail page.
 */
export function ScrollToTop() {
  const [location] = useLocation();
  const previous = useRef(location);

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useLayoutEffect(() => {
    if (previous.current === location) return;
    previous.current = location;

    // Hash links (#section) should scroll to the target, not the top.
    if (window.location.hash) {
      const id = decodeURIComponent(window.location.hash.slice(1));
      const el = id ? document.getElementById(id) : null;
      if (el) {
        el.scrollIntoView();
        return;
      }
    }

    window.scrollTo(0, 0);
  }, [location]);

  return null;
}
