/**
 * Vercel serverless function backing POST /api/newsletter.
 *
 * Stores newsletter signups as contacts in a Resend Audience, then emails a
 * confirmation with a signed unsubscribe link.
 *
 * Required env vars (Vercel project settings):
 *   RESEND_API_KEY       — Resend API key (Full access)
 *   RESEND_AUDIENCE_ID   — Audience / segment that holds subscribers
 *   CONTACT_FROM_EMAIL   — verified sender used for the confirmation email
 *
 * Optional:
 *   NEWSLETTER_UNSUBSCRIBE_SECRET — HMAC secret for unsubscribe links
 *                                   (falls back to RESEND_API_KEY)
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";
import {
  confirmationEmail,
  normalizeEmail,
  unsubscribeSecret,
  unsubscribeUrl,
} from "./_lib/newsletter";

function isAlreadyExists(message: string | undefined): boolean {
  return /already exist/i.test(message ?? "");
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const email = normalizeEmail(
    typeof req.body === "object" && req.body !== null
      ? (req.body as Record<string, unknown>).email
      : null
  );
  if (!email) {
    res.status(400).json({ error: "Please enter a valid email address" });
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  const from = process.env.CONTACT_FROM_EMAIL;
  const secret = unsubscribeSecret();
  if (!apiKey || !audienceId || !from || !secret) {
    console.error(
      "Newsletter misconfigured: missing RESEND_API_KEY / RESEND_AUDIENCE_ID / CONTACT_FROM_EMAIL"
    );
    res.status(500).json({ error: "Failed to subscribe" });
    return;
  }

  try {
    const resend = new Resend(apiKey);
    const { error: createError } = await resend.contacts.create({
      email,
      audienceId,
      unsubscribed: false,
    });

    if (createError && !isAlreadyExists(createError.message)) {
      console.error("Resend contact create failed:", createError);
      res.status(500).json({ error: "Failed to subscribe" });
      return;
    }

    // Re-subscribe if they were previously unsubscribed (or exist already).
    if (createError && isAlreadyExists(createError.message)) {
      const { error: updateError } = await resend.contacts.update({
        email,
        audienceId,
        unsubscribed: false,
      });
      if (updateError) {
        console.error("Resend contact re-subscribe failed:", updateError);
        res.status(500).json({ error: "Failed to subscribe" });
        return;
      }
    }

    const unsubLink = unsubscribeUrl(req, email, secret);
    const mail = confirmationEmail({ email, unsubscribeLink: unsubLink });
    const { error: sendError } = await resend.emails.send({
      from,
      to: email,
      subject: mail.subject,
      text: mail.text,
      html: mail.html,
      headers: {
        "List-Unsubscribe": `<${unsubLink}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
    });
    if (sendError) {
      console.error("Newsletter confirmation send failed:", sendError);
      res.status(500).json({ error: "Failed to subscribe" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "You're on the list! Check your inbox for a confirmation email.",
    });
  } catch (err) {
    console.error("Newsletter signup error:", err);
    res.status(500).json({ error: "Failed to subscribe" });
  }
}
