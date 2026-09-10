/**
 * "Manage the list" panel for page sections whose items live in a separate
 * Tina collection (Gallery artwork, Free Downloads, YouTube Tutorials).
 *
 * Opening the Downloads page in Tina shows the page *sections* (header, grid)
 * but not the files themselves, which look like they're missing. This
 * display-only field explains that and links straight to the list where
 * items are added, removed, and dragged into order.
 */
import React from "react";
import type { TinaField } from "tinacms";

const h = React.createElement;

type ManagedList = "gallery" | "download" | "tutorial";

const LISTS: Record<
  ManagedList,
  { title: string; noun: string; menu: string; hash: string }
> = {
  gallery: {
    title: "Gallery artwork",
    noun: "images",
    menu: "Gallery",
    hash: "#/collections/edit/gallery/items",
  },
  download: {
    title: "Free download files",
    noun: "files",
    menu: "Downloads",
    hash: "#/collections/edit/download/items",
  },
  tutorial: {
    title: "YouTube tutorial videos",
    noun: "videos",
    menu: "YouTube Tutorials",
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
        `This section only places the grid on the page. The ${info.noun} themselves are one list, shared by every page that shows them. Add, remove, or drag the ⋮⋮ handle to reorder them there — the change shows up here automatically.`
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
        `Open ${info.title} →`
      ),
      h(
        "div",
        { style: { fontSize: 11.5, color: "#776562", marginTop: 8 } },
        `Also in the ☰ menu under ${info.menu} → items.`
      )
    );
  };
}

/**
 * Display-only pointer to the collection that holds a section's items.
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
