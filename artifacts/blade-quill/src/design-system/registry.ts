import { lazy } from "react";
import type { DesignSystemEntry } from "./types";
import { makeBlockDemo, CtaBandBothVariantsDemo } from "./demos/blocks/BlockDemo";

/**
 * Every entry on /design-system. Blocks mirror `tina/blocks.ts` 1:1 (all 39
 * templates) and their `guidelines` carry the admin specs from that schema:
 * character limits, image expectations, where each block is used and edited.
 */

/** Appended to every block that carries the shared Text Style controls. */
const TEXT_STYLE_NOTE =
  "Has a Text Style group in Tina (heading size, heading type, font, alignment, body size). Leave everything on Default to keep the design as-is.";

const SECTIONS_LOCATION = "Any page → Page Sections → Add Section";

/** Common image spec fragments (site conventions — see Images & Media below). */
const SPEC = {
  heroBg:
    "Wide landscape, ~1920×1080 or larger. JPG or WebP. Upload to images/pages/. Shown cropped edge-to-edge (cover).",
  artwork:
    "At least 1200px on the long edge. JPG/PNG/WebP. Shown scaled-to-fit (never cropped).",
  artworkCover:
    "At least 1200px wide. JPG/PNG/WebP. Shown cropped to fill its frame (cover) — keep the subject centered.",
  square:
    "Square-ish works best — displayed in a 1:1 frame, scaled to fit (never cropped). ≥1200px. JPG/PNG/WebP.",
  portrait:
    "Portrait orientation (about 3:4), ≥1200px wide. JPG/PNG/WebP.",
  bookCover:
    "Tall book-cover portrait (about 2:3), ≥1200px wide, PNG or JPG. Shown scaled-to-fit — never cropped.",
};

// ---------------------------------------------------------------------------
// Page Blocks — every Tina template, grouped as in tina/blocks.ts
// ---------------------------------------------------------------------------

const HERO_BLOCKS: DesignSystemEntry[] = [
  {
    id: "block-home-hero",
    name: "Hero (Homepage)",
    category: "block",
    group: "Heroes & headers",
    description:
      "The giant homepage hero: eyebrow, two-line gradient heading, dual CTAs, meta line, floating art cutouts, and a scrolling word marquee.",
    demo: makeBlockDemo("homeHero"),
    guidelines: {
      usage: "Use once, at the top of the homepage only.",
      usedOn: ["/"],
      cmsLocation: "Main Pages → Home → Page Sections → Hero (Homepage)",
      charLimits: [
        { field: "eyebrow", limit: 40 },
        { field: "heading", limit: 80 },
        { field: "ctaPrimary", limit: 24 },
        { field: "ctaSecondary", limit: 24 },
        { field: "metaLine", limit: 60 },
      ],
      notes: [
        "Press Enter once in the heading to split it into two lines — the second line renders in gradient color.",
        "Keep each scrolling marquee word under 20 characters.",
        "The three floating art cutouts (/images/hero/*.webp) are currently fixed in code and can't be swapped from Tina.",
        TEXT_STYLE_NOTE,
      ],
    },
  },
  {
    id: "block-about-hero",
    name: "Hero (Portrait)",
    category: "block",
    group: "Heroes & headers",
    description:
      "About-page hero with a three-line heading and a polaroid photo collage (portrait + two optional accent photos).",
    demo: makeBlockDemo("aboutHero"),
    guidelines: {
      usage: "Personal introduction pages — pairs a headline with real photos.",
      usedOn: ["/about"],
      cmsLocation: "Main Pages → About → Page Sections → Hero (Portrait)",
      images: [
        { field: "portraitImage", spec: `Main polaroid. ${SPEC.portrait}` },
        {
          field: "deskImage",
          spec: "Optional smaller polaroid (desktop only). Square-ish, ≥800px. Leave blank to hide.",
        },
        {
          field: "screenImage",
          spec: "Optional bottom-right polaroid (desktop only). Square-ish, ≥800px. Leave blank to hide.",
        },
      ],
      charLimits: [
        { field: "eyebrow", limit: 40 },
        { field: "heading", limit: 90 },
        { field: "ctaPrimary", limit: 24 },
        { field: "ctaSecondary", limit: 24 },
        { field: "metaLine", limit: 60 },
        { field: "portraitCaption", limit: 48 },
        { field: "deskCaption", limit: 32 },
        { field: "screenCaption", limit: 32 },
      ],
      notes: [
        "Heading supports up to three lines (press Enter) — the middle line renders in gradient color.",
        TEXT_STYLE_NOTE,
      ],
    },
  },
  {
    id: "block-hero",
    name: "Hero (Simple)",
    category: "block",
    group: "Heroes & headers",
    description:
      "Centered heading, subheading, and one CTA button over an optional background image with a paper overlay.",
    demo: makeBlockDemo("hero"),
    guidelines: {
      usage:
        "The general-purpose hero for featured/landing pages when you don't need the homepage treatment.",
      usedOn: ["/p/summer-workshop"],
      cmsLocation: `${SECTIONS_LOCATION} → Hero (Simple)`,
      images: [{ field: "backgroundImage", spec: SPEC.heroBg }],
      charLimits: [
        { field: "heading", limit: 70 },
        { field: "ctaLabel", limit: 24 },
      ],
      notes: [
        "The background gets an 80% paper-colored overlay so text stays readable — busy images are fine.",
        TEXT_STYLE_NOTE,
      ],
    },
  },
  {
    id: "block-hero-split-image",
    name: "Hero (Split Image)",
    category: "block",
    group: "Heroes & headers",
    description:
      "Headline and CTAs beside one large featured image (left or right).",
    demo: makeBlockDemo("heroSplitImage"),
    guidelines: {
      usage:
        "Book launches, class promos, portfolio highlights — anywhere one image carries the section.",
      cmsLocation: `${SECTIONS_LOCATION} → Hero (Split Image)`,
      images: [{ field: "featuredImage", spec: SPEC.artwork }],
      charLimits: [
        { field: "heading", limit: 80 },
        { field: "imageAlt", limit: 125 },
        { field: "imageCaption", limit: 80 },
        { field: "ctaPrimary", limit: 24 },
        { field: "ctaSecondary", limit: 24 },
      ],
      notes: ["Choose image left or right per section.", TEXT_STYLE_NOTE],
    },
  },
  {
    id: "block-hero-full-bleed",
    name: "Hero (Full Bleed)",
    category: "block",
    group: "Heroes & headers",
    description:
      "Edge-to-edge background artwork with overlaid text. Adjustable overlay darkness, text alignment, and height (45/60/80vh).",
    demo: makeBlockDemo("heroFullBleed"),
    guidelines: {
      usage: "Dramatic portfolio pieces or event banners.",
      cmsLocation: `${SECTIONS_LOCATION} → Hero (Full Bleed)`,
      images: [
        {
          field: "backgroundImage",
          spec: `${SPEC.heroBg} Faces/subjects should sit near the center — edges get cropped on narrow screens.`,
        },
      ],
      charLimits: [
        { field: "heading", limit: 70 },
        { field: "ctaLabel", limit: 24 },
      ],
      notes: [
        "Pick a darker overlay when the image is bright, so the text keeps contrast.",
        TEXT_STYLE_NOTE,
      ],
    },
  },
  {
    id: "block-hero-floating-images",
    name: "Hero (Floating Images)",
    category: "block",
    group: "Heroes & headers",
    description:
      "2–6 images scattered around the headline with a gentle drift — the editable cousin of the homepage hero collage.",
    demo: makeBlockDemo("heroFloatingImages"),
    guidelines: {
      usage: "Portfolio-style landing pages where several artworks share the stage.",
      cmsLocation: `${SECTIONS_LOCATION} → Hero (Floating Images)`,
      images: [
        {
          field: "images[].src",
          spec: `Add 2–6. ${SPEC.artworkCover} They auto-position around the headline on desktop.`,
        },
      ],
      charLimits: [
        { field: "eyebrow", limit: 40 },
        { field: "heading", limit: 70 },
        { field: "images[].alt", limit: 125 },
        { field: "images[].caption", limit: 80 },
        { field: "ctaPrimary", limit: 24 },
        { field: "ctaSecondary", limit: 24 },
      ],
      notes: [TEXT_STYLE_NOTE],
    },
  },
  {
    id: "block-hero-image-grid",
    name: "Hero (Image Mosaic)",
    category: "block",
    group: "Heroes & headers",
    description:
      "Headline over a 2-, 3-, or 4-image mosaic grid.",
    demo: makeBlockDemo("heroImageGrid"),
    guidelines: {
      usage: "Gallery-flavored page openers.",
      cmsLocation: `${SECTIONS_LOCATION} → Hero (Image Mosaic)`,
      images: [
        {
          field: "images[].src",
          spec: `Match the count to the chosen layout (duo/trio/quad). ${SPEC.artwork}`,
        },
      ],
      charLimits: [
        { field: "eyebrow", limit: 40 },
        { field: "heading", limit: 70 },
        { field: "images[].alt", limit: 125 },
        { field: "images[].caption", limit: 80 },
        { field: "ctaLabel", limit: 24 },
      ],
      notes: [TEXT_STYLE_NOTE],
    },
  },
  {
    id: "block-page-header",
    name: "Page Header",
    category: "block",
    group: "Heroes & headers",
    description: "Simple page-title band: heading plus intro text. No image.",
    demo: makeBlockDemo("pageHeader"),
    guidelines: {
      usage: "The standard opener for utility pages.",
      usedOn: ["/gallery", "/downloads", "/contact", "/publishers"],
      cmsLocation: `${SECTIONS_LOCATION} → Page Header`,
      charLimits: [{ field: "heading", limit: 60 }],
      notes: [TEXT_STYLE_NOTE],
    },
  },
];

