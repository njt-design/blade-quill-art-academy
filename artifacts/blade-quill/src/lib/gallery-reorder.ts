/**
 * Drag-to-reorder support for the Art Gallery Grid.
 *
 * The gallery order is the `artworks` array on the Gallery page document
 * (content/pages/gallery.json). Reordering rewrites that document through
 * Tina's `updatePage` GraphQL mutation:
 *
 * - Dev: the local `tinacms dev` server at /graphql (no auth) writes the
 *   JSON file to disk, so the new order is immediately the source of truth.
 * - Prod: the Tina Cloud content API (via the same-origin /api/tina proxy)
 *   with the signed-in admin's JWT — the same way the Tina admin saves.
 *
 * Because `updatePage` replaces the whole document, we first fetch the
 * document's raw `_values` and round-trip everything except the artwork
 * order. That also guarantees we reorder the *current* CMS list, not a
 * possibly stale bundled copy.
 */

import { getTinaIdToken, hasTinaSession } from "@/lib/tina-auth";
import {
  isInTinaEditor,
  tinaGraphqlEndpoint,
  tinaReadHeaders,
} from "@/lib/tina-live";
import {
  GALLERY_GRID_LIST_FIELD,
  isGalleryGridBlock,
  rawGalleryItems,
} from "@/lib/gallery";

const GALLERY_RELATIVE_PATH = "gallery.json";

/**
 * True when the current visitor may rearrange the gallery from the site.
 * Hidden inside the Tina visual editor (the sidebar list handles order
 * there, and a GraphQL save would fight the open form).
 */
export function canReorderGallery(): boolean {
  if (isInTinaEditor()) return false;
  if (import.meta.env.DEV) return true;
  return hasTinaSession();
}

async function tinaGraphql<T>(
  query: string,
  variables: Record<string, unknown>,
  headers: Record<string, string>
): Promise<T> {
  const res = await fetch(tinaGraphqlEndpoint(), {
    method: "POST",
    cache: "no-store",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) {
    throw new Error(`Content API error (HTTP ${res.status})`);
  }
  const json = (await res.json()) as {
    data?: T;
    errors?: Array<{ message?: string }>;
  };
  if (Array.isArray(json.errors) && json.errors.length > 0) {
    throw new Error(json.errors[0]?.message || "Content API returned errors");
  }
  if (!json.data) throw new Error("Content API returned no data");
  return json.data;
}

export interface GalleryReorderDoc {
  /** Raw document values (`_values`) — round-tripped on save. */
  values: Record<string, unknown>;
  /** The artworks list from the Art Gallery Grid section, in current order. */
  artworks: Record<string, unknown>[];
}

/** Load the Gallery page document and its current artwork order. */
export async function fetchGalleryReorderDoc(): Promise<GalleryReorderDoc> {
  const data = await tinaGraphql<{
    page?: { _values?: unknown } | null;
  }>(
    `query galleryDocValues($relativePath: String!) {
      page(relativePath: $relativePath) { _values }
    }`,
    { relativePath: GALLERY_RELATIVE_PATH },
    tinaReadHeaders()
  );
  const values = data.page?._values;
  if (!values || typeof values !== "object") {
    throw new Error("Couldn't load the gallery page document.");
  }
  const doc = values as Record<string, unknown>;
  const blocks = Array.isArray(doc.blocks) ? doc.blocks : [];
  const grid = blocks.find(isGalleryGridBlock);
  const artworks = grid ? rawGalleryItems(grid[GALLERY_GRID_LIST_FIELD]) : [];
  if (artworks.length === 0) {
    throw new Error("The gallery page has no artworks to rearrange.");
  }
  return { values: doc, artworks };
}

/** Wrap a raw block as Tina's mutation input: `{ [template]: fields }`. */
function blockToMutationInput(
  block: Record<string, unknown>
): Record<string, unknown> {
  const template = block._template;
  if (typeof template !== "string" || !template) {
    throw new Error("Gallery page contains a section that can't be saved.");
  }
  const fields: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(block)) {
    if (key === "_template" || key === "__typename") continue;
    fields[key] = value;
  }
  return { [template]: fields };
}

/** Top-level fields accepted by the `PageMutation` input. */
const PAGE_MUTATION_PASSTHROUGH = ["title", "layout", "seoAssistant", "seo"];

/**
 * Persist a new artwork order.
 * @param doc the document loaded via `fetchGalleryReorderDoc`
 * @param order original artwork indices in their new sequence
 */
export async function saveGalleryOrder(
  doc: GalleryReorderDoc,
  order: number[]
): Promise<void> {
  const reordered = order.map((i) => doc.artworks[i]);
  if (
    reordered.length !== doc.artworks.length ||
    reordered.some((item) => !item)
  ) {
    throw new Error("The gallery changed while rearranging — please retry.");
  }

  const rawBlocks = Array.isArray(doc.values.blocks) ? doc.values.blocks : [];
  const blocks = rawBlocks.map((raw) => {
    if (!raw || typeof raw !== "object") {
      throw new Error("Gallery page contains a section that can't be saved.");
    }
    const block = raw as Record<string, unknown>;
    const withOrder = isGalleryGridBlock(block)
      ? { ...block, [GALLERY_GRID_LIST_FIELD]: reordered }
      : block;
    return blockToMutationInput(withOrder);
  });

  const params: Record<string, unknown> = { blocks };
  for (const key of PAGE_MUTATION_PASSTHROUGH) {
    if (doc.values[key] !== undefined) params[key] = doc.values[key];
  }

  const headers: Record<string, string> = {};
  if (!import.meta.env.DEV) {
    const token = getTinaIdToken();
    if (!token) {
      throw new Error("Sign in to the site admin to save the gallery order.");
    }
    headers.Authorization = `Bearer ${token}`;
  }

  await tinaGraphql(
    `mutation reorderGalleryArtworks(
      $relativePath: String!
      $params: PageMutation!
    ) {
      updatePage(relativePath: $relativePath, params: $params) {
        __typename
      }
    }`,
    { relativePath: GALLERY_RELATIVE_PATH, params },
    headers
  );
}
