/**
 * "Where are the items?" panel for page sections that *display* a list that
 * is edited somewhere else:
 *   - the homepage Gallery / Downloads previews show the first few items from
 *     the Gallery page's "Art Gallery Grid" / Downloads page's "Downloads Grid"
 *     sections, and
 *   - the YouTube strip shows videos from the YouTube Tutorials list.
 *
 * This display-only field explains that and links straight to the place the
 * items are added, removed, and dragged into order.
 */
import React from "react";
import type { TinaField } from "tinacms";

const h = React.createElement;

type ManagedList = "gallery" | "download" | "tutorial";

const LISTS: Record<
  ManagedList,
  { where: string; noun: string; button: string; hash: string }
> = {
  gallery: {
    noun: "images",
    where:
      "They're edited on the Gallery page: Site Pages → gallery → the Art Gallery Grid section.",
    button: "Open the Gallery page →",
    hash: "#/collections/edit/page/gallery",
  },
  download: {
    noun: "files",
    where:
      "They're edited on the Downloads page: Site Pages → downloads → the Downloads Grid section.",
    button: "Open the Downloads page →",
    hash: "#/collections/edit/page/downloads",
  },
  tutorial: {
    noun: "videos",
    where: "They're edited in the ☰ menu under Site → YouTube Tutorials.",
    button: "Open YouTube Tutorials →",
    hash: "#/collections/edit/tutorial/items",
  },
};

function makeManageListPanel(kind: ManagedList): React.FC {
  const info = LISTS[kind];
  return function ManageListPanel() {
    return h(
      "div",
      {
        style: {
          border: "1px solid rgba(0,0,0,0.12)",
          borderRadius: 8,
          background: "#FBF7F1",
          padding: "12px 14px",
          margin: "4px 0 8px",
          fontFamily: "system-ui, sans-serif",
        },
      },
      h(
        "div",
        { style: { fontSize: 13, fontWeight: 700, color: "#4A3838" } },
        `Where are the ${info.noun}?`
      ),
      h(
        "div",
        {
          style: {
            fontSize: 12,
            color: "#776562",
            margin: "4px 0 10px",
            lineHeight: 1.45,
          },
        },
        `This section shows the first few ${info.noun} from one shared list. ${info.where} Add, remove, or drag the ⋮⋮ handle to reorder them there — this section updates automatically.`
      ),
      h(
        "a",
        {
          href: info.hash,
          style: {
            display: "inline-block",
            border: "none",
            borderRadius: 999,
            background: "#9A5151",
            color: "#fff",
            fontSize: 12.5,
            fontWeight: 600,
            padding: "7px 14px",
            textDecoration: "none",
          },
        },
        info.button
      )
    );
  };
}

/**
 * Display-only pointer to where a section's items are edited.
 * Put it first in the section's fields so it's the first thing editors see.
 */
export function manageListField(kind: ManagedList): TinaField {
  return {
    type: "string",
    name: "manageList",
    label: "Manage items",
    ui: {
      // Display-only panel — never writes its own value.
      component: makeManageListPanel(kind) as never,
    },
  };
}