const CONTENT_BLOCKS: DesignSystemEntry[] = [
  {
    id: "block-text",
    name: "Text Section",
    category: "block",
    group: "Content",
    description:
      "Rich-text section: paragraphs, lists, quotes, inline links and images, with an optional heading.",
    demo: makeBlockDemo("text"),
    guidelines: {
      usage: "Any long-form copy. The workhorse block.",
      usedOn: ["/publishers", "/p/…"],
      cmsLocation: `${SECTIONS_LOCATION} → Text Section`,
      charLimits: [{ field: "heading", limit: 70 }],
      notes: [
        "Links are added via Embed → Link; toggle “Open in new tab” for external sites (shows ↗).",
        "Inline images uploaded here should still follow the media guide below (≥1200px, kebab-case names).",
        TEXT_STYLE_NOTE,
      ],
    },
  },
  {
    id: "block-story",
    name: "Story Section",
    category: "block",
    group: "Content",
    description:
      "Numbered editorial section: margin label, two paragraphs around a dark pull-quote panel, and a small side polaroid.",
    demo: makeBlockDemo("story"),
    guidelines: {
      usage: "Narrative sections on the About page and similar.",
      usedOn: ["/about"],
      cmsLocation: `${SECTIONS_LOCATION} → Story Section`,
      images: [
        {
          field: "sideImage",
          spec: "Small polaroid on the right (desktop only). Square-ish, ≥800px. JPG/PNG.",
        },
      ],
      charLimits: [
        { field: "number", limit: 4 },
        { field: "label", limit: 24 },
        { field: "heading", limit: 80 },
        { field: "sideCaption", limit: 48 },
      ],
      notes: [TEXT_STYLE_NOTE],
    },
  },
  {
    id: "block-timeline",
    name: "Timeline",
    category: "block",
    group: "Content",
    description: "Year-by-year events, each with an optional artwork.",
    demo: makeBlockDemo("timeline"),
    guidelines: {
      usage: "History / milestones sections.",
      usedOn: ["/about"],
      cmsLocation: `${SECTIONS_LOCATION} → Timeline`,
      images: [
        {
          field: "events[].image",
          spec: `Optional per event. ${SPEC.artworkCover}`,
        },
      ],
      charLimits: [
        { field: "number", limit: 4 },
        { field: "label", limit: 24 },
        { field: "events[].year", limit: 12 },
        { field: "events[].title", limit: 48 },
        { field: "events[].description", limit: 220 },
      ],
      notes: [TEXT_STYLE_NOTE],
    },
  },
  {
    id: "block-stats-row",
    name: "Stats Row",
    category: "block",
    group: "Content",
    description: "A strip of short metrics (value + label). No images.",
    demo: makeBlockDemo("statsRow"),
    guidelines: {
      usage: "Social proof: subscriber counts, page counts, countries reached.",
      usedOn: ["/about"],
      cmsLocation: `${SECTIONS_LOCATION} → Stats Row`,
      charLimits: [
        { field: "stats[].value", limit: 12 },
        { field: "stats[].label", limit: 24 },
      ],
    },
  },
  {
    id: "block-feature-grid",
    name: "Feature Grid",
    category: "block",
    group: "Content",
    description: "Icon + title + description cards in a responsive grid.",
    demo: makeBlockDemo("featureGrid"),
    guidelines: {
      usage: "“What's included” lists for classes, products, or events.",
      usedOn: ["/p/summer-workshop"],
      cmsLocation: `${SECTIONS_LOCATION} → Feature Grid`,
      charLimits: [
        { field: "heading", limit: 70 },
        { field: "items[].title", limit: 48 },
      ],
      notes: [
        "Icons are Lucide icon names, e.g. “Brush”, “Star”, “BookOpen” — leave blank for no icon.",
        TEXT_STYLE_NOTE,
      ],
    },
  },
  {
    id: "block-card-row",
    name: "Card Row",
    category: "block",
    group: "Content",
    description:
      "Numbered “what I make” cards: tag, title, body, thumbnail, and link.",
    demo: makeBlockDemo("cardRow"),
    guidelines: {
      usage: "Grouping the studio's output into 3 linked categories.",
      usedOn: ["/about"],
      cmsLocation: `${SECTIONS_LOCATION} → Card Row`,
      images: [
        {
          field: "cards[].image",
          spec: `Card thumbnail. ${SPEC.artworkCover} Leave blank for the on-brand gradient fallback.`,
        },
      ],
      charLimits: [
        { field: "number", limit: 4 },
        { field: "label", limit: 24 },
        { field: "cards[].tag", limit: 16 },
        { field: "cards[].title", limit: 48 },
        { field: "cards[].body", limit: 220 },
        { field: "cards[].ctaLabel", limit: 24 },
      ],
      notes: [TEXT_STYLE_NOTE],
    },
  },
  {
    id: "block-pillars",
    name: "Pillars (3 Cards)",
    category: "block",
    group: "Content",
    description:
      "Three destination cards with media, wavy content panel, corner badge, and link.",
    demo: makeBlockDemo("pillars"),
    guidelines: {
      usage: "“Where would you like to start?” navigation on the homepage.",
      usedOn: ["/"],
      cmsLocation: "Main Pages → Home → Page Sections → Pillars (3 Cards)",
      images: [
        {
          field: "items[].image",
          spec: "Displayed in a fixed 220–240px-tall frame, cropped to fill (cover) — keep the subject centered. ≥1200px wide. Leave blank to auto-show a product or YouTube preview based on the link.",
        },
      ],
      charLimits: [
        { field: "eyebrow", limit: 40 },
        { field: "heading", limit: 60 },
        { field: "items[].tag", limit: 16 },
        { field: "items[].title", limit: 48 },
        { field: "items[].sub", limit: 60 },
        { field: "items[].cta", limit: 24 },
        { field: "items[].badge", limit: 16 },
      ],
      notes: [TEXT_STYLE_NOTE],
    },
  },
  {
    id: "block-image-gallery",
    name: "Image Gallery (Manual)",
    category: "block",
    group: "Content",
    description:
      "Hand-picked square image grid with captions — separate from the site-wide Gallery collection.",
    demo: makeBlockDemo("imageGallery"),
    guidelines: {
      usage:
        "Small curated image sets inside a page. For the main art gallery use the Art Gallery Grid instead.",
      usedOn: ["/publishers", "/p/…"],
      cmsLocation: `${SECTIONS_LOCATION} → Image Gallery (Manual)`,
      images: [{ field: "images[].src", spec: SPEC.square }],
      charLimits: [
        { field: "heading", limit: 70 },
        { field: "images[].alt", limit: 125 },
        { field: "images[].caption", limit: 80 },
      ],
      notes: [TEXT_STYLE_NOTE],
    },
  },
  {
    id: "block-image-spotlight",
    name: "Image (Spotlight)",
    category: "block",
    group: "Content",
    description:
      "One large image with eyebrow, heading, caption, and optional body text. Selectable frame: 16:10, 1:1, 3:4, or 21:9.",
    demo: makeBlockDemo("imageSpotlight"),
    guidelines: {
      usage: "Featuring a single artwork with room to breathe.",
      cmsLocation: `${SECTIONS_LOCATION} → Image (Spotlight)`,
      images: [
        {
          field: "image",
          spec: `Pick the aspect option that matches the artwork — the image is scaled to fit the frame, never cropped. ${SPEC.artwork}`,
        },
      ],
      charLimits: [
        { field: "eyebrow", limit: 40 },
        { field: "heading", limit: 70 },
        { field: "alt", limit: 125 },
        { field: "caption", limit: 80 },
      ],
      notes: [TEXT_STYLE_NOTE],
    },
  },
  {
    id: "block-image-side-by-side",
    name: "Image (Side by Side)",
    category: "block",
    group: "Content",
    description:
      "Two images paired — before/after or compare/contrast — framed as polaroids, clean, or rounded.",
    demo: makeBlockDemo("imageSideBySide"),
    guidelines: {
      usage: "Process comparisons (sketch vs. final) or paired artworks.",
      cmsLocation: `${SECTIONS_LOCATION} → Image (Side by Side)`,
      images: [
        {
          field: "leftImage / rightImage",
          spec: `Use two images with similar orientation so the pair lines up. ${SPEC.artworkCover}`,
        },
      ],
      charLimits: [
        { field: "heading", limit: 60 },
        { field: "…alt", limit: 125 },
        { field: "…caption", limit: 80 },
      ],
      notes: [TEXT_STYLE_NOTE],
    },
  },
  {
    id: "block-image-masonry",
    name: "Image (Masonry)",
    category: "block",
    group: "Content",
    description:
      "3–6 images in an asymmetric masonry wall at their natural proportions.",
    demo: makeBlockDemo("imageMasonry"),
    guidelines: {
      usage: "A loose “wall of work” inside a page.",
      cmsLocation: `${SECTIONS_LOCATION} → Image (Masonry)`,
      images: [
        {
          field: "images[].src",
          spec: `Mixed orientations welcome — images keep their natural shape. ${SPEC.artwork}`,
        },
      ],
      charLimits: [
        { field: "heading", limit: 60 },
        { field: "images[].alt", limit: 125 },
        { field: "images[].caption", limit: 80 },
      ],
      notes: [TEXT_STYLE_NOTE],
    },
  },
  {
    id: "block-video-embed",
    name: "Video Embed",
    category: "block",
    group: "Content",
    description: "A 16:9 YouTube embed with an optional heading.",
    demo: makeBlockDemo("videoEmbed"),
    guidelines: {
      usage: "Embedding a single tutorial or trailer in a page.",
      usedOn: ["/p/summer-workshop"],
      cmsLocation: `${SECTIONS_LOCATION} → Video Embed`,
      charLimits: [{ field: "heading", limit: 70 }],
      notes: [
        "Paste the full YouTube URL (youtube.com or youtu.be) — the embed ID is extracted automatically.",
        TEXT_STYLE_NOTE,
      ],
    },
  },
];

