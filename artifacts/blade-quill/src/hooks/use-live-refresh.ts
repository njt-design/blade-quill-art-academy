import { useEffect, useRef } from "react";
import { hasTinaSession } from "@/lib/tina-auth";

/** How often signed-in editors re-fetch after focus/mount. */
export const EDITOR_POLL_INTERVAL_MS = 5_000;
/** Stop editor polling after this window (covers a save + a few refreshes). */
export const EDITOR_POLL_DURATION_MS = 120_000;

/**
 * Re-run `refresh` when the tab becomes visible / window focused, and — while
 * a Tina session is present — poll every few seconds for a couple of minutes.
 *
 * Callers own the initial fetch; this hook only adds focus + editor polling.
 * Pass a stable `refresh` (or accept that the effect rebinds when it changes).
 */
export function useLiveRefresh(refresh: () => void, enabled: boolean): void {
  const refreshRef = useRef(refresh);
  refreshRef.current = refresh;

  useEffect(() => {
    if (!enabled) return;

    let pollId: number | undefined;
    let stopPollId: number | undefined;

    const run = () => {
      refreshRef.current();
    };

    const startEditorPoll = () => {
      if (!hasTinaSession()) return;
      if (pollId !== undefined) window.clearInterval(pollId);
      if (stopPollId !== undefined) window.clearTimeout(stopPollId);
      pollId = window.setInterval(run, EDITOR_POLL_INTERVAL_MS);
      stopPollId = window.setTimeout(() => {
        if (pollId !== undefined) window.clearInterval(pollId);
        pollId = undefined;
      }, EDITOR_POLL_DURATION_MS);
    };

    const onFocus = () => {
      run();
      startEditorPoll();
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        run();
        startEditorPoll();
      }
    };

    // Editor who just saved often already has the public tab open — start
    // polling immediately so they don't need to click away and back.
    if (hasTinaSession()) startEditorPoll();

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
      if (pollId !== undefined) window.clearInterval(pollId);
      if (stopPollId !== undefined) window.clearTimeout(stopPollId);
    };
  }, [enabled]);
}
