import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, Clock, Loader2, PlayCircle, RefreshCw } from "lucide-react";
import { QuillMark } from "@/components/site/QuillMark";
import { Btn } from "@/components/site/Btn";
import { useSeo } from "@/lib/seo";
import {
  adminLoginUrl,
  establishInsightsSession,
  getLocalDevTinaToken,
  getTinaClientId,
  getTinaIdToken,
  subscribeTinaAuthHandoff,
} from "@/lib/tina-auth";

/*
 * /guide — owner "How To" page: Loom walkthroughs for editing the site in
 * Tina. Only renders for a signed-in Tina user: the content (including the
 * recording links) comes from GET /api/guide, which verifies the Tina
 * session server-side. Nothing here is meant for the public — see the
 * X-Robots-Tag header in vercel.json and public/robots.txt.
 */

interface GuideVideo {
  title: string;
  description?: string;
  loomUrl: string;
}

interface GuideSpecRow {
  element: string;
  value: string;
  note?: string;
}

interface GuideSpecGroup {
  title: string;
  rows: GuideSpecRow[];
}

interface GuideSection {
  id: string;
  title: string;
  summary: string;
  videos: GuideVideo[];
  specs?: GuideSpecGroup[];
  tips?: string[];
}

interface GuideContent {
  title: string;
  intro: string;
  sections: GuideSection[];
}

type Status = "checking" | "locked" | "ready" | "error";

const PAGE_BACKGROUND =
  "radial-gradient(1200px 600px at 20% -10%, rgba(176,74,58,0.12), transparent), radial-gradient(900px 500px at 90% 10%, rgba(196,154,74,0.14), transparent), var(--paper)";

const CARD_STYLE = {
  background: "rgba(255,255,255,0.55)",
  border: "1px solid rgba(46,34,34,0.08)",
} as const;

class GuideAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GuideAuthError";
  }
}

/** Best token for the API: real Tina Cloud id_token, else the dev-only sentinel. */
function currentToken(): string | null {
  return getTinaIdToken() ?? getLocalDevTinaToken();
}

async function fetchGuide(): Promise<GuideContent> {
  const token = currentToken();
  const clientId = getTinaClientId();
  const params = new URLSearchParams(clientId ? { clientID: clientId } : {});
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const query = params.toString();
  const res = await fetch(`/api/guide${query ? `?${query}` : ""}`, {
    credentials: "include",
    headers,
  });
  if (res.status === 401) {
    throw new GuideAuthError(
      token
        ? "Your Tina session has expired. Sign in again at /admin, then reopen this page."
        : "Sign in with Tina to open the guide."
    );
  }
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error || "Couldn't load the guide.");
  }
  return res.json() as Promise<GuideContent>;
}

/**
 * Turn a Loom share link (https://www.loom.com/share/<id>?sid=…) into the
 * embed URL. Returns null for anything that isn't a Loom link.
 */
function toLoomEmbedUrl(raw: string): string | null {
  try {
    const url = new URL(raw.trim());
    if (!/(^|\.)loom\.com$/i.test(url.hostname)) return null;
    const match = url.pathname.match(/^\/(?:share|embed)\/([A-Za-z0-9]+)/);
    if (!match) return null;
    const params = new URLSearchParams();
    const sid = url.searchParams.get("sid");
    if (sid) params.set("sid", sid);
    params.set("hideEmbedTopBar", "true");
    params.set("hide_share", "true");
    return `https://www.loom.com/embed/${match[1]}?${params.toString()}`;
  } catch {
    return null;
  }
}