const COMMERCE_BLOCKS: DesignSystemEntry[] = [
  {
    id: "block-featured-book",
    name: "Featured Book",
    category: "block",
    group: "Commerce & media",
    description:
      "Homepage book highlight: eyebrow, heading, description, stats row, and two CTAs beside book art.",
    demo: makeBlockDemo("featuredBook"),
    guidelines: {
      usage: "Spotlighting the current release on the homepage.",
      usedOn: ["/"],
      cmsLocation: "Main Pages → Home → Page Sections → Featured Book",
      charLimits: [
        { field: "eyebrow", limit: 40 },
        { field: "heading", limit: 60 },
        { field: "stats[].value", limit: 12 },
        { field: "stats[].label", limit: 24 },
        { field: "ctaLabel", limit: 24 },
        { field: "secondaryLabel", limit: 24 },
      ],
      notes: [
        "The book art in this block comes from the product catalog / built-in covers, not from a Tina image field.",
        TEXT_STYLE_NOTE,
      ],
    },
  },
  {
    id: "block-featured-release",
    name: "Featured Release",
    category: "block",
    group: "Commerce & media",
    description:
      "Release announcement with front (and optional back) cover shown full-size, plus one CTA button.",
    demo: makeBlockDemo("featuredRelease"),
    guidelines: {
      usage: "The link-in-bio page's main announcement.",
      usedOn: ["/important-links-page"],
      cmsLocation: `${SECTIONS_LOCATION} → Featured Release`,
      images: [
        { field: "coverImage", spec: SPEC.bookCover },
        {
          field: "backCoverImage",
          spec: `Optional — shown beside the front. ${SPEC.bookCover}`,
        },
      ],
      charLimits: [
        { field: "eyebrow", limit: 40 },
        { field: "title", limit: 60 },
        { field: "ctaLabel", limit: 24 },
      ],
      notes: [
        "Button URL must start with https:// (or / for a page on this site).",
        TEXT_STYLE_NOTE,
      ],
    },
  },
  {
    id: "block-product-strip",
    name: "Product Strip",
    category: "block",
    group: "Commerce & media",
    description:
      "A horizontal strip of shop products with a “view all” link. Products load automatically from the catalog.",
    demo: makeBlockDemo("productStrip"),
    guidelines: {
      usage: "Teasing the shop from landing pages. Currently unused on live pages.",
      cmsLocation: `${SECTIONS_LOCATION} → Product Strip`,
      charLimits: [
        { field: "eyebrow", limit: 40 },
        { field: "heading", limit: 60 },
        { field: "viewAllLabel", limit: 24 },
      ],
      notes: [
        "Products and their images are managed under Shop Products in Tina (cover image: square or 3:4 portrait, ≥1200px, in images/products/).",
        TEXT_STYLE_NOTE,
      ],
    },
  },
  {
    id: "block-shop-catalog",
    name: "Shop Catalog",
    category: "block",
    group: "Commerce & media",
    description:
      "The full shop: heading with gradient highlight word, optional featured banner, category filters, and the product grid.",
    demo: makeBlockDemo("shopCatalog"),
    guidelines: {
      usage: "Use once, on the Shop page only.",
      usedOn: ["/shop"],
      cmsLocation: "Main Pages → Shop → Page Sections → Shop Catalog",
      charLimits: [
        { field: "heading", limit: 48 },
        { field: "highlightText", limit: 40 },
        { field: "emptyHeading", limit: 60 },
        { field: "emptyDescription", limit: 120 },
      ],
      notes: [
        "Products themselves (name, price, images, stock) are edited under Shop Products in the Tina sidebar.",
        "Product cover images: square or 3:4 portrait, ≥1200px, uploaded to images/products/. Look-inside spreads: landscape, ≥1200px wide.",
        "The highlight word must match the heading text exactly to get the gradient.",
        TEXT_STYLE_NOTE,
      ],
    },
  },
  {
    id: "block-gallery-grid",
    name: "Art Gallery Grid",
    category: "block",
    group: "Commerce & media",
    description:
      "Masonry wall of every artwork in the Gallery collection, with a lightbox (and optional per-artwork download).",
    demo: makeBlockDemo("galleryGrid"),
    guidelines: {
      usage: "Use once, on the Gallery page only.",
      usedOn: ["/gallery"],
      cmsLocation:
        "Block: Main Pages → Gallery. Artworks: Gallery collection in the Tina sidebar (drag to reorder).",
      images: [
        {
          field: "Gallery → items[].image",
          spec: "≥1200px on the long edge, JPG/PNG/WebP, upload to images/gallery/. Any proportions — the masonry keeps each artwork's natural shape, and the lightbox never crops.",
        },
        {
          field: "Gallery → items[].downloadFile",
          spec: "Optional extra file visitors can download from the lightbox (PDF/JPG/PNG). Upload to files/ or images/.",
        },
      ],
      charLimits: [
        { field: "emptyHeading", limit: 60 },
        { field: "emptyDescription", limit: 120 },
      ],
      notes: [
        "The block's own fields only control the empty state — everything else comes from the Gallery collection.",
        TEXT_STYLE_NOTE,
      ],
    },
  },
  {
    id: "block-downloads-grid",
    name: "Downloads Grid",
    category: "block",
    group: "Commerce & media",
    description:
      "Grid of free downloadable resources with 4:3 thumbnails and download buttons.",
    demo: makeBlockDemo("downloadsGrid"),
    guidelines: {
      usage: "Use once, on the Downloads page only.",
      usedOn: ["/downloads"],
      cmsLocation: "Main Pages → Downloads → Page Sections → Downloads Grid",
      images: [
        {
          field: "thumbnails",
          spec: "Displayed in a 4:3 frame, scaled to fit (never cropped). ≥1200px wide. Downloadable files (PDF/ZIP/JPG) live in the files/ folder.",
        },
      ],
      charLimits: [
        { field: "emptyHeading", limit: 60 },
        { field: "emptyDescription", limit: 120 },
      ],
      notes: [TEXT_STYLE_NOTE],
    },
  },
  {
    id: "block-featured-video",
    name: "Newest Video (YouTube)",
    category: "block",
    group: "Commerce & media",
    description:
      "Dark feature panel that automatically embeds the newest Blade & Quill YouTube upload, with a gold “Newest video” badge and subscribe button.",
    demo: makeBlockDemo("featuredVideo"),
    guidelines: {
      usage: "Featuring the latest YouTube lesson on landing pages.",
      usedOn: ["/education"],
      cmsLocation: `${SECTIONS_LOCATION} → Newest Video (YouTube)`,
      charLimits: [
        { field: "eyebrow", limit: 40 },
        { field: "heading", limit: 60 },
        { field: "buttonLabel", limit: 24 },
      ],
      notes: [
        "The newest upload is resolved automatically at every site build/deploy (no API key) and shipped as /latest-video.json. Paste a YouTube URL in the block to pin a specific video instead.",
        "If the video file is missing, the first featured tutorial is shown so the section never renders empty.",
        TEXT_STYLE_NOTE,
      ],
    },
  },
  {
    id: "block-gallery-preview",
    name: "Gallery Preview",
    category: "block",
    group: "Commerce & media",
    description:
      "The first N artworks from the Gallery collection in a square-tile grid with lightbox, plus a “view all” button.",
    demo: makeBlockDemo("galleryPreview"),
    guidelines: {
      usage: "Teasing the gallery from landing pages (the full wall stays on /gallery).",
      usedOn: ["/education"],
      cmsLocation: `${SECTIONS_LOCATION} → Gallery Preview`,
      charLimits: [
        { field: "eyebrow", limit: 40 },
        { field: "heading", limit: 60 },
        { field: "viewAllLabel", limit: 32 },
      ],
      notes: [
        "Artworks come from the Gallery collection (Tina sidebar), in CMS order.",
        TEXT_STYLE_NOTE,
      ],
    },
  },
  {
    id: "block-downloads-preview",
    name: "Downloads Preview",
    category: "block",
    group: "Commerce & media",
    description:
      "The first N free downloads as cards with direct download buttons, plus a “view all” link to the Downloads page.",
    demo: makeBlockDemo("downloadsPreview"),
    guidelines: {
      usage: "Teasing free resources from landing pages (the full grid stays on /downloads).",
      usedOn: ["/education"],
      cmsLocation: `${SECTIONS_LOCATION} → Downloads Preview`,
      charLimits: [
        { field: "eyebrow", limit: 40 },
        { field: "heading", limit: 60 },
        { field: "viewAllLabel", limit: 32 },
      ],
      notes: [TEXT_STYLE_NOTE],
    },
  },
  {
    id: "block-tutorials-strip",
    name: "YouTube Tutorials Strip",
    category: "block",
    group: "Commerce & media",
    description:
      "Dark YouTube CTA panel: three-part heading with gradient highlight, subscribe button, and stats row.",
    demo: makeBlockDemo("tutorialsStrip"),
    guidelines: {
      usage: "Driving YouTube subscriptions from the homepage.",
      usedOn: ["/"],
      cmsLocation: "Main Pages → Home → Page Sections → YouTube Tutorials Strip",
      charLimits: [
        { field: "eyebrow", limit: 40 },
        { field: "headingPrefix", limit: 30 },
        { field: "headingHighlight", limit: 40 },
        { field: "headingSuffix", limit: 40 },
        { field: "buttonLabel", limit: 24 },
        { field: "stats[].value", limit: 12 },
        { field: "stats[].label", limit: 24 },
      ],
      notes: [
        "Video thumbnails come from YouTube automatically.",
        TEXT_STYLE_NOTE,
      ],
    },
  },
  {
    id: "block-classes-pitch",
    name: "Classes Pitch",
    category: "block",
    group: "Commerce & media",
    description:
      "Classroom promo card: benefit bullets, meta tags, dual CTAs, and module art tiles.",
    demo: makeBlockDemo("classesPitch"),
    guidelines: {
      usage: "Promoting classes/curriculum. Currently unused on live pages.",
      cmsLocation: `${SECTIONS_LOCATION} → Classes Pitch`,
      charLimits: [
        { field: "eyebrow", limit: 40 },
        { field: "heading", limit: 60 },
        { field: "metaTags", limit: 80 },
        { field: "ctaLabel", limit: 24 },
        { field: "secondaryLabel", limit: 24 },
      ],
      notes: [
        "Keep each bullet under 60 characters. Separate meta items with “·”.",
        "The module tiles are fixed on-brand art (not editable in Tina).",
        TEXT_STYLE_NOTE,
      ],
    },
  },
  {
    id: "block-blog-feed",
    name: "Blog Feed",
    category: "block",
    group: "Commerce & media",
    description:
      "Recent blog posts (loaded automatically) with an optional dark newsletter panel beside them.",
    demo: makeBlockDemo("blogFeed"),
    guidelines: {
      usage: "Surfacing recent writing on the homepage.",
      usedOn: ["/"],
      cmsLocation: "Main Pages → Home → Page Sections → Blog Feed",
      charLimits: [
        { field: "heading", limit: 60 },
        { field: "newsletter.eyebrow", limit: 40 },
        { field: "newsletter.heading", limit: 60 },
        { field: "newsletter.placeholderText", limit: 32 },
        { field: "newsletter.ctaLabel", limit: 24 },
        { field: "newsletter.privacyNote", limit: 80 },
      ],
      notes: [
        "Post covers come from each Blog Post's Cover Image (~1600×900, 16:9, in images/blog/).",
        TEXT_STYLE_NOTE,
      ],
    },
  },
];

