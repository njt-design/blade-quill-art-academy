/**
 * Free downloads authored in Tina (`content/downloads/items.json`).
 *
 * The Downloads Grid reads this list first. The Express / Supabase
 * downloads API remains a fallback when the Tina file is missing or empty.
 */

import type { Download } from "@workspace/api-client-react";

const downloadModules = import.meta.glob("../../content/downloads/*.json", {
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

function itemsFromDocument(data: Record<string, unknown>): Download[] {
  const rawItems = data.items;
  if (!Array.isArray(rawItems)) return [];
  return rawItems
    .filter((item): item is Record<string, unknown> =>
      Boolean(item && typeof item === "object")
    )
    .map((item, index) => toDownloadItem(item, index))
    .filter((item) => Boolean(item.fileUrl));
}

/** True when the Tina downloads file exists and has items (skip API fetches). */
export function hasDownloadItems(): boolean {
  return loadDownloadItems().length > 0;
}

/** Downloads authored in Tina, in CMS order (drag to reorder). */
export function loadDownloadItems(): Download[] {
  for (const mod of Object.values(downloadModules)) {
    const data = (mod.default ?? mod) as Record<string, unknown>;
    const items = itemsFromDocument(data);
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