/** Highlight the section closest to the top of the viewport. */
function useActiveSection(ids: string[]): string | null {
  const [active, setActive] = useState<string | null>(ids[0] ?? null);

  useEffect(() => {
    if (ids.length === 0) return;
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (elements.length === 0) return;

    const visible = new Set<string>();
    const pick = () => {
      const first = ids.find((id) => visible.has(id));
      if (first) setActive(first);
    };
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        pick();
      },
      // Trigger when a section's top crosses the upper third of the screen.
      { rootMargin: "-96px 0px -60% 0px", threshold: 0 }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  window.history.replaceState(null, "", `#${id}`);
}

// ---------------------------------------------------------------------------
// Pieces
// ---------------------------------------------------------------------------

function PageHeader({ subtitle }: { subtitle: string }) {
  return (
    <header className="border-b" style={{ borderColor: "rgba(46,34,34,0.08)" }}>
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            className="grid place-items-center rounded-[12px]"
            style={{ width: 42, height: 42, background: "var(--g-cta)" }}
          >
            <QuillMark size={22} color="var(--paper)" />
          </span>
          <div>
            <div className="text-xl leading-tight" style={{ fontFamily: "var(--f-serif)" }}>
              How To
            </div>
            <div className="text-xs" style={{ color: "var(--ink-mute)" }}>
              {subtitle}
            </div>
          </div>
        </div>
        <Btn
          size="sm"
          href={`${import.meta.env.BASE_URL}admin/index.html`}
          target="_top"
          iconRight={<ArrowUpRight className="w-3.5 h-3.5" />}
        >
          Open the editor
        </Btn>
      </div>
    </header>
  );
}

function LockedGate({ message }: { message: string }) {
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
        <h1 className="text-3xl mb-3" style={{ fontFamily: "var(--f-serif)", color: "var(--ink)" }}>
          How To
        </h1>
        <p
          className="text-sm leading-relaxed mb-8"
          style={{ color: "var(--ink-mute)", fontFamily: "var(--f-sans)" }}
        >
          {message} This page is for the site owner and only opens for a
          signed-in Tina account.
        </p>
        <Btn
          href={adminLoginUrl("/guide")}
          target="_top"
          iconRight={<ArrowUpRight className="w-4 h-4" />}
        >
          Sign in with Tina
        </Btn>
        <p
          className="text-xs mt-5"
          style={{ color: "var(--ink-faint)", fontFamily: "var(--f-sans)" }}
        >
          After signing in at /admin, open <strong>How To</strong> from the Tina
          sidebar — or come back to this page.
        </p>
      </div>
    </div>
  );
}

