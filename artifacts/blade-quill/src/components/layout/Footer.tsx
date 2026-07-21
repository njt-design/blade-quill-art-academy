import { useState } from "react";
import { Link } from "wouter";
import { SiInstagram, SiKofi, SiYoutube } from "react-icons/si";
import { FaAmazon } from "react-icons/fa";
import { QuillMark } from "@/components/site/QuillMark";
import { useLiveNavigation } from "@/hooks/use-live-navigation";
import { useNewsletterSignup } from "@/hooks/use-newsletter";

const AMAZON_BOOK_URL = "https://www.amazon.com/dp/1733168451";
const YOUTUBE_URL = "https://www.youtube.com/c/BladeQuillartacademy";
const INSTAGRAM_URL = "https://www.instagram.com/bladequillartacademy/";
const KOFI_URL = "https://ko-fi.com/bladeandquill";

export function Footer() {
  const [email, setEmail] = useState("");
  const { status, message, subscribe } = useNewsletterSignup();
  // Link columns come from the CMS Navigation document, so the client can
  // reorganize them (alongside the header menu) in Tina.
  const { footerColumns } = useLiveNavigation();

  return (
    <footer
      className="relative overflow-hidden mt-20 pt-20 pb-9"
      style={{ background: "var(--ink)", color: "var(--paper-2)" }}
    >
      <div
        className="absolute inset-x-0 top-0 h-1"
        style={{ background: "var(--g-warm)" }}
      />

      <div className="bq-container-wide">
        <div className="grid gap-10 md:gap-12 lg:grid-cols-[2fr_3fr_1.6fr] mb-14">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span
                className="grid place-items-center rounded-[10px]"
                style={{
                  width: 42,
                  height: 42,
                  background: "var(--g-cta)",
                }}
              >
                <QuillMark size={22} color="var(--paper)" />
              </span>
              <span
                className="text-[24px]"
                style={{
                  fontFamily: "var(--f-serif)",
                  color: "var(--paper)",
                }}
              >
                Blade &amp; Quill
              </span>
            </div>
            <p
              className="text-sm leading-relaxed max-w-[320px]"
              style={{ color: "var(--ink-faint)" }}
            >
              Author, illustrator, and Krita educator. Books, classes, and free
              lessons from the studio.
            </p>
          </div>

        <div className="grid gap-10 md:gap-12 [grid-template-columns:repeat(auto-fit,minmax(140px,1fr))]">
          {footerColumns.map((col) => (
            <div key={col.heading}>
              <div className="eyebrow mb-5" style={{ color: "var(--paper-3)" }}>
                {col.heading}
              </div>
              <ul className="flex flex-col gap-3">
                {col.links.map((item) =>
                  item.external ? (
                    <li key={item.label}>
                      <a
                        href={item.href ?? "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-ink text-sm self-start"
                        style={{ color: "var(--paper-2)" }}
                      >
                        {item.label}
                      </a>
                    </li>
                  ) : (
                    <li key={item.label}>
                      <Link
                        href={item.href ?? "/"}
                        className="link-ink text-sm self-start"
                        style={{ color: "var(--paper-2)" }}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </div>
          ))}
        </div>

          <div>
            <div className="eyebrow mb-5" style={{ color: "var(--paper-3)" }}>
              The Newsletter
            </div>
            <p
              className="text-[13px] mb-4 leading-relaxed"
              style={{ color: "var(--ink-faint)" }}
            >
              New work, free guides, class openings. Once a month.
            </p>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (status === "submitting") return;
                const ok = await subscribe(email);
                if (ok) setEmail("");
              }}
              className="flex gap-2"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@studio"
                className="flex-1 min-w-0 min-h-11 rounded-full px-4 py-2.5 text-[13px] outline-none focus:border-[rgba(223,210,204,0.45)] transition-colors"
                style={{
                  background: "transparent",
                  border: "1px solid rgba(223,210,204,0.2)",
                  color: "var(--paper)",
                  fontFamily: "var(--f-sans)",
                }}
              />
              <button
                type="submit"
                className="btn-cta min-h-11 px-5 py-2.5 rounded-full text-[13px] font-semibold whitespace-nowrap"
                style={{
                  background: "var(--g-cta)",
                  color: "var(--paper)",
                }}
              >
                {status === "submitting" ? "..." : "Join"}
              </button>
            </form>
            {status === "success" || status === "error" ? (
              <div
                role="status"
                className="mt-3 text-[12px] leading-relaxed"
                style={{
                  color: status === "success" ? "var(--gold)" : "#f2b8b5",
                }}
              >
                {message}
              </div>
            ) : null}
            <div className="flex items-center gap-1 mt-4 -ml-3">
              <a
                href={YOUTUBE_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-11 h-11 grid place-items-center rounded-full hover:text-paper transition-colors"
                style={{ color: "var(--paper-3)" }}
              >
                <SiYoutube className="w-5 h-5" />
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-11 h-11 grid place-items-center rounded-full hover:text-paper transition-colors"
                style={{ color: "var(--paper-3)" }}
              >
                <SiInstagram className="w-5 h-5" />
              </a>
              <a
                href={AMAZON_BOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Lheeloo & Luna on Amazon"
                className="w-11 h-11 grid place-items-center rounded-full hover:text-paper transition-colors"
                style={{ color: "var(--paper-3)" }}
              >
                <FaAmazon className="w-5 h-5" />
              </a>
              <a
                href={KOFI_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Ko-fi"
                className="w-11 h-11 grid place-items-center rounded-full hover:text-paper transition-colors"
                style={{ color: "var(--paper-3)" }}
              >
                <SiKofi className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div
          className="pt-7 flex flex-wrap items-center justify-between gap-3"
          style={{ borderTop: "1px solid rgba(223,210,204,0.08)" }}
        >
          <div className="eyebrow" style={{ color: "var(--ink-faint)" }}>
            © {new Date().getFullYear()} Blade &amp; Quill Art Academy ·
            bladeandquillacademy.com
          </div>
          <div className="flex items-center gap-5 text-xs">
            <Link
              href="/about"
              className="link-ink"
              style={{ color: "var(--ink-faint)" }}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="link-ink"
              style={{ color: "var(--ink-faint)" }}
            >
              Contact
            </Link>
            <a
              href={`${import.meta.env.BASE_URL}admin/index.html`}
              className="link-ink"
              style={{ color: "rgba(223,210,204,0.25)" }}
              aria-label="Admin"
            >
              Admin
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
