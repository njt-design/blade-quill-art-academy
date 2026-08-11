/**
 * POST /api/inbound — Resend `email.received` webhook.
 *
 * Gives the site a branded inbox without hosting a mailbox: Resend receives
 * mail for any address @bladeandquillartacademy.com (inbound MX record),
 * fires this webhook, and we forward the full original message to Corinne's
 * private inbox. Combined with Gmail "Send mail as" over Resend SMTP she can
 * read and answer mail as the branded address, so her personal email is
 * never shown to guests. Setup checklist: docs/email-reply-privacy.md.
 *
 * Required env vars (Vercel project settings):
 *   RESEND_API_KEY           — Resend API key
 *   RESEND_WEBHOOK_SECRET    — signing secret of this webhook (whsec_…)
 *   INBOUND_FORWARD_TO_EMAIL — private inbox that receives forwarded mail
 *   CONTACT_FROM_EMAIL       — verified sender used as the forward's From
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";
import { readRawBody } from "./_lib/http";

// Signature verification needs the exact raw bytes Resend signed.
export const config = {
  api: {
    bodyParser: false,
  },
};

function header(req: VercelRequest, ...names: string[]): string {
  for (const name of names) {
    const value = req.headers[name];
    if (typeof value === "string" && value) return value;
    if (Array.isArray(value) && value[0]) return value[0];
  }
  return "";
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;
  const forwardTo = process.env.INBOUND_FORWARD_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !webhookSecret || !forwardTo || !from) {
    console.error(
      "Inbound webhook misconfigured: missing RESEND_API_KEY / RESEND_WEBHOOK_SECRET / INBOUND_FORWARD_TO_EMAIL / CONTACT_FROM_EMAIL",
    );
    res.status(500).json({ error: "Inbound email not configured" });
    return;
  }

  const resend = new Resend(apiKey);
  const payload = (await readRawBody(req)).toString("utf8");

  let event: ReturnType<typeof resend.webhooks.verify>;
  try {
    event = resend.webhooks.verify({
      payload,
      headers: {
        id: header(req, "svix-id", "webhook-id"),
        timestamp: header(req, "svix-timestamp", "webhook-timestamp"),
        signature: header(req, "svix-signature", "webhook-signature"),
      },
      webhookSecret,
    });
  } catch {
    res.status(401).json({ error: "Invalid webhook signature" });
    return;
  }

  if (event.type !== "email.received") {
    res.status(200).json({ ignored: true });
    return;
  }

  // Basic loop guard: if the private inbox itself emails the branded address,
  // don't forward the message straight back to it.
  if (event.data.from.toLowerCase() === forwardTo.toLowerCase()) {
    res.status(200).json({ skipped: true });
    return;
  }

  try {
    const { error } = await resend.emails.receiving.forward({
      emailId: event.data.email_id,
      to: forwardTo,
      from,
    });
    if (error) {
      console.error("Inbound forward failed:", error);
      res.status(500).json({ error: "Failed to forward inbound email" });
      return;
    }
    res.status(200).json({ forwarded: true });
  } catch (err) {
    console.error("Inbound webhook error:", err);
    res.status(500).json({ error: "Failed to forward inbound email" });
  }
}