const CTA_BLOCKS: DesignSystemEntry[] = [
  {
    id: "block-cta-band",
    name: "CTA Band",
    category: "block",
    group: "CTAs & forms",
    description:
      "Horizontal call-to-action strip with heading, supporting line, and one button — light and dark variants.",
    demo: CtaBandBothVariantsDemo,
    guidelines: {
      usage: "Closing out a page section with a single next step.",
      usedOn: ["/p/…"],
      cmsLocation: `${SECTIONS_LOCATION} → CTA Band`,
      charLimits: [
        { field: "heading", limit: 70 },
        { field: "ctaLabel", limit: 24 },
      ],
      notes: [
        "Choose “dark” for a dark panel with light text; “light” is the default.",
        TEXT_STYLE_NOTE,
      ],
    },
  },
  {
    id: "block-big-cta",
    name: "Big CTA",
    category: "block",
    group: "CTAs & forms",
    description:
      "Large centered closing statement with a gradient highlight word and up to two buttons.",
    demo: makeBlockDemo("bigCta"),
    guidelines: {
      usage: "The final “say hi” moment at the bottom of a page.",
      usedOn: ["/about"],
      cmsLocation: `${SECTIONS_LOCATION} → Big CTA`,
      charLimits: [
        { field: "eyebrow", limit: 40 },
        { field: "heading", limit: 90 },
        { field: "highlightText", limit: 40 },
        { field: "primaryLabel", limit: 24 },
        { field: "secondaryLabel", limit: 24 },
      ],
      notes: [
        "The highlighted word must match the heading text exactly. Press Enter in the heading for a line break.",
        TEXT_STYLE_NOTE,
      ],
    },
  },
  {
    id: "block-newsletter-signup",
    name: "Newsletter Signup",
    category: "block",
    group: "CTAs & forms",
    description:
      "Standalone newsletter panel: eyebrow, heading, description, email field, and privacy note.",
    demo: makeBlockDemo("newsletterSignup"),
    guidelines: {
      usage:
        "Newsletter capture anywhere outside the homepage Blog Feed (which has its own panel).",
      cmsLocation: `${SECTIONS_LOCATION} → Newsletter Signup`,
      charLimits: [
        { field: "eyebrow", limit: 40 },
        { field: "heading", limit: 60 },
        { field: "placeholderText", limit: 32 },
        { field: "ctaLabel", limit: 24 },
        { field: "privacyNote", limit: 80 },
      ],
      notes: [TEXT_STYLE_NOTE],
    },
  },
  {
    id: "block-contact-info",
    name: "Contact Info",
    category: "block",
    group: "CTAs & forms",
    description: "Public email address and general location.",
    demo: makeBlockDemo("contactInfo"),
    guidelines: {
      usage: "Contact page details.",
      usedOn: ["/contact"],
      cmsLocation: "Main Pages → Contact → Page Sections → Contact Info",
      charLimits: [{ field: "location", limit: 48 }],
      notes: [
        "The email is shown publicly — use a safe inbox, not a personal address.",
      ],
    },
  },
  {
    id: "block-contact-form",
    name: "Contact Form",
    category: "block",
    group: "CTAs & forms",
    description:
      "The site contact form. Messages are delivered to the studio inbox automatically.",
    demo: makeBlockDemo("contactForm"),
    guidelines: {
      usage: "Use once, on the Contact page.",
      usedOn: ["/contact"],
      cmsLocation: "Main Pages → Contact → Page Sections → Contact Form",
      charLimits: [{ field: "submitLabel", limit: 24 }],
    },
  },
  {
    id: "block-dummy-book-request",
    name: "Dummy Book Request",
    category: "block",
    group: "CTAs & forms",
    description:
      "Gated PDF request form for publishers: visitor fills in details, the PDF unlocks, and Corinne is notified.",
    demo: makeBlockDemo("dummyBookRequest"),
    guidelines: {
      usage: "Publisher outreach pages.",
      usedOn: ["/publishers"],
      cmsLocation: `${SECTIONS_LOCATION} → Dummy Book Request`,
      charLimits: [
        { field: "heading", limit: 60 },
        { field: "submitLabel", limit: 32 },
        { field: "successHeading", limit: 60 },
        { field: "successNote", limit: 220 },
        { field: "downloadLabel", limit: 32 },
      ],
      notes: [
        "The PDF itself is a file path like /files/… — upload PDFs to the files/ folder, not images/.",
        TEXT_STYLE_NOTE,
      ],
    },
  },
  {
    id: "block-kofi-support",
    name: "Ko-fi Support",
    category: "block",
    group: "CTAs & forms",
    description: "Centered support panel with a Ko-fi button.",
    demo: makeBlockDemo("kofiSupport"),
    guidelines: {
      usage: "Tip-jar sections.",
      usedOn: ["/", "/important-links-page"],
      cmsLocation: `${SECTIONS_LOCATION} → Ko-fi Support`,
      charLimits: [
        { field: "heading", limit: 60 },
        { field: "ctaLabel", limit: 24 },
      ],
      notes: [TEXT_STYLE_NOTE],
    },
  },
  {
    id: "block-review-links",
    name: "Review Buttons",
    category: "block",
    group: "CTAs & forms",
    description:
      "Per-region review buttons (Amazon.com, Amazon.fr, …) with intro and thank-you copy.",
    demo: makeBlockDemo("reviewLinks"),
    guidelines: {
      usage: "Asking readers for reviews after a release.",
      usedOn: ["/important-links-page"],
      cmsLocation: `${SECTIONS_LOCATION} → Review Buttons`,
      charLimits: [
        { field: "heading", limit: 60 },
        { field: "thankYou", limit: 80 },
        { field: "ctaHeading", limit: 80 },
        { field: "links[].label", limit: 32 },
      ],
      notes: [
        "One button per region; links open in a new tab.",
        TEXT_STYLE_NOTE,
      ],
    },
  },
];

