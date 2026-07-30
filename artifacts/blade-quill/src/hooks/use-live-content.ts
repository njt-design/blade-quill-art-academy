import { useCallback, useEffect, useRef, useState } from "react";
import {
  loadBlogPosts,
  sortBlogPosts,
  toBlogPostMeta,
  type BlogPostMeta,
} from "@/lib/blog-posts";
import { useLiveRefresh } from "@/hooks/use-live-refresh";
import { hasTinaSession } from "@/lib/tina-auth";
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
 * behavior — then refresh from the Tina Cloud content API so CMS saves
 * show up in seconds instead of waiting for a rebuild.
 *
 * Connections are paginated so catalogs of 30–100+ products stay within Tina
 * page limits without truncating the shop.
 *
 * Refetches on tab focus / visibility, and polls while a Tina session is
 * present (same pattern as use-live-tina.ts).
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
          amazonUrl
          googlePlayUrl
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
    const data: Record<string, ConnectionData | undefined> | null =
      await fetchTinaData<Record<string, ConnectionData | undefined>>(query, {
        first: PAGE_SIZE,
        after,
      });
    if (!data) return nodes.length > 0 ? nodes : null;

    const connection: ConnectionData | undefined = data[connectionKey];
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
 * Editors with a Tina session bypass the cache so saves aren't held back.
 */
const CACHE_TTL_MS = 10_000;
const cache = new Map<string, { at: number; promise: Promise<unknown> }>();

function cachedFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  bypassCache: boolean
): Promise<T> {
  if (!bypassCache) {
    const hit = cache.get(key);
    if (hit && Date.now() - hit.at < CACHE_TTL_MS) {
      return hit.promise as Promise<T>;
    }
  }
  const promise = fetcher();
  cache.set(key, { at: Date.now(), promise });
  return promise;
}

/** Drop a list cache entry so the next refresh hits Tina Cloud. */
export function invalidateLiveContentCache(key?: string): void {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
}

function useLiveList<T>(
  key: string,
  seed: () => T[],
  fetchLive: () => Promise<T[] | null>
): T[] {
  const [items, setItems] = useState<T[]>(seed);
  const liveEnabled = isLiveContentEnabled() && !isInTinaEditor();
  const fetchLiveRef = useRef(fetchLive);
  fetchLiveRef.current = fetchLive;
  const requestId = useRef(0);

  const refresh = useCallback(() => {
    if (!isLiveContentEnabled() || isInTinaEditor()) return;
    const bypass = hasTinaSession();
    if (bypass) invalidateLiveContentCache(key);
    const id = ++requestId.current;
    cachedFetch(key, () => fetchLiveRef.current(), bypass).then((live) => {
      if (id !== requestId.current) return;
      if (live && live.length > 0) setItems(live);
    });
  }, [key]);

  useEffect(() => {
    if (!liveEnabled) return;
    refresh();
  }, [liveEnabled, refresh]);

  useLiveRefresh(refresh, liveEnabled);

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
