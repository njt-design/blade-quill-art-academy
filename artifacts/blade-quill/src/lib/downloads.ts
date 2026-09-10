/**
 * Free downloads authored in Tina.
 *
 * The list lives on the Downloads page document (`content/pages/downloads.json`)
 * inside its "Downloads Grid" section, so editors manage it right on the page.
 * The homepage Downloads Preview reads the same list. The Express / Supabase
 * downloads API remains a fallback when the list is missing or empty.
 */

import type { Download } from "@workspace/api-client-react";

const DOWNLOADS_PAGE_SLUG = "downloads";
export const DOWNLOADS_GRID_TEMPLATE = "downloadsGrid";
export const DOWNLOADS_GRID_TYPENAME = "PageBlocksDownloadsGrid";
/**
 * Name of the list field on the Downloads Grid section. (Not `items`: Tina
 * generates one fragment per section type in the same `blocks` list, and
 * same-named fields with different shapes conflict.)
 */
export const DOWNLOADS_GRID_LIST_FIELD = "downloads";

const pageModules = import.meta.glob("../../content/pages/downloads.json", {
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

/** Derive the badge label from the file extension when not set explicitly. */
function fileTypeFromUrl(url: string): string {
  const name = url.split("?")[0]?.split("/").pop() ?? "";
  const ext = name.includes(".") ? name.split(".").pop() : "";
  return ext ? ext.toUpperCase() : "FILE";
}

/** Map a Tina list item (bundled JSON or GraphQL node) to a download. */
export function toDownloadItem(
  raw: Record<string, unknown>,
  index: number
): Download {
  const fileUrl = text(raw.file) || text(raw.fileUrl);
  return {
    id: Number(raw.id) || index + 1,
    title: text(raw.title) || `Download ${index + 1}`,
    description: optionalText(raw.description),
    fileUrl,
    fileType: text(raw.fileType) || fileTypeFromUrl(fileUrl),
    thumbnailUrl: optionalText(raw.thumbnail) ?? optionalText(raw.thumbnailUrl),
    createdAt: text(raw.createdAt) || new Date(0).toISOString(),
  };
}

/** Raw list items from a section's `downloads` value (bundled JSON or GraphQL). */
export function rawDownloadItems(items: unknown): Record<string, unknown>[] {
  if (!Array.isArray(items)) return [];
  return items.filter((item): item is Record<string, unknown> =>
    Boolean(item && typeof item === "object")
  );
}

/** Downloads from a section's `downloads` value, in CMS order. */
export function downloadItemsFromRaw(items: unknown): Download[] {
  return rawDownloadItems(items)
    .map((item, index) => toDownloadItem(item, index))
    .filter((item) => Boolean(item.fileUrl));
}

/** True for the Downloads Grid section (bundled `_template` or GraphQL `__typename`). */
export function isDownloadsGridBlock(block: unknown): block is Record<string, unknown> {
  if (!block || typeof block !== "object") return false;
  const b = block as Record<string, unknown>;
  return (
    b._template === DOWNLOADS_GRID_TEMPLATE ||
    b.__typename === DOWNLOADS_GRID_TYPENAME
  );
}

/** Downloads from a page document's blocks (first Downloads Grid section). */
export function downloadItemsFromPage(
  page: Record<string, unknown> | null | undefined
): Download[] {
  const blocks = page?.blocks;
  if (!Array.isArray(blocks)) return [];
  const grid = blocks.find(isDownloadsGridBlock);
  return grid ? downloadItemsFromRaw(grid[DOWNLOADS_GRID_LIST_FIELD]) : [];
}

/** True when the Downloads page has items (skip API fetches). */
export function hasDownloadItems(): boolean {
  return loadDownloadItems().length > 0;
}

/** Downloads authored on the Downloads page, in CMS order (bundled at build). */
export function loadDownloadItems(): Download[] {
  for (const [key, mod] of Object.entries(pageModules)) {
    if (!key.endsWith(`/${DOWNLOADS_PAGE_SLUG}.json`)) continue;
    const data = (mod.default ?? mod) as Record<string, unknown>;
    const items = downloadItemsFromPage(data);
    if (items.length > 0) return items;
  }
  return [];
}

export function resolveDownloadItems(
  apiItems: Download[] | undefined,
  fallback: Download[],
  catalog: Download[] = loadDownloadItems()
): Download[] {
  if (catalog.length > 0) return catalog;

  const api = Array.isArray(apiItems) ? apiItems : [];
  if (api.length > 0) return api;

  return fallback;
}
