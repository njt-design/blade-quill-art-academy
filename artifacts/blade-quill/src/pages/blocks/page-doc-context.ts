/**
 * Where the blocks currently being rendered live in Tina.
 *
 * `Page.tsx` provides the document info (collection + relativePath) and
 * `BlockRenderer` provides each block's index in the document's `blocks`
 * array, so reusable sections (e.g. Image Masonry) can offer document-level
 * features like drag-to-reorder without hardcoding a page path the way the
 * Gallery/Downloads grids do.
 *
 * Both default to null: blocks rendered outside a page document (design
 * system demos, product pages, blog articles) simply don't get those
 * features.
 */

import { createContext, useContext } from "react";

export interface PageDocInfo {
  /** Tina collection the document belongs to. */
  collection: "page" | "landingPage";
  /** Document path under content/pages, e.g. "gallery.json". */
  relativePath: string;
}

export const PageDocContext = createContext<PageDocInfo | null>(null);

/** The page document the current blocks belong to, if any. */
export function usePageDoc(): PageDocInfo | null {
  return useContext(PageDocContext);
}

export const BlockIndexContext = createContext<number | null>(null);

/** This block's index in the page document's `blocks` array, if known. */
export function useBlockIndex(): number | null {
  return useContext(BlockIndexContext);
}
