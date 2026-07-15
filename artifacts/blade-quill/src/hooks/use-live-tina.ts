import { useEffect, useState } from "react";
import { useTina } from "tinacms/react";
import {
  fetchTinaData,
  isInTinaEditor,
  isLiveContentEnabled,
} from "@/lib/tina-live";

interface UseLiveTinaArgs<T extends object> {
  query: string;
  variables: Record<string, unknown>;
  data: T;
}

/**
 * Drop-in replacement for useTina that also re-fetches the query from the
 * Tina Cloud content API at runtime (production, outside the editor iframe),
 * so CMS saves appear on the live site in seconds instead of waiting for a
 * rebuild. The passed `data` (bundled at build time) renders first and stays
 * as the fallback when the live fetch fails.
 */
export function useLiveTina<T extends object>({
  query,
  variables,
  data,
}: UseLiveTinaArgs<T>): { data: T } {
  const tina = useTina({ query, variables, data });
  // Keyed by query+variables so stale live data never shows after the
  // component re-renders for a different document (e.g. /p/a -> /p/b).
  const [live, setLive] = useState<{ key: string; data: T } | null>(null);
  const variablesKey = JSON.stringify(variables);
  const liveKey = query + variablesKey;

  useEffect(() => {
    if (!isLiveContentEnabled() || isInTinaEditor()) return;
    let cancelled = false;
    fetchTinaData<T>(query, JSON.parse(variablesKey)).then((fresh) => {
      if (!cancelled && fresh) setLive({ key: query + variablesKey, data: fresh });
    });
    return () => {
      cancelled = true;
    };
  }, [query, variablesKey]);

  // Inside the editor the useTina live data always wins; on the public site
  // the runtime fetch (when it lands) supersedes the bundled seed.
  if (isInTinaEditor()) return { data: tina.data };
  return { data: live && live.key === liveKey ? live.data : tina.data };
}
