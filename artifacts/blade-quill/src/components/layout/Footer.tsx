import { useState } from "react";
import { Link } from "wouter";
import { SiInstagram, SiKofi, SiYoutube } from "react-icons/si";
import { FaAmazon } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { QuillMark } from "@/components/site/QuillMark";

const AMAZON_BOOK_URL = "https://www.amazon.com/dp/1733168451";
const YOUTUBE_URL = "https://www.youtube.com/c/BladeQuillartacademy";
const INSTAGRAM_URL = "https://www.instagram.com/bladequillartacademy/";
const KOFI_URL = "https://ko-fi.com/bladeandquill";

interface FooterColumn {
  heading: string;
  items: Array<{ label: string; href: string; external?: boolean }>;
}

const COLUMNS: FooterColumn[] = [
  {
    heading: "Shop",
    items: [
      { label: "Books", href: "/shop" },
      { label: "Ebooks", href: "/shop" },
      { label: "Downloads", href: "/downloads" },
      { label: "Gallery", href: "/gallery" },
    ],
  },
  {
    heading: "Studio",
    items: [
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
      { label: "Cart", href: "/cart" },
    ],
  },
  {
    heading: "Follow",
    items: [
      { label: "YouTube", href: YOUTUBE_URL, external: true },
      { label: "Instagram", href: INSTAGRAM_URL, external: true },
      { label: "Amazon", href: AMAZON_BOOK_URL, external: true },
      { label: "Ko-fi", href: KOFI_URL, external: true },
    ],
  },
];

export function Footer() {
  const [adminOpen, setAdminOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "B&Q2024") {
      setAdminOpen(false);
      setPassword("");
      setError("");
      window.location.href = `${import.meta.env.BASE_URL}admin/index.html`;
    } else {
      setError("Incorrect password. Please try again.");
    }
  };

  const handleOpenChange = (open: boolean) => {
    setAdminOpen(open);
    if (!open) {
      setPassword("");
      setError("");
    }
  };

  return (
    <>
      <footer
        className="relative overflow-hidden mt-20 pt-20 pb-9"
        style={{ background: "var(--ink)", color: "var(--paper-2)" }}
      >
        <div
          className="absolute inset-x-0 top-0 h-1"
          style={{ background: "var(--g-warm)" }}
        />

        <div className="bq-container-wide">
          <div className="grid gap-10 md:gap-12 lg:grid-cols-[2fr_1fr_1fr_1fr_1.6fr] mb-14">
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
                Author, illustrator, and Krita educator. Books, classes,
                and free lessons from the studio.
              </p>
            </div>

            {COLUMNS.map((col) => (
              <div key={col.heading}>
                <div
                  className="eyebrow mb-5"
                  style={{ color: "var(--paper-3)" }}
                >
                  {col.heading}
                </div>
                <ul className="flex flex-col gap-3">
                  {col.items.map((item) =>
                    item.external ? (
                      <li key={item.label}>
                        <a
                          href={item.href}
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
                          href={item.href}
                          className="link-ink text-sm self-start"
                          style={{ color: "var(--paper-2)" }}
                        >
                          {item.label}
                        </Link>
                      </li>
                    )
                  )}
                </ul>
              </div>
            ))}

            <div>
              <div
                className="eyebrow mb-5"
                style={{ color: "var(--paper-3)" }}
              >
                The Newsletter
              </div>
              <p
                className="text-[13px] mb-4 leading-relaxed"
                style={{ color: "var(--ink-faint)" }}
              >
                New work, free guides, class openings. Once a month.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setEmail("");
                }}
                className="flex gap-2"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@studio"
                  className="flex-1 rounded-full px-4 py-2.5 text-[13px] outline-none focus:border-[rgba(251,246,236,0.45)] transition-colors"
                  style={{
                    background: "transparent",
                    border: "1px solid rgba(251,246,236,0.2)",
                    color: "var(--paper)",
                    fontFamily: "var(--f-sans)",
                  }}
                />
                <button
                  type="submit"
                  className="btn-cta px-5 py-2.5 rounded-full text-[13px] font-semibold whitespace-nowrap"
                  style={{
                    background: "var(--g-cta)",
                    color: "var(--paper)",
                    boxShadow:
                      "0 6px 18px rgba(229,89,52,0.32), 0 2px 4px rgba(229,89,52,0.18)",
                  }}
                >
                  Join
                </button>
              </form>
              <div className="flex items-center gap-4 mt-6">
                <a
                  href={YOUTUBE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="hover:text-paper transition-colors"
                  style={{ color: "var(--paper-3)" }}
                >
                  <SiYoutube className="w-5 h-5" />
                </a>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="hover:text-paper transition-colors"
                  style={{ color: "var(--paper-3)" }}
                >
                  <SiInstagram className="w-5 h-5" />
                </a>
                <a
                  href={AMAZON_BOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Lheeloo & Luna on Amazon"
                  className="hover:text-paper transition-colors"
                  style={{ color: "var(--paper-3)" }}
                >
                  <FaAmazon className="w-5 h-5" />
                </a>
                <a
                  href={KOFI_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Ko-fi"
                  className="hover:text-paper transition-colors"
                  style={{ color: "var(--paper-3)" }}
                >
                  <SiKofi className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          <div
            className="pt-7 flex flex-wrap items-center justify-between gap-3"
            style={{ borderTop: "1px solid rgba(251,246,236,0.08)" }}
          >
            <div
              className="eyebrow"
              style={{ color: "var(--ink-faint)" }}
            >
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
              <button
                type="button"
                onClick={() => setAdminOpen(true)}
                className="link-ink"
                style={{ color: "rgba(251,246,236,0.25)" }}
                aria-label="Admin login"
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      </footer>

      <Dialog open={adminOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl">
              Admin Access
            </DialogTitle>
            <DialogDescription>
              Enter the admin password to access the content editor.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAdminSubmit} className="space-y-4 mt-2">
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              autoFocus
              className={error ? "border-destructive" : ""}
            />
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <div className="flex gap-3">
              <Button type="submit" className="flex-1">
                Enter
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
