import { useEffect, useRef } from "react";
import { useLocation } from "wouter";

/**
 * Page-turn transition. A single fixed-positioned div is mounted once
 * at the app root; whenever `wouter`'s location changes, we toggle the
 * `.run` class for 700ms to play the sketchbook page-turn keyframe
 * defined in `index.css`.
 *
 * Different from the prototype's `goTo()` helper (which fires BEFORE
 * navigation) — we fire on location change since wouter's `<Link>` is
 * idiomatic and reverting it would touch every link in the app.
 */
export function PageTurnOverlay() {
  const [location] = useLocation();
  const initialRef = useRef(true);

  useEffect(() => {
    if (initialRef.current) {
      initialRef.current = false;
      return;
    }
    const el = document.getElementById("pageturn");
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    el.classList.add("run");
    const t = window.setTimeout(() => el.classList.remove("run"), 700);
    return () => window.clearTimeout(t);
  }, [location]);

  return <div id="pageturn" className="pageturn" />;
}
