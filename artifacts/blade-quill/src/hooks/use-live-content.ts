import { useEffect, useState } from "react";
import {
  loadBlogPosts,
  sortBlogPosts,
  toBlogPostMeta,
  type BlogPostMeta,
} from "@/lib/blog-posts";
import {
  loadCatalogProducts,
  sortCatalogProducts,
  toCatalogProduct,
  type CatalogProduct,
} from "@/lib/products";
import {
  fetchTinaData,
  isInTinaEditor,
  isLiveContentEnabled,
} from "@/lib/tina-live";

/**
 * Live (runtime-fetched) blog and product lists. These seed from the JSON
 * bundled at build time — so first paint is instant and identical to the old
 * behavior — then refresh once from the Tina Cloud content API so CMS saves
 * show up in seconds instead of waiting for a rebuild.
 *
 * Connections are paginated so catalogs of 30–100+ products stay within Tina
 * page limits without truncating the shop.
 */

interface PageInfo {
  hasNextPage?: boolean;
  endCursor?: string | null;
}

interface ConnectionData {
  pageInfo?: PageInfo;
  edges?: Array<{
    node?: { _sys?: { filename?: string } } & Record<string, unknown>;
  } | null> | null;
}

const PAGE_SIZE = 50;
/** Safety ceiling: 50 * 20 = 1,000 documents. */
const MAX_PAGES = 20;

const POSTS_PAGE_QUERY = `
  query liveBlogPostsPage($first: Float!, $after: String) {
    postConnection(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          _sys { filename }
          title
          excerpt
          coverImage
          publishedAt
          tags
        }
      }
    }
  }
`;

const PRODUCTS_PAGE_QUERY = `
  query liveProductsPage($first: Float!, $after: String) {
    shopProductConnection(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          _sys { filename }
          productId
          name
          description
          price
          category
          image
          gumroadUrl
          downloadUrl
          featured
          inStock
          createdAt
        }
      }
    }
  }
`;

function filenameToSlug(filename: string | undefined): string {
  if (!filename) return "";
  return filename.replace(/\.json$/i, "");
}

function connectionNodes(
  connection: ConnectionData | undefined
): Array<{ slug: string; data: Record<string, unknown> }> {
  return (connection?.edges ?? [])
    .map((edge) => edge?.node)
    .filter((node): node is NonNullable<typeof node> => Boolean(node))
    .map((node) => ({
      slug: filenameToSlug(node._sys?.filename),
      data: node,
    }));
}

async function fetchAllConnectionPages(
  query: string,
  connectionKey: "postConnection" | "shopProductConnection"
): Promise<Array<{ slug: string; data: Record<string, unknown> }> | null> {
  const nodes: Array<{ slug: string; data: Record<string, unknown> }> = [];
  let after: string | null = null;

  for (let page = 0; page < MAX_PAGES; page++) {
    const data = await fetchTinaData<Record<string, ConnectionData | undefined>>(
      query,
      { first: PAGE_SIZE, after }
    );
    if (!data) return nodes.length > 0 ? nodes : null;

    const connection = data[connectionKey];
    nodes.push(...connectionNodes(connection));

    if (!connection?.pageInfo?.hasNextPage || !connection.pageInfo.endCursor) {
      break;
    }
    after = connection.pageInfo.endCursor;
  }

  return nodes;
}

/**
 * Several blocks on one page consume the same list (e.g. homepage product
 * strips), so live fetches are deduped through a short-lived shared cache.
 */
const CACHE_TTL_MS = 10_000;
const cache = new Map<string, { at: number; promise: Promise<unknown> }>();

function cachedFetch<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) {
    return hit.promise as Promise<T>;
  }
  const promise = fetcher();
  cache.set(key, { at: Date.now(), promise });
  return promise;
}

function useLiveList<T>(
  key: string,
  seed: () => T[],
  fetchLive: () => Promise<T[] | null>
): T[] {
  const [items, setItems] = useState<T[]>(seed);

  useEffect(() => {
    if (!isLiveContentEnabled() || isInTinaEditor()) return;
    let cancelled = false;
    cachedFetch(key, fetchLive).then((live) => {
      if (!cancelled && live && live.length > 0) setItems(live);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return items;
}

/** Blog posts, newest first — bundled seed refreshed from Tina Cloud. */
export function useLiveBlogPosts(): BlogPostMeta[] {
  return useLiveList("posts", loadBlogPosts, async () => {
    const nodes = await fetchAllConnectionPages(
      POSTS_PAGE_QUERY,
      "postConnection"
    );
    if (!nodes) return null;
    return sortBlogPosts(
      nodes.filter((n) => n.slug).map((n) => toBlogPostMeta(n.slug, n.data))
    );
  });
}

/** Shop products, newest first — bundled seed refreshed from Tina Cloud. */
export function useLiveProducts(): CatalogProduct[] {
  return useLiveList("products", loadCatalogProducts, async () => {
    const nodes = await fetchAllConnectionPages(
      PRODUCTS_PAGE_QUERY,
      "shopProductConnection"
    );
    if (!nodes) return null;
    return sortCatalogProducts(
      nodes
        .map((n) => toCatalogProduct(n.slug, n.data))
        .filter((p): p is CatalogProduct => p !== null)
    );
  });
}
