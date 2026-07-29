import React, { useEffect } from "react";
import { defineConfig, type Template, type TinaField } from "tinacms";
import { ALL_BLOCKS, charLimit } from "./blocks";

/**
 * Tina sidebar screen for Owner Insights.
 * Embeds /insights in-frame (same-origin → Tina localStorage auth works).
 * Auto-redirect was unreliable inside Tina's fullscreen modal.
 */
function InsightsRedirectScreen(_props: { close: () => void }) {
  const insightsUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/insights`
      : "/insights";

  useEffect(() => {
    // Prefer leaving the admin SPA entirely when possible (top window).
    // If that is blocked (modal / nested frame), the iframe below still works.
    try {
      if (window.top && window.top !== window) {
        window.top.location.href = insightsUrl;
      }
    } catch {
      // Cross-origin frame access can throw; iframe fallback handles it.
    }
  }, [insightsUrl]);

  return React.createElement(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: "70vh",
        fontFamily: "system-ui, sans-serif",
      },
    },
    React.createElement(
      "div",
      {
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          padding: "12px 16px",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
          flexShrink: 0,
        },
      },
      React.createElement(
        "div",
        { style: { fontSize: 14, color: "#4A3838" } },
        "Owner Insights — analytics & Stripe orders"
      ),
      React.createElement(
        "a",
        {
          href: insightsUrl,
          target: "_top",
          rel: "noopener noreferrer",
          style: {
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 14px",
            borderRadius: 999,
            background: "#9A5151",
            color: "#fff",
            fontSize: 13,
            fontWeight: 600,
            textDecoration: "none",
          },
        },
        "Open full page"
      )
    ),
    React.createElement("iframe", {
      src: insightsUrl,
      title: "Owner Insights",
      style: {
        flex: 1,
        width: "100%",
        minHeight: 0,
        border: "none",
        background: "#F7F1EA",
      },
    })
  );
}

function InsightsScreenIcon() {
  return React.createElement(
    "svg",
    {
      width: 20,
      height: 20,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": true,
    },
    React.createElement("path", { d: "M3 3v18h18" }),
    React.createElement("path", { d: "M7 14v4" }),
    React.createElement("path", { d: "M12 10v8" }),
    React.createElement("path", { d: "M17 6v12" })
  );
}

const INLINE_RICH_TEXT = {
  toolbar: ["bold", "italic", "link", "ul", "ol"] as Array<
    "bold" | "italic" | "link" | "ul" | "ol"
  >,
  showFloatingToolbar: true,
};

/** JSON collections store Slate AST directly — skip markdown re-parsing. */
const SLATE_JSON_PARSER = { type: "slatejson" as const };

/** Build a Slate rich-text value from a plain sentence (for starter content). */
const rt = (text: string) => ({
  type: "root",
  children: [{ type: "p", children: [{ type: "text", text }] }],
});

// ---------------------------------------------------------------------------
// Shared page fields (title + layout + reorderable sections)
// ---------------------------------------------------------------------------

/**
 * Slugs that belong to the core site pages. These live in the protected
 * "Site Pages" collection; anything else in content/pages is a "New Page".
 */
const CORE_PAGE_SLUGS = [
  "home",
  "about",
  "contact",
  "shop",
  "gallery",
  "downloads",
  "publishers",
  "important-links",
];

const CORE_PAGE_GLOB = `{${CORE_PAGE_SLUGS.join(",")}}`;

const pageFields: TinaField[] = [
  {
    type: "string",
    name: "title",
    label: "Page Title",
    required: true,
    isTitle: true,
    ui: charLimit(60, "Shown in the browser tab and used to name the page in this list."),
  },
  {
    type: "string",
    name: "layout",
    label: "Page Layout",
    options: [
      { value: "standard", label: "Standard (with menu & footer)" },
      { value: "standalone", label: "Standalone (full page, no menu)" },
    ],
    ui: {
      description:
        'Standard pages show the site menu and footer. Standalone pages are full-screen with just a small logo header — great for link-in-bio or promo pages.',
    },
  },
  {
    type: "object",
    name: "blocks",
    label: "Page Sections",
    list: true,
    ui: {
      visualSelector: true,
      description:
        "The sections on this page, top to bottom. Drag to reorder, click a section to edit it, or use the + button to add a new one.",
    },
    templates: ALL_BLOCKS,
  },
];

/** Map a page file name to its live URL for visual editing. */
function corePageRoute(basename: string): string {
  const base = basename.replace(/\.json$/i, "");
  if (base === "home") return "/";
  if (base === "important-links") return "/important-links-page";
  return `/${base}`;
}

// ---------------------------------------------------------------------------
// Navigation (site menu + footer links, editable as a single document)
// ---------------------------------------------------------------------------

/**
 * Fields shared by every nav link (top-level menu items, dropdown children,
 * and footer links). A link points at a site page, a built-in path like
 * /blog, or an external URL.
 */
function navLinkFields(): TinaField[] {
  return [
    {
      type: "string",
      name: "label",
      label: "Label",
      required: true,
      ui: charLimit(24, "The text shown in the menu."),
    },
    {
      type: "string",
      name: "linkType",
      label: "Link Type",
      options: [
        { value: "page", label: "Site page" },
        { value: "path", label: "Site link (e.g. /blog or /cart)" },
        { value: "external", label: "External URL" },
      ],
      ui: {
        description:
          'Where this link goes: pick "Site page" to link to one of your pages.',
      },
    },
    {
      type: "reference",
      name: "page",
      label: "Page",
      collections: ["page", "landingPage"],
      ui: { description: 'The page to link to (used when Link Type is "Site page").' },
    },
    {
      type: "string",
      name: "href",
      label: "URL / Path",
      ui: {
        description:
          'For "Site link" use a path like /blog, /cart, /shop, /gallery, /downloads, /contact, /about, or /. For "External URL" paste the full https://… address. Prefer Link Type "Site page" whenever you can — that picks from your pages and cannot typo.',
      },
    },
  ];
}

const navItemProps = (item?: Record<string, unknown>) => ({
  label: (item?.label as string) || "Menu item",
});

// ---------------------------------------------------------------------------
// Starter templates for new pages
// ---------------------------------------------------------------------------

function newPageTemplate(
  name: string,
  label: string,
  defaultItem: Record<string, unknown>
): Template {
  return { name, label, ui: { defaultItem }, fields: pageFields };
}

const blankPageTemplate = newPageTemplate("blank", "Blank Page", {
  title: "New Page",
  layout: "standard",
  blocks: [],
});

const eventPageTemplate = newPageTemplate("event", "Event / Workshop", {
  title: "New Event",
  layout: "standard",
  blocks: [
    {
      _template: "hero",
      heading: "Your Event Name",
      subheading: rt("When it happens, who it's for, and why it's exciting — one or two sentences."),
      ctaLabel: "Register Now",
      ctaLink: "/contact",
    },
    {
      _template: "featureGrid",
      heading: "What You'll Learn",
      items: [
        { icon: "Brush", title: "First topic", description: rt("Describe the first topic.") },
        { icon: "Palette", title: "Second topic", description: rt("Describe the second topic.") },
        { icon: "Star", title: "Third topic", description: rt("Describe the third topic.") },
      ],
    },
    {
      _template: "text",
      heading: "About the Event",
      body: rt("Tell visitors everything they need to know — schedule, format, what to bring, and how to prepare."),
    },
    {
      _template: "ctaBand",
      heading: "Ready to join?",
      description: rt("Limited spots available."),
      ctaLabel: "Sign Up Today",
      ctaLink: "/contact",
      variant: "dark",
    },
  ],
});

const promoPageTemplate = newPageTemplate("promo", "Promo / Sale", {
  title: "New Promotion",
  layout: "standard",
  blocks: [
    {
      _template: "hero",
      heading: "Something special is here",
      subheading: rt("Announce the promotion and what makes it a great deal."),
      ctaLabel: "Shop Now",
      ctaLink: "/shop",
    },
    {
      _template: "featuredRelease",
      eyebrow: "Featured",
      title: "The featured item",
      description: rt("Describe the featured product or offer."),
      ctaLabel: "Get It Now",
      ctaHref: "/shop",
    },
    {
      _template: "productStrip",
      eyebrow: "FROM THE SHOP",
      heading: "More from the shop",
      viewAllLabel: "All products",
      viewAllLink: "/shop",
    },
    {
      _template: "ctaBand",
      heading: "Don't miss out",
      description: rt("This offer won't last forever."),
      ctaLabel: "Shop the Sale",
      ctaLink: "/shop",
      variant: "dark",
    },
  ],
});

const infoPageTemplate = newPageTemplate("info", "Info Page", {
  title: "New Info Page",
  layout: "standard",
  blocks: [
    {
      _template: "pageHeader",
      heading: "Page Title",
      description: rt("A short introduction to what this page covers."),
    },
    {
      _template: "text",
      body: rt("Write the main content here. You can add headings, lists, links, and images."),
    },
  ],
});

const linkInBioPageTemplate = newPageTemplate("linkInBio", "Link-in-Bio / Landing", {
  title: "New Landing Page",
  layout: "standalone",
  blocks: [
    {
      _template: "marquee",
      highlightText: "Big news",
      text: " — something exciting is coming",
    },
    {
      _template: "featuredRelease",
      eyebrow: "New Featured Release",
      title: "The featured item",
      description: rt("Describe what you're featuring."),
      ctaLabel: "Check It Out",
      ctaHref: "https://",
    },
    {
      _template: "kofiSupport",
      heading: "Support the Studio",
      body: rt("If you enjoy the tutorials, books, and free resources, consider buying a coffee on Ko-fi."),
      ctaLabel: "Support on Ko-fi",
      href: "https://ko-fi.com/bladeandquill",
    },
    {
      _template: "socialLinks",
      links: [
        { platform: "youtube", url: "https://www.youtube.com/c/BladeQuillartacademy", label: "YouTube" },
        { platform: "instagram", url: "https://www.instagram.com/bladequillartacademy/", label: "Instagram" },
        { platform: "kofi", url: "https://ko-fi.com/bladeandquill", label: "Ko-fi" },
      ],
    },
  ],
});

// ---------------------------------------------------------------------------
// Main config
// ---------------------------------------------------------------------------

export default defineConfig({
  clientId: process.env.TINA_PUBLIC_CLIENT_ID,
  token: process.env.TINA_TOKEN,
  branch: process.env.TINA_BRANCH || "main",
  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "images",
      publicFolder: "public",
    },
  },
  cmsCallback: (cms) => {
    cms.plugins.add({
      __type: "screen",
      name: "Insights",
      Component: InsightsRedirectScreen,
      Icon: InsightsScreenIcon,
      layout: "fullscreen",
      navCategory: "Dashboard",
    });
    return cms;
  },
  schema: {
    // Order = sidebar order for Corinne (most-used first).
    collections: [
      // ---------------------------------------------------------------
      // Site Pages — core pages. Protected from create/delete.
      // ---------------------------------------------------------------
      {
        name: "page",
        label: "Site Pages",
        path: "content/pages",
        match: { include: CORE_PAGE_GLOB },
        format: "json",
        ui: {
          allowedActions: { create: false, delete: false },
          router: ({ document }) =>
            corePageRoute(document._sys.basename ?? document._sys.filename ?? ""),
        },
        fields: pageFields,
      },

      // ---------------------------------------------------------------
      // New Pages — client-created from templates.
      // ---------------------------------------------------------------
      {
        name: "landingPage",
        label: "New Pages",
        path: "content/pages",
        match: { exclude: CORE_PAGE_GLOB },
        format: "json",
        ui: {
          filename: {
            readonly: true,
            slugify: (values) =>
              String(values?.title ?? "new-page")
                .toLowerCase()
                .replace(/['’]/g, "")
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "") || "new-page",
          },
          router: ({ document }) => {
            const base =
              document._sys.basename?.replace(/\.json$/i, "") ??
              document._sys.filename?.replace(/\.json$/i, "") ??
              "";
            return `/p/${base}`;
          },
        },
        templates: [
          blankPageTemplate,
          eventPageTemplate,
          promoPageTemplate,
          infoPageTemplate,
          linkInBioPageTemplate,
        ],
      },

      // ---------------------------------------------------------------
      // Blog Posts
      // ---------------------------------------------------------------
      {
        name: "post",
        label: "Blog Posts",
        path: "content/posts",
        format: "json",
        ui: {
          filename: {
            readonly: true,
            slugify: (values) =>
              String(values?.title ?? "new-post")
                .toLowerCase()
                .replace(/['’]/g, "")
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "") || "new-post",
          },
          router: ({ document }) => {
            const base =
              document._sys.basename?.replace(/\.json$/i, "") ??
              document._sys.filename?.replace(/\.json$/i, "") ??
              "";
            return `/blog/${base}`;
          },
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            required: true,
            isTitle: true,
            ui: {
              ...charLimit(90, "The post headline. Shows in the blog list and at the top of the post."),
              // Seed sensible defaults when Corinne clicks Create.
              defaultValue: "New blog post",
            },
          },
          {
            type: "rich-text",
            name: "excerpt",
            label: "Excerpt",
            overrides: INLINE_RICH_TEXT,
            parser: SLATE_JSON_PARSER,
            ui: { description: "A 1-2 sentence summary shown on blog list cards." },
          },
          {
            type: "image",
            name: "coverImage",
            label: "Cover Image",
            ui: {
              description:
                "Featured image for the post and list cards. Prefer ~1600×900 (16:9). Upload into images/blog/.",
            },
          },
          {
            type: "datetime",
            name: "publishedAt",
            label: "Publish Date",
            ui: { description: "Controls sort order on the blog list. Newest posts appear first." },
          },
          {
            type: "string",
            name: "tags",
            label: "Tags",
            list: true,
            ui: {
              description:
                "Topic tags for filtering (e.g. 'Krita', 'Behind the Scenes'). Keep each under 24 characters.",
            },
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            parser: SLATE_JSON_PARSER,
            ui: { description: "The full post content. Supports headings, images, links, and embeds." },
          },
        ],
      },

      // ---------------------------------------------------------------
      // Shop Products
      // ---------------------------------------------------------------
      {
        name: "shopProduct",
        label: "Shop Products",
        path: "content/products",
        format: "json",
        ui: {
          router: ({ document }) => {
            const base =
              document._sys.basename?.replace(/\.json$/i, "") ??
              document._sys.filename?.replace(/\.json$/i, "") ??
              "";
            return `/shop/${base}`;
          },
        },
        fields: [
          {
            type: "string",
            name: "name",
            label: "Name",
            required: true,
            isTitle: true,
            ui: {
              ...charLimit(80, "Product title shown on cards and the detail page."),
              defaultValue: "New product",
            },
          },
          {
            type: "rich-text",
            name: "description",
            label: "Description",
            overrides: INLINE_RICH_TEXT,
            parser: SLATE_JSON_PARSER,
            ui: {
              description: "Short description for shop cards and the product detail tab.",
            },
          },
          {
            type: "number",
            name: "price",
            label: "Price (USD)",
            required: true,
            ui: {
              description:
                "Customer pays this amount at Stripe Checkout (USD, e.g. 24.99). Change it here — no Stripe dashboard needed.",
            },
          },
          {
            type: "string",
            name: "category",
            label: "Category",
            required: true,
            options: [
              { value: "physical", label: "Physical (book)" },
              { value: "digital", label: "Digital download" },
              { value: "curriculum", label: "Curriculum" },
            ],
            ui: { description: "Controls card style and shop filters." },
          },
          {
            type: "image",
            name: "image",
            label: "Cover Image",
            ui: {
              description:
                "Product image for the shop grid and detail page. Prefer square or 3:4 portrait, at least 1200px wide. Upload into images/products/.",
            },
          },
          {
            type: "boolean",
            name: "featured",
            label: "Featured",
            ui: {
              description:
                "Featured products show a NEW badge and appear in homepage/shop highlights.",
            },
          },
          {
            type: "boolean",
            name: "inStock",
            label: "In Stock",
            ui: {
              description:
                "When off, the product still appears in the shop but Buy now / cart checkout are blocked.",
            },
          },
          {
            type: "string",
            name: "downloadUrl",
            label: "Download URL",
            ui: {
              description:
                "After Stripe payment, digital/curriculum products get a 48-hour download link that redirects here. Prefer a file on this site (e.g. /files/guide.pdf).",
            },
          },
          {
            type: "string",
            name: "gumroadUrl",
            label: "Gumroad URL (optional)",
            ui: {
              description:
                "Optional post-purchase fallback if no Download URL is set. Not used for checkout.",
            },
          },
          {
            type: "number",
            name: "productId",
            label: "Product ID (advanced)",
            required: true,
            ui: {
              description:
                "Stable numeric ID for cart and Stripe. Must be unique. Do not change existing products — only set this when creating a brand-new product (pick the next free number).",
            },
          },
          {
            type: "datetime",
            name: "createdAt",
            label: "Created Date",
            ui: { description: 'Used for "Newest" sort on the shop page.' },
          },
        ],
      },

      // ---------------------------------------------------------------
      // Menu & Footer — single document; protected from delete.
      // ---------------------------------------------------------------
      {
        name: "navigation",
        label: "Menu & Footer",
        path: "content/navigation",
        format: "json",
        ui: {
          allowedActions: { create: false, delete: false },
          router: () => "/",
        },
        fields: [
          {
            type: "object",
            name: "items",
            label: "Menu Items",
            list: true,
            ui: {
              itemProps: navItemProps,
              defaultItem: {
                label: "New link",
                linkType: "path",
                href: "/",
              },
              description:
                "The links in the site header, left to right. Drag to reorder. Add Dropdown Items to a link to group pages under it.",
            },
            fields: [
              ...navLinkFields(),
              {
                type: "object",
                name: "children",
                label: "Dropdown Items",
                list: true,
                ui: {
                  itemProps: navItemProps,
                  defaultItem: {
                    label: "New dropdown link",
                    linkType: "path",
                    href: "/",
                  },
                  description:
                    "Optional links shown in a dropdown under this menu item.",
                },
                fields: navLinkFields(),
              },
            ],
          },
          {
            type: "object",
            name: "footerColumns",
            label: "Footer Columns",
            list: true,
            ui: {
              itemProps: (item?: Record<string, unknown>) => ({
                label: (item?.heading as string) || "Footer column",
              }),
              defaultItem: {
                heading: "Explore",
                links: [{ label: "Home", linkType: "path", href: "/" }],
              },
              description:
                "The link columns in the site footer, left to right. Drag to reorder.",
            },
            fields: [
              {
                type: "string",
                name: "heading",
                label: "Column Heading",
                required: true,
                ui: charLimit(32),
              },
              {
                type: "object",
                name: "links",
                label: "Links",
                list: true,
                ui: {
                  itemProps: navItemProps,
                  defaultItem: {
                    label: "New link",
                    linkType: "path",
                    href: "/",
                  },
                },
                fields: navLinkFields(),
              },
            ],
          },
        ],
      },
    ],
  },
});
