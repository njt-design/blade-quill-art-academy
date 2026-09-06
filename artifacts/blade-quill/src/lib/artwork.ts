/**
 * Helpers for pulling the client's real artwork into decorative art slots
 * (hero tiles, polaroids, module tiles) instead of gradient placeholders.
 */

import { FALLBACK_GALLERY, FALLBACK_PRODUCTS } from "./fallback-data";
import { loadGalleryArtworks } from "./gallery";

/** Look up one of Corinne's artworks (Tina gallery, then bundled fallback) by its title. */
export function galleryImageUrl(title: string): string | undefined {
  const fromCms = loadGalleryArtworks().find((item) => item.title === title)?.imageUrl;
  if (fromCms) return fromCms;
  return FALLBACK_GALLERY.find((item) => item.title === title)?.imageUrl;
}

/** First product image in a category (book cover, curriculum art, …). */
export function productImageUrl(
  category: "physical" | "digital" | "curriculum"
): string | undefined {
  return FALLBACK_PRODUCTS.find((p) => p.category === category)?.imageUrl;
}

/** Standard-quality YouTube thumbnail for a tutorial video (480×360). */
export function youtubeThumb(id: string): string {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

/** YouTube’s recommended custom-thumbnail size (1280×720). Falls back to hq if the video has no maxres still. */
export function youtubeThumbMaxres(id: string): string {
  return `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
}
