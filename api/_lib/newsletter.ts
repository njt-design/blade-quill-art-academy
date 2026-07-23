import { createHmac, timingSafeEqual } from "node:crypto";
import type { VercelRequest } from "@vercel/node";

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmail(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim().toLowerCase();
  if (!EMAIL_RE.test(trimmed) || trimmed.length > 320) return null;
  return trimmed;
}

/** Prefer a dedicated secret; fall back to the API key so no extra env is required. */
export function unsubscribeSecret(): string | null {
  return (
    process.env.NEWSLETTER_UNSUBSCRIBE_SECRET?.trim() ||
    process.env.RESEND_API_KEY?.trim() ||
    null
  );
}

export function signUnsubscribeToken(email: string, secret: string): string {
  return createHmac("sha256", secret).update(email).digest("base64url");
}

export function verifyUnsubscribeToken(
  email: string,
  token: string,
  secret: string
): boolean {
  if (!token) return false;
  const expected = signUnsubscribeToken(email, secret);
  try {
    const a = Buffer.from(expected);
    const b = Buffer.from(token);
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function siteBaseUrl(req: VercelRequest): string {
  const protoHeader = req.headers["x-forwarded-proto"];
  const proto =
    (Array.isArray(protoHeader) ? protoHeader[0] : protoHeader)?.split(",")[0]?.trim() ||
    "https";
  const hostHeader = req.headers["x-forwarded-host"] || req.headers.host;
  const host = (Array.isArray(hostHeader) ? hostHeader[0] : hostHeader)?.split(",")[0]?.trim();
  if (host) return `${proto}://${host}`;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return "https://blade-quill-art-academy.vercel.app";
}

export function unsubscribeUrl(req: VercelRequest, email: string, secret: string): string {
  const token = signUnsubscribeToken(email, secret);
  const params = new URLSearchParams({ email, token });
  return `${siteBaseUrl(req)}/api/newsletter/unsubscribe?${params.toString()}`;
}

export function confirmationEmail(opts: {
  email: string;
  unsubscribeLink: string;
}): { subject: string; text: string; html: string } {
  const subject = "You're subscribed to the Blade & Quill studio newsletter";
  const text = [
    "Thanks for joining the Blade & Quill studio newsletter.",
    "",
    "You'll get art tips, new tutorials, and class announcements — usually about once a month. No spam.",
    "",
    `If you didn't mean to sign up, or you'd rather not hear from us, unsubscribe here:`,
    opts.unsubscribeLink,
    "",
    "— Corinne · Blade & Quill Art Academy",
  ].join("\n");

  const html = `
<!DOCTYPE html>
<html>
  <body style="font-family: Georgia, serif; color: #2e2222; line-height: 1.6; max-width: 520px; margin: 0 auto; padding: 24px;">
    <p>Thanks for joining the <strong>Blade &amp; Quill</strong> studio newsletter.</p>
    <p>You'll get art tips, new tutorials, and class announcements — usually about once a month. No spam.</p>
    <p style="font-size: 14px; color: #6b5c5c;">
      If you didn't mean to sign up, or you'd rather not hear from us,
      <a href="${opts.unsubscribeLink}">unsubscribe here</a>.
    </p>
    <p style="margin-top: 28px;">— Corinne · Blade &amp; Quill Art Academy</p>
  </body>
</html>`.trim();

  return { subject, text, html };
}
