/**
 * Drag-to-reorder support for CMS-owned grids (gallery artwork, downloads).
 *
 * Each grid's order is an array on a Tina page document (e.g. the `artworks`
 * list on content/pages/gallery.json). Reordering rewrites that document
 * through Tina's `updatePage` GraphQL mutation:
 *
 * - Dev: the local `tinacms dev` server at /graphql (no auth) writes the
 *   JSON file to disk, so the new order is immediately the source of truth.
 * - Prod: the Tina Cloud content API (via the same-origin /api/tina proxy)
 *   with the signed-in admin's JWT — the same way the Tina admin saves.
 *
 * Because `updatePage` replaces the whole document, we first fetch the
 * document's raw `_values` and round-trip everything except the list order.
 * That also guarantees we reorder the *current* CMS list, not a possibly
 * stale bundled copy.
 */

import { getTinaIdToken, hasTinaSession } from "@/lib/tina-auth";
import {
  isInTinaEditor,
  tinaGraphqlEndpoint,
  tinaReadHeaders,
} from "@/lib/tina-live";

/** Describes where a grid's ordered list lives in Tina. */
export interface GridReorderConfig {
  /** Page document under content/pages, e.g. "gallery.json". */
  relativePath: string;
  /** Name of the ordered list field on the grid section, e.g. "artworks". */
  listField: string;
  /** True for the grid section block that owns the list. */
  isGridBlock: (block: unknown) => block is Record<string, unknown>;
  /**
   * Index of the grid block in the document's `blocks` array. Required when
   * the same section type can appear more than once on a page (e.g. Image
   * Masonry) so only that one instance is reordered; without it the first
   * block matching `isGridBlock` is used (gallery/downloads singletons).
   */
  blockIndex?: number;
}

/** True when the page was opened with `?rearrange` (e.g. from the editor). */
export function hasRearrangeParam(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return new URLSearchParams(window.location.search).has("rearrange");
  } catch {
    return false;
  }
}

/**
 * Value of the `?rearrange` param (empty string when bare), or null when
 * absent. Lets pages with several reorderable grids auto-enter only the one
 * the editor asked for (see `openRearrangePage(target)`).
 */
export function rearrangeParamValue(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return new URLSearchParams(window.location.search).get("rearrange");
  } catch {
    return null;
  }
}

/**
 * True when the current visitor may rearrange grids from the site:
 * signed-in admins (Tina session in localStorage), local dev, or an explicit
 * `?rearrange` URL — a discoverable escape hatch; actually saving still
 * requires a valid admin session because Tina Cloud enforces auth
 * server-side. Hidden inside the Tina visual editor (the sidebar list
 * handles order there, and a GraphQL save would fight the open form).
 */
export function canRearrangeGrids(): boolean {
  if (typeof window === "undefined") return false;
  if (isInTinaEditor()) return false;
  if (import.meta.env.DEV) return true;
  if (hasRearrangeParam()) return true;
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

function rawListItems(items: unknown): Record<string, unknown>[] {
  if (!Array.isArray(items)) return [];
  return items.filter((item): item is Record<string, unknown> =>
    Boolean(item && typeof item === "object")
  );
}

export interface GridReorderDoc {
  /** Raw document values (`_values`) — round-tripped on save. */
  values: Record<string, unknown>;
  /** The grid section's list items, in current order. */
  items: Record<string, unknown>[];
}

/** Load the grid's page document and its current item order. */
export async function fetchGridReorderDoc(
  config: GridReorderConfig
): Promise<GridReorderDoc> {
  const data = await tinaGraphql<{
    page?: { _values?: unknown } | null;
  }>(
    `query gridDocValues($relativePath: String!) {
      page(relativePath: $relativePath) { _values }
    }`,
    { relativePath: config.relativePath },
    tinaReadHeaders()
  );
  const values = data.page?._values;
  if (!values || typeof values !== "object") {
    throw new Error("Couldn't load the page document.");
  }
  const doc = values as Record<string, unknown>;
  const blocks = Array.isArray(doc.blocks) ? doc.blocks : [];
  const grid = findGridBlock(blocks, config);
  const items = grid ? rawListItems(grid[config.listField]) : [];
  if (items.length === 0) {
    throw new Error("This page has no items to rearrange.");
  }
  return { values: doc, items };
}

/** Locate the grid block this config targets (by index when given). */
function findGridBlock(
  blocks: unknown[],
  config: GridReorderConfig
): Record<string, unknown> | undefined {
  if (config.blockIndex !== undefined) {
    const candidate = blocks[config.blockIndex];
    // The index comes from the rendered page; if the document changed since
    // (section added/removed in the editor), refuse rather than touch the
    // wrong section.
    return config.isGridBlock(candidate) ? candidate : undefined;
  }
  return blocks.find(config.isGridBlock);
}

/** Wrap a raw block as Tina's mutation input: `{ [template]: fields }`. */
function blockToMutationInput(
  block: Record<string, unknown>
): Record<string, unknown> {
  const template = block._template;
  if (typeof template !== "string" || !template) {
    throw new Error("This page contains a section that can't be saved.");
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
 * Persist a new item order.
 * @param doc the document loaded via `fetchGridReorderDoc`
 * @param order original item indices in their new sequence
 */
export async function saveGridOrder(
  config: GridReorderConfig,
  doc: GridReorderDoc,
  order: number[]
): Promise<void> {
  const reordered = order.map((i) => doc.items[i]);
  if (
    reordered.length !== doc.items.length ||
    reordered.some((item) => !item)
  ) {
    throw new Error("The list changed while rearranging — please retry.");
  }

  const rawBlocks = Array.isArray(doc.values.blocks) ? doc.values.blocks : [];
  const target = findGridBlock(rawBlocks, config);
  if (!target) {
    throw new Error("The page changed while rearranging — please retry.");
  }
  const blocks = rawBlocks.map((raw) => {
    if (!raw || typeof raw !== "object") {
      throw new Error("This page contains a section that can't be saved.");
    }
    const block = raw as Record<string, unknown>;
    const withOrder =
      block === target ? { ...block, [config.listField]: reordered } : block;
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
      throw new Error(
        "Sign in to the site admin (/admin) in this browser, then try again."
      );
    }
    headers.Authorization = `Bearer ${token}`;
  }

  await tinaGraphql(
    `mutation reorderGridItems(
      $relativePath: String!
      $params: PageMutation!
    ) {
      updatePage(relativePath: $relativePath, params: $params) {
        __typename
      }
    }`,
    { relativePath: config.relativePath, params },
    headers
  );
}
