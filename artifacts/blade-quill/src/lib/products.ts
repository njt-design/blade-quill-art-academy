import type { Category, Product, ProductCategory } from "@workspace/api-client-react";

const productModules = import.meta.glob("../../content/products/*.json", {
  eager: true,
}) as Record<
  string,
  { default?: Record<string, unknown> } & Record<string, unknown>
>;

export type CatalogProduct = Product & { slug: string };

function parseProduct(
  path: string,
  mod: { default?: Record<string, unknown> } & Record<string, unknown>
): CatalogProduct | null {
  const data = (mod.default ?? mod) as Record<string, unknown>;
  const slug = path.split("/").pop()?.replace(/\.json$/i, "") ?? "";
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
    description: (data.description as string) ?? "",
    price,
    category,
    imageUrl: image,
    gumroadUrl: (data.gumroadUrl as string | null) ?? null,
    downloadUrl: (data.downloadUrl as string | null) ?? null,
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

/** Products authored in Tina (`content/products/*.json`). */
export function loadCatalogProducts(): CatalogProduct[] {
  return Object.entries(productModules)
    .map(([path, mod]) => parseProduct(path, mod))
    .filter((p): p is CatalogProduct => p !== null)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export function getCatalogProduct(
  slugOrId: string
): CatalogProduct | undefined {
  const products = loadCatalogProducts();
  const bySlug = products.find((p) => p.slug === slugOrId);
  if (bySlug) return bySlug;

  const id = Number(slugOrId);
  if (!Number.isNaN(id)) {
    return products.find((p) => p.id === id);
  }
  return undefined;
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
  fallback: Product[]
): CatalogProduct[] {
  const catalog = loadCatalogProducts();
  if (catalog.length > 0) return catalog;

  const api = Array.isArray(apiProducts) ? apiProducts : [];
  if (api.length > 0) {
    return api.map((p) => ({
      ...p,
      slug: String(p.id),
    }));
  }

  return fallback.map((p) => ({
    ...p,
    slug: String(p.id),
  }));
}
