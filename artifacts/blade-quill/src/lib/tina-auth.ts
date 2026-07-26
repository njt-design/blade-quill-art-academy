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

export function adminLoginUrl(returnPath = "/insights"): string {
  const base = import.meta.env.BASE_URL || "/";
  const admin = `${base}admin/index.html`.replace(/\/{2,}/g, "/");
  // Admin login is separate; after login Corinne returns via the Insights link.
  void returnPath;
  return admin.startsWith("/") ? admin : `/${admin}`;
}
