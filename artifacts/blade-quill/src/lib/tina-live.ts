/**
 * Runtime client for the Tina Cloud content API.
 *
 * The public site bundles content JSON at build time (see page-content.ts),
 * which means a CMS save normally waits ~2-3 minutes for a Vercel rebuild.
 * This module lets pages re-fetch the same GraphQL queries directly from
 * Tina Cloud at runtime, so saved edits show up in seconds. The bundled
 * JSON remains the seed/fallback, so nothing breaks if the fetch fails.
 *
 * Credentials are injected at build time via `define` in vite.config.ts.
 * The token MUST be a Tina Cloud *read-only* token — those are designed to
 * be shipped in browser bundles (Tina's documented client-side data
 * fetching pattern).
 */

declare const __TINA_CLIENT_ID__: string;
declare const __TINA_READONLY_TOKEN__: string;
declare const __TINA_BRANCH__: string;

/** major.minor of @tinacms/graphql — the version segment of the content API URL. */
const TINA_API_VERSION = "2.4";

const clientId = typeof __TINA_CLIENT_ID__ === "string" ? __TINA_CLIENT_ID__ : "";
const token =
  typeof __TINA_READONLY_TOKEN__ === "string" ? __TINA_READONLY_TOKEN__ : "";
const branch = typeof __TINA_BRANCH__ === "string" && __TINA_BRANCH__ ? __TINA_BRANCH__ : "main";

const contentApiUrl = `https://content.tinajs.io/${TINA_API_VERSION}/content/${clientId}/github/${branch}`;

/**
 * Live content is production-only: in dev Vite HMR already reloads content
 * JSON instantly, and the Tina editor iframe gets live data via useTina.
 */
export function isLiveContentEnabled(): boolean {
  return import.meta.env.PROD && Boolean(clientId) && Boolean(token);
}

/** True inside the Tina visual editor iframe (useTina handles live data there). */
export function isInTinaEditor(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.self !== window.top;
  } catch {
    // Cross-origin frame access throws — we're framed, treat as editor/embedded.
    return true;
  }
}

/**
 * Run a GraphQL query against the Tina Cloud content API.
 * Returns the `data` payload, or null on any failure (network, HTTP, GraphQL).
 */
export async function fetchTinaData<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T | null> {
  if (!isLiveContentEnabled()) return null;
  try {
    const res = await fetch(contentApiUrl, {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": token,
      },
      body: JSON.stringify({ query, variables: variables ?? {} }),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { data?: T; errors?: unknown[] };
    if (!json.data || (Array.isArray(json.errors) && json.errors.length > 0)) {
      return null;
    }
    return json.data;
  } catch {
    return null;
  }
}