const STANDALONE_BLOCKS: DesignSystemEntry[] = [
  {
    id: "block-marquee",
    name: "Announcement Marquee",
    category: "block",
    group: "Standalone extras",
    description:
      "Scrolling announcement strip — highlighted lead-in plus muted text.",
    demo: makeBlockDemo("marquee"),
    guidelines: {
      usage: "Top-of-page announcements on standalone/link-in-bio pages.",
      usedOn: ["/important-links-page"],
      cmsLocation: `${SECTIONS_LOCATION} → Announcement Marquee`,
      charLimits: [
        { field: "highlightText", limit: 40 },
        { field: "text", limit: 80 },
      ],
      notes: ["Pauses for visitors who prefer reduced motion."],
    },
  },
  {
    id: "block-social-links",
    name: "Social Links",
    category: "block",
    group: "Standalone extras",
    description:
      "Social icon row (YouTube, Instagram, Pinterest, Amazon, Ko-fi) — plain, or inside a centered panel when a heading is set.",
    demo: makeBlockDemo("socialLinks"),
    guidelines: {
      usage: "Anywhere you want the social icons.",
      usedOn: ["/publishers", "/important-links-page"],
      cmsLocation: `${SECTIONS_LOCATION} → Social Links`,
      charLimits: [
        { field: "heading", limit: 60 },
        { field: "links[].label", limit: 32 },
      ],
      notes: [
        "The platform choice controls the icon; the label is the accessible name read by screen readers.",
        TEXT_STYLE_NOTE,
      ],
    },
  },
];

