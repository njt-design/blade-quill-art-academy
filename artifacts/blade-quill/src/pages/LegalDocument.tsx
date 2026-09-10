import { useMemo, type MouseEvent } from "react";
import { Link, useLocation } from "wouter";
import { useSeo } from "@/lib/seo";
import {
  PRIVACY_POLICY,
  TERMS_OF_USE,
  collectLegalHeadings,
  renderLegalHtml,
  type LegalDoc,
} from "@/lib/legal";

interface Props {
  doc: LegalDoc;
}

export default function LegalDocument({ doc }: Props) {
  const [, setLocation] = useLocation();
  const headings = useMemo(() => collectLegalHeadings(doc.markdown), [doc.markdown]);
  const html = useMemo(() => renderLegalHtml(doc.markdown), [doc.markdown]);
  const companion =
    doc.slug === TERMS_OF_USE.slug
      ? { href: `/${PRIVACY_POLICY.slug}`, label: PRIVACY_POLICY.title }
      : { href: `/${TERMS_OF_USE.slug}`, label: TERMS_OF_USE.title };

  useSeo({
    title: doc.title,
    description: doc.description,
  });

  const onContentClick = (event: MouseEvent<HTMLElement>) => {
    const anchor = (event.target as HTMLElement).closest("a");
    if (!anchor) return;
    const href = anchor.getAttribute("href");
    if (!href || href.startsWith("#") || href.startsWith("mailto:")) return;
    if (href.startsWith("/") && !href.startsWith("//")) {
      event.preventDefault();
      setLocation(href);
    }
  };

  return (
    <div className="bq-legal-page min-h-screen">
      <header className="bq-container-wide pt-16 md:pt-20 pb-10 md:pb-12">
        <div className="max-w-2xl">
          <p className="eyebrow mb-3" style={{ color: "var(--ink-mute)" }}>
            {doc.eyebrow}
          </p>
          <h1
            className="font-display mb-3"
            style={{
              fontSize: "clamp(30px, 3.5vw, 36px)",
              lineHeight: 1.2,
              color: "var(--ink)",
            }}
          >
            {doc.title}
          </h1>
          <p className="text-base text-muted-foreground font-sans leading-relaxed mb-5">
            {doc.description}
          </p>
          <p className="text-sm" style={{ color: "var(--ink-mute)" }}>
            Effective {doc.effectiveDate} · Last updated {doc.lastUpdated}
          </p>
        </div>
      </header>

      <div className="bq-container-wide pb-16 md:pb-20 lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-16">
        <nav
          aria-label="On this page"
          className="mb-10 lg:mb-0 lg:sticky lg:top-28 lg:self-start"
        >
          <p className="eyebrow mb-4">On this page</p>
          <ol className="flex flex-col gap-2.5 list-none m-0 p-0">
            {headings.map((heading) => (
              <li key={heading.id} className={heading.level === 3 ? "pl-3" : undefined}>
                <a
                  href={`#${heading.id}`}
                  className="bq-legal-toc-link"
                  style={{
                    fontSize: heading.level === 3 ? 13 : 14,
                    color:
                      heading.level === 3 ? "var(--ink-mute)" : "var(--ink-soft)",
                  }}
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div>
          <article
            className="bq-legal-prose prose prose-neutral max-w-none"
            onClick={onContentClick}
            dangerouslySetInnerHTML={{ __html: html }}
          />
          <p
            className="mt-14 pt-6 text-sm"
            style={{
              borderTop: "1px solid rgba(46, 34, 34, 0.1)",
              color: "var(--ink-mute)",
            }}
          >
            Also see our{" "}
            <Link
              href={companion.href}
              className="font-semibold"
              style={{ color: "var(--maroon)" }}
            >
              {companion.label}
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
