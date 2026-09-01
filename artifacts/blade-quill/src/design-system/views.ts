import type { DesignSystemEntry } from "./types";

/**
 * View modes for /design-system. The registry is view-agnostic; these
 * helpers re-group the same entries three ways:
 *
 * - size   (default, client-friendly): Large page sections → Medium
 *          components → Small UI elements
 * - page:  everything grouped by the live page it appears on (uses the
 *          `guidelines.usedOn` metadata on each entry)
 * - atomic: the classic atomic-design split (blocks / brand / molecules /
 *          atoms)
 */
export type ViewMode = "size" | "page" | "atomic";

export interface ViewSection {
  id: string;
  title: string;
  intro?: string;
  entries: DesignSystemEntry[];
}

// ---------------------------------------------------------------------------
// Atomic view (the original layout)
// ---------------------------------------------------------------------------

function atomicSections(registry: DesignSystemEntry[]): ViewSection[] {
  const byCategory = (c: DesignSystemEntry["category"]) =>
    registry.filter((e) => e.category === c);
  return [
    {
      id: "blocks",
      title: "Page Blocks",
      intro:
        "Every section available under “Add Section” in the Tina editor — all 39, rendered exactly as they appear on the live site. Each one lists its admin specs: image sizes, character limits, and where it's used.",
      entries: byCategory("block"),
    },
    {
      id: "brand",
      title: "Brand Components",
      intro:
        "Site chrome and the reusable brand pieces that give Blade & Quill its look — buttons, art frames, polaroids, and motion accents.",
      entries: byCategory("brand"),
    },
    { id: "molecules", title: "Molecules", entries: byCategory("molecule") },
    { id: "atoms", title: "Atoms", entries: byCategory("atom") },
  ];
}

// ---------------------------------------------------------------------------
// Size view (default) — how much of the page the element occupies
// ---------------------------------------------------------------------------

const SIZE_BUCKETS: {
  id: string;
  title: string;
  intro: string;
  match: (e: DesignSystemEntry) => boolean;
}[] = [
  {
    id: "size-sections",
    title: "Large · Page Sections",
    intro:
      "Full-width sections — the big pieces you add under “Add Section” in Tina. Each fills the page edge to edge.",
    match: (e) => e.category === "block",
  },
  {
    id: "size-components",
    title: "Medium · Components",
    intro:
      "Site chrome, cards, and composite widgets — medium pieces that live inside page sections.",
    match: (e) => e.category === "brand" || e.category === "molecule",
  },
  {
    id: "size-elements",
    title: "Small · UI Elements",
    intro:
      "Buttons, inputs, badges, and other small pieces the bigger components are built from.",
    match: (e) => e.category === "atom",
  },
];

function sizeSections(registry: DesignSystemEntry[]): ViewSection[] {
  return SIZE_BUCKETS.map((bucket) => ({
    id: bucket.id,
    title: bucket.title,
    intro: bucket.intro,
    entries: registry.filter(bucket.match),
  }));
}

// ---------------------------------------------------------------------------
// Page view — group by the live page each element appears on
// ---------------------------------------------------------------------------

const PAGE_MATCHERS: {
  id: string;
  title: string;
  match: (route: string) => boolean;
}[] = [
  { id: "page-home", title: "Home", match: (r) => r === "/" },
  { id: "page-about", title: "About", match: (r) => r === "/about" },
  { id: "page-shop", title: "Shop", match: (r) => r === "/shop" },
  { id: "page-gallery", title: "Gallery", match: (r) => r === "/gallery" },
  { id: "page-downloads", title: "Downloads", match: (r) => r === "/downloads" },
  { id: "page-contact", title: "Contact", match: (r) => r === "/contact" },
  { id: "page-publishers", title: "Publishers", match: (r) => r === "/publishers" },
  {
    id: "page-important-links",
    title: "Important Links (link-in-bio)",
    match: (r) => r === "/important-links-page",
  },
  {
    id: "page-featured",
    title: "Featured Pages (/p/…)",
    match: (r) => r.startsWith("/p/"),
  },
];

/** The single page group an entry belongs to (first matching route wins). */
function pageGroupId(entry: DesignSystemEntry): string {
  const usedOn = entry.guidelines?.usedOn ?? [];
  for (const route of usedOn) {
    const page = PAGE_MATCHERS.find((p) => p.match(route));
    if (page) return page.id;
  }
  if (entry.category === "block") return "page-unused";
  if (entry.id === "navbar" || entry.id === "footer") return "page-every";
  return "page-shared";
}

const PAGE_TRAILING: { id: string; title: string; intro: string }[] = [
  {
    id: "page-every",
    title: "Every Page",
    intro: "Site chrome shown on every page.",
  },
  {
    id: "page-unused",
    title: "Not on a Live Page Yet",
    intro:
      "Sections available in Tina's “Add Section” picker that no live page currently uses — ready when you need them.",
  },
  {
    id: "page-shared",
    title: "Shared Building Blocks",
    intro:
      "Components and UI elements used across many pages — not tied to any single one.",
  },
];

function pageSections(registry: DesignSystemEntry[]): ViewSection[] {
  const groups = new Map<string, DesignSystemEntry[]>();
  for (const entry of registry) {
    const id = pageGroupId(entry);
    // Flat list per page — family sub-groups aren't useful at this granularity.
    const flat = { ...entry, group: undefined };
    groups.set(id, [...(groups.get(id) ?? []), flat]);
  }

  const sections: ViewSection[] = [];
  for (const page of PAGE_MATCHERS) {
    const entries = groups.get(page.id);
    if (entries?.length) {
      sections.push({ id: page.id, title: page.title, entries });
    }
  }
  for (const extra of PAGE_TRAILING) {
    const entries = groups.get(extra.id);
    if (entries?.length) {
      sections.push({ ...extra, entries });
    }
  }
  return sections;
}

// ---------------------------------------------------------------------------

export function getViewSections(
  view: ViewMode,
  registry: DesignSystemEntry[]
): ViewSection[] {
  if (view === "page") return pageSections(registry);
  if (view === "atomic") return atomicSections(registry);
  return sizeSections(registry);
}
