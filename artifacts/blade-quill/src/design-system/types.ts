import type { ComponentType } from "react";

export type AtomicCategory = "block" | "brand" | "molecule" | "atom";

/**
 * Admin-facing guidance shown under each demo — mined from the Tina schema
 * (`tina/blocks.ts`) and the site's rendering conventions so Corinne can see
 * exactly what each element expects without leaving the page.
 */
export type EntryGuidelines = {
  /** When/why to use this element. */
  usage?: string;
  /** Live pages currently using it, e.g. ["/", "/about"]. */
  usedOn?: string[];
  /** Where to edit it in Tina, e.g. "Main Pages → Home → Page Sections". */
  cmsLocation?: string;
  /** Image fields with the spec an admin should follow (dims, format, folder). */
  images?: { field: string; spec: string }[];
  /** Character limits enforced by the Tina editor. */
  charLimits?: { field: string; limit: number }[];
  /** Anything else worth knowing (behavior, fallbacks, gotchas). */
  notes?: string[];
};

export type DesignSystemEntry = {
  id: string;
  name: string;
  category: AtomicCategory;
  description?: string;
  /** Sub-group within a section (e.g. "Heroes & headers" for blocks). */
  group?: string;
  guidelines?: EntryGuidelines;
  demo: ComponentType;
};
