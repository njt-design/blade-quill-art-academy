/**
 * Optional SEO fields + AI assistant for pages, blog posts, and products.
 *
 * Every document gets a "Search Listing (SEO)" group (search title + search
 * description) plus an assistant panel that:
 *   - shows the page's live web address (derived from the file name), and
 *   - fills the SEO fields with AI-written suggestions (POST /api/seo-suggest,
 *     authenticated with the editor's Tina session).
 *
 * Suggestions auto-fill once when a document with content is opened and its
 * SEO fields are still empty; the "Suggest with AI" button re-generates on
 * demand. All fields stay fully editable — the AI only types a first draft.
 */
import React from "react";
import type { TinaField } from "tinacms";
import { charLimit } from "./blocks";

const h = React.createElement;

// ---------------------------------------------------------------------------
// Slug → live URL mapping (single source of truth for tina/config.ts;
// must stay in sync with CORE_PAGE_SLUGS in src/lib/page-queries.ts)
// ---------------------------------------------------------------------------

/** Slugs of the protected core site pages (the "page" collection). */
export const CORE_PAGE_SLUGS = [
  "home",
  "about",
  "contact",
  "shop",
  "gallery",
  "downloads",
  "education",
  "publishers",
  "important-links",
];

/** Map a core page file name to its live URL. */
export function corePageRoute(basename: string): string {
  const base = basename.replace(/\.json$/i, "");
  if (base === "home") return "/";
  if (base === "important-links") return "/important-links-page";
  return `/${base}`;
}

/** Live URL path for a document, from its content folder + file name. */
function liveUrlPath(folder: string, slug: string): string | null {
  if (!slug) return null;
  if (folder === "posts") return `/blog/${slug}`;
  if (folder === "products") return `/shop/${slug}`;
  if (folder === "pages") {
    return CORE_PAGE_SLUGS.includes(slug) ? corePageRoute(slug) : `/p/${slug}`;
  }
  return null;
}

/** Derive the live URL from a Tina form id like "content/posts/my-post.json". */
function docUrlPath(formId: string): string | null {
  const match = /content\/(pages|posts|products)\/(.+?)\.json$/i.exec(formId);
  if (!match) return null;
  return liveUrlPath(match[1], match[2]);
}

// ---------------------------------------------------------------------------
// Plain-text extraction from Tina form values (for the AI prompt)
// ---------------------------------------------------------------------------

