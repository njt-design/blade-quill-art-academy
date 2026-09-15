/**
 * Content for the owner "How To" page (/guide) — Loom walkthroughs that show
 * Corinne how to use Tina to edit the site.
 *
 * This lives server-side on purpose: it is only ever returned by
 * GET /api/guide after the caller's Tina session has been verified, so the
 * recording links never ship in the public JS bundle.
 *
 * To add a recording: paste the Loom share link (https://www.loom.com/share/…)
 * into `loomUrl`. Sections with no recordings yet show a "coming soon" card.
 */

export interface GuideVideo {
  title: string;
  /** Optional one-liner under the title. */
  description?: string;
  /** Loom share or embed URL. Leave empty until the recording exists. */
  loomUrl: string;
}

/** One row of a reference table: the thing on the left, the value on the right. */
export interface GuideSpecRow {
  /** e.g. "Cover Image (thumbnail 1)" */
  element: string;
  /** e.g. "1200 × 1600 px" */
  value: string;
  /** Optional small print under the element name. */
  note?: string;
}

export interface GuideSpecGroup {
  /** e.g. "Shop Products" — the Tina collection or block these belong to. */
  title: string;
  rows: GuideSpecRow[];
}

export interface GuideSection {
  /** URL-safe anchor id (used for the table of contents + deep links). */
  id: string;
  title: string;
  summary: string;
  videos: GuideVideo[];
  /** Optional reference tables rendered under the videos (element → value). */
  specs?: GuideSpecGroup[];
  /** Optional footnotes rendered under the tables. */
  tips?: string[];
}

export interface GuideContent {
  title: string;
  intro: string;
  sections: GuideSection[];
}

/**
 * Recommended upload sizes per Tina image field. Derived from how each
 * container actually renders (aspect ratio × largest on-screen size × 2 for
 * Retina, capped around 2400px). Group titles match the Tina collection or
 * section-template names Corinne sees in the editor.
 */
const IMAGE_DIMENSIONS: GuideSpecGroup[] = [
  {
    title: "Shop Products",
    rows: [
      {
        element: "Cover Image (thumbnail 1)",
        value: "1200 × 1600 px",
        note: "Portrait, 3:4. Shows on the shop card, the big product photo, and the cart. Fills the box.",
      },
      {
        element: "More Thumbnails (under the big photo)",
        value: "1200 × 1600 px",
        note: "Same shape as the cover — each one swaps into the big photo when clicked.",
      },
      {
        element: "Inside Tab Images (previews / spreads)",
        value: "1600 × 1000 px",
        note: "Landscape. Fills the box.",
      },
    ],
  },
  {
    title: "Blog Posts",
    rows: [
      {
        element: "Cover Image",
        value: "1600 × 900 px",
        note: "16:9. Also used as the preview when a post is shared on social media.",
      },
      {
        element: "Image (inside the post)",
        value: "1600 px wide",
        note: "Any height. Use 1800 px wide if you pick the “wide” layout.",
      },
      { element: "Image Pair — each image", value: "1200 × 800 px" },
      { element: "Gallery — each image", value: "1200 × 1200 px", note: "Square. Fits inside." },
    ],
  },
  {
    title: "Hero sections",
    rows: [
      {
        element: "Hero (Homepage) → Background Image",
        value: "~1800 px tall",
        note: "Character art on a transparent background (PNG or WebP), under 1 MB. Sits bottom-right; height matters more than width.",
      },
      {
        element: "Hero (Simple) → Background Image",
        value: "2400 × 1350 px",
        note: "Full-width photo behind the text with a dark tint over it. Fills the box.",
      },
      {
        element: "Hero (Full Bleed) → Background Image",
        value: "2400 × 1350 px",
        note: "Fills the whole screen width — keep the subject centred, the edges get cropped on phones.",
      },
      {
        element: "Hero (Split Image) → Featured Image",
        value: "1200 × 960 px",
        note: "Polaroid frame beside the text. Fills the box.",
      },
      { element: "Hero (Portrait) → Portrait Image", value: "800 × 960 px", note: "Main polaroid. Fills the box." },
      { element: "Hero (Portrait) → Desk Accent Image", value: "600 × 720 px", note: "Desktop only." },
      { element: "Hero (Portrait) → Screen Accent Image", value: "560 × 560 px", note: "Square. Desktop only." },
      {
        element: "Hero (Floating Images) → each image",
        value: "600 × 800 px",
        note: "Small decorative tiles. Fills the box.",
      },
      {
        element: "Hero (Image Mosaic) → each image",
        value: "1200 × 1200 px",
        note: "Square works best across the 2 / 3 / 4-image layouts. Fits inside.",
      },
    ],
  },
  {
    title: "Page sections",
    rows: [
      { element: "Pillars (3 Cards) → Image", value: "1200 × 800 px", note: "Landscape, 3:2. Fills the box." },
      { element: "Card Row → Image", value: "800 × 400 px", note: "Wide strip across the top of each card. Fills the box." },
      { element: "Story Section → Side Photo", value: "640 × 640 px", note: "Square polaroid. Desktop only." },
      { element: "Timeline → Image", value: "600 × 400 px", note: "Small landscape tile. Fills the box." },
      {
        element: "Featured Release → Front / Back Cover Image",
        value: "800 × 1200 px",
        note: "Book cover shape, 2:3. Fits inside.",
      },
      { element: "Image (Spotlight) → Landscape", value: "1800 × 1125 px", note: "16:10." },
      { element: "Image (Spotlight) → Square", value: "1400 × 1400 px" },
      { element: "Image (Spotlight) → Portrait", value: "900 × 1200 px", note: "3:4." },
      { element: "Image (Spotlight) → Wide", value: "2400 × 1030 px", note: "21:9 banner." },
      { element: "Image (Side by Side) → Left / Right Image", value: "1200 × 800 px", note: "Fills the box." },
      {
        element: "Image (Masonry) → each image",
        value: "1600 px long edge",
        note: "Any shape — the wall stacks them at their natural proportions.",
      },
      { element: "Image Gallery (Manual) → each image", value: "1200 × 1200 px", note: "Square. Fits inside." },
    ],
  },
  {
    title: "Gallery & Downloads",
    rows: [
      {
        element: "Art Gallery Grid → Artwork Image",
        value: "2400 px long edge",
        note: "Your most-viewed art — it opens full size in the lightbox, so give it the most resolution. Any shape.",
      },
      {
        element: "Downloads Grid → Card Image",
        value: "1200 × 900 px",
        note: "4:3. Fits inside.",
      },
    ],
  },
];

