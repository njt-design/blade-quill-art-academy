/**
 * Gallery artworks authored in Tina.
 *
 * The list lives on the Gallery page document (`content/pages/gallery.json`)
 * inside its "Art Gallery Grid" section, so editors manage it right on the
 * page. The homepage Gallery Preview reads the same list. The Express /
 * Supabase gallery API remains a fallback when the list is missing or empty.
 */

import type { GalleryItem } from "@workspace/api-client-react";

const GALLERY_PAGE_SLUG = "gallery";
export const GALLERY_GRID_TEMPLATE = "galleryGrid";
export const GALLERY_GRID_TYPENAME = "PageBlocksGalleryGrid";
/**
 * Name of the list field on the Art Gallery Grid section. (Not `items`: Tina
 * generates one fragment per section type in the same `blocks` list, and
 * same-named fields with different shapes conflict.)
 */
export const GALLERY_GRID_LIST_FIELD = "artworks";

const pageModules = import.meta.glob("../../content/pages/gallery.json", {
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

/** Raw list items from a section's `artworks` value (bundled JSON or GraphQL). */
export function rawGalleryItems(items: unknown): Record<string, unknown>[] {
  if (!Array.isArray(items)) return [];
  return items.filter((item): item is Record<string, unknown> =>
    Boolean(item && typeof item === "object")
  );
}

/** Artworks from a section's `artworks` value, in CMS order. */
export function galleryArtworksFromRaw(items: unknown): GalleryArtwork[] {
  return rawGalleryItems(items)
    .map((item, index) => toGalleryArtwork(item, index))
    .filter((item) => Boolean(item.imageUrl));
}

/** True for the Art Gallery Grid section (bundled `_template` or GraphQL `__typename`). */
export function isGalleryGridBlock(block: unknown): block is Record<string, unknown> {
  if (!block || typeof block !== "object") return false;
  const b = block as Record<string, unknown>;
  return (
    b._template === GALLERY_GRID_TEMPLATE ||
    b.__typename === GALLERY_GRID_TYPENAME
  );
}

/** Artworks from a page document's blocks (first Art Gallery Grid section). */
export function galleryArtworksFromPage(
  page: Record<string, unknown> | null | undefined
): GalleryArtwork[] {
  const blocks = page?.blocks;
  if (!Array.isArray(blocks)) return [];
  const grid = blocks.find(isGalleryGridBlock);
  return grid ? galleryArtworksFromRaw(grid[GALLERY_GRID_LIST_FIELD]) : [];
}

/** True when the Gallery page has artworks (skip API fetches). */
export function hasGalleryArtworks(): boolean {
  return loadGalleryArtworks().length > 0;
}

/** Artworks authored on the Gallery page, in CMS order (bundled at build). */
export function loadGalleryArtworks(): GalleryArtwork[] {
  for (const [key, mod] of Object.entries(pageModules)) {
    if (!key.endsWith(`/${GALLERY_PAGE_SLUG}.json`)) continue;
    const data = (mod.default ?? mod) as Record<string, unknown>;
    const items = galleryArtworksFromPage(data);
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
