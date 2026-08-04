import type { Block } from "@/pages/blocks/block-utils";

/** Resolve a section template key from JSON `_template` or GraphQL `__typename`. */
export function sectionKey(section: Block): string | null {
  if (section._template && typeof section._template === "string") {
    return section._template;
  }
  const typename = section.__typename ?? "";
  // PostSectionsHeading → Heading → heading
  const match = typename.match(/Sections(.+)$/);
  if (match) {
    const pascal = match[1];
    return pascal.charAt(0).toLowerCase() + pascal.slice(1);
  }
  return null;
}

/** Slugify a heading for TOC anchor ids. */
export function headingAnchorId(text: string, index: number): string {
  const base = text
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return base || `section-${index + 1}`;
}

export type TocItem = {
  id: string;
  number?: string;
  text: string;
};

/** Collect Heading sections for an optional table of contents. */
export function collectTocItems(sections: Block[]): TocItem[] {
  const items: TocItem[] = [];
  let headingIndex = 0;
  for (const section of sections) {
    if (sectionKey(section) !== "heading") continue;
    const text = String(section.text ?? "").trim();
    if (!text) continue;
    items.push({
      id: headingAnchorId(text, headingIndex),
      number: section.number ? String(section.number).trim() : undefined,
      text,
    });
    headingIndex += 1;
  }
  return items;
}
