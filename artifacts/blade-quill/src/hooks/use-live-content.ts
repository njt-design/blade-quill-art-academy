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
 */

interface ConnectionData {
  edges?: Array<{
    node?: { _sys?: { filename?: string } } & Record<string, unknown>;
  } | null> | null;
}

const POSTS_QUERY = `
  query liveBlogPosts {
    postConnection(first: 100) {
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

const PRODUCTS_QUERY = `
  query liveProducts {
    shopProductConnection(first: 100) {
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

function connectionNodes(
  connection: ConnectionData | undefined
): Array<{ slug: string; data: Record<string, unknown> }> {
  return (connection?.edges ?? [])
    .map((edge) => edge?.node)
    .filter((node): node is NonNullable<typeof node> => Boolean(node))
    .map((node) => ({ slug: node._sys?.filename ?? "", data: node }));
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

function useLiveList<T>(key: string, seed: () => T[], fetchLive: () => Promise<T[] | null>): T[] {
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
    const data = await fetchTinaData<{ postConnection?: ConnectionData }>(
      POSTS_QUERY
    );
    if (!data) return null;
    return sortBlogPosts(
      connectionNodes(data.postConnection)
        .filter((n) => n.slug)
        .map((n) => toBlogPostMeta(n.slug, n.data))
    );
  });
}

/** Shop products, newest first — bundled seed refreshed from Tina Cloud. */
export function useLiveProducts(): CatalogProduct[] {
  return useLiveList("products", loadCatalogProducts, async () => {
    const data = await fetchTinaData<{
      shopProductConnection?: ConnectionData;
    }>(PRODUCTS_QUERY);
    if (!data) return null;
    return sortCatalogProducts(
      connectionNodes(data.shopProductConnection)
        .map((n) => toCatalogProduct(n.slug, n.data))
        .filter((p): p is CatalogProduct => p !== null)
    );
  });
}
