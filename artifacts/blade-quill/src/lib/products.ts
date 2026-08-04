import type { Category, Product, ProductCategory } from "@workspace/api-client-react";
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
  /** Extra images for the product detail thumbnail strip (up to 5). */
  galleryImages: ProductGalleryImage[];
};

const THUMBNAIL_SLOT_COUNT = 5;

function parseGalleryImages(raw: unknown): ProductGalleryImage[] {
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
    .slice(0, THUMBNAIL_SLOT_COUNT);
}

/**
 * Resolve the 5 detail-page thumbnail slots.
 * Uses uploaded gallery images when present; otherwise slot 1 falls back to Cover Image.
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

  if (gallery.length > 0) {
    gallery.forEach((img, i) => {
      if (i < THUMBNAIL_SLOT_COUNT) slots[i] = img;
    });
    return slots;
  }

  if (product.imageUrl) {
    slots[0] = {
      src: product.imageUrl,
      alt: product.name ?? undefined,
    };
  }
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

const CATEGORY_LABELS: Record<ProductCategory, string> = {
  physical: "Physical",
  digital: "Digital",
  curriculum: "Curriculum",
};

/** Category pills for the shop filter rail (derived from catalog products). */
export function deriveCategories(products: CatalogProduct[]): Category[] {
  const counts = new Map<ProductCategory, number>();
  for (const p of products) {
    counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
  }
  return (["physical", "digital", "curriculum"] as const)
    .filter((id) => (counts.get(id) ?? 0) > 0)
    .map((id) => ({
      id,
      label: CATEGORY_LABELS[id],
      productCount: counts.get(id) ?? 0,
    }));
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
    }));
  }

  return fallback.map((p) => ({
    ...p,
    slug: String(p.id),
    galleryImages: [],
  }));
}
