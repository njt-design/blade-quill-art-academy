/**
 * YouTube tutorials authored in Tina (`content/tutorials/items.json`).
 *
 * The homepage YouTube strip and pillar cards read this list first. The
 * Express / Supabase tutorials API remains a fallback when the Tina file is
 * missing or empty.
 */

import type { Tutorial } from "@workspace/api-client-react";

const tutorialModules = import.meta.glob("../../content/tutorials/*.json", {
  eager: true,
}) as Record<
  string,
  { default?: Record<string, unknown> } & Record<string, unknown>
>;

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function optionalText(value: unknown): string | null {
  const trimmed = text(value);
  return trimmed ? trimmed : null;
}

/** Map a Tina list item (bundled JSON or GraphQL node) to a tutorial. */
export function toTutorial(
  raw: Record<string, unknown>,
  index: number
): Tutorial {
  return {
    id: Number(raw.id) || index + 1,
    title: text(raw.title) || `Video ${index + 1}`,
    youtubeId: text(raw.youtubeId),
    description: optionalText(raw.description),
    topic: optionalText(raw.topic),
    featured: Boolean(raw.featured),
    createdAt: text(raw.createdAt) || new Date(0).toISOString(),
  };
}

function itemsFromDocument(data: Record<string, unknown>): Tutorial[] {
  const rawItems = data.items;
  if (!Array.isArray(rawItems)) return [];
  return rawItems
    .filter((item): item is Record<string, unknown> =>
      Boolean(item && typeof item === "object")
    )
    .map((item, index) => toTutorial(item, index))
    .filter((item) => Boolean(item.youtubeId));
}

/** True when the Tina tutorials file exists and has videos (skip API fetches). */
export function hasTutorials(): boolean {
  return loadTutorials().length > 0;
}

/** Tutorials authored in Tina, in CMS order (drag to reorder). */
export function loadTutorials(): Tutorial[] {
  for (const mod of Object.values(tutorialModules)) {
    const data = (mod.default ?? mod) as Record<string, unknown>;
    const items = itemsFromDocument(data);
    if (items.length > 0) return items;
  }
  return [];
}

export function resolveTutorials(
  apiItems: Tutorial[] | undefined,
  fallback: Tutorial[],
  catalog: Tutorial[] = loadTutorials()
): Tutorial[] {
  if (catalog.length > 0) return catalog;

  const api = Array.isArray(apiItems) ? apiItems : [];
  if (api.length > 0) return api;

  return fallback;
}

/**
 * Videos for the homepage strip: featured videos in CMS order, or the first
 * videos in the list when none are featured (so the strip is never empty).
 */
export function pickStripTutorials(
  list: Tutorial[],
  count = 4
): Tutorial[] {
  const featured = list.filter((t) => t.featured);
  return (featured.length > 0 ? featured : list).slice(0, count);
}
