import { useState } from "react";
import { tinaField } from "tinacms/react";
import { Btn } from "@/components/site/Btn";
import { RichText } from "@/components/site/RichText";
import { useNewsletterSignup } from "@/hooks/use-newsletter";
import { SectionHeading, bodyTextStyle, sectionAlignStyle } from "./text-style";

export type NewsletterContent = Record<string, unknown> & {
  eyebrow?: string;
  heading?: string;
  subheading?: unknown;
  placeholderText?: string;
  ctaLabel?: string;
  privacyNote?: string;
};

/** The dark rounded newsletter signup panel (shared by BlogFeed + NewsletterSignup blocks). */
export function NewsletterPanel({ content }: { content: NewsletterContent }) {
  const [email, setEmail] = useState("");
  const { status, message, subscribe } = useNewsletterSignup();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "submitting") return;
    const ok = await subscribe(email);
    if (ok) setEmail("");
  }

  return (
    <div
      className="relative flex h-full min-h-0 flex-col overflow-hidden p-6 sm:px-9 sm:py-10"
      style={{
        background: "var(--g-ink)",
        color: "var(--paper)",
        borderRadius: 24,
        boxShadow: "var(--sh-lg)",
      }}
    >
      <div
        className="relative flex h-full min-h-0 flex-1 flex-col"
        style={sectionAlignStyle(content)}
      >
        <div
          className="eyebrow mb-4"
          style={{ color: "var(--gold)" }}
          data-tina-field={tinaField(content, "eyebrow")}
        >
          {content.eyebrow || "STUDIO NEWSLETTER"}
        </div>
        <SectionHeading
          block={content}
          defaultTag="h3"
          baseSize="32px"
          className="mb-3.5"
          style={{ lineHeight: 1.1, color: "var(--paper)" }}
        >
          {content.heading || "Stay in the loop."}
        </SectionHeading>
        <div
          className="mb-7"
          style={{ fontSize: 14, color: "var(--paper-3)", lineHeight: 1.6, ...bodyTextStyle(content) }}
          data-tina-field={tinaField(content, "subheading")}
        >
          <RichText value={content.subheading} />
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={content.placeholderText || "your@email.com"}
            data-tina-field={tinaField(content, "placeholderText")}
            className="rounded-full outline-none transition-colors"
            style={{
              background: "rgba(223,210,204,0.08)",
              border: "1px solid rgba(223,210,204,0.18)",
              padding: "14px 20px",
              color: "var(--paper)",
              fontFamily: "var(--f-sans)",
              fontSize: 14,
            }}
          />
          <Btn kind="primary" size="lg" iconRight="→" type="submit">
            <span data-tina-field={tinaField(content, "ctaLabel")}>
              {status === "submitting"
                ? "Subscribing..."
                : content.ctaLabel || "Subscribe"}
            </span>
          </Btn>
        </form>
        {status === "success" || status === "error" ? (
          <div
            role="status"
            className="mt-4"
            style={{
              fontSize: 13,
              lineHeight: 1.5,
              color: status === "success" ? "var(--gold)" : "#f2b8b5",
            }}
          >
            {message}
          </div>
        ) : null}
        {content.privacyNote ? (
          <div
            className="mt-auto pt-8"
            style={{
              fontFamily: "var(--f-mono)",
              fontSize: 10,
              letterSpacing: "0.1em",
              color: "var(--ink-faint)",
            }}
            data-tina-field={tinaField(content, "privacyNote")}
          >
            {content.privacyNote}
          </div>
        ) : null}
      </div>
    </div>
  );
}