const SECTIONS: GuideSection[] = [
  {
    id: "navigation",
    title: "Navigation",
    summary:
      "Getting around the Tina editor: signing in, the sidebar, finding the page you want, and what the Save button does.",
    videos: [
      {
        title: "A tour of the editor",
        description: "Sidebar, collections, and how the live preview works.",
        loomUrl: "",
      },
    ],
  },
  {
    id: "site-pages",
    title: "Site Pages",
    summary:
      "Editing the core pages — Home, Shop, Gallery, Downloads, Education, Publishers, About, and Contact.",
    videos: [],
  },
  {
    id: "new-pages",
    title: "New Pages",
    summary:
      "Creating a brand-new page, choosing a layout, and where it shows up on the site.",
    videos: [],
  },
  {
    id: "current-templates",
    title: "Current Templates",
    summary:
      "The section templates you can drop onto any page — what each one looks like and when to use it.",
    videos: [],
  },
  {
    id: "wysiwyg",
    title: "WYSIWYG",
    summary:
      "Using the rich-text editor: headings, bold and italic, links, lists, and images inside your copy.",
    videos: [],
  },
  {
    id: "adding-products",
    title: "Adding Products",
    summary:
      "Adding a product to the Shop — pricing, photos, download files for digital items, and marking it Featured.",
    videos: [],
  },
  {
    id: "blog-posts",
    title: "Blog Posts",
    summary: "Writing, previewing, and publishing a blog post.",
    videos: [],
  },
  {
    id: "youtube-tutorials",
    title: "YouTube Tutorials",
    summary:
      "Adding a new YouTube video to the Tutorials list and choosing which ones appear on the homepage.",
    videos: [],
  },
  {
    id: "images-media",
    title: "Images & Media",
    summary:
      "Uploading images, replacing an existing photo, and keeping file sizes friendly.",
    videos: [],
  },
  {
    id: "image-dimensions",
    title: "Image Dimensions",
    summary:
      "The best size to upload for each image spot on the site. The site shows images exactly as uploaded (no automatic resizing), so these sizes are chosen to look sharp on Retina screens without being huge files.",
    videos: [],
    specs: IMAGE_DIMENSIONS,
    tips: [
      "Width × height, in pixels. If your image is a little larger that's fine — the site scales it down. Much smaller and it will look soft.",
      "Use JPG for photos and artwork; use PNG (or WebP) only when you need a transparent background, like the homepage character art.",
      "Aim for under 1 MB per image (heroes and gallery pieces can go to about 2 MB). Squoosh.app or Photoshop's “Export for web” are good for shrinking.",
      "Spots marked “fills the box” crop the image to fit, so keep the important part away from the edges. Spots marked “fits inside” never crop.",
    ],
  },
  {
    id: "menu-footer",
    title: "Menu & Footer",
    summary: "Changing the navigation links, footer text, and social links.",
    videos: [],
  },
  {
    id: "saving-publishing",
    title: "Saving & Publishing",
    summary:
      "What happens when you press Save, how long changes take to appear, and how to check the live site.",
    videos: [],
  },
];

export function getGuideContent(): GuideContent {
  return {
    title: "How To",
    intro:
      "Short screen recordings that walk through editing the Blade & Quill site in Tina. Pick a topic from the contents, or scroll through them in order.",
    sections: SECTIONS,
  };
}