function ContentsList({
  sections,
  activeId,
  variant,
}: {
  sections: GuideSection[];
  activeId: string | null;
  variant: "sidebar" | "chips";
}) {
  if (variant === "chips") {
    return (
      <nav
        aria-label="Contents"
        className="lg:hidden sticky top-0 z-10 -mx-5 px-5 py-3 mb-8 border-b"
        style={{ background: "var(--paper)", borderColor: "rgba(46,34,34,0.08)" }}
      >
        <ol className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {sections.map((s) => {
            const isActive = s.id === activeId;
            return (
              <li key={s.id} className="shrink-0">
                <button
                  type="button"
                  onClick={() => scrollToSection(s.id)}
                  aria-current={isActive ? "true" : undefined}
                  className="rounded-full px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors"
                  style={{
                    background: isActive ? "var(--ink)" : "rgba(46,34,34,0.05)",
                    color: isActive ? "var(--paper)" : "var(--ink-mute)",
                    border: "1px solid rgba(46,34,34,0.08)",
                  }}
                >
                  {s.title}
                </button>
              </li>
            );
          })}
        </ol>
      </nav>
    );
  }

  return (
    <nav aria-label="Contents" className="hidden lg:block">
      <div className="sticky top-6 rounded-2xl p-5" style={CARD_STYLE}>
        <div
          className="text-[11px] uppercase tracking-[0.14em] mb-3"
          style={{ color: "var(--maroon)" }}
        >
          Contents
        </div>
        <ol className="space-y-0.5">
          {sections.map((s, i) => {
            const isActive = s.id === activeId;
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => scrollToSection(s.id)}
                  aria-current={isActive ? "true" : undefined}
                  className="group w-full text-left flex items-baseline gap-3 rounded-lg px-2.5 py-2 text-sm transition-colors"
                  style={{
                    background: isActive ? "rgba(154,81,81,0.10)" : "transparent",
                    color: isActive ? "var(--maroon)" : "var(--ink-mute)",
                    fontWeight: isActive ? 600 : 500,
                  }}
                >
                  <span
                    className="text-[11px] tabular-nums shrink-0"
                    style={{
                      fontFamily: "var(--f-mono)",
                      color: isActive ? "var(--maroon)" : "var(--ink-faint)",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="group-hover:text-[var(--ink)] transition-colors">
                    {s.title}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}

function LoomEmbed({ video }: { video: GuideVideo }) {
  const embedUrl = toLoomEmbedUrl(video.loomUrl);
  if (!embedUrl) {
    return (
      <div
        className="aspect-video rounded-xl grid place-items-center text-sm px-6 text-center"
        style={{
          background: "rgba(176,74,58,0.08)",
          border: "1px solid rgba(176,74,58,0.2)",
          color: "var(--maroon)",
        }}
      >
        That recording link isn't a Loom share link — check it in the guide content.
      </div>
    );
  }
  return (
    <div
      className="aspect-video rounded-xl overflow-hidden"
      style={{ background: "rgba(46,34,34,0.06)" }}
    >
      <iframe
        src={embedUrl}
        title={video.title}
        loading="lazy"
        allowFullScreen
        allow="fullscreen; picture-in-picture"
        referrerPolicy="strict-origin-when-cross-origin"
        className="w-full h-full block"
        style={{ border: 0 }}
      />
    </div>
  );
}

function VideoCard({ video }: { video: GuideVideo }) {
  return (
    <div className="rounded-2xl p-3 md:p-4" style={CARD_STYLE}>
      <div className="flex items-start gap-3 px-1 pb-3">
        <PlayCircle className="w-4 h-4 mt-1 shrink-0" style={{ color: "var(--maroon)" }} />
        <div>
          <div className="font-semibold text-[15px]" style={{ color: "var(--ink)" }}>
            {video.title}
          </div>
          {video.description ? (
            <p className="text-sm mt-0.5" style={{ color: "var(--ink-mute)" }}>
              {video.description}
            </p>
          ) : null}
        </div>
      </div>
      <LoomEmbed video={video} />
    </div>
  );
}

function ComingSoon() {
  return (
    <div
      className="rounded-2xl px-5 py-8 flex items-center gap-3 text-sm"
      style={{
        border: "1.5px dashed rgba(46,34,34,0.16)",
        color: "var(--ink-mute)",
      }}
    >
      <Clock className="w-4 h-4 shrink-0" style={{ color: "var(--ink-faint)" }} />
      Recording coming soon.
    </div>
  );
}

/** Element on the left, value on the right — one table per Tina collection/section. */
function SpecTable({ group }: { group: GuideSpecGroup }) {
  return (
    <div className="rounded-2xl overflow-hidden" style={CARD_STYLE}>
      <div
        className="px-5 py-3 text-[11px] uppercase tracking-[0.14em] border-b"
        style={{ color: "var(--maroon)", borderColor: "rgba(46,34,34,0.08)" }}
      >
        {group.title}
      </div>
      <table className="w-full text-sm">
        <thead className="sr-only">
          <tr>
            <th scope="col">Element</th>
            <th scope="col">Recommended size</th>
          </tr>
        </thead>
        <tbody>
          {group.rows.map((row, i) => (
            <tr
              key={row.element}
              style={{ borderTop: i === 0 ? undefined : "1px solid rgba(46,34,34,0.06)" }}
            >
              <th
                scope="row"
                className="px-5 py-3 text-left align-top font-semibold w-full"
                style={{ color: "var(--ink)" }}
              >
                {row.element}
                {row.note ? (
                  <div className="text-[12.5px] font-normal leading-snug mt-0.5" style={{ color: "var(--ink-mute)" }}>
                    {row.note}
                  </div>
                ) : null}
              </th>
              <td
                className="px-5 py-3 text-right align-top tabular-nums whitespace-nowrap"
                style={{ fontFamily: "var(--f-mono)", color: "var(--ink)", fontSize: 13 }}
              >
                {row.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Section({ section, index }: { section: GuideSection; index: number }) {
  const recorded = section.videos.filter((v) => v.loomUrl.trim());
  const hasSpecs = Boolean(section.specs?.length);
  return (
    <section id={section.id} className="scroll-mt-24" aria-labelledby={`${section.id}-title`}>
      <div
        className="text-[11px] uppercase tracking-[0.14em] mb-2"
        style={{ color: "var(--maroon)", fontFamily: "var(--f-mono)" }}
      >
        {String(index + 1).padStart(2, "0")}
      </div>
      <h2
        id={`${section.id}-title`}
        className="text-2xl md:text-3xl leading-tight"
        style={{ fontFamily: "var(--f-serif)", color: "var(--ink)" }}
      >
        {section.title}
      </h2>
      <p className="text-[15px] leading-relaxed mt-2 mb-5 max-w-2xl" style={{ color: "var(--ink-mute)" }}>
        {section.summary}
      </p>
      {recorded.length > 0 ? (
        <div className="space-y-5">
          {recorded.map((video) => (
            <VideoCard key={`${section.id}-${video.title}`} video={video} />
          ))}
        </div>
      ) : hasSpecs ? null : (
        <ComingSoon />
      )}
      {hasSpecs ? (
        <div className={`space-y-4 ${recorded.length > 0 ? "mt-6" : ""}`}>
          {section.specs!.map((group) => (
            <SpecTable key={group.title} group={group} />
          ))}
        </div>
      ) : null}
      {section.tips?.length ? (
        <ul className="mt-5 space-y-1.5 text-[13.5px] leading-relaxed pl-4 list-disc" style={{ color: "var(--ink-mute)" }}>
          {section.tips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function Guide() {
  const [status, setStatus] = useState<Status>("checking");
  const [content, setContent] = useState<GuideContent | null>(null);
  const [message, setMessage] = useState<string>("");
  const statusRef = useRef<Status>("checking");
  const requestId = useRef(0);

  useSeo({ title: "How To" });

  // Belt-and-braces with the X-Robots-Tag header: tell crawlers that do run
  // JS to keep this page out of their index.
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.setAttribute("name", "robots");
    meta.setAttribute("content", "noindex, nofollow");
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  const setStatusTracked = useCallback((next: Status) => {
    statusRef.current = next;
    setStatus(next);
  }, []);

  const load = useCallback(() => {
    const id = ++requestId.current;
    fetchGuide()
      .then((payload) => {
        if (id !== requestId.current) return;
        setContent(payload);
        setStatusTracked("ready");
      })
      .catch((err: unknown) => {
        if (id !== requestId.current) return;
        const text = err instanceof Error ? err.message : "Couldn't load the guide.";
        setMessage(text);
        setStatusTracked(err instanceof GuideAuthError ? "locked" : "error");
      });
  }, [setStatusTracked]);

  useEffect(() => {
    let timer: number | undefined;

    const unsub = subscribeTinaAuthHandoff((token) => {
      if (!token) return;
      void establishInsightsSession(token);
      load();
    });

    const existing = getTinaIdToken();
    if (existing) {
      // Also mint the cookie so fetches work even if storage is unreadable.
      void establishInsightsSession(existing).finally(load);
    } else if (getLocalDevTinaToken()) {
      load();
    } else {
      // Give a wrapping Tina admin frame a moment to hand us a token.
      timer = window.setTimeout(load, 500);
    }

    // Signed in from another tab? Re-check when the user comes back.
    const recheck = () => {
      if (statusRef.current === "locked" && currentToken()) load();
    };
    window.addEventListener("focus", recheck);
    window.addEventListener("storage", recheck);
    return () => {
      if (timer) window.clearTimeout(timer);
      unsub();
      window.removeEventListener("focus", recheck);
      window.removeEventListener("storage", recheck);
    };
  }, [load]);

  const sectionIds = useMemo(
    () => content?.sections.map((s) => s.id) ?? [],
    [content]
  );
  const activeId = useActiveSection(sectionIds);

  // Honour a deep link (/guide#adding-products) once content is on screen.
  useEffect(() => {
    if (status !== "ready") return;
    const hash = window.location.hash.replace(/^#/, "");
    if (hash && sectionIds.includes(hash)) {
      window.requestAnimationFrame(() => {
        document.getElementById(hash)?.scrollIntoView({ block: "start" });
      });
    }
  }, [status, sectionIds]);

  if (status === "checking") {
    return (
      <div
        className="min-h-screen flex items-center justify-center gap-3"
        style={{ background: "var(--paper)", color: "var(--ink-mute)", fontFamily: "var(--f-sans)" }}
      >
        <Loader2 className="w-5 h-5 animate-spin" />
        Opening the guide…
      </div>
    );
  }

  if (status === "locked") {
    return <LockedGate message={message} />;
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: PAGE_BACKGROUND, color: "var(--ink)", fontFamily: "var(--f-sans)" }}
    >
      <PageHeader subtitle="Using Tina to edit Blade & Quill" />

      <main className="max-w-6xl mx-auto px-5 md:px-8 py-8 md:py-12">
        {status === "error" || !content ? (
          <div
            className="rounded-xl px-4 py-3 text-sm flex flex-wrap items-center justify-between gap-3"
            role="alert"
            style={{
              background: "rgba(176,74,58,0.08)",
              color: "var(--maroon)",
              border: "1px solid rgba(176,74,58,0.2)",
            }}
          >
            <span>{message || "Couldn't load the guide."}</span>
            <Btn kind="outline" size="sm" onClick={load} iconLeft={<RefreshCw className="w-3.5 h-3.5" />}>
              Try again
            </Btn>
          </div>
        ) : (
          <>
            <div className="mb-8 md:mb-12 max-w-2xl">
              <div
                className="text-[11px] uppercase tracking-[0.14em] mb-2"
                style={{ color: "var(--maroon)" }}
              >
                Owner guide
              </div>
              <h1 className="text-3xl md:text-4xl leading-tight" style={{ fontFamily: "var(--f-serif)" }}>
                How to use Tina
              </h1>
              <p className="text-[15px] md:text-base leading-relaxed mt-3" style={{ color: "var(--ink-mute)" }}>
                {content.intro}
              </p>
            </div>

            <ContentsList sections={content.sections} activeId={activeId} variant="chips" />

            {/* Grid items stretch to the row height so the sidebar's sticky box has room to travel. */}
            <div className="lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10 xl:gap-14">
              <ContentsList sections={content.sections} activeId={activeId} variant="sidebar" />

              <div className="space-y-14 md:space-y-16 min-w-0">
                {content.sections.map((section, i) => (
                  <Section key={section.id} section={section} index={i} />
                ))}

                <p className="text-xs pt-4" style={{ color: "var(--ink-faint)" }}>
                  Need something that isn't covered here? Message Nick and a new
                  recording will be added.
                </p>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
