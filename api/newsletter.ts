/**
 * Vercel serverless function backing POST /api/newsletter.
 *
 * Stores newsletter signups as contacts in a Resend Audience, so subscribers
 * live in the same Resend account used for contact form email and can receive
 * broadcasts later — no separate database needed.
 *
 * Required env vars (Vercel project settings):
 *   RESEND_API_KEY     — Resend API key (shared with api/contact.ts)
 *   RESEND_AUDIENCE_ID — id of the Resend Audience that holds subscribers
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function parseEmail(body: unknown): string | null {
  if (typeof body !== "object" || body === null) return null;
  const { email } = body as Record<string, unknown>;
  if (typeof email !== "string") return null;
  const trimmed = email.trim().toLowerCase();
  if (!EMAIL_RE.test(trimmed) || trimmed.length > 320) return null;
  return trimmed;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const email = parseEmail(req.body);
  if (!email) {
    res.status(400).json({ error: "Please enter a valid email address" });
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!apiKey || !audienceId) {
    console.error("Newsletter misconfigured: missing RESEND_API_KEY / RESEND_AUDIENCE_ID");
    res.status(500).json({ error: "Failed to subscribe" });
    return;
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.contacts.create({
      email,
      audienceId,
      unsubscribed: false,
    });
    // Resend rejects duplicates; a repeat signup should still read as success.
    if (error && !/already exist/i.test(error.message ?? "")) {
      console.error("Resend contact create failed:", error);
      res.status(500).json({ error: "Failed to subscribe" });
      return;
    }
    res.status(200).json({
      success: true,
      message: "You're on the list! Watch your inbox for studio news.",
    });
  } catch (err) {
    console.error("Newsletter signup error:", err);
    res.status(500).json({ error: "Failed to subscribe" });
  }
}
