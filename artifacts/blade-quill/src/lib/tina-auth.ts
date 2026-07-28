/**
 * Read the Tina Cloud session stored by `/admin` (same origin localStorage).
 * Key and shape match tinacms AUTH_TOKEN_KEY / TokenObject.
 */

export const TINA_AUTH_TOKEN_KEY = "tinacms-auth";

export interface TinaTokenObject {
  id_token: string;
  access_token?: string;
  refresh_token?: string;
}

declare const __TINA_CLIENT_ID__: string;

export function getTinaClientId(): string {
  return (typeof __TINA_CLIENT_ID__ === "string" ? __TINA_CLIENT_ID__ : "")
    .replace(/\\n/g, "")
    .trim();
}

export function getTinaIdToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(TINA_AUTH_TOKEN_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as TinaTokenObject;
    const token = parsed?.id_token?.trim();
    if (!token || token === "null") return null;
    return token;
  } catch {
    return null;
  }
}

export function hasTinaSession(): boolean {
  return Boolean(getTinaIdToken());
}

/** Canonical admin while the production domain is under construction. */
export const CANONICAL_ADMIN_URL =
  "https://blade-quill-art-academy.vercel.app/admin";

export function adminLoginUrl(returnPath = "/insights"): string {
  // Always send editors to the working host — the real domain may still
  // serve the under-construction page for non-/admin routes.
  void returnPath;
  return CANONICAL_ADMIN_URL;
}
