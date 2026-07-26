import React, { useEffect } from "react";
import { defineConfig, type Template, type TinaField } from "tinacms";
import { ALL_BLOCKS, charLimit } from "./blocks";

/** Tina sidebar screen that sends Corinne to the Owner Insights page. */
function InsightsRedirectScreen(_props: { close: () => void }) {
  useEffect(() => {
    window.location.assign("/insights");
  }, []);
  return React.createElement(
    "div",
    { style: { padding: 32, fontFamily: "system-ui, sans-serif" } },
    "Opening Owner Insights…"
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
          'Used for "Site link" (e.g. /blog) or "External URL" (e.g. https://youtube.com/...).',
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
    collections: [
      // ---------------------------------------------------------------
      // Site Pages — the core pages of the site. Protected from
      // creation/deletion so Home, Shop, etc. can't disappear.
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
      // New Pages — pages the client creates herself, starting from a
      // template (Blank, Event, Promo, Info, Link-in-Bio).
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
      // Navigation — a single document controlling the site menu and
      // footer link columns. Protected so it can't be deleted.
      // ---------------------------------------------------------------
      {
        name: "navigation",
        label: "Navigation",
        path: "content/navigation",
        format: "json",
        ui: {
          allowedActions: { create: false, delete: false },
          // Preview nav edits live on the homepage.
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
                ui: { itemProps: navItemProps },
                fields: navLinkFields(),
              },
            ],
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
            type: "number",
            name: "productId",
            label: "Product ID",
            required: true,
            ui: {
              description:
                "Stable numeric ID for cart and Stripe checkout. Keep unique and do not renumber existing products (e.g. 1, 2, 3).",
            },
          },
          {
            type: "string",
            name: "name",
            label: "Name",
            required: true,
            ui: charLimit(80, "Product title shown on cards and the detail page."),
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
            ui: { description: "Product image for shop grid and detail gallery." },
          },
          {
            type: "string",
            name: "gumroadUrl",
            label: "Gumroad URL",
            ui: {
              description:
                "Optional post-purchase fallback link shown after Stripe payment if no Download URL is set. Not used for checkout.",
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
            type: "datetime",
            name: "createdAt",
            label: "Created Date",
            ui: { description: 'Used for "Newest" sort on the shop page.' },
          },
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
          // Use basename without extension so the URL matches /blog/:slug (wouter route)
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
            ui: charLimit(90, "The post headline. Shows in the blog list and at the top of the post."),
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
            ui: { description: "Featured image shown at the top of the post and on list cards." },
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
            ui: { description: "Topic tags for filtering (e.g. 'Krita', 'Behind the Scenes'). Keep each under 24 characters." },
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
    ],
  },
});
