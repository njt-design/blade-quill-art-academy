import { useEffect, useMemo, useState, type FormEvent } from "react";
import { marked } from "marked";
import { ArrowUpRight, Loader2, LogOut, Printer } from "lucide-react";
import { QuillMark } from "@/components/site/QuillMark";
// Single source of truth: the repo doc, inlined at build time by Vite.
import guideMarkdown from "../../../../docs/EDITING-GUIDE.md?raw";

type GateState = "checking" | "locked" | "unlocked";

const PAGE_BACKGROUND =
  "radial-gradient(1200px 600px at 20% -10%, rgba(176,74,58,0.12), transparent), radial-gradient(900px 500px at 90% 10%, rgba(196,154,74,0.14), transparent), var(--paper)";

/** Brand styling for the rendered markdown (headings, tables, links, print). */
const GUIDE_PROSE_CSS = `
.bq-guide-prose h1,
.bq-guide-prose h2,
.bq-guide-prose h3 {
  font-family: var(--f-serif);
  font-weight: 400;
  color: var(--ink);
}
.bq-guide-prose h2 {
  margin-top: 2.5em;
  padding-bottom: 0.35em;
  border-bottom: 1px solid rgba(46, 34, 34, 0.12);
}
.bq-guide-prose a {
  color: var(--maroon);
  font-weight: 600;
  text-decoration-color: rgba(154, 81, 81, 0.4);
}
.bq-guide-prose strong {
  color: var(--ink);
}
.bq-guide-prose table {
  font-size: 0.925em;
}
.bq-guide-prose thead th {
  font-family: var(--f-sans);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.8em;
  color: var(--ink-mute);
}
.bq-guide-prose tbody tr {
  border-bottom-color: rgba(46, 34, 34, 0.08);
}
.bq-guide-prose code {
  background: rgba(46, 34, 34, 0.06);
  padding: 0.15em 0.4em;
  border-radius: 6px;
  font-size: 0.9em;
}
.bq-guide-prose code::before,
.bq-guide-prose code::after {
  content: none;
}
@media print {
  .bq-guide-no-print {
    display: none !important;
  }
  .bq-guide-page {
    background: #fff !important;
  }
}
`;

export default function Guide() {
  const [gate, setGate] = useState<GateState>("checking");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const guideHtml = useMemo(
    () => marked.parse(guideMarkdown, { async: false, gfm: true }),
    []
  );

  useEffect(() => {
    let cancelled = false;
    fetch("/api/guide", { credentials: "include" })
      .then((res) => {
        if (!cancelled) setGate(res.ok ? "unlocked" : "locked");
      })
      .catch(() => {
        if (!cancelled) setGate("locked");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/guide", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setPassword("");
        setGate("unlocked");
      } else {
        const body = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        setError(body?.error || "That password isn't right — try again.");
      }
    } catch {
      setError("Couldn't reach the site — check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch("/api/guide", { method: "DELETE", credentials: "include" });
    } catch {
      // Cookie clearing is best-effort; still show the gate.
    }
    setGate("locked");
  };

  if (gate === "checking") {
    return (
      <div
        className="min-h-screen flex items-center justify-center gap-3"
        style={{
          background: "var(--paper)",
          color: "var(--ink-mute)",
          fontFamily: "var(--f-sans)",
        }}
      >
        <Loader2 className="w-5 h-5 animate-spin" />
        Opening the guide…
      </div>
    );
  }

  if (gate === "locked") {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-6"
        style={{ background: PAGE_BACKGROUND }}
      >
        <div className="max-w-md w-full text-center">
          <div
            className="mx-auto mb-6 grid place-items-center rounded-[14px]"
            style={{ width: 56, height: 56, background: "var(--g-cta)" }}
          >
            <QuillMark size={28} color="var(--paper)" />
          </div>
          <h1
            className="text-3xl mb-3"
            style={{ fontFamily: "var(--f-serif)", color: "var(--ink)" }}
          >
            Editing Guide
          </h1>
          <p
            className="text-sm leading-relaxed mb-8"
            style={{ color: "var(--ink-mute)", fontFamily: "var(--f-sans)" }}
          >
            Step-by-step instructions for updating the Blade &amp; Quill site.
            Enter the guide password to continue.
          </p>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoFocus
              autoComplete="current-password"
              aria-label="Guide password"
              className="w-full rounded-full px-5 py-3 text-sm outline-none"
              style={{
                background: "rgba(255,255,255,0.75)",
                border: "1px solid rgba(46,34,34,0.16)",
                color: "var(--ink)",
                fontFamily: "var(--f-sans)",
              }}
            />
            {error ? (
              <p
                className="text-sm rounded-xl px-4 py-2.5"
                role="alert"
                style={{
                  background: "rgba(176,74,58,0.08)",
                  color: "var(--maroon)",
                  border: "1px solid rgba(176,74,58,0.2)",
                  fontFamily: "var(--f-sans)",
                }}
              >
                {error}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={submitting || !password.trim()}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold disabled:opacity-60"
              style={{
                background: "var(--g-cta)",
                color: "var(--paper)",
                fontFamily: "var(--f-sans)",
              }}
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Open the guide"
              )}
            </button>
          </form>
          <p
            className="text-xs mt-5"
            style={{ color: "var(--ink-faint)", fontFamily: "var(--f-sans)" }}
          >
            Forgot the password? Message Nick.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bq-guide-page"
      style={{
        background: PAGE_BACKGROUND,
        color: "var(--ink)",
        fontFamily: "var(--f-sans)",
      }}
    >
      <style>{GUIDE_PROSE_CSS}</style>
      <header
        className="border-b bq-guide-no-print"
        style={{ borderColor: "rgba(46,34,34,0.08)" }}
      >
        <div className="max-w-3xl mx-auto px-5 md:px-8 py-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span
              className="grid place-items-center rounded-[12px]"
              style={{ width: 42, height: 42, background: "var(--g-cta)" }}
            >
              <QuillMark size={22} color="var(--paper)" />
            </span>
            <div>
              <div
                className="text-xl leading-tight"
                style={{ fontFamily: "var(--f-serif)" }}
              >
                Editing Guide
              </div>
              <div className="text-xs" style={{ color: "var(--ink-mute)" }}>
                How to update Blade &amp; Quill
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <a
              href={`${import.meta.env.BASE_URL}admin/index.html`}
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold"
              style={{ background: "var(--g-cta)", color: "var(--paper)" }}
            >
              Open the editor
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm border"
              style={{
                borderColor: "rgba(46,34,34,0.14)",
                color: "var(--ink)",
              }}
            >
              <Printer className="w-3.5 h-3.5" />
              Print
            </button>
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm border"
              style={{
                borderColor: "rgba(46,34,34,0.14)",
                color: "var(--ink-mute)",
              }}
              aria-label="Sign out of the guide"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-5 md:px-8 py-10 md:py-14">
        <article
          className="bq-guide-prose prose prose-neutral max-w-none"
          // Trusted content: rendered from our own repo markdown at build time.
          dangerouslySetInnerHTML={{ __html: guideHtml }}
        />
      </main>
    </div>
  );
}
