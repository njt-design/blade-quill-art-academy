/**
 * Shared password-gate helpers for the owner editing guide (/guide).
 *
 * The guide is protected by a single shared password (GUIDE_PASSWORD).
 * A successful login sets an httpOnly cookie whose value is derived from
 * the password + GUIDE_COOKIE_SECRET, so rotating the password invalidates
 * all existing sessions automatically.
 *
 * Used by both the Vercel function (api/guide.ts) and the local Express
 * dev server (artifacts/api-server/src/routes/guide.ts).
 */
import { createHash, timingSafeEqual } from "node:crypto";

const COOKIE_NAME = "bq_guide";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

function configuredPassword(): string | undefined {
  const pw = process.env.GUIDE_PASSWORD?.trim();
  return pw || undefined;
}

/** Deterministic session token for the current password + secret. */
function expectedGuideToken(password: string): string {
  const secret = process.env.GUIDE_COOKIE_SECRET?.trim() || "bq-guide";
  return createHash("sha256").update(`${password}:${secret}`).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  // Hash both sides so timingSafeEqual always gets equal-length buffers.
  const da = createHash("sha256").update(a).digest();
  const db = createHash("sha256").update(b).digest();
  return timingSafeEqual(da, db);
}

export type GuidePasswordResult = "ok" | "invalid" | "unconfigured";

/** Check a login attempt against GUIDE_PASSWORD. */
export function verifyGuidePassword(candidate: unknown): GuidePasswordResult {
  const pw = configuredPassword();
  if (!pw) return "unconfigured";
  if (typeof candidate !== "string" || !candidate.trim()) return "invalid";
  return safeEqual(candidate.trim(), pw) ? "ok" : "invalid";
}

/** Build Set-Cookie for a successful guide login. */
export function buildGuideSessionCookie(): string {
  const pw = configuredPassword();
  if (!pw) throw new Error("GUIDE_PASSWORD is not configured");
  const parts = [
    `${COOKIE_NAME}=${expectedGuideToken(pw)}`,
    "Path=/",
    `Max-Age=${MAX_AGE_SECONDS}`,
    "HttpOnly",
    "SameSite=Lax",
  ];
  if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
    parts.push("Secure");
  }
  return parts.join("; ");
}

export function clearGuideSessionCookie(): string {
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

/** True when the request's cookies contain a valid guide session token. */
export function hasValidGuideSession(
  cookieHeader: string | string[] | undefined
): boolean {
  const pw = configuredPassword();
  if (!pw) return false;
  const header = Array.isArray(cookieHeader) ? cookieHeader.join(";") : cookieHeader;
  if (!header) return false;
  for (const part of header.split(";")) {
    const [rawName, ...rest] = part.trim().split("=");
    if (rawName === COOKIE_NAME) {
      const value = rest.join("=").trim();
      if (value && safeEqual(value, expectedGuideToken(pw))) return true;
    }
  }
  return false;
}