// ---------------------------------------------------------------------------
// Brand components — site chrome + components/site/*
// ---------------------------------------------------------------------------

const BRAND: DesignSystemEntry[] = [
  {
    id: "navbar",
    name: "Navbar",
    category: "brand",
    group: "Site chrome",
    description: "Site header with navigation, cart, and mobile menu.",
    demo: lazy(() => import("./demos/brand/NavbarDemo")),
    guidelines: {
      cmsLocation: "Menu & Footer → main → Menu Items",
      notes: [
        "Prefer Link Type → Site page so links can't typo; use External URL for YouTube/Amazon.",
      ],
    },
  },
  {
    id: "footer",
    name: "Footer",
    category: "brand",
    group: "Site chrome",
    description:
      "Site footer with pages, social icons, newsletter signup, and admin link.",
    demo: lazy(() => import("./demos/brand/FooterDemo")),
    guidelines: {
      cmsLocation: "Menu & Footer → main → Footer Columns",
    },
  },
  {
    id: "btn",
    name: "Btn (Brand Button)",
    category: "brand",
    group: "Brand components",
    description:
      "The brand CTA pill: primary (gradient sweep + lift), outline (fills on hover), ghost (underline draws in), light (for dark panels). Sizes sm/md/lg; renders as a link when given an href.",
    demo: lazy(() => import("./demos/brand/BtnDemo")),
    guidelines: {
      usage:
        "Developers: use Btn for marketing/CTA surfaces; the shadcn Button (Atoms below) is for app UI like forms and dialogs. Two or more buttons together? Wrap them in BtnGroup.",
    },
  },
  {
    id: "btn-group",
    name: "BtnGroup (CTA ordering)",
    category: "brand",
    group: "Brand components",
    description:
      "Button-group ordering rule: the primary action always sits on the RIGHT in a horizontal group and on TOP when buttons stack on mobile. Write children primary-first; BtnGroup flips the horizontal order automatically.",
    demo: lazy(() => import("./demos/brand/BtnGroupDemo")),
    guidelines: {
      usage:
        "Wrap any pair/group of CTAs. Primary first in code — it renders right on desktop, top on mobile. Use align to match the section's text alignment.",
      notes: [
        "Never hard-code button order per breakpoint — BtnGroup owns the rule.",
        "One primary per group; everything else is outline, ghost, or light.",
      ],
    },
  },
  {
    id: "product-card",
    name: "Product Card",
    category: "brand",
    group: "Brand components",
    description:
      "Shop card: BookCover for physical books, ArtTile otherwise; hover lifts the media and peels the page corner.",
    demo: lazy(() => import("./demos/brand/ProductCardDemo")),
    guidelines: {
      cmsLocation: "Shop Products (name, price, cover image, stock, featured)",
      images: [
        {
          field: "product image",
          spec: "Square or 3:4 portrait, ≥1200px wide, JPG/PNG/WebP, uploaded to images/products/.",
        },
      ],
      notes: [
        "This demo shows real products from the catalog.",
        "The “NEW” pill appears when a product is marked Featured.",
      ],
    },
  },
  {
    id: "art-tile",
    name: "Art Tile",
    category: "brand",
    group: "Brand components",
    description:
      "The universal artwork frame: real image (cover-cropped, lazy-loaded) or an on-palette gradient fallback with a monospace label.",
    demo: lazy(() => import("./demos/brand/ArtTileDemo")),
    guidelines: {
      usage:
        "Developers: any artwork slot without a confirmed asset should be an ArtTile so empty states stay on-brand.",
      notes: [
        "Images are cropped to fill (object-cover) — keep subjects centered.",
        "All ArtTile images lazy-load automatically.",
      ],
    },
  },
  {
    id: "polaroid",
    name: "Polaroid",
    category: "brand",
    group: "Brand components",
    description:
      "White-framed photo card with washi-tape strip, mono caption, and optional hover-straighten.",
    demo: lazy(() => import("./demos/brand/PolaroidDemo")),
    guidelines: {
      usage: "Personal photos (About page collage, story sections).",
      notes: ["Captions render in uppercase monospace — keep them short."],
    },
  },
  {
    id: "tutorial-thumb",
    name: "Tutorial Thumb",
    category: "brand",
    group: "Brand components",
    description:
      "YouTube-style thumbnail with centered play button and duration chip; can auto-load a video's thumbnail from its YouTube ID.",
    demo: lazy(() => import("./demos/brand/TutorialThumbDemo")),
    guidelines: {
      notes: [
        "Given a youtubeId, the thumbnail comes from i.ytimg.com automatically — no upload needed.",
      ],
    },
  },
  {
    id: "book-cover",
    name: "Book Cover",
    category: "brand",
    group: "Brand components",
    description:
      "Stylized book frame with spine highlight — real cover art edge-to-edge, or a gradient placeholder with serif title.",
    demo: lazy(() => import("./demos/brand/BookCoverDemo")),
    guidelines: {
      images: [
        {
          field: "src",
          spec: "Tall book-cover portrait (~2:3), ≥1200px wide. Cover-cropped to the frame.",
        },
      ],
    },
  },
  {
    id: "quill-mark",
    name: "Quill Mark",
    category: "brand",
    group: "Brand components",
    description:
      "The small quill SVG used in the nav/footer logo tile. Scales 16–32px; inherits color.",
    demo: lazy(() => import("./demos/brand/QuillMarkDemo")),
  },
  {
    id: "word-reveal",
    name: "Word Reveal / Reveal",
    category: "brand",
    group: "Motion",
    description:
      "Headline words rise one-by-one as they enter the viewport; Reveal/reveal-stagger do the same for whole sections.",
    demo: lazy(() => import("./demos/brand/WordRevealDemo")),
    guidelines: {
      notes: [
        "All reveal motion is disabled automatically for visitors who prefer reduced motion.",
      ],
    },
  },
  {
    id: "ink-underline",
    name: "Ink Underline",
    category: "brand",
    group: "Motion",
    description:
      "Hand-drawn curvy underline used under active nav links and editorial accents; stroke color is themable.",
    demo: lazy(() => import("./demos/brand/InkUnderlineDemo")),
  },
];

