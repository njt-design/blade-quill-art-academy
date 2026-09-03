import type { Product, ProductCategory } from "@workspace/api-client-react";
import { isRichText, type RichTextValue } from "@/lib/rich-text";

const productModules = import.meta.glob("../../content/products/*.json", {
  eager: true,
}) as Record<
  string,
  { default?: Record<string, unknown> } & Record<string, unknown>
>;

export type ProductGalleryImage = {
  src: string;
  alt?: string;
};

export type CatalogProduct = Omit<Product, "description"> & {
  slug: string;
  description: string | RichTextValue;
  amazonUrl?: string | null;
  googlePlayUrl?: string | null;
  /** Extra images for thumbnail slots 2–5 (slot 1 is always Cover Image). */
  galleryImages: ProductGalleryImage[];
  /** Up to 6 Look Inside tab images (book spreads or digital previews). */
  spreadImages: ProductGalleryImage[];
};

const THUMBNAIL_SLOT_COUNT = 5;
/** Extra gallery uploads fill slots 2–5; slot 1 is always the Cover Image. */
const GALLERY_IMAGE_LIMIT = THUMBNAIL_SLOT_COUNT - 1;
const SPREAD_IMAGE_LIMIT = 6;

function parseGalleryImages(
  raw: unknown,
  limit = GALLERY_IMAGE_LIMIT
): ProductGalleryImage[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const src = String((item as { src?: unknown }).src ?? "").trim();
      if (!src) return null;
      const alt = String((item as { alt?: unknown }).alt ?? "").trim();
      return { src, ...(alt ? { alt } : {}) };
    })
    .filter((item): item is ProductGalleryImage => item !== null)
    .slice(0, limit);
}

/**
 * Resolve the 5 detail-page thumbnail slots.
 * Slot 1 is always the Cover Image; uploaded gallery images fill slots 2–5.
 */
export function resolveProductThumbnails(product: {
  imageUrl?: string | null;
  galleryImages?: ProductGalleryImage[] | null;
  name?: string | null;
}): Array<ProductGalleryImage | null> {
  const gallery = (product.galleryImages ?? []).filter((img) =>
    Boolean(img.src)
  );
  const slots: Array<ProductGalleryImage | null> = Array.from(
    { length: THUMBNAIL_SLOT_COUNT },
    () => null
  );

  if (product.imageUrl) {
    slots[0] = {
      src: product.imageUrl,
      alt: product.name ?? undefined,
    };
  }

  gallery.slice(0, GALLERY_IMAGE_LIMIT).forEach((img, i) => {
    slots[i + 1] = img;
  });

  return slots;
}

/** Build a CatalogProduct from raw Tina document data (bundled JSON or GraphQL node). */
export function toCatalogProduct(
  slug: string,
  data: Record<string, unknown>
): CatalogProduct | null {
  const id = Number(data.productId ?? data.id);
  const name = data.name as string | undefined;
  const price = Number(data.price);
  const category = data.category as ProductCategory | undefined;

  if (!slug || !name || !id || Number.isNaN(price) || !category) {
    return null;
  }

  const image =
    (data.image as string | undefined) ??
    (data.imageUrl as string | undefined) ??
    "";

  return {
    slug,
    id,
    name,
    description: isRichText(data.description)
      ? data.description
      : ((data.description as string | undefined) ?? ""),
    price,
    category,
    imageUrl: image,
    galleryImages: parseGalleryImages(data.galleryImages),
    spreadImages: parseGalleryImages(data.spreadImages, SPREAD_IMAGE_LIMIT),
    gumroadUrl: (data.gumroadUrl as string | null) ?? null,
    downloadUrl: (data.downloadUrl as string | null) ?? null,
    amazonUrl: (data.amazonUrl as string | null) ?? null,
    googlePlayUrl: (data.googlePlayUrl as string | null) ?? null,
    featured: Boolean(data.featured),
    inStock: data.inStock !== false,
    createdAt:
      (data.createdAt as string) ?? new Date(0).toISOString(),
  };
}

/** True when Tina product files exist (skip API product fetches in dev). */
export function hasCatalogProducts(): boolean {
  return Object.keys(productModules).length > 0;
}

/** Newest-first sort shared by the bundled and live catalog loaders. */
export function sortCatalogProducts(
  products: CatalogProduct[]
): CatalogProduct[] {
  return [...products].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/** Products authored in Tina (`content/products/*.json`). */
export function loadCatalogProducts(): CatalogProduct[] {
  return sortCatalogProducts(
    Object.entries(productModules)
      .map(([path, mod]) => {
        const data = (mod.default ?? mod) as Record<string, unknown>;
        const slug = path.split("/").pop()?.replace(/\.json$/i, "") ?? "";
        return toCatalogProduct(slug, data);
      })
      .filter((p): p is CatalogProduct => p !== null)
  );
}

/** Find a product by slug (preferred) or numeric ID. */
export function findCatalogProduct(
  products: CatalogProduct[],
  slugOrId: string
): CatalogProduct | undefined {
  const bySlug = products.find((p) => p.slug === slugOrId);
  if (bySlug) return bySlug;

  const id = Number(slugOrId);
  if (!Number.isNaN(id)) {
    return products.find((p) => p.id === id);
  }
  return undefined;
}

export function getCatalogProduct(
  slugOrId: string
): CatalogProduct | undefined {
  return findCatalogProduct(loadCatalogProducts(), slugOrId);
}

export function resolveCatalogProducts(
  apiProducts: Product[] | undefined,
  fallback: Product[],
  catalog: CatalogProduct[] = loadCatalogProducts()
): CatalogProduct[] {
  if (catalog.length > 0) return catalog;

  const api = Array.isArray(apiProducts) ? apiProducts : [];
  if (api.length > 0) {
    return api.map((p) => ({
      ...p,
      slug: String(p.id),
      galleryImages: [],
      spreadImages: [],
    }));
  }

  return fallback.map((p) => ({
    ...p,
    slug: String(p.id),
    galleryImages: [],
    spreadImages: [],
  }));
}
