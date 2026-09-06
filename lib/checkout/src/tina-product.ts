import type { CheckoutProduct, DownloadFile, ProductCategory } from "./types";

const TINA_API_VERSION = "2.4";
const PAGE_SIZE = 50;
/** Hard ceiling so a runaway cursor loop cannot burn the function. */
const MAX_PAGES = 20; // 50 * 20 = 1,000 products
/** Warm-instance cache so repeat checkouts don't re-hit Tina every time. */
const CACHE_TTL_MS = 30_000;

const PRODUCT_FIELDS = `
  _sys { filename }
  productId
  name
  description
  price
  category
  image
  gumroadUrl
  downloadUrl
  downloadFiles {
    label
    file
  }
  inStock
`;

const PRODUCT_BY_PATH_QUERY = `
  query checkoutShopProductByPath($relativePath: String!) {
    shopProduct(relativePath: $relativePath) {
      ${PRODUCT_FIELDS}
    }
  }
`;

const PRODUCT_BY_ID_QUERY = `
  query checkoutShopProductById($productId: Float!) {
    shopProductConnection(
      first: 5
      filter: { productId: { eq: $productId } }
    ) {
      edges {
        node {
          ${PRODUCT_FIELDS}
        }
      }
    }
  }
`;

const PRODUCTS_PAGE_QUERY = `
  query checkoutShopProductsPage($first: Float!, $after: String) {
    shopProductConnection(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          ${PRODUCT_FIELDS}
        }
      }
    }
  }
`;

interface TinaNode {
  _sys?: { filename?: string };
  productId?: number | null;
  name?: string | null;
  description?: unknown;
  price?: number | null;
  category?: string | null;
  image?: string | null;
  gumroadUrl?: string | null;
  downloadUrl?: string | null;
  downloadFiles?: Array<{
    label?: string | null;
    file?: string | null;
  } | null> | null;
  inStock?: boolean | null;
}

interface TinaCredentials {
  contentApiUrl: string;
  token: string;
}

const productCache = new Map<
  string,
  { at: number; product: CheckoutProduct | null }
>();

function richTextToPlain(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (!value || typeof value !== "object") return "";
  const parts: string[] = [];
  const walk = (node: unknown) => {
    if (!node || typeof node !== "object") return;
    const n = node as Record<string, unknown>;
    if (typeof n.text === "string") parts.push(n.text);
    if (Array.isArray(n.children)) n.children.forEach(walk);
  };
  walk(value);
  return parts.join(" ").replace(/\s+/g, " ").trim();
}

function asCategory(raw: unknown): ProductCategory {
  if (
    raw === "physical" ||
    raw === "digital" ||
    raw === "curriculum" ||
    raw === "bundle"
  ) {
    return raw;
  }
  return "digital";
}

function fileLabelFromPath(path: string): string {
  const base = path.split("/").pop() ?? path;
  return base.replace(/\.[a-z0-9]{1,5}$/i, "").replace(/[-_]+/g, " ").trim() || base;
}

function toDownloadFiles(node: TinaNode): DownloadFile[] {
  const out: DownloadFile[] = [];
  for (const item of node.downloadFiles ?? []) {
    const path = item?.file?.trim();
    if (!path) continue;
    const label = item?.label?.trim() || fileLabelFromPath(path);
    out.push({ label, path });
  }
  return out;
}

function absoluteUrl(baseUrl: string, maybeRelative: string | null): string | null {
  if (!maybeRelative) return null;
  if (/^https?:\/\//i.test(maybeRelative)) return maybeRelative;
  if (maybeRelative.startsWith("//")) return `https:${maybeRelative}`;
  const base = baseUrl.replace(/\/$/, "");
  return maybeRelative.startsWith("/")
    ? `${base}${maybeRelative}`
    : `${base}/${maybeRelative}`;
}

function toProduct(node: TinaNode, baseUrl: string): CheckoutProduct | null {
  const productId = Number(node.productId);
  if (!Number.isFinite(productId) || productId <= 0) return null;
  const name = (node.name ?? "").trim();
  const price = Number(node.price);
  if (!name || !Number.isFinite(price) || price < 0) return null;
  const slug =
    node._sys?.filename?.replace(/\.json$/i, "") ?? String(productId);
  const description = richTextToPlain(node.description) || name;
  return {
    productId,
    slug,
    name,
    description: description.slice(0, 500),
    price,
    category: asCategory(node.category),
    imageUrl: absoluteUrl(baseUrl, node.image ?? null),
    gumroadUrl: node.gumroadUrl?.trim() || null,
    downloadUrl: node.downloadUrl?.trim() || null,
    files: toDownloadFiles(node),
    inStock: node.inStock !== false,
  };
}

function getTinaCredentials(): TinaCredentials | null {
  const clientId = (
    process.env.TINA_PUBLIC_CLIENT_ID ??
    process.env.NEXT_PUBLIC_TINA_CLIENT_ID ??
    ""
  )
    .replace(/\\n/g, "")
    .trim();
  const token = (process.env.TINA_TOKEN ?? process.env.TINA_PUBLIC_READONLY_TOKEN ?? "")
    .replace(/\\n/g, "")
    .trim();
  const branch = (process.env.TINA_BRANCH ?? "main").replace(/\\n/g, "").trim();
  if (!clientId || !token) {
    console.error("Tina credentials missing for checkout product lookup");
    return null;
  }
  return {
    token,
    contentApiUrl: `https://content.tinajs.io/${TINA_API_VERSION}/content/${clientId}/github/${branch}`,
  };
}

async function tinaGraphql<T>(
  creds: TinaCredentials,
  query: string,
  variables: Record<string, unknown>
): Promise<T | null> {
  try {
    const res = await fetch(creds.contentApiUrl, {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": creds.token,
      },
      body: JSON.stringify({ query, variables }),
    });
    if (!res.ok) {
      console.error("Tina GraphQL failed:", res.status, await res.text());
      return null;
    }
    const json = (await res.json()) as { data?: T; errors?: unknown[] };
    if (Array.isArray(json.errors) && json.errors.length > 0) {
      console.error("Tina GraphQL errors:", json.errors);
      return null;
    }
    return json.data ?? null;
  } catch (err) {
    console.error("Tina GraphQL error:", err);
    return null;
  }
}