// ---------------------------------------------------------------------------
// Molecules & Atoms — shadcn/ui primitives
// ---------------------------------------------------------------------------

const MOLECULES: DesignSystemEntry[] = [
  { id: "input-group", name: "Input Group", category: "molecule", description: "Input with addon icons or text.", demo: lazy(() => import("./demos/molecules/InputGroupDemo")) },
  { id: "button-group", name: "Button Group", category: "molecule", description: "Grouped buttons with shared border radius.", demo: lazy(() => import("./demos/molecules/ButtonGroupDemo")) },
  { id: "alert-dialog", name: "Alert Dialog", category: "molecule", description: "Confirmation dialog with cancel/action buttons.", demo: lazy(() => import("./demos/molecules/AlertDialogDemo")) },
  { id: "command", name: "Command", category: "molecule", description: "Searchable command palette.", demo: lazy(() => import("./demos/molecules/CommandDemo")) },
  { id: "pagination", name: "Pagination", category: "molecule", description: "Page navigation with prev/next.", demo: lazy(() => import("./demos/molecules/PaginationDemo")) },
  { id: "carousel", name: "Carousel", category: "molecule", description: "Horizontal content slider.", demo: lazy(() => import("./demos/molecules/CarouselDemo")) },
  { id: "navigation-menu", name: "Navigation Menu", category: "molecule", description: "Dropdown navigation with content panels.", demo: lazy(() => import("./demos/molecules/NavigationMenuDemo")) },
  { id: "menubar", name: "Menubar", category: "molecule", description: "Horizontal menu bar with dropdown menus.", demo: lazy(() => import("./demos/atoms/MenubarDemo")) },
  { id: "form", name: "Form", category: "molecule", description: "react-hook-form wrapper with labels, descriptions, and validation messages.", demo: lazy(() => import("./demos/atoms/FormDemo")) },
  { id: "chart", name: "Chart", category: "molecule", description: "Recharts wrapper with themed tooltip and legend.", demo: lazy(() => import("./demos/atoms/ChartDemo")) },
  { id: "sidebar", name: "Sidebar", category: "molecule", description: "Composable app sidebar with groups, menus, and collapse behavior.", demo: lazy(() => import("./demos/atoms/SidebarDemo")) },
];

