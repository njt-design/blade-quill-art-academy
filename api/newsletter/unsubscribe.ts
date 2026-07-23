/**
 * GET /api/newsletter/unsubscribe?email=...&token=...
 *
 * Marks the Resend contact as unsubscribed and returns a simple confirmation page.
 * Token is an HMAC of the email (see api/_lib/newsletter.ts).
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";
import {
  normalizeEmail,
  unsubscribeSecret,
  verifyUnsubscribeToken,
} from "../_lib/newsletter";

function htmlPage(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <style>
    body { font-family: Georgia, serif; color: #2e2222; background: #f6efe8; margin: 0; padding: 48px 20px; }
    main { max-width: 440px; margin: 0 auto; background: #fffdf9; padding: 32px 28px; border-radius: 16px; box-shadow: 0 8px 30px rgba(46,34,34,0.08); }
    h1 { font-size: 26px; margin: 0 0 12px; line-height: 1.2; }
    p { font-size: 16px; line-height: 1.6; margin: 0 0 12px; color: #4a3c3c; }
    a { color: #8b3a2a; }
  </style>
</head>
<body>
  <main>
    <h1>${title}</h1>
    ${body}
  </main>
</body>
</html>`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET" && req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    res.status(405).send("Method not allowed");
    return;
  }

  const email = normalizeEmail(
    typeof req.query.email === "string" ? req.query.email : null
  );
  const token = typeof req.query.token === "string" ? req.query.token : "";
  const secret = unsubscribeSecret();
  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;

  if (!email || !secret || !verifyUnsubscribeToken(email, token, secret)) {
    res.status(400).setHeader("Content-Type", "text/html; charset=utf-8").send(
      htmlPage(
        "Invalid unsubscribe link",
        "<p>This unsubscribe link is invalid or has expired. If you still receive studio emails, reply to one of them and ask to be removed.</p>"
      )
    );
    return;
  }

  if (!apiKey || !audienceId) {
    console.error("Unsubscribe misconfigured: missing RESEND_API_KEY / RESEND_AUDIENCE_ID");
    res.status(500).setHeader("Content-Type", "text/html; charset=utf-8").send(
      htmlPage(
        "Something went wrong",
        "<p>We couldn't process your unsubscribe request right now. Please try again in a few minutes.</p>"
      )
    );
    return;
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.contacts.update({
      email,
      audienceId,
      unsubscribed: true,
    });
    if (error) {
      console.error("Resend unsubscribe failed:", error);
      res.status(500).setHeader("Content-Type", "text/html; charset=utf-8").send(
        htmlPage(
          "Something went wrong",
          "<p>We couldn't process your unsubscribe request right now. Please try again in a few minutes.</p>"
        )
      );
      return;
    }

    res.status(200).setHeader("Content-Type", "text/html; charset=utf-8").send(
      htmlPage(
        "You've been unsubscribed",
        `<p><strong>${email}</strong> has been removed from the Blade &amp; Quill studio newsletter.</p>
         <p>You won't receive future studio emails. If that was a mistake, you can subscribe again anytime on the website.</p>
         <p><a href="/">Back to Blade &amp; Quill</a></p>`
      )
    );
  } catch (err) {
    console.error("Unsubscribe error:", err);
    res.status(500).setHeader("Content-Type", "text/html; charset=utf-8").send(
      htmlPage(
        "Something went wrong",
        "<p>We couldn't process your unsubscribe request right now. Please try again in a few minutes.</p>"
      )
    );
  }
}