function normalizeSlug(slug: string | undefined): string | null {
  if (!slug || typeof slug !== "string") return null;
  const trimmed = slug.trim().replace(/^\/+/, "").replace(/\.json$/i, "");
  if (!trimmed || trimmed.includes("..") || trimmed.includes("/")) return null;
  return trimmed;
}

async function findBySlug(
  creds: TinaCredentials,
  slug: string,
  baseUrl: string
): Promise<CheckoutProduct | null> {
  const data = await tinaGraphql<{ shopProduct?: TinaNode | null }>(
    creds,
    PRODUCT_BY_PATH_QUERY,
    { relativePath: `${slug}.json` }
  );
  if (!data?.shopProduct) return null;
  return toProduct(data.shopProduct, baseUrl);
}

async function findByProductIdFilter(
  creds: TinaCredentials,
  productId: number,
  baseUrl: string
): Promise<CheckoutProduct | null> {
  const data = await tinaGraphql<{
    shopProductConnection?: {
      edges?: Array<{ node?: TinaNode | null } | null> | null;
    };
  }>(creds, PRODUCT_BY_ID_QUERY, { productId });
  const edges = data?.shopProductConnection?.edges ?? [];
  for (const edge of edges) {
    const product = edge?.node ? toProduct(edge.node, baseUrl) : null;
    if (product && product.productId === productId) return product;
  }
  return null;
}

type ProductsPageData = {
  shopProductConnection?: {
    pageInfo?: { hasNextPage?: boolean; endCursor?: string | null };
    edges?: Array<{ node?: TinaNode | null } | null> | null;
  };
};

/** Paginated scan — used only if filter/path lookups miss (older Tina indexes). */
async function findByPaginatedScan(
  creds: TinaCredentials,
  productId: number,
  baseUrl: string
): Promise<CheckoutProduct | null> {
  let after: string | null = null;
  for (let page = 0; page < MAX_PAGES; page++) {
    const data: ProductsPageData | null = await tinaGraphql<ProductsPageData>(
      creds,
      PRODUCTS_PAGE_QUERY,
      {
        first: PAGE_SIZE,
        after,
      }
    );
    const connection: ProductsPageData["shopProductConnection"] =
      data?.shopProductConnection;
    const edges = connection?.edges ?? [];
    for (const edge of edges) {
      const product = edge?.node ? toProduct(edge.node, baseUrl) : null;
      if (product && product.productId === productId) return product;
    }
    if (!connection?.pageInfo?.hasNextPage || !connection.pageInfo.endCursor) {
      break;
    }
    after = connection.pageInfo.endCursor;
  }
  return null;
}

function cacheGet(key: string): CheckoutProduct | null | undefined {
  const hit = productCache.get(key);
  if (!hit) return undefined;
  if (Date.now() - hit.at > CACHE_TTL_MS) {
    productCache.delete(key);
    return undefined;
  }
  return hit.product;
}

function cacheSet(key: string, product: CheckoutProduct | null): void {
  productCache.set(key, { at: Date.now(), product });
}

/**
 * Resolve one product for checkout without loading the full catalog.
 * Order: optional slug path → productId filter → paginated scan fallback.
 */
export async function findTinaProductById(
  productId: number,
  baseUrl: string,
  productSlug?: string
): Promise<CheckoutProduct | null> {
  const cacheKey = `id:${productId}`;
  const cached = cacheGet(cacheKey);
  if (cached !== undefined) return cached;

  const creds = getTinaCredentials();
  if (!creds) return null;

  const slug = normalizeSlug(productSlug);
  if (slug) {
    const byPath = await findBySlug(creds, slug, baseUrl);
    if (byPath && byPath.productId === productId) {
      cacheSet(cacheKey, byPath);
      return byPath;
    }
    // Slug was provided but mismatched / missing — still try id filter.
  }

  const byFilter = await findByProductIdFilter(creds, productId, baseUrl);
  if (byFilter) {
    cacheSet(cacheKey, byFilter);
    return byFilter;
  }

  const byScan = await findByPaginatedScan(creds, productId, baseUrl);
  cacheSet(cacheKey, byScan);
  return byScan;
}
