/**
 * Gallery artworks authored in Tina (`content/gallery/items.json`).
 *
 * The Art Gallery Grid reads this list first. The Express / Supabase
 * gallery API remains a fallback when the Tina file is missing or empty.
 */

import type { GalleryItem } from "@workspace/api-client-react";

const galleryModules = import.meta.glob("../../content/gallery/*.json", {
  eager: true,
}) as Record<
  string,
  { default?: Record<string, unknown> } & Record<string, unknown>
>;

export type GalleryArtwork = GalleryItem & {
  /** Optional extra file visitors can download from the lightbox. */
  downloadFile?: string | null;
};

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function optionalText(value: unknown): string | null {
  const trimmed = text(value);
  return trimmed ? trimmed : null;
}

/** True when the artwork has a downloadable extra file. */
export function hasDownloadFile(
  file: string | null | undefined
): file is string {
  return Boolean(file && file.trim());
}

/** Prefer a real filename so browsers save the file instead of opening it. */
export function fileNameFromUrl(url: string): string {
  try {
    const path = new URL(url, "https://example.invalid").pathname;
    const name = path.split("/").pop();
    return name && name.includes(".") ? decodeURIComponent(name) : "download";
  } catch {
    return "download";
  }
}

/** Map a Tina list item (bundled JSON or GraphQL node) to a gallery artwork. */
export function toGalleryArtwork(
  raw: Record<string, unknown>,
  index: number
): GalleryArtwork {
  const title = text(raw.title) || `Artwork ${index + 1}`;
  const imageUrl = text(raw.image) || text(raw.imageUrl);
  return {
    id: Number(raw.id) || index + 1,
    title,
    imageUrl,
    description: optionalText(raw.description),
    createdAt: text(raw.createdAt) || new Date(0).toISOString(),
    downloadFile: optionalText(raw.downloadFile),
  };
}

function itemsFromDocument(data: Record<string, unknown>): GalleryArtwork[] {
  const rawItems = data.items;
  if (!Array.isArray(rawItems)) return [];
  return rawItems
    .filter((item): item is Record<string, unknown> =>
      Boolean(item && typeof item === "object")
    )
    .map((item, index) => toGalleryArtwork(item, index))
    .filter((item) => Boolean(item.imageUrl));
}

/** True when the Tina gallery file exists and has artworks (skip API fetches). */
export function hasGalleryArtworks(): boolean {
  return loadGalleryArtworks().length > 0;
}

/** Artworks authored in Tina, in CMS order (drag to reorder). */
export function loadGalleryArtworks(): GalleryArtwork[] {
  for (const mod of Object.values(galleryModules)) {
    const data = (mod.default ?? mod) as Record<string, unknown>;
    const items = itemsFromDocument(data);
    if (items.length > 0) return items;
  }
  return [];
}

function withNoDownload(item: GalleryItem): GalleryArtwork {
  return { ...item, downloadFile: null };
}

export function resolveGalleryArtworks(
  apiItems: GalleryItem[] | undefined,
  fallback: GalleryItem[],
  catalog: GalleryArtwork[] = loadGalleryArtworks()
): GalleryArtwork[] {
  if (catalog.length > 0) return catalog;

  const api = Array.isArray(apiItems) ? apiItems : [];
  if (api.length > 0) return api.map(withNoDownload);

  return fallback.map(withNoDownload);
}
