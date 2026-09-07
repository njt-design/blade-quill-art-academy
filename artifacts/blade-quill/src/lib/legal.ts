import { marked } from "marked";
import privacyMarkdown from "../../content/legal/privacy-policy.md?raw";
import termsMarkdown from "../../content/legal/terms-of-use.md?raw";

export type LegalHeading = {
  id: string;
  text: string;
  level: 2 | 3;
};

export type LegalDoc = {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  effectiveDate: string;
  lastUpdated: string;
  markdown: string;
};

export const TERMS_OF_USE: LegalDoc = {
  slug: "terms-of-use",
  title: "Terms of Use",
  eyebrow: "Studio policies",
  description:
    "The agreement between you and Blade & Quill Art Academy — courses, purchases, and what we each owe the other.",
  effectiveDate: "September 6, 2026",
  lastUpdated: "September 6, 2026",
  markdown: termsMarkdown,
};

export const PRIVACY_POLICY: LegalDoc = {
  slug: "privacy-policy",
  title: "Privacy Policy",
  eyebrow: "Studio policies",
  description:
    "What we collect, why we collect it, who we share it with, and what you can ask us to do about it.",
  effectiveDate: "September 6, 2026",
  lastUpdated: "September 6, 2026",
  markdown: privacyMarkdown,
};

/** Slugify a heading so TOC links, in-page hashes, and heading ids match. */
export function headingAnchorId(text: string): string {
  return (
    text
      .toLowerCase()
      .replace(/['']/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "section"
  );
}

function uniqueHeadingId(text: string, used: Map<string, number>): string {
  let id = headingAnchorId(text);
  const count = used.get(id) ?? 0;
  used.set(id, count + 1);
  return count > 0 ? `${id}-${count + 1}` : id;
}

function headingLabel(raw: string): string {
  return raw.replace(/[*_`]/g, "").trim();
}

export function collectLegalHeadings(markdown: string): LegalHeading[] {
  const headings: LegalHeading[] = [];
  const used = new Map<string, number>();

  for (const token of marked.lexer(markdown, { gfm: true })) {
    if (token.type !== "heading") continue;
    if (token.depth !== 2 && token.depth !== 3) continue;
    const text = headingLabel(token.text);
    if (!text) continue;
    headings.push({
      id: uniqueHeadingId(text, used),
      text,
      level: token.depth === 3 ? 3 : 2,
    });
  }

  return headings;
}

export function renderLegalHtml(markdown: string): string {
  const headings = collectLegalHeadings(markdown);
  const html = marked.parse(markdown, { async: false, gfm: true }) as string;
  let index = 0;

  return html.replace(/<h([23])>([\s\S]*?)<\/h\1>/g, (_match, level, inner) => {
    const heading = headings[index++];
    const fallback = headingLabel(String(inner).replace(/<[^>]+>/g, ""));
    const id = heading?.id ?? headingAnchorId(fallback);
    return (
      `<h${level} id="${id}" class="bq-legal-heading scroll-mt-28">` +
      `<a href="#${id}" class="bq-legal-anchor">${inner}</a>` +
      `</h${level}>`
    );
  });
}
