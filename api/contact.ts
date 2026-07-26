/**
 * Vercel serverless function backing POST /api/contact on the static site.
 *
 * The SPA's contact form (useSubmitContact) posts { name, email, message }
 * and expects { success, message } — same contract as the Express api-server
 * route used in local dev (lib/api-spec/openapi.yaml). This function delivers
 * the message to Corinne's inbox via Resend, with the guest's address as
 * Reply-To so she can respond directly from her email client.
 *
 * Required env vars (Vercel project settings):
 *   RESEND_API_KEY     — Resend API key
 *   CONTACT_TO_EMAIL   — destination inbox
 *   CONTACT_FROM_EMAIL — verified sender, e.g. "Blade & Quill <contact@example.com>"
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ContactBody {
  name: string;
  email: string;
  message: string;
  company?: string;
  intent?: "general" | "dummy-book";
}

function parseBody(body: unknown): ContactBody | null {
  if (typeof body !== "object" || body === null) return null;
  const { name, email, message, company, intent } = body as Record<string, unknown>;
  if (typeof name !== "string" || typeof email !== "string" || typeof message !== "string") {
    return null;
  }
  const trimmedName = name.trim();
  const trimmedEmail = email.trim();
  const trimmedMessage = message.trim();
  if (trimmedName.length < 2 || trimmedName.length > 200) return null;
  if (!EMAIL_RE.test(trimmedEmail) || trimmedEmail.length > 320) return null;
  if (trimmedMessage.length < 10 || trimmedMessage.length > 5000) return null;
  const parsed: ContactBody = { name: trimmedName, email: trimmedEmail, message: trimmedMessage };
  if (typeof company === "string" && company.trim()) {
    const trimmedCompany = company.trim();
    if (trimmedCompany.length > 200) return null;
    parsed.company = trimmedCompany;
  }
  if (intent === "dummy-book" || intent === "general") {
    parsed.intent = intent;
  }
  return parsed;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const parsed = parseBody(req.body);
  if (!parsed) {
    res.status(400).json({ error: "Invalid form data" });
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !to || !from) {
    console.error("Contact form misconfigured: missing RESEND_API_KEY / CONTACT_TO_EMAIL / CONTACT_FROM_EMAIL");
    res.status(500).json({ error: "Failed to submit contact form" });
    return;
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: parsed.email,
      subject:
        parsed.intent === "dummy-book"
          ? `Publisher dummy book request from ${parsed.name}`
          : `New contact form message from ${parsed.name}`,
      text: [
        `Name: ${parsed.name}`,
        `Email: ${parsed.email}`,
        ...(parsed.company ? [`Company: ${parsed.company}`] : []),
        ...(parsed.intent === "dummy-book"
          ? ["Request: 30-page picture-book dummy (Lheeloo & Luna)"]
          : []),
        "",
        parsed.message,
      ].join("\n"),
    });
    if (error) {
      console.error("Resend send failed:", error);
      res.status(500).json({ error: "Failed to submit contact form" });
      return;
    }
    res.status(200).json({
      success: true,
      message: "Thanks for reaching out! Corinne will get back to you soon.",
    });
  } catch (err) {
    console.error("Contact form error:", err);
    res.status(500).json({ error: "Failed to submit contact form" });
  }
}
