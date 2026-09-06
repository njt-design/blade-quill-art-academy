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

export type ProductPurchaseOption = {
  name: string;
  meta: string;
};

export type ProductTrustBullet = {
  label: string;
};

export type ProductDetailRow = {
  label: string;
  value: string;
};

export type ProductReview = {
  name: string;
  date: string;
  body: string;
  stars: number;
};

export type ProductPageCopy = {
  eyebrow?: string;
  coverSubtitle?: string;
  fullDescription?: string | RichTextValue;
  shippingNote?: string | RichTextValue;
  supportEmail?: string;
  paperbackLabel?: string;
  ebookLabel?: string;
  ebookStoresLabel?: string;
  addToCartLabel?: string;
  buyNowLabel?: string;
  gumroadButtonLabel?: string;
  amazonButtonLabel?: string;
  googlePlayButtonLabel?: string;
};

export type ProductPurchaseOptions = {
  groupLabel?: string;
  options: ProductPurchaseOption[];
};

export type ProductDetails = {
  format?: string;
  studio?: string;
  rows: ProductDetailRow[];
};

export type ProductReviews = {
  rating?: number;
  countLabel?: string;
  items: ProductReview[];
};

export type ProductTabs = {
  descriptionLabel?: string;
  insideLabel?: string;
  reviewsLabel?: string;
  shippingLabel?: string;
  showInside?: boolean;
  showReviews?: boolean;
  showShipping?: boolean;
};

export type ProductRelated = {
  eyebrow?: string;
  heading?: string;
  show?: boolean;
};

export type CatalogProduct = Omit<Product, "description"> & {
  slug: string;
  description: string | RichTextValue;
  amazonUrl?: string | null;
  googlePlayUrl?: string | null;
  /** Extra images for the thumbnail strip (slot 1 is always Cover Image). */
  galleryImages: ProductGalleryImage[];
  /** Look Inside tab images (book spreads or digital previews). */
  spreadImages: ProductGalleryImage[];
  pageCopy?: ProductPageCopy;
  purchaseOptions?: ProductPurchaseOptions;
  trustBullets?: ProductTrustBullet[];
  details?: ProductDetails;
  reviews?: ProductReviews;
  tabs?: ProductTabs;
  related?: ProductRelated;
};

const GALLERY_IMAGE_LIMIT = 8;
const SPREAD_IMAGE_LIMIT = 12;

function parseGalleryImages(
  raw: unknown,
  limit = GALLERY_IMAGE_LIMIT,
  includeEmpty = false
): ProductGalleryImage[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const src = String((item as { src?: unknown }).src ?? "").trim();
      const alt = String((item as { alt?: unknown }).alt ?? "").trim();
      if (!src && !includeEmpty) return null;
      return { src, ...(alt ? { alt } : {}) };
    })
    .filter((item): item is ProductGalleryImage => item !== null)
    .slice(0, limit);
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function optionalString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed || undefined;
}

function parsePurchaseOptions(
  raw: unknown
): ProductPurchaseOptions | undefined {
  const obj = asRecord(raw);
  if (!obj) return undefined;
  const options = Array.isArray(obj.options)
    ? obj.options
        .map((item) => {
          const row = asRecord(item);
          if (!row) return null;
          const name = optionalString(row.name);
          if (!name) return null;
          return { name, meta: optionalString(row.meta) ?? "" };
        })
        .filter((item): item is ProductPurchaseOption => item !== null)
    : [];
  return {
    groupLabel: optionalString(obj.groupLabel),
    options,
  };
}

function parseTrustBullets(raw: unknown): ProductTrustBullet[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  return raw
    .map((item) => {
      const row = asRecord(item);
      const label = optionalString(row?.label);
      return label ? { label } : null;
    })
    .filter((item): item is ProductTrustBullet => item !== null);
}

function parseDetails(raw: unknown): ProductDetails | undefined {
  const obj = asRecord(raw);
  if (!obj) return undefined;
  const rows = Array.isArray(obj.rows)
    ? obj.rows
        .map((item) => {
          const row = asRecord(item);
          const label = optionalString(row?.label);
          const value = optionalString(row?.value);
          return label && value ? { label, value } : null;
        })
        .filter((item): item is ProductDetailRow => item !== null)
    : [];
  return {
    format: optionalString(obj.format),
    studio: optionalString(obj.studio),
    rows,
  };
}

