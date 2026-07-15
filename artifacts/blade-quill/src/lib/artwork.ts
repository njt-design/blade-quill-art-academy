/**
 * Helpers for pulling the client's real artwork into decorative art slots
 * (hero tiles, polaroids, module tiles) instead of gradient placeholders.
 */

import { FALLBACK_GALLERY, FALLBACK_PRODUCTS } from "./fallback-data";

/** Look up one of Corinne's artworks (bundled gallery data) by its title. */
export function galleryImageUrl(title: string): string | undefined {
  return FALLBACK_GALLERY.find((item) => item.title === title)?.imageUrl;
}

/** First product image in a category (book cover, curriculum art, …). */
export function productImageUrl(
  category: "physical" | "digital" | "curriculum"
): string | undefined {
  return FALLBACK_PRODUCTS.find((p) => p.category === category)?.imageUrl;
}

/** Standard-quality YouTube thumbnail for a tutorial video. */
export function youtubeThumb(id: string): string {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}