const ATOMS: DesignSystemEntry[] = [
  {
    id: "button",
    name: "Button",
    category: "atom",
    description: "Primary interactive element with multiple variants and sizes.",
    demo: lazy(() => import("./demos/atoms/ButtonDemo")),
    guidelines: {
      notes: [
        "Variants: default (brand gradient — same --g-cta language as Btn primary), secondary, outline (ink, fills on hover), ghost, link. Sizes: sm, default, lg, icon.",
        "Gold is accent-only — never a button fill. For marketing CTAs use the brand Btn component instead.",
      ],
    },
  },
  { id: "badge", name: "Badge", category: "atom", description: "Status or category label.", demo: lazy(() => import("./demos/atoms/BadgeDemo")) },
  { id: "input", name: "Input", category: "atom", description: "Text input field.", demo: lazy(() => import("./demos/atoms/InputDemo")) },
  { id: "textarea", name: "Textarea", category: "atom", description: "Multi-line text input.", demo: lazy(() => import("./demos/atoms/TextareaDemo")) },
  { id: "label", name: "Label", category: "atom", description: "Form field label.", demo: lazy(() => import("./demos/atoms/LabelDemo")) },
  { id: "field", name: "Field", category: "atom", description: "Field layout primitives (label, description, error).", demo: lazy(() => import("./demos/atoms/FieldDemo")) },
  { id: "checkbox", name: "Checkbox", category: "atom", description: "Boolean toggle input.", demo: lazy(() => import("./demos/atoms/CheckboxDemo")) },
  { id: "radio-group", name: "Radio Group", category: "atom", description: "Single-select option list.", demo: lazy(() => import("./demos/atoms/RadioGroupDemo")) },
  { id: "switch", name: "Switch", category: "atom", description: "Toggle switch.", demo: lazy(() => import("./demos/atoms/SwitchDemo")) },
  { id: "slider", name: "Slider", category: "atom", description: "Range value input.", demo: lazy(() => import("./demos/atoms/SliderDemo")) },
  { id: "select", name: "Select", category: "atom", description: "Dropdown selection.", demo: lazy(() => import("./demos/atoms/SelectDemo")) },
  { id: "progress", name: "Progress", category: "atom", description: "Linear progress indicator.", demo: lazy(() => import("./demos/atoms/ProgressDemo")) },
  { id: "skeleton", name: "Skeleton", category: "atom", description: "Loading placeholder.", demo: lazy(() => import("./demos/atoms/SkeletonDemo")) },
  { id: "spinner", name: "Spinner", category: "atom", description: "Loading spinner animation.", demo: lazy(() => import("./demos/atoms/SpinnerDemo")) },
  { id: "avatar", name: "Avatar", category: "atom", description: "User image or initials.", demo: lazy(() => import("./demos/atoms/AvatarDemo")) },
  { id: "separator", name: "Separator", category: "atom", description: "Horizontal or vertical divider.", demo: lazy(() => import("./demos/atoms/SeparatorDemo")) },
  { id: "tooltip", name: "Tooltip", category: "atom", description: "Hover information popup.", demo: lazy(() => import("./demos/atoms/TooltipDemo")) },
  { id: "popover", name: "Popover", category: "atom", description: "Click-triggered floating content.", demo: lazy(() => import("./demos/atoms/PopoverDemo")) },
  { id: "dialog", name: "Dialog", category: "atom", description: "Modal overlay.", demo: lazy(() => import("./demos/atoms/DialogDemo")) },
  { id: "sheet", name: "Sheet", category: "atom", description: "Slide-out panel.", demo: lazy(() => import("./demos/atoms/SheetDemo")) },
  { id: "drawer", name: "Drawer", category: "atom", description: "Bottom sheet (mobile-friendly).", demo: lazy(() => import("./demos/atoms/DrawerDemo")) },
  { id: "dropdown-menu", name: "Dropdown Menu", category: "atom", description: "Context or action menu.", demo: lazy(() => import("./demos/atoms/DropdownMenuDemo")) },
  { id: "context-menu", name: "Context Menu", category: "atom", description: "Right-click triggered menu.", demo: lazy(() => import("./demos/atoms/ContextMenuDemo")) },
  { id: "hover-card", name: "Hover Card", category: "atom", description: "Hover-triggered info card.", demo: lazy(() => import("./demos/atoms/HoverCardDemo")) },
  { id: "tabs", name: "Tabs", category: "atom", description: "Tabbed content panels.", demo: lazy(() => import("./demos/atoms/TabsDemo")) },
  { id: "accordion", name: "Accordion", category: "atom", description: "Expandable content sections.", demo: lazy(() => import("./demos/atoms/AccordionDemo")) },
  { id: "collapsible", name: "Collapsible", category: "atom", description: "Expandable/collapsible wrapper.", demo: lazy(() => import("./demos/atoms/CollapsibleDemo")) },
  { id: "alert", name: "Alert", category: "atom", description: "Inline feedback message.", demo: lazy(() => import("./demos/atoms/AlertDemo")) },
  { id: "toast", name: "Toast", category: "atom", description: "Temporary notification (via the useToast hook).", demo: lazy(() => import("./demos/atoms/ToastDemo")) },
  { id: "card", name: "Card", category: "atom", description: "Content container with header/body/footer.", demo: lazy(() => import("./demos/atoms/CardDemo")) },
  { id: "item", name: "Item", category: "atom", description: "List row with media, content, and actions.", demo: lazy(() => import("./demos/atoms/ItemDemo")) },
  { id: "table", name: "Table", category: "atom", description: "Data table.", demo: lazy(() => import("./demos/atoms/TableDemo")) },
  { id: "toggle", name: "Toggle", category: "atom", description: "Two-state toggle button.", demo: lazy(() => import("./demos/atoms/ToggleDemo")) },
  { id: "toggle-group", name: "Toggle Group", category: "atom", description: "Group of toggle buttons (single or multi select).", demo: lazy(() => import("./demos/atoms/ToggleGroupDemo")) },
  { id: "scroll-area", name: "Scroll Area", category: "atom", description: "Custom-styled scrollable area.", demo: lazy(() => import("./demos/atoms/ScrollAreaDemo")) },
  { id: "aspect-ratio", name: "Aspect Ratio", category: "atom", description: "Constrained aspect ratio container.", demo: lazy(() => import("./demos/atoms/AspectRatioDemo")) },
  { id: "calendar", name: "Calendar", category: "atom", description: "Date picker calendar.", demo: lazy(() => import("./demos/atoms/CalendarDemo")) },
  { id: "breadcrumb", name: "Breadcrumb", category: "atom", description: "Navigation breadcrumb trail.", demo: lazy(() => import("./demos/atoms/BreadcrumbDemo")) },
  { id: "kbd", name: "Kbd", category: "atom", description: "Keyboard shortcut display.", demo: lazy(() => import("./demos/atoms/KbdDemo")) },
  { id: "input-otp", name: "Input OTP", category: "atom", description: "One-time password input.", demo: lazy(() => import("./demos/atoms/InputOtpDemo")) },
  { id: "resizable", name: "Resizable", category: "atom", description: "Resizable panel layout.", demo: lazy(() => import("./demos/atoms/ResizableDemo")) },
  { id: "empty", name: "Empty", category: "atom", description: "Empty state placeholder.", demo: lazy(() => import("./demos/atoms/EmptyDemo")) },
];

export const registry: DesignSystemEntry[] = [
  ...HERO_BLOCKS,
  ...CONTENT_BLOCKS,
  ...COMMERCE_BLOCKS,
  ...CTA_BLOCKS,
  ...STANDALONE_BLOCKS,
  ...BRAND,
  ...MOLECULES,
  ...ATOMS,
];

export function getEntries(category: DesignSystemEntry["category"]) {
  return registry.filter((e) => e.category === category);
}
