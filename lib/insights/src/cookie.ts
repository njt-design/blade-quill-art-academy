const COOKIE_NAME = "bq_insights";

export function insightsCookieName(): string {
  return COOKIE_NAME;
}

/** Build Set-Cookie for a validated Tina Bearer token (value is the raw JWT). */
export function buildInsightsSessionCookie(idToken: string): string {
  const maxAge = 60 * 60 * 12; // 12 hours
  const parts = [
    `${COOKIE_NAME}=${encodeURIComponent(idToken)}`,
    "Path=/",
    `Max-Age=${maxAge}`,
    "HttpOnly",
    "SameSite=Lax",
  ];
  if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
    parts.push("Secure");
  }
  return parts.join("; ");
}

export function clearInsightsSessionCookie(): string {
  const parts = [
    `${COOKIE_NAME}=`,
    "Path=/",
    "Max-Age=0",
    "HttpOnly",
    "SameSite=Lax",
  ];
  if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
    parts.push("Secure");
  }
  return parts.join("; ");
}

export function readInsightsTokenFromCookie(
  cookieHeader: string | undefined
): string | undefined {
  if (!cookieHeader) return undefined;
  const parts = cookieHeader.split(";");
  for (const part of parts) {
    const [rawName, ...rest] = part.trim().split("=");
    if (rawName === COOKIE_NAME) {
      const value = decodeURIComponent(rest.join("=").trim());
      return value || undefined;
    }
  }
  return undefined;
}

/** Prefer Authorization header; fall back to insights session cookie. */
export function resolveAuthorization(opts: {
  authorization?: string | string[] | undefined;
  cookie?: string | string[] | undefined;
}): string | undefined {
  const header = Array.isArray(opts.authorization)
    ? opts.authorization[0]
    : opts.authorization;
  if (header?.trim()) return header.trim();

  const cookie = Array.isArray(opts.cookie) ? opts.cookie[0] : opts.cookie;
  const fromCookie = readInsightsTokenFromCookie(cookie);
  if (!fromCookie) return undefined;
  return fromCookie.startsWith("Bearer ")
    ? fromCookie
    : `Bearer ${fromCookie}`;
}
