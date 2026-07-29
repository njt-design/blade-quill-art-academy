import { useCallback, useEffect, useRef, useState } from "react";
import { useTina } from "tinacms/react";
import { useLiveRefresh } from "@/hooks/use-live-refresh";
import { hasTinaSession } from "@/lib/tina-auth";
import {
  fetchTinaData,
  isInTinaEditor,
  isLiveContentEnabled,
} from "@/lib/tina-live";

export type LiveTinaFreshness =
  | "bundled"
  | "loading"
  | "live"
  | "publishing"
  | "unavailable";

interface UseLiveTinaArgs<T extends object> {
  query: string;
  variables: Record<string, unknown>;
  data: T;
}

interface UseLiveTinaResult<T extends object> {
  data: T;
  /** How the public site resolved content (ignored inside the editor iframe). */
  freshness: LiveTinaFreshness;
}

/**
 * Drop-in replacement for useTina that also re-fetches the query from the
 * Tina Cloud content API at runtime (production, outside the editor iframe),
 * so CMS saves appear on the live site in seconds instead of waiting for a
 * rebuild. The passed `data` (bundled at build time) renders first and stays
 * as the fallback when the live fetch fails.
 *
 * Refetches on tab focus / visibility, and polls for ~2 minutes while a Tina
 * session is present so an already-open public tab picks up saves without a
 * hard refresh.
 */
export function useLiveTina<T extends object>({
  query,
  variables,
  data,
}: UseLiveTinaArgs<T>): UseLiveTinaResult<T> {
  const tina = useTina({ query, variables, data });
  // Keyed by query+variables so stale live data never shows after the
  // component re-renders for a different document (e.g. /p/a -> /p/b).
  const [live, setLive] = useState<{ key: string; data: T } | null>(null);
  const [freshness, setFreshness] = useState<LiveTinaFreshness>("bundled");
  const variablesKey = JSON.stringify(variables);
  const liveKey = query + variablesKey;
  const liveEnabled = isLiveContentEnabled() && !isInTinaEditor();
  const requestId = useRef(0);

  const refresh = useCallback(
    (mode: "initial" | "silent" = "silent") => {
      if (!isLiveContentEnabled() || isInTinaEditor()) return;

      if (mode === "initial") {
        setFreshness("loading");
      } else if (hasTinaSession()) {
        // Signed-in editor waiting on a save — keep the pill informative
        // without blanking the page.
        setFreshness((prev) => (prev === "live" ? "publishing" : prev));
      }

      const id = ++requestId.current;
      fetchTinaData<T>(query, JSON.parse(variablesKey)).then((fresh) => {
        if (id !== requestId.current) return;
        if (fresh) {
          setLive({ key: query + variablesKey, data: fresh });
          setFreshness("live");
        } else if (mode === "initial") {
          setFreshness("unavailable");
        } else {
          setFreshness((prev) =>
            prev === "publishing"
              ? "live"
              : prev === "loading"
                ? "unavailable"
                : prev
          );
        }
      });
    },
    [query, variablesKey]
  );

  useEffect(() => {
    if (!liveEnabled) {
      setFreshness("bundled");
      return;
    }
    refresh("initial");
  }, [liveEnabled, refresh]);

  useLiveRefresh(() => refresh("silent"), liveEnabled);

  // Inside the editor the useTina live data always wins; on the public site
  // the runtime fetch (when it lands) supersedes the bundled seed.
  if (isInTinaEditor()) return { data: tina.data, freshness: "bundled" };
  return {
    data: live && live.key === liveKey ? live.data : tina.data,
    freshness,
  };
}
