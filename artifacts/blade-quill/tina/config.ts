import React, { useEffect } from "react";
import { defineConfig, type Template, type TinaField } from "tinacms";
import {
  ALL_BLOCKS,
  INLINE_RICH_TEXT,
  RICH_TEXT_TEMPLATES,
  SLATE_JSON_PARSER,
  charLimit,
} from "./blocks";
import { BLOG_BLOCKS } from "./blog-blocks";
import { CORE_PAGE_SLUGS, corePageRoute, seoFields } from "./seo";

const INSIGHTS_AUTH_MESSAGE = "bq-insights-auth";

function readTinaIdTokenFromStorage(): string | null {
  try {
    const raw = localStorage.getItem("tinacms-auth");
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { id_token?: string };
    const token = parsed?.id_token?.trim();
    return token && token !== "null" ? token : null;
  } catch {
    return null;
  }
}

/**
 * Tina sidebar screen for Owner Insights.
 * 1) Reads the Tina session from admin localStorage
 * 2) Sets an httpOnly cookie via /api/insights/session
 * 3) Embeds /insights and postMessages the token into the iframe
 */
function InsightsRedirectScreen(_props: { close: () => void }) {
  const [iframeSrc, setIframeSrc] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState("Preparing Insights…");
  const iframeRef = React.useRef<HTMLIFrameElement | null>(null);

  const insightsUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/insights`
      : "/insights";

  const postTokenToIframe = React.useCallback((token: string) => {
    const frame = iframeRef.current?.contentWindow;
    if (!frame) return;
    frame.postMessage(
      { type: INSIGHTS_AUTH_MESSAGE, idToken: token },
      window.location.origin
    );
  }, []);

  useEffect(() => {
    let cancelled = false;
    const token = readTinaIdTokenFromStorage();

    const boot = async () => {
      if (!token) {
        setStatus("No Tina session found. Sign in to Tina, then reopen Insights.");
        setIframeSrc(insightsUrl);
        return;
      }

      setStatus("Connecting your Tina session…");
      try {
        await fetch("/api/insights/session", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken: token }),
        });
      } catch {
        // Cookie is best-effort; postMessage + Bearer still work.
      }

      if (cancelled) return;
      setStatus("Loading dashboard…");
      setIframeSrc(insightsUrl);
    };

    void boot();

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const data = event.data as { type?: string } | null;
      if (data?.type === `${INSIGHTS_AUTH_MESSAGE}-request` && token) {
        postTokenToIframe(token);
      }
    };
    window.addEventListener("message", onMessage);
    return () => {
      cancelled = true;
      window.removeEventListener("message", onMessage);
    };
  }, [insightsUrl, postTokenToIframe]);

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
        status
      ),
      React.createElement(
        "a",
        {
          href: insightsUrl,
          target: "_top",
          rel: "noopener noreferrer",
          onClick: () => {
            const token = readTinaIdTokenFromStorage();
            if (!token) return;
            // Best-effort: cookie should already be set; fire again before leave.
            void fetch("/api/insights/session", {
              method: "POST",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ idToken: token }),
            });
          },
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
    iframeSrc
      ? React.createElement("iframe", {
          ref: iframeRef,
          src: iframeSrc,
          title: "Owner Insights",
          onLoad: () => {
            const token = readTinaIdTokenFromStorage();
            if (token) postTokenToIframe(token);
            setStatus("Owner Insights");
          },
          style: {
            flex: 1,
            width: "100%",
            minHeight: 0,
            border: "none",
            background: "#F7F1EA",
          },
        })
      : React.createElement(
          "div",
          {
            style: {
              flex: 1,
              display: "grid",
              placeItems: "center",
              color: "#776562",
              fontSize: 14,
            },
          },
          status
        )
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

/**
 * Tina sidebar screen for the Editing Guide — embeds the password-protected
 * /guide page (same origin, so the bq_guide cookie is shared).
 */
function GuideScreen(_props: { close: () => void }) {
  const guideUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/guide`
      : "/guide";

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
        "How to edit the site"
      ),
      React.createElement(
        "a",
        {
          href: guideUrl,
          target: "_blank",
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
      src: guideUrl,
      title: "Editing Guide",
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

function GuideScreenIcon() {
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
    React.createElement("path", {
      d: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20",
    }),
    React.createElement("path", {
      d: "M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z",
    })
  );
}

/** Build a Slate rich-text value from a plain sentence (for starter content). */
const rt = (text: string) => ({
  type: "root",
  children: [{ type: "p", children: [{ type: "text", text }] }],
});

// ---------------------------------------------------------------------------
// Shared page fields (title + layout + reorderable sections)
// ---------------------------------------------------------------------------

/**
 * Slugs that belong to the core site pages (defined in ./seo alongside the
 * URL mapping). Anything else in content/pages is a "New Page".
 */
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
  ...seoFields("page"),
];

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
  // NOTE: do NOT set tinaioConfig.contentApiUrlOverride (or the top-level
  // contentApiUrlOverride) to point the admin at our own domain. Tina's
  // TinaCMSProvider runs parseURL() on the content API URL and only
  // recognises *.tinajs.io hosts; any other host yields clientId/branch =
  // null and the admin throws "Invalid setup" before rendering — which
  // surfaces as "Failed loading TinaCMS assets" on /admin. See
  // docs/tina-cloud-zstd-issue.md for the history.
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
    cms.plugins.add({
      __type: "screen",
      name: "Guide",
      Component: GuideScreen,
      Icon: GuideScreenIcon,
      layout: "fullscreen",
      navCategory: "Help",
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
            templates: RICH_TEXT_TEMPLATES,
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
            type: "boolean",
            name: "showTableOfContents",
            label: "Show Table of Contents",
            ui: {
              description:
                "When on, a jump-link list is built automatically from Heading sections under the excerpt.",
            },
          },
          {
            type: "object",
            name: "sections",
            label: "Post Sections",
            list: true,
            ui: {
              visualSelector: true,
              description:
                "Build the article from sections, top to bottom. Drag to reorder, click a section to edit, or use + to add Heading, Text, Spacer, Image, and more.",
            },
            templates: BLOG_BLOCKS,
          },
          ...seoFields("post"),
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
            templates: RICH_TEXT_TEMPLATES,
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
            type: "object",
            name: "galleryImages",
            label: "Detail Page Thumbnails",
            list: true,
            ui: {
              description:
                "Up to 4 extra images for the thumbnail strip under the large preview. Slot 1 is always the Cover Image; the first upload here becomes thumbnail 2. Upload into images/products/.",
              max: 4,
              itemProps: (item: Record<string, unknown> | undefined) => ({
                label:
                  (item?.alt as string) ||
                  (item?.src as string)?.split("/").pop() ||
                  "Thumbnail",
              }),
              defaultItem: {
                src: "",
                alt: "",
              },
            },
            fields: [
              {
                type: "image",
                name: "src",
                label: "Image",
                ui: {
                  description:
                    "Square or 3:4 portrait works best. At least 800px wide.",
                },
              },
              {
                type: "string",
                name: "alt",
                label: "Alt Text",
                ui: charLimit(
                  125,
                  "Short description for screen readers (e.g. “Back cover” or “Interior page”)."
                ),
              },
            ],
          },
          {
            type: "object",
            name: "spreadImages",
            label: "Interior Spreads / Previews",
            list: true,
            ui: {
              description:
                "Up to 6 images for the Look Inside tab (books show as Spreads, digital as Previews). Upload page spreads or sample pages into images/products/.",
              max: 6,
              itemProps: (item: Record<string, unknown> | undefined) => ({
                label:
                  (item?.alt as string)?.trim() ||
                  (item?.src as string)?.split("/").pop() ||
                  "Spread",
              }),
              defaultItem: {
                src: "",
                alt: "",
              },
            },
            fields: [
              {
                type: "image",
                name: "src",
                label: "Image",
                ui: {
                  description:
                    "Landscape page spread or preview works best. At least 1200px wide.",
                },
              },
              {
                type: "string",
                name: "alt",
                label: "Alt Text",
                ui: charLimit(
                  125,
                  "Short description for screen readers (e.g. “Pages 4–5” or “Character lineup”)."
                ),
              },
            ],
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
                "eBook or printable download on Gumroad. Shown as a buy button on book product pages.",
            },
          },
          {
            type: "string",
            name: "amazonUrl",
            label: "Amazon URL (optional)",
            ui: {
              description:
                "Paperback listing on Amazon. Shown as a buy button on book product pages.",
            },
          },
          {
            type: "string",
            name: "googlePlayUrl",
            label: "Google Play URL (optional)",
            ui: {
              description:
                "eBook listing on Google Play. Shown as a buy button on book product pages.",
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
          ...seoFields("product"),
        ],
      },

      // ---------------------------------------------------------------
      // Gallery — single document; drag to reorder artworks.
      // ---------------------------------------------------------------
      {
        name: "gallery",
        label: "Gallery",
        path: "content/gallery",
        format: "json",
        ui: {
          allowedActions: { create: false, delete: false },
          router: () => "/gallery",
        },
        fields: [
          {
            type: "object",
            name: "items",
            label: "Artwork",
            list: true,
            ui: {
              itemProps: (item?: Record<string, unknown>) => ({
                label: (item?.title as string) || "Artwork",
              }),
              defaultItem: {
                title: "New artwork",
                description: "",
                image: "",
                downloadFile: "",
              },
              description:
                "Images on the Gallery page, top to bottom (shown in a masonry grid). Drag to reorder. Add an optional free downloadable resource on any piece — it shows a FREE badge on the grid.",
            },
            fields: [
              {
                type: "string",
                name: "title",
                label: "Title",
                required: true,
                ui: charLimit(
                  80,
                  "Shown on hover and in the lightbox under the image."
                ),
              },
              {
                type: "image",
                name: "image",
                label: "Image",
                required: true,
                ui: {
                  description:
                    "The artwork shown in the grid and lightbox. Prefer at least 1200px on the long edge. Upload into images/gallery/ or images/squarespace/digital-paintings/.",
                },
              },
              {
                type: "string",
                name: "description",
                label: "Description (optional)",
                ui: charLimit(
                  200,
                  "Short caption under the title in the lightbox."
                ),
              },
              {
                type: "image",
                name: "downloadFile",
                label: "Free Downloadable Resource (optional)",
                ui: {
                  description:
                    "A free file visitors can grab from the lightbox (coloring page, high-res image, PDF, etc.). When set, the artwork shows a FREE badge in the grid and a 'Sketch Download' button next to the full-image download. Upload via Media, or paste a path like /files/coloring-page.pdf. Leave empty if this piece has no free resource.",
                },
              },
            ],
          },
        ],
      },

      // ---------------------------------------------------------------
      // Downloads — single document; drag to reorder free resources.
      // ---------------------------------------------------------------
      {
        name: "download",
        label: "Downloads",
        path: "content/downloads",
        format: "json",
        ui: {
          allowedActions: { create: false, delete: false },
          router: () => "/downloads",
        },
        fields: [
          {
            type: "object",
            name: "items",
            label: "Free Downloads",
            list: true,
            ui: {
              itemProps: (item?: Record<string, unknown>) => ({
                label: (item?.title as string) || "Download",
              }),
              defaultItem: {
                title: "New download",
                description: "",
                file: "",
                fileType: "PDF",
                thumbnail: "",
              },
              description:
                "The free resources on the Downloads page, top to bottom. Drag to reorder. Remove any item to take it off the site.",
            },
            fields: [
              {
                type: "string",
                name: "title",
                label: "Title",
                required: true,
                ui: charLimit(80, "Shown on the download card."),
              },
              {
                type: "string",
                name: "description",
                label: "Description (optional)",
                ui: charLimit(200, "One or two sentences under the title."),
              },
              {
                type: "image",
                name: "file",
                label: "Downloadable File",
                required: true,
                ui: {
                  description:
                    "The file visitors get when they click Free Download (PDF, JPG, PNG, ZIP, etc.). Upload via Media, or paste a path like /files/coloring-page.pdf.",
                },
              },
              {
                type: "string",
                name: "fileType",
                label: "File Type Badge",
                required: true,
                options: ["PDF", "JPG", "PNG", "ZIP", "MP4", "EPUB"],
                ui: {
                  description:
                    "Shown as a small badge on the card image. Pick the format of the file.",
                },
              },
              {
                type: "image",
                name: "thumbnail",
                label: "Card Image (optional)",
                ui: {
                  description:
                    "Preview image on the card. Prefer 4:3 landscape, at least 800px wide. Upload into images/downloads/.",
                },
              },
            ],
          },
        ],
      },

      // ---------------------------------------------------------------
      // YouTube Tutorials — single document; drag to reorder videos.
      // ---------------------------------------------------------------
      {
        name: "tutorial",
        label: "YouTube Tutorials",
        path: "content/tutorials",
        format: "json",
        ui: {
          allowedActions: { create: false, delete: false },
          router: () => "/",
        },
        fields: [
          {
            type: "object",
            name: "items",
            label: "Videos",
            list: true,
            ui: {
              itemProps: (item?: Record<string, unknown>) => ({
                label: (item?.title as string) || "Video",
              }),
              defaultItem: {
                title: "New video",
                youtubeId: "",
                description: "",
                topic: "",
                featured: false,
              },
              description:
                "Your YouTube tutorial videos, top to bottom. Drag to reorder. Videos marked Featured appear in the homepage YouTube strip (up to 4, in this order).",
            },
            fields: [
              {
                type: "string",
                name: "title",
                label: "Video Title",
                required: true,
                ui: charLimit(90, "Shown under the video thumbnail."),
              },
              {
                type: "string",
                name: "youtubeId",
                label: "YouTube Video ID",
                required: true,
                ui: charLimit(
                  20,
                  "The 11-character code from the video URL — the part after watch?v= (e.g. 63_gp_rFtOc)."
                ),
              },
              {
                type: "string",
                name: "description",
                label: "Description (optional)",
                ui: charLimit(200, "One or two sentences about the video."),
              },
              {
                type: "string",
                name: "topic",
                label: "Topic (optional)",
                ui: charLimit(32, 'Grouping label (e.g. "Learning Krita", "Brushes").'),
              },
              {
                type: "boolean",
                name: "featured",
                label: "Featured on Homepage",
                ui: {
                  description:
                    "Featured videos appear in the homepage YouTube strip — the first 4 featured videos (in this list's order) are shown.",
                },
              },
            ],
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
