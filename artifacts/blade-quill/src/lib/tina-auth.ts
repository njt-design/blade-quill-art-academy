/**
 * Tina Cloud session helpers for Owner Insights.
 *
 * Admin login stores tokens at localStorage key `tinacms-auth` (Tina's
 * AUTH_TOKEN_KEY). Insights also accepts a postMessage / in-memory handoff
 * from the Tina admin Insights screen, and a server cookie set by
 * POST /api/insights/session.
 */

export const TINA_AUTH_TOKEN_KEY = "tinacms-auth";
export const INSIGHTS_AUTH_MESSAGE = "bq-insights-auth";
export const INSIGHTS_TOKEN_STORAGE_KEY = "bq-insights-tina-token";

/** Production admin + Insights host during domain cutover. */
export const CANONICAL_SITE_ORIGIN =
  "https://blade-quill-art-academy.vercel.app";

export interface TinaTokenObject {
  id_token: string;
  access_token?: string;
  refresh_token?: string;
}

declare const __TINA_CLIENT_ID__: string;

/** In-memory token from postMessage (iframe handoff). */
let handedOffToken: string | null = null;

export function getTinaClientId(): string {
  return (typeof __TINA_CLIENT_ID__ === "string" ? __TINA_CLIENT_ID__ : "")
    .replace(/\\n/g, "")
    .trim();
}

function parseTokenRaw(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed || trimmed === "null") return null;

  // Raw JWT
  if (trimmed.startsWith("eyJ")) return trimmed;

  try {
    const parsed = JSON.parse(trimmed) as TinaTokenObject | string;
    if (typeof parsed === "string") {
      const t = parsed.trim();
      return t && t !== "null" ? t : null;
    }
    const token = parsed?.id_token?.trim();
    if (!token || token === "null") return null;
    return token;
  } catch {
    return null;
  }
}

function readLocalStorageToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const fromSelf = parseTokenRaw(localStorage.getItem(TINA_AUTH_TOKEN_KEY));
    if (fromSelf) return fromSelf;
  } catch {
    // ignore
  }

  // Same-origin parent (Tina admin wrapping Insights in an iframe).
  try {
    if (window.parent && window.parent !== window) {
      const fromParent = parseTokenRaw(
        window.parent.localStorage.getItem(TINA_AUTH_TOKEN_KEY)
      );
      if (fromParent) return fromParent;
    }
  } catch {
    // Cross-origin parent — ignore.
  }

  try {
    return parseTokenRaw(sessionStorage.getItem(INSIGHTS_TOKEN_STORAGE_KEY));
  } catch {
    return null;
  }
}

export function setHandedOffTinaToken(token: string | null): void {
  handedOffToken = token?.trim() || null;
  if (typeof window === "undefined") return;
  try {
    if (handedOffToken) {
      sessionStorage.setItem(INSIGHTS_TOKEN_STORAGE_KEY, handedOffToken);
    }
  } catch {
    // ignore
  }
}

/** Best available Tina id_token for Insights API calls. */
export function getTinaIdToken(): string | null {
  if (handedOffToken) return handedOffToken;
  try {
    const fromSession = parseTokenRaw(
      typeof sessionStorage !== "undefined"
        ? sessionStorage.getItem(INSIGHTS_TOKEN_STORAGE_KEY)
        : null
    );
    if (fromSession) {
      handedOffToken = fromSession;
      return fromSession;
    }
  } catch {
    // ignore
  }
  return readLocalStorageToken();
}

export function hasTinaSession(): boolean {
  return Boolean(getTinaIdToken());
}

/**
 * Listen for token handoff from the Tina Insights screen (parent frame).
 * Returns an unsubscribe function.
 */
export function subscribeTinaAuthHandoff(
  onToken: (token: string | null) => void
): () => void {
  if (typeof window === "undefined") return () => {};

  const handler = (event: MessageEvent) => {
    if (event.origin !== window.location.origin) return;
    const data = event.data as {
      type?: string;
      idToken?: string;
    } | null;
    if (!data || data.type !== INSIGHTS_AUTH_MESSAGE) return;
    const token = parseTokenRaw(data.idToken ?? null);
    setHandedOffTinaToken(token);
    onToken(token);
  };

  window.addEventListener("message", handler);

  // Ask parent for a token if we're framed.
  try {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage(
        { type: `${INSIGHTS_AUTH_MESSAGE}-request` },
        window.location.origin
      );
    }
  } catch {
    // ignore
  }

  return () => window.removeEventListener("message", handler);
}

/** Establish an httpOnly cookie so iframe fetches work without Bearer header quirks. */
export async function establishInsightsSession(token: string): Promise<boolean> {
  const clientId = getTinaClientId();
  try {
    const res = await fetch("/api/insights/session", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idToken: token,
        ...(clientId ? { clientID: clientId } : {}),
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export function adminLoginUrl(_returnPath = "/insights"): string {
  void _returnPath;
  return `${CANONICAL_SITE_ORIGIN}/admin/index.html`;
}

export function canonicalInsightsUrl(): string {
  return `${CANONICAL_SITE_ORIGIN}/insights`;
}
