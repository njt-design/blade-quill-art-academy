import { tinaField } from "tinacms/react";
import { Btn } from "@/components/site/Btn";
import { RichText } from "@/components/site/RichText";

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
  return (
    <div
      className="relative overflow-hidden p-6 sm:px-9 sm:py-10"
      style={{
        background: "var(--g-ink)",
        color: "var(--paper)",
        borderRadius: 24,
        boxShadow: "var(--sh-lg)",
      }}
    >
      <div className="relative">
        <div
          className="eyebrow mb-4"
          style={{ color: "var(--gold)" }}
          data-tina-field={tinaField(content, "eyebrow")}
        >
          {content.eyebrow || "STUDIO NEWSLETTER"}
        </div>
        <h3
          className="mb-3.5"
          style={{ fontSize: 32, lineHeight: 1.1, color: "var(--paper)" }}
          data-tina-field={tinaField(content, "heading")}
        >
          {content.heading || "Stay in the loop."}
        </h3>
        <div
          className="mb-7"
          style={{ fontSize: 14, color: "var(--paper-3)", lineHeight: 1.6 }}
          data-tina-field={tinaField(content, "subheading")}
        >
          <RichText value={content.subheading} />
        </div>
        <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-3">
          <input
            type="email"
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
              {content.ctaLabel || "Subscribe"}
            </span>
          </Btn>
        </form>
        {content.privacyNote ? (
          <div
            className="mt-5"
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