/** Keys that hold configuration, IDs, or media — never prose. */
const SKIP_KEYS = new Set([
  "id",
  "type",
  "_template",
  "__typename",
  "icon",
  "variant",
  "layout",
  "align",
  "platform",
  "tone",
  "level",
  "size",
  "style",
  "width",
  "aspect",
  "category",
  "linkType",
  "page",
  "productId",
  "price",
  "createdAt",
  "publishedAt",
  "region",
  "textStyle",
  "seo",
  "seoAssistant",
]);
const SKIP_KEY_SUFFIX = /(link|url|href|image|src|file)$/i;
const SKIP_VALUE = /^(\/|https?:|data:|mailto:|#)/i;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}/;

/**
 * Walk the document values (blocks, rich-text Slate trees, plain strings) and
 * collect readable copy, top to bottom, capped at `budget` characters.
 */
export function extractContentText(value: unknown, budget = 6000): string {
  const out: string[] = [];
  let used = 0;

  const visit = (node: unknown): void => {
    if (used >= budget || node == null) return;
    if (typeof node === "string") {
      const text = node.trim();
      if (text.length < 2 || SKIP_VALUE.test(text) || ISO_DATE.test(text)) {
        return;
      }
      out.push(text);
      used += text.length + 1;
      return;
    }
    if (Array.isArray(node)) {
      for (const item of node) visit(item);
      return;
    }
    if (typeof node === "object") {
      for (const [key, val] of Object.entries(node as Record<string, unknown>)) {
        if (SKIP_KEYS.has(key) || SKIP_KEY_SUFFIX.test(key)) continue;
        visit(val);
      }
    }
  };

  visit(value);
  return out.join(" ").replace(/\s+/g, " ").trim();
}

// ---------------------------------------------------------------------------
// AI assistant field component
// ---------------------------------------------------------------------------

type SeoKind = "page" | "post" | "product";

/** Minimum characters of real content before suggestions auto-run. */
const AUTO_FILL_MIN_CONTENT = 80;

function readTinaIdToken(): string {
  try {
    const raw = localStorage.getItem("tinacms-auth");
    if (raw) {
      const parsed = JSON.parse(raw) as { id_token?: string };
      const token = parsed?.id_token?.trim();
      if (token && token !== "null") return token;
    }
  } catch {
    // fall through to local-dev token
  }
  return "LOCAL";
}

interface AssistantProps {
  form?: {
    change?: (name: string, value: unknown) => void;
    getState?: () => { values?: Record<string, unknown> };
  };
  tinaForm?: {
    id?: string;
    finalForm?: AssistantProps["form"];
  };
}

type AssistantStatus = "idle" | "working" | "done" | "error";

function makeSeoAssistant(kind: SeoKind) {
  const contentNoun =
    kind === "product" ? "product details" : kind === "post" ? "post" : "page";

  return function SeoAssistant(props: AssistantProps) {
    const finalForm =
      props?.form && typeof props.form.change === "function"
        ? props.form
        : props?.tinaForm?.finalForm;
    const formId = typeof props?.tinaForm?.id === "string" ? props.tinaForm.id : "";
    const urlPath = docUrlPath(formId);

    const [status, setStatus] = React.useState<AssistantStatus>("idle");
    const [message, setMessage] = React.useState("");
    const autoRanRef = React.useRef(false);

    const getValues = React.useCallback(
      (): Record<string, unknown> => finalForm?.getState?.()?.values ?? {},
      [finalForm]
    );

    const generate = React.useCallback(async () => {
      const values = getValues();
      const title = String(
        (values?.title as string | undefined) ??
          (values?.name as string | undefined) ??
          ""
      ).trim();
      const contentText = extractContentText(values);

      if (!title && contentText.length < 40) {
        setStatus("error");
        setMessage(`Write some ${contentNoun} content first, then try again.`);
        return;
      }

      setStatus("working");
      setMessage("Writing suggestions…");
      try {
        const res = await fetch("/api/seo-suggest", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${readTinaIdToken()}`,
          },
          body: JSON.stringify({
            kind,
            title,
            contentText,
            ...(urlPath ? { url: urlPath } : {}),
          }),
        });
        const body = (await res.json().catch(() => null)) as {
          metaTitle?: string;
          metaDescription?: string;
          error?: string;
        } | null;
        if (!res.ok || !body) {
          throw new Error(body?.error || "Could not generate suggestions.");
        }
        if (body.metaTitle) finalForm?.change?.("seo.metaTitle", body.metaTitle);
        if (body.metaDescription) {
          finalForm?.change?.("seo.metaDescription", body.metaDescription);
        }
        setStatus("done");
        setMessage(
          "Suggestions added below — edit anything you like, then save."
        );
      } catch (err) {
        setStatus("error");
        setMessage(
          err instanceof Error ? err.message : "Could not generate suggestions."
        );
      }
    }, [getValues, urlPath, contentNoun]);

    // Auto-fill once per session when the doc has content but no SEO yet.
    React.useEffect(() => {
      if (autoRanRef.current) return;
      autoRanRef.current = true;

      const values = getValues();
      const seo = (values?.seo ?? {}) as {
        metaTitle?: string;
        metaDescription?: string;
      };
      if ((seo.metaTitle ?? "").trim() || (seo.metaDescription ?? "").trim()) {
        return;
      }
      const title = String(
        (values?.title as string | undefined) ??
          (values?.name as string | undefined) ??
          ""
      ).trim();
      const contentText = extractContentText(values);
      if (`${title} ${contentText}`.trim().length < AUTO_FILL_MIN_CONTENT) {
        return;
      }

      const guardKey = `bq-seo-autofill:${formId || kind}`;
      try {
        if (sessionStorage.getItem(guardKey)) return;
        sessionStorage.setItem(guardKey, "1");
      } catch {
        // sessionStorage unavailable — still attempt once per mount
      }
      void generate();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const statusColor =
      status === "error" ? "#B3261E" : status === "done" ? "#3A6B3A" : "#776562";

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
        "SEO Assistant"
      ),
      h(
        "div",
        {
          style: {
            fontSize: 12,
            color: "#776562",
            margin: "4px 0 8px",
            lineHeight: 1.45,
          },
        },
        "Fills the Search Listing fields below with suggestions written from this " +
          contentNoun +
          ". You can edit everything afterwards."
      ),
      h(
        "div",
        { style: { fontSize: 12, color: "#4A3838", marginBottom: 10 } },
        h("span", { style: { fontWeight: 600 } }, "Web address: "),
        urlPath
          ? h(
              "code",
              {
                style: {
                  background: "rgba(0,0,0,0.06)",
                  borderRadius: 4,
                  padding: "1px 6px",
                  fontSize: 11.5,
                },
              },
              urlPath
            )
          : h(
              "span",
              { style: { color: "#776562" } },
              "set from the file name when this is first saved"
            )
      ),
      h(
        "div",
        { style: { display: "flex", alignItems: "center", gap: 10 } },
        h(
          "button",
          {
            type: "button",
            onClick: () => void generate(),
            disabled: status === "working",
            style: {
              border: "none",
              borderRadius: 999,
              background: "#9A5151",
              color: "#fff",
              fontSize: 12.5,
              fontWeight: 600,
              padding: "7px 14px",
              cursor: status === "working" ? "wait" : "pointer",
              opacity: status === "working" ? 0.7 : 1,
            },
          },
          status === "working" ? "Writing…" : "Suggest with AI"
        ),
        message
          ? h(
              "span",
              { style: { fontSize: 12, color: statusColor, lineHeight: 1.4 } },
              message
            )
          : null
      )
    );
  };
}

// ---------------------------------------------------------------------------
// Field group
// ---------------------------------------------------------------------------

/**
 * SEO assistant + optional search-listing fields for a collection.
 * Append to the end of the collection's fields.
 */
export function seoFields(kind: SeoKind): TinaField[] {
  const thing =
    kind === "product" ? "product" : kind === "post" ? "post" : "page";
  return [
    {
      type: "string",
      name: "seoAssistant",
      label: "SEO Assistant",
      ui: {
        // Display-only panel — never writes its own value.
        component: makeSeoAssistant(kind) as never,
      },
    },
    {
      type: "object",
      name: "seo",
      label: "Search Listing (SEO)",
      ui: {
        description:
          `Optional. How this ${thing} appears in Google and other search engines. ` +
          "Leave empty to use the regular title, or use the SEO Assistant above for a head start.",
      },
      fields: [
        {
          type: "string",
          name: "metaTitle",
          label: "Search Title",
          ui: charLimit(
            60,
            "The clickable headline in search results. The site name is added automatically."
          ),
        },
        {
          type: "string",
          name: "metaDescription",
          label: "Search Description",
          ui: {
            component: "textarea",
            ...charLimit(
              160,
              "The short blurb under the headline in search results. Aim for 120–155 characters."
            ),
          },
        },
      ],
    },
  ];
}