function parseReviews(raw: unknown): ProductReviews | undefined {
  const obj = asRecord(raw);
  if (!obj) return undefined;
  const items = Array.isArray(obj.items)
    ? obj.items
        .map((item) => {
          const row = asRecord(item);
          const name = optionalString(row?.name);
          if (!name) return null;
          const stars = Number(row?.stars);
          return {
            name,
            date: optionalString(row?.date) ?? "",
            body: optionalString(row?.body) ?? "",
            stars: Number.isFinite(stars) && stars > 0 ? Math.min(5, stars) : 5,
          };
        })
        .filter((item): item is ProductReview => item !== null)
    : [];
  const rating = Number(obj.rating);
  return {
    rating: Number.isFinite(rating) ? rating : undefined,
    countLabel: optionalString(obj.countLabel),
    items,
  };
}

function parseTabs(raw: unknown): ProductTabs | undefined {
  const obj = asRecord(raw);
  if (!obj) return undefined;
  return {
    descriptionLabel: optionalString(obj.descriptionLabel),
    insideLabel: optionalString(obj.insideLabel),
    reviewsLabel: optionalString(obj.reviewsLabel),
    shippingLabel: optionalString(obj.shippingLabel),
    showInside: obj.showInside !== false,
    showReviews: obj.showReviews !== false,
    showShipping: obj.showShipping !== false,
  };
}

function parseRelated(raw: unknown): ProductRelated | undefined {
  const obj = asRecord(raw);
  if (!obj) return undefined;
  return {
    eyebrow: optionalString(obj.eyebrow),
    heading: optionalString(obj.heading),
    show: obj.show !== false,
  };
}

function parsePageCopy(raw: unknown): ProductPageCopy | undefined {
  const obj = asRecord(raw);
  if (!obj) return undefined;
  return {
    eyebrow: optionalString(obj.eyebrow),
    coverSubtitle: optionalString(obj.coverSubtitle),
    fullDescription: isRichText(obj.fullDescription)
      ? obj.fullDescription
      : optionalString(obj.fullDescription),
    shippingNote: isRichText(obj.shippingNote)
      ? obj.shippingNote
      : optionalString(obj.shippingNote),
    supportEmail: optionalString(obj.supportEmail),
    paperbackLabel: optionalString(obj.paperbackLabel),
    ebookLabel: optionalString(obj.ebookLabel),
    ebookStoresLabel: optionalString(obj.ebookStoresLabel),
    addToCartLabel: optionalString(obj.addToCartLabel),
    buyNowLabel: optionalString(obj.buyNowLabel),
    gumroadButtonLabel: optionalString(obj.gumroadButtonLabel),
    amazonButtonLabel: optionalString(obj.amazonButtonLabel),
    googlePlayButtonLabel: optionalString(obj.googlePlayButtonLabel),
  };
}

/**
 * Cover image first, then extra gallery uploads.
 * Pass `includeEmpty` in the Tina editor so blank slots stay clickable.
 */
export function resolveProductThumbnails(
  product: {
    imageUrl?: string | null;
    galleryImages?: ProductGalleryImage[] | null;
    name?: string | null;
  },
  options?: { includeEmpty?: boolean }
): Array<ProductGalleryImage | null> {
  const includeEmpty = options?.includeEmpty !== false;
  const gallery = product.galleryImages ?? [];
  const slots: Array<ProductGalleryImage | null> = [];

  if (product.imageUrl || includeEmpty) {
    slots.push(
      product.imageUrl
        ? { src: product.imageUrl, alt: product.name ?? undefined }
        : null
    );
  }

  gallery.slice(0, GALLERY_IMAGE_LIMIT).forEach((img) => {
    slots.push({ src: img.src, alt: img.alt });
  });

  return includeEmpty ? slots : slots.filter((slot) => Boolean(slot?.src));
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
    galleryImages: parseGalleryImages(data.galleryImages, GALLERY_IMAGE_LIMIT, true),
    spreadImages: parseGalleryImages(
      data.spreadImages,
      SPREAD_IMAGE_LIMIT,
      true
    ),
    pageCopy: parsePageCopy(data.pageCopy),
    purchaseOptions: parsePurchaseOptions(data.purchaseOptions),
    trustBullets: parseTrustBullets(data.trustBullets),
    details: parseDetails(data.details),
    reviews: parseReviews(data.reviews),
    tabs: parseTabs(data.tabs),
    related: parseRelated(data.related),
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

/** Raw gallery/spread rows from a Tina document, including empty uploads. */
export function rawProductImages(
  doc: Record<string, unknown> | null | undefined,
  field: "galleryImages" | "spreadImages"
): ProductGalleryImage[] {
  if (!doc) return [];
  return parseGalleryImages(
    doc[field],
    field === "spreadImages" ? SPREAD_IMAGE_LIMIT : GALLERY_IMAGE_LIMIT,
    true
  );
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
