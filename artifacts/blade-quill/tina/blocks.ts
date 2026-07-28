import type { Template } from "tinacms";

const INLINE_RICH_TEXT = {
  toolbar: ["bold", "italic", "link", "ul", "ol"] as Array<
    "bold" | "italic" | "link" | "ul" | "ol"
  >,
  showFloatingToolbar: true,
};

/** JSON collections store Slate AST directly — skip markdown re-parsing. */
const SLATE_JSON_PARSER = { type: "slatejson" as const };

/**
 * Character-limit helper for text fields: shows "Max N characters" in the
 * field description and warns in the editor when the limit is exceeded, so
 * copy never overflows or crowds its section on the live site.
 */
export const charLimit = (max: number, description?: string) => ({
  description: [description, `Max ${max} characters.`]
    .filter(Boolean)
    .join(" "),
  validate: (value?: string) => {
    if (value && value.length > max) {
      return `Too long — ${value.length}/${max} characters. Please shorten so it fits nicely on the page.`;
    }
    return undefined;
  },
});

/** Build a Slate rich-text value from a plain sentence (for defaultItem seeds). */
const rt = (text: string) => ({
  type: "root",
  children: [{ type: "p", children: [{ type: "text", text }] }],
});

/** Reusable image list item fields for showcase blocks. */
const IMAGE_ITEM_FIELDS = [
  { type: "image" as const, name: "src", label: "Image" },
  {
    type: "string" as const,
    name: "alt",
    label: "Alt Text",
    ui: charLimit(125, "Short image description for screen readers."),
  },
  {
    type: "string" as const,
    name: "caption",
    label: "Caption (optional)",
    ui: charLimit(80),
  },
];

const IMAGE_LIST_UI = {
  itemProps: (item: Record<string, unknown> | undefined) => ({
    label: (item?.caption as string) || (item?.alt as string) || "Image",
  }),
};

/**
 * Shared UI config for a block template: preview image for the visual
 * "Add Section" picker + a readable label in the section list sidebar.
 */
function blockUi(
  name: string,
  label: string,
  titleField: string | null,
  defaultItem?: Record<string, unknown>
) {
  return {
    previewSrc: `/admin-previews/${name}.svg`,
    ...(defaultItem ? { defaultItem } : {}),
    itemProps: (item: Record<string, unknown> | undefined) => {
      const raw = titleField ? item?.[titleField] : undefined;
      const text =
        typeof raw === "string" && raw.trim()
          ? raw.split("\n")[0].trim()
          : "";
      return { label: text ? `${label} — ${text}` : label };
    },
  };
}

// ---------------------------------------------------------------------------
// General-purpose blocks
// ---------------------------------------------------------------------------

export const heroBlock: Template = {
  name: "hero",
  label: "Hero (Simple)",
  ui: blockUi("hero", "Hero (Simple)", "heading", {
    heading: "A big welcoming headline",
    subheading: rt("A short sentence that supports the headline."),
    ctaLabel: "Learn More",
    ctaLink: "/",
  }),
  fields: [
    {
      type: "string",
      name: "heading",
      label: "Heading",
      ui: charLimit(70, "Large heading text for this hero section."),
    },
    {
      type: "rich-text",
      name: "subheading",
      label: "Subheading",
      overrides: INLINE_RICH_TEXT,
      parser: SLATE_JSON_PARSER,
      ui: { description: "Supporting text shown below the heading." },
    },
    {
      type: "image",
      name: "backgroundImage",
      label: "Background Image",
      ui: {
        description:
          "Optional background image behind the hero. Prefer ~1920×1080 landscape. Upload into images/pages/.",
      },
    },
    {
      type: "string",
      name: "ctaLabel",
      label: "Button Label",
      ui: charLimit(24, 'Text on the call-to-action button (e.g. "Get Started").'),
    },
    {
      type: "string",
      name: "ctaLink",
      label: "Button Link",
      ui: { description: 'Relative URL the button links to (e.g. "/shop").' },
    },
  ],
};

export const textBlock: Template = {
  name: "text",
  label: "Text Section",
  ui: blockUi("text", "Text", "heading", {
    heading: "Section heading",
    body: rt("Write anything here — paragraphs, lists, links, and more."),
  }),
  fields: [
    {
      type: "string",
      name: "heading",
      label: "Heading (optional)",
      ui: charLimit(70, "Optional heading above the text content."),
    },
    {
      type: "rich-text",
      name: "body",
      label: "Body",
      parser: SLATE_JSON_PARSER,
      ui: { description: "Rich text content. Supports headings, bold, links, images, and more." },
    },
  ],
};

export const imageGalleryBlock: Template = {
  name: "imageGallery",
  label: "Image Gallery (Manual)",
  ui: blockUi("imageGallery", "Image Gallery", "heading", {
    heading: "Gallery",
    images: [],
  }),
  fields: [
    {
      type: "string",
      name: "heading",
      label: "Heading (optional)",
      ui: charLimit(70, "Optional heading above the image grid."),
    },
    {
      type: "object",
      name: "images",
      label: "Images",
      list: true,
      ui: {
        itemProps: (item: Record<string, unknown> | undefined) => ({
          label: (item?.caption as string) || (item?.alt as string) || "Image",
        }),
      },
      fields: [
        { type: "image", name: "src", label: "Image" },
        { type: "string", name: "alt", label: "Alt Text", ui: charLimit(125, "Short image description for screen readers.") },
        { type: "string", name: "caption", label: "Caption (optional)", ui: charLimit(80) },
      ],
    },
  ],
};

export const ctaBandBlock: Template = {
  name: "ctaBand",
  label: "CTA Band",
  ui: blockUi("ctaBand", "CTA Band", "heading", {
    heading: "Ready to get started?",
    description: rt("One short supporting line goes here."),
    ctaLabel: "Get Started",
    ctaLink: "/contact",
    variant: "light",
  }),
  fields: [
    {
      type: "string",
      name: "heading",
      label: "Heading",
      ui: charLimit(70, "Bold heading for the call-to-action strip."),
    },
    {
      type: "rich-text",
      name: "description",
      label: "Description",
      overrides: INLINE_RICH_TEXT,
      parser: SLATE_JSON_PARSER,
      ui: { description: "Supporting line below the heading." },
    },
    { type: "string", name: "ctaLabel", label: "Button Label", ui: charLimit(24) },
    {
      type: "string",
      name: "ctaLink",
      label: "Button Link",
      ui: { description: 'Relative URL (e.g. "/shop").' },
    },
    {
      type: "string",
      name: "variant",
      label: "Style Variant",
      options: ["light", "dark"],
      ui: { description: 'Choose "dark" for a dark background with white text, or "light" for the default.' },
    },
  ],
};

export const videoEmbedBlock: Template = {
  name: "videoEmbed",
  label: "Video Embed",
  ui: blockUi("videoEmbed", "Video", "heading", {
    heading: "Watch the video",
    youtubeUrl: "",
  }),
  fields: [
    {
      type: "string",
      name: "heading",
      label: "Heading (optional)",
      ui: charLimit(70, "Optional heading above the video."),
    },
    {
      type: "string",
      name: "youtubeUrl",
      label: "YouTube URL",
      ui: {
        description:
          "Full YouTube video URL (e.g. https://www.youtube.com/watch?v=abc123). The embed ID is extracted automatically.",
        validate: (value?: string) => {
          if (value && !/youtube\.com|youtu\.be/i.test(value)) {
            return "Please paste a full YouTube link (youtube.com or youtu.be).";
          }
          return undefined;
        },
      },
    },
  ],
};

export const featureGridBlock: Template = {
  name: "featureGrid",
  label: "Feature Grid",
  ui: blockUi("featureGrid", "Feature Grid", "heading", {
    heading: "What's included",
    items: [
      { icon: "Star", title: "First feature", description: rt("Describe the first feature here.") },
      { icon: "Brush", title: "Second feature", description: rt("Describe the second feature here.") },
      { icon: "BookOpen", title: "Third feature", description: rt("Describe the third feature here.") },
    ],
  }),
  fields: [
    {
      type: "string",
      name: "heading",
      label: "Heading (optional)",
      ui: charLimit(70, "Optional heading above the feature cards."),
    },
    {
      type: "object",
      name: "items",
      label: "Features",
      list: true,
      ui: {
        itemProps: (item: Record<string, unknown> | undefined) => ({
          label: (item?.title as string) || "Feature",
        }),
      },
      fields: [
        {
          type: "string",
          name: "icon",
          label: "Icon Name",
          ui: { description: 'Lucide icon name (e.g. "Brush", "Star", "BookOpen"). Leave blank for no icon.' },
        },
        { type: "string", name: "title", label: "Title", ui: charLimit(48) },
        {
          type: "rich-text",
          name: "description",
          label: "Description",
          overrides: INLINE_RICH_TEXT,
          parser: SLATE_JSON_PARSER,
        },
      ],
    },
  ],
};

export const bigCtaBlock: Template = {
  name: "bigCta",
  label: "Big CTA",
  ui: blockUi("bigCta", "Big CTA", "heading", {
    eyebrow: "SAY HI",
    heading: "A big closing\nstatement.",
    highlightText: "closing",
    primaryLabel: "Get in Touch",
    primaryLink: "/contact",
  }),
  fields: [
    {
      type: "string",
      name: "eyebrow",
      label: "Eyebrow",
      ui: charLimit(40, "Small label above the heading."),
    },
    {
      type: "string",
      name: "heading",
      label: "Heading",
      ui: {
        component: "textarea",
        ...charLimit(90, "Large centered heading. Press Enter to create a line break."),
      },
    },
    {
      type: "string",
      name: "highlightText",
      label: "Highlighted Word",
      ui: charLimit(40, "A word or phrase from the heading to show in gradient color. Must match the heading text exactly."),
    },
    { type: "string", name: "primaryLabel", label: "Primary Button Label", ui: charLimit(24) },
    {
      type: "string",
      name: "primaryLink",
      label: "Primary Button Link",
      ui: { description: 'Relative URL (e.g. "/contact").' },
    },
    { type: "string", name: "secondaryLabel", label: "Secondary Button Label", ui: charLimit(24) },
    {
      type: "string",
      name: "secondaryLink",
      label: "Secondary Button Link",
      ui: { description: "Relative URL or full https:// link." },
    },
  ],
};

export const pageHeaderBlock: Template = {
  name: "pageHeader",
  label: "Page Header",
  ui: blockUi("pageHeader", "Page Header", "heading", {
    heading: "Page Title",
    description: rt("A short introduction for this page."),
  }),
  fields: [
    {
      type: "string",
      name: "heading",
      label: "Heading",
      ui: charLimit(60, "The main page title shown at the top."),
    },
    {
      type: "rich-text",
      name: "description",
      label: "Description",
      overrides: INLINE_RICH_TEXT,
      parser: SLATE_JSON_PARSER,
      ui: { description: "Introductory text shown below the heading." },
    },
  ],
};

// ---------------------------------------------------------------------------
// Homepage blocks
// ---------------------------------------------------------------------------

export const homeHeroBlock: Template = {
  name: "homeHero",
  label: "Hero (Homepage)",
  ui: blockUi("homeHero", "Hero (Homepage)", "heading", {
    eyebrow: "✦ HELLO FROM THE STUDIO ✦",
    heading: "I write books and teach\ndigital painting.",
    subheading: rt("A sentence about what the site offers."),
    ctaPrimary: "Explore the Shop",
    ctaPrimaryLink: "/shop",
    ctaSecondary: "Watch Tutorials",
    ctaSecondaryLink: "https://www.youtube.com/c/BladeQuillartacademy",
    metaLine: "EST. 2018 · NANTES, FR",
    marqueeItems: ["Author", "Illustrator", "Krita educator"],
  }),
  fields: [
    {
      type: "string",
      name: "eyebrow",
      label: "Eyebrow",
      ui: charLimit(40, "Small label above the big heading."),
    },
    {
      type: "string",
      name: "heading",
      label: "Heading",
      ui: {
        component: "textarea",
        ...charLimit(80, "The giant homepage heading. Press Enter once to split it into two lines — the second line shows in gradient color."),
      },
    },
    {
      type: "rich-text",
      name: "subheading",
      label: "Subheading",
      overrides: INLINE_RICH_TEXT,
      parser: SLATE_JSON_PARSER,
      ui: { description: "The sentence below the main heading." },
    },
    {
      type: "string",
      name: "ctaPrimary",
      label: "Primary Button Label",
      ui: charLimit(24, 'Text on the orange button (e.g. "Explore the Shop").'),
    },
    {
      type: "string",
      name: "ctaPrimaryLink",
      label: "Primary Button Link",
      ui: { description: 'Relative URL (e.g. "/shop").' },
    },
    {
      type: "string",
      name: "ctaSecondary",
      label: "Secondary Button Label",
      ui: charLimit(24, "Text on the outline button next to the primary one."),
    },
    {
      type: "string",
      name: "ctaSecondaryLink",
      label: "Secondary Button Link",
      ui: { description: "Relative URL or a full https:// link (opens in a new tab)." },
    },
    {
      type: "string",
      name: "metaLine",
      label: "Meta Line",
      ui: charLimit(60, 'Small line between the quill marks (e.g. "EST. 2018 · NANTES, FR").'),
    },
    {
      type: "string",
      name: "marqueeItems",
      label: "Scrolling Words",
      list: true,
      ui: { description: "Words that scroll across the bottom of the hero (e.g. Author, Illustrator). Keep each under 20 characters." },
    },
  ],
};

export const pillarsBlock: Template = {
  name: "pillars",
  label: "Pillars (3 Cards)",
  ui: blockUi("pillars", "Pillars", "heading", {
    eyebrow: "THREE THREADS",
    heading: "Where would you like to start?",
    items: [
      { tag: "FIRST", title: "First card", sub: "One line about it", cta: "Read more", badge: "NEW", link: "/" },
      { tag: "SECOND", title: "Second card", sub: "One line about it", cta: "Read more", badge: "OPEN", link: "/" },
      { tag: "THIRD", title: "Third card", sub: "One line about it", cta: "Read more", badge: "HOT", link: "/" },
    ],
  }),
  fields: [
    { type: "string", name: "eyebrow", label: "Eyebrow", ui: charLimit(40, "Small label above the heading.") },
    { type: "string", name: "heading", label: "Heading", ui: charLimit(60) },
    {
      type: "object",
      name: "items",
      label: "Cards",
      list: true,
      ui: {
        itemProps: (item: Record<string, unknown> | undefined) => ({
          label: (item?.title as string) || "Card",
        }),
        description: "Three polaroid-style cards. Each links somewhere on (or off) the site.",
      },
      fields: [
        {
          type: "string",
          name: "tag",
          label: "Tag",
          ui: charLimit(16, 'Small label above the card title (e.g. "NEW BOOK").'),
        },
        { type: "string", name: "title", label: "Title", ui: charLimit(48) },
        { type: "string", name: "sub", label: "Subtitle", ui: charLimit(60) },
        { type: "string", name: "cta", label: "Link Text", ui: charLimit(24) },
        {
          type: "string",
          name: "badge",
          label: "Corner Badge",
          ui: charLimit(16, 'Small pill in the top-right corner of the image (e.g. "LATEST").'),
        },
        {
          type: "string",
          name: "link",
          label: "Link",
          ui: { description: "Relative URL or full https:// link (https links open in a new tab)." },
        },
        {
          type: "image",
          name: "image",
          label: "Image (optional)",
          ui: { description: "Leave empty to automatically show a product/video preview." },
        },
      ],
    },
  ],
};

export const featuredBookBlock: Template = {
  name: "featuredBook",
  label: "Featured Book",
  ui: blockUi("featuredBook", "Featured Book", "heading", {
    eyebrow: "FEATURED RELEASE",
    heading: "The new book.",
    description: rt("A short description of the featured book."),
    stats: [
      { value: "$25", label: "SIGNED COPY" },
      { value: "$14", label: "EBOOK" },
      { value: "144", label: "FULL-COLOR PAGES" },
    ],
    ctaLabel: "Order Now",
    ctaLink: "/shop",
    secondaryLabel: "Browse the shop",
    secondaryLink: "/shop",
  }),
  fields: [
    { type: "string", name: "eyebrow", label: "Eyebrow", ui: charLimit(40, "Small label above the heading.") },
    { type: "string", name: "heading", label: "Heading", ui: charLimit(60) },
    {
      type: "rich-text",
      name: "description",
      label: "Description",
      overrides: INLINE_RICH_TEXT,
      parser: SLATE_JSON_PARSER,
    },
    {
      type: "object",
      name: "stats",
      label: "Stats Row",
      list: true,
      ui: {
        description: "Short figures shown above the buttons (price, page count, etc.).",
        itemProps: (item: Record<string, unknown> | undefined) => ({
          label: item?.value ? `${item.value} ${item?.label ?? ""}` : "Stat",
        }),
      },
      fields: [
        { type: "string", name: "value", label: "Value", ui: charLimit(12, 'Short figure (e.g. "100K+").') },
        { type: "string", name: "label", label: "Label", ui: charLimit(24) },
      ],
    },
    { type: "string", name: "ctaLabel", label: "Primary Button Label", ui: charLimit(24) },
    {
      type: "string",
      name: "ctaLink",
      label: "Primary Button Link",
      ui: { description: 'Relative URL (e.g. "/shop/lheeloo-luna-cartoon-book").' },
    },
    { type: "string", name: "secondaryLabel", label: "Secondary Button Label", ui: charLimit(24) },
    { type: "string", name: "secondaryLink", label: "Secondary Button Link" },
  ],
};

export const classesPitchBlock: Template = {
  name: "classesPitch",
  label: "Classes Pitch",
  ui: blockUi("classesPitch", "Classes Pitch", "heading", {
    eyebrow: "Now Enrolling",
    heading: "Step inside the classroom.",
    subheading: rt("Structured digital art training."),
    bullets: ["First benefit", "Second benefit", "Third benefit"],
    ctaLabel: "Reserve Your Spot",
    ctaLink: "/shop",
    secondaryLabel: "About Corinne",
    secondaryLink: "/about",
    metaTags: "Self-paced · Krita 5.2 · All skill levels",
  }),
  fields: [
    {
      type: "string",
      name: "eyebrow",
      label: "Eyebrow",
      ui: charLimit(40, 'Small label above the heading (e.g. "Now Enrolling").'),
    },
    { type: "string", name: "heading", label: "Heading", ui: charLimit(60) },
    {
      type: "rich-text",
      name: "subheading",
      label: "Subheading",
      overrides: INLINE_RICH_TEXT,
      parser: SLATE_JSON_PARSER,
      ui: { description: "Shown inside the left panel of the classroom card." },
    },
    {
      type: "string",
      name: "bullets",
      label: "Bullet Points",
      list: true,
      ui: { description: "Numbered benefit bullets. Keep each under 60 characters." },
    },
    {
      type: "string",
      name: "metaTags",
      label: "Meta Line",
      ui: charLimit(80, 'Small line below the bullets (e.g. "Self-paced · Krita 5.2"). Separate items with "·".'),
    },
    { type: "string", name: "ctaLabel", label: "Primary Button Label", ui: charLimit(24) },
    {
      type: "string",
      name: "ctaLink",
      label: "Primary Button Link",
      ui: { description: 'Relative URL (e.g. "/classes").' },
    },
    { type: "string", name: "secondaryLabel", label: "Secondary Button Label", ui: charLimit(24) },
    { type: "string", name: "secondaryLink", label: "Secondary Button Link" },
  ],
};

export const tutorialsStripBlock: Template = {
  name: "tutorialsStrip",
  label: "YouTube Tutorials Strip",
  ui: blockUi("tutorialsStrip", "YouTube Strip", "headingHighlight", {
    eyebrow: "FREE LESSONS ON YOUTUBE",
    headingPrefix: "Join ",
    headingHighlight: "100,000+ artists",
    headingSuffix: "learning with me.",
    buttonLabel: "Subscribe on YouTube",
    youtubeUrl: "https://www.youtube.com/c/BladeQuillartacademy",
    stats: [
      { value: "100K+", label: "subscribers" },
      { value: "1.5M", label: "total views" },
      { value: "65", label: "countries" },
      { value: "bi-weekly", label: "new videos" },
    ],
  }),
  fields: [
    { type: "string", name: "eyebrow", label: "Eyebrow", ui: charLimit(40, "Small label above the heading.") },
    {
      type: "string",
      name: "headingPrefix",
      label: "Heading — Start",
      ui: charLimit(30, 'First words of the heading (e.g. "Join ").'),
    },
    {
      type: "string",
      name: "headingHighlight",
      label: "Heading — Highlighted Part",
      ui: charLimit(40, 'Shown in warm gradient color (e.g. "100,000+ artists").'),
    },
    {
      type: "string",
      name: "headingSuffix",
      label: "Heading — Second Line",
      ui: charLimit(40, 'Rest of the heading on the next line (e.g. "learning with me.").'),
    },
    { type: "string", name: "buttonLabel", label: "Button Label", ui: charLimit(24) },
    {
      type: "string",
      name: "youtubeUrl",
      label: "YouTube Channel URL",
      ui: { description: "Full channel URL — the button links here." },
    },
    {
      type: "object",
      name: "stats",
      label: "Stats Row",
      list: true,
      ui: {
        itemProps: (item: Record<string, unknown> | undefined) => ({
          label: item?.value ? `${item.value} ${item?.label ?? ""}` : "Stat",
        }),
      },
      fields: [
        { type: "string", name: "value", label: "Value", ui: charLimit(12, 'Short figure (e.g. "100K+").') },
        { type: "string", name: "label", label: "Label", ui: charLimit(24) },
      ],
    },
  ],
};

export const productStripBlock: Template = {
  name: "productStrip",
  label: "Product Strip",
  ui: blockUi("productStrip", "Product Strip", "heading", {
    eyebrow: "FROM THE SHOP",
    heading: "Books, brushes, and guides.",
    viewAllLabel: "All products",
    viewAllLink: "/shop",
  }),
  fields: [
    { type: "string", name: "eyebrow", label: "Eyebrow", ui: charLimit(40, "Small label above the heading.") },
    { type: "string", name: "heading", label: "Heading", ui: charLimit(60) },
    { type: "string", name: "viewAllLabel", label: "View All Label", ui: charLimit(24) },
    {
      type: "string",
      name: "viewAllLink",
      label: "View All Link",
      ui: { description: 'Where the "view all" button goes (usually "/shop").' },
    },
  ],
};

export const blogFeedBlock: Template = {
  name: "blogFeed",
  label: "Blog Feed",
  ui: blockUi("blogFeed", "Blog Feed", "heading", {
    heading: "Recent writing.",
    showNewsletter: true,
    newsletter: {
      eyebrow: "STUDIO NEWSLETTER",
      heading: "Stay in the Loop",
      subheading: rt("Get art tips and announcements in your inbox."),
      placeholderText: "you@example.com",
      ctaLabel: "Subscribe",
      privacyNote: "No spam. Unsubscribe anytime.",
    },
  }),
  fields: [
    {
      type: "string",
      name: "heading",
      label: "Heading",
      ui: charLimit(60, "Heading above the list of recent blog posts (posts appear automatically)."),
    },
    {
      type: "boolean",
      name: "showNewsletter",
      label: "Show Newsletter Panel",
      ui: { description: "Show the dark newsletter signup panel beside the posts." },
    },
    {
      type: "object",
      name: "newsletter",
      label: "Newsletter Panel",
      fields: [
        { type: "string", name: "eyebrow", label: "Eyebrow", ui: charLimit(40, "Small label above the heading.") },
        { type: "string", name: "heading", label: "Heading", ui: charLimit(60) },
        {
          type: "rich-text",
          name: "subheading",
          label: "Description",
          overrides: INLINE_RICH_TEXT,
          parser: SLATE_JSON_PARSER,
        },
        { type: "string", name: "placeholderText", label: "Email Placeholder", ui: charLimit(32) },
        { type: "string", name: "ctaLabel", label: "Submit Button Label", ui: charLimit(24) },
        { type: "string", name: "privacyNote", label: "Privacy Note", ui: charLimit(80) },
      ],
    },
  ],
};

export const newsletterSignupBlock: Template = {
  name: "newsletterSignup",
  label: "Newsletter Signup",
  ui: blockUi("newsletterSignup", "Newsletter", "heading", {
    eyebrow: "STUDIO NEWSLETTER",
    heading: "Stay in the Loop",
    subheading: rt("Get art tips, new tutorials, and announcements in your inbox."),
    placeholderText: "you@example.com",
    ctaLabel: "Subscribe",
    privacyNote: "No spam. Unsubscribe anytime.",
  }),
  fields: [
    { type: "string", name: "eyebrow", label: "Eyebrow", ui: charLimit(40, "Small label above the heading.") },
    { type: "string", name: "heading", label: "Heading", ui: charLimit(60) },
    {
      type: "rich-text",
      name: "subheading",
      label: "Description",
      overrides: INLINE_RICH_TEXT,
      parser: SLATE_JSON_PARSER,
    },
    { type: "string", name: "placeholderText", label: "Email Placeholder", ui: charLimit(32) },
    { type: "string", name: "ctaLabel", label: "Submit Button Label", ui: charLimit(24) },
    { type: "string", name: "privacyNote", label: "Privacy Note", ui: charLimit(80) },
  ],
};

// ---------------------------------------------------------------------------
// About-page blocks
// ---------------------------------------------------------------------------

export const aboutHeroBlock: Template = {
  name: "aboutHero",
  label: "Hero (Portrait)",
  ui: blockUi("aboutHero", "Hero (Portrait)", "heading", {
    eyebrow: "ABOUT · A STUDIO VISIT",
    heading: "I'm Corinne —\nand I draw\nfor a living.",
    leadText: rt("A short introduction sentence."),
    ctaPrimary: "Get in Touch",
    ctaPrimaryLink: "/contact",
    ctaSecondary: "Visit the Shop",
    ctaSecondaryLink: "/shop",
    metaLine: "NANTES, FRANCE · EST. 2018",
    portraitCaption: "in the studio",
  }),
  fields: [
    { type: "string", name: "eyebrow", label: "Eyebrow", ui: charLimit(40, "Small label above the heading.") },
    {
      type: "string",
      name: "heading",
      label: "Heading",
      ui: {
        component: "textarea",
        ...charLimit(90, "Up to three lines (press Enter to break). The middle line shows in gradient color."),
      },
    },
    {
      type: "rich-text",
      name: "leadText",
      label: "Lead Text",
      overrides: INLINE_RICH_TEXT,
      parser: SLATE_JSON_PARSER,
      ui: { description: "The introductory sentence below the heading. Keep it to 1-2 sentences." },
    },
    { type: "string", name: "ctaPrimary", label: "Primary Button Label", ui: charLimit(24) },
    { type: "string", name: "ctaPrimaryLink", label: "Primary Button Link" },
    { type: "string", name: "ctaSecondary", label: "Secondary Button Label", ui: charLimit(24) },
    { type: "string", name: "ctaSecondaryLink", label: "Secondary Button Link" },
    {
      type: "string",
      name: "metaLine",
      label: "Meta Line",
      ui: charLimit(60, 'Small line under the buttons (e.g. "NANTES, FRANCE · EST. 2018"). Separate items with "·".'),
    },
    {
      type: "image",
      name: "portraitImage",
      label: "Portrait Image",
      ui: { description: "Photo shown in the large polaroid on the right." },
    },
    {
      type: "string",
      name: "portraitCaption",
      label: "Portrait Caption",
      ui: charLimit(48, "Handwritten-style caption under the portrait."),
    },
    {
      type: "image",
      name: "deskImage",
      label: "Desk Accent Image",
      ui: {
        description:
          "Smaller polaroid on the left of the collage (desktop only). Leave blank to hide.",
      },
    },
    {
      type: "string",
      name: "deskCaption",
      label: "Desk Accent Caption",
      ui: charLimit(32, 'Small label on the desk polaroid (e.g. "from the desk").'),
    },
    {
      type: "image",
      name: "screenImage",
      label: "Screen Accent Image",
      ui: {
        description:
          "Bottom-right polaroid in the collage (desktop only). Leave blank to hide.",
      },
    },
    {
      type: "string",
      name: "screenCaption",
      label: "Screen Accent Caption",
      ui: charLimit(32, 'Small label on the screen polaroid (e.g. "krita screen").'),
    },
  ],
};

export const statsRowBlock: Template = {
  name: "statsRow",
  label: "Stats Row",
  ui: blockUi("statsRow", "Stats Row", null, {
    stats: [
      { value: "100K+", label: "YouTube subscribers" },
      { value: "1.5M", label: "video views" },
      { value: "65", label: "countries reached" },
      { value: "2", label: "illustrated books" },
    ],
  }),
  fields: [
    {
      type: "object",
      name: "stats",
      label: "Stats",
      list: true,
      ui: {
        itemProps: (item: Record<string, unknown> | undefined) => ({
          label: item?.value ? `${item.value} ${item?.label ?? ""}` : "Stat",
        }),
      },
      fields: [
        { type: "string", name: "value", label: "Value", ui: charLimit(12, 'Short figure (e.g. "100K+").') },
        { type: "string", name: "label", label: "Label", ui: charLimit(24) },
      ],
    },
  ],
};

export const storyBlock: Template = {
  name: "story",
  label: "Story Section",
  ui: blockUi("story", "Story", "heading", {
    number: "01",
    label: "STORY",
    heading: "The story behind\nall of this.",
    paragraph1: rt("First paragraph of the story."),
    quote: rt("A pull-quote shown in the dark panel."),
    paragraph2: rt("Second paragraph of the story."),
    sideCaption: "my window in winter",
  }),
  fields: [
    {
      type: "string",
      name: "number",
      label: "Section Number",
      ui: charLimit(4, 'The small orange number in the left margin (e.g. "01").'),
    },
    {
      type: "string",
      name: "label",
      label: "Section Label",
      ui: charLimit(24, 'The small label in the left margin (e.g. "STORY").'),
    },
    {
      type: "string",
      name: "heading",
      label: "Heading",
      ui: { component: "textarea", ...charLimit(80, "Press Enter to create a line break.") },
    },
    {
      type: "rich-text",
      name: "paragraph1",
      label: "First Paragraph",
      overrides: INLINE_RICH_TEXT,
      parser: SLATE_JSON_PARSER,
    },
    {
      type: "rich-text",
      name: "quote",
      label: "Pull Quote",
      overrides: INLINE_RICH_TEXT,
      parser: SLATE_JSON_PARSER,
      ui: { description: "Shown as a large quote in a dark rounded panel between the paragraphs." },
    },
    {
      type: "rich-text",
      name: "paragraph2",
      label: "Second Paragraph",
      overrides: INLINE_RICH_TEXT,
      parser: SLATE_JSON_PARSER,
    },
    {
      type: "image",
      name: "sideImage",
      label: "Side Photo",
      ui: { description: "Small polaroid on the right of the story section (desktop)." },
    },
    {
      type: "string",
      name: "sideCaption",
      label: "Side Photo Caption",
      ui: charLimit(48, "Caption under the small polaroid on the right."),
    },
  ],
};

export const timelineBlock: Template = {
  name: "timeline",
  label: "Timeline",
  ui: blockUi("timeline", "Timeline", "label", {
    number: "02",
    label: "TIMELINE",
    events: [
      { year: "2018", title: "It all started", description: "How things began." },
      { year: "2026", title: "Today", description: "Where things are now." },
    ],
  }),
  fields: [
    { type: "string", name: "number", label: "Section Number", ui: charLimit(4, 'e.g. "02".') },
    { type: "string", name: "label", label: "Section Label", ui: charLimit(24) },
    {
      type: "object",
      name: "events",
      label: "Events",
      list: true,
      ui: {
        itemProps: (item: Record<string, unknown> | undefined) => ({
          label: item?.year ? `${item.year} — ${item?.title ?? ""}` : "Event",
        }),
      },
      fields: [
        { type: "string", name: "year", label: "Year", ui: charLimit(12) },
        { type: "string", name: "title", label: "Title", ui: charLimit(48) },
        { type: "string", name: "description", label: "Description", ui: { component: "textarea", ...charLimit(220) } },
        {
          type: "image",
          name: "image",
          label: "Image",
          ui: { description: "Optional artwork shown beside this timeline event." },
        },
      ],
    },
  ],
};

export const cardRowBlock: Template = {
  name: "cardRow",
  label: "Card Row",
  ui: blockUi("cardRow", "Card Row", "label", {
    number: "03",
    label: "WHAT I MAKE",
    cards: [
      { tag: "FIRST", title: "First card", body: "One or two sentences.", ctaLabel: "Learn more", link: "/" },
      { tag: "SECOND", title: "Second card", body: "One or two sentences.", ctaLabel: "Learn more", link: "/" },
      { tag: "THIRD", title: "Third card", body: "One or two sentences.", ctaLabel: "Learn more", link: "/" },
    ],
  }),
  fields: [
    { type: "string", name: "number", label: "Section Number", ui: charLimit(4, 'e.g. "02".') },
    { type: "string", name: "label", label: "Section Label", ui: charLimit(24) },
    {
      type: "object",
      name: "cards",
      label: "Cards",
      list: true,
      ui: {
        itemProps: (item: Record<string, unknown> | undefined) => ({
          label: (item?.title as string) || "Card",
        }),
      },
      fields: [
        {
          type: "string",
          name: "tag",
          label: "Tag",
          ui: charLimit(16, 'Small label above the title (e.g. "BOOKS").'),
        },
        { type: "string", name: "title", label: "Title", ui: charLimit(48) },
        { type: "string", name: "body", label: "Body", ui: { component: "textarea", ...charLimit(220) } },
        {
          type: "image",
          name: "image",
          label: "Image",
          ui: { description: "Card thumbnail. Leave blank to use the default fallback art." },
        },
        { type: "string", name: "ctaLabel", label: "Link Text", ui: charLimit(24) },
        {
          type: "string",
          name: "link",
          label: "Link",
          ui: { description: "Relative URL or full https:// link (https links open in a new tab)." },
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Shop / Gallery / Downloads / Contact blocks
// ---------------------------------------------------------------------------

export const shopCatalogBlock: Template = {
  name: "shopCatalog",
  label: "Shop Catalog",
  ui: blockUi("shopCatalog", "Shop Catalog", "heading", {
    heading: "The studio shop.",
    highlightText: "studio",
    description: rt("Books, digital guides, and curriculum."),
    showFeaturedBanner: true,
    emptyHeading: "No products found",
    emptyDescription: "Check back later for new releases.",
  }),
  fields: [
    {
      type: "string",
      name: "heading",
      label: "Heading",
      ui: charLimit(48, "The big shop heading. Products themselves are managed under Shop Products."),
    },
    {
      type: "string",
      name: "highlightText",
      label: "Highlighted Word",
      ui: charLimit(40, "A word from the heading to show in gradient color. Must match the heading text exactly."),
    },
    {
      type: "rich-text",
      name: "description",
      label: "Description",
      overrides: INLINE_RICH_TEXT,
      parser: SLATE_JSON_PARSER,
    },
    {
      type: "boolean",
      name: "showFeaturedBanner",
      label: "Show Featured Banner",
      ui: { description: "Show the dark featured-product banner above the grid." },
    },
    {
      type: "string",
      name: "emptyHeading",
      label: "Empty State Heading",
      ui: charLimit(60, "Heading shown when no products match the filter."),
    },
    {
      type: "string",
      name: "emptyDescription",
      label: "Empty State Description",
      ui: charLimit(120),
    },
  ],
};

export const galleryGridBlock: Template = {
  name: "galleryGrid",
  label: "Art Gallery Grid",
  ui: blockUi("galleryGrid", "Art Gallery Grid", null, {
    emptyHeading: "Gallery is empty",
    emptyDescription: "Check back soon — new artwork is added regularly.",
  }),
  fields: [
    {
      type: "string",
      name: "emptyHeading",
      label: "Empty State Heading",
      ui: charLimit(60, "Images load automatically from the gallery database. This heading only shows if the gallery is empty."),
    },
    {
      type: "string",
      name: "emptyDescription",
      label: "Empty State Description",
      ui: charLimit(120),
    },
  ],
};

export const downloadsGridBlock: Template = {
  name: "downloadsGrid",
  label: "Downloads Grid",
  ui: blockUi("downloadsGrid", "Downloads Grid", null, {
    emptyHeading: "Free resources coming soon!",
    emptyDescription: "Coloring pages, guides, and more on the way.",
  }),
  fields: [
    {
      type: "string",
      name: "emptyHeading",
      label: "Empty State Heading",
      ui: charLimit(60, "Downloads load automatically. This heading only shows when there are none."),
    },
    {
      type: "string",
      name: "emptyDescription",
      label: "Empty State Description",
      ui: charLimit(120),
    },
  ],
};

export const contactInfoBlock: Template = {
  name: "contactInfo",
  label: "Contact Info",
  ui: blockUi("contactInfo", "Contact Info", "email", {
    email: "hello@example.com",
    location: "City, State",
  }),
  fields: [
    {
      type: "string",
      name: "email",
      label: "Email Address",
      ui: { description: "Shown publicly. Use a safe inbox, not a personal address." },
    },
    {
      type: "string",
      name: "location",
      label: "Location",
      ui: charLimit(48, 'General location (e.g. "Des Moines, IA").'),
    },
  ],
};

export const dummyBookRequestBlock: Template = {
  name: "dummyBookRequest",
  label: "Dummy Book Request",
  ui: blockUi("dummyBookRequest", "Dummy Book Request", "heading", {
    heading: "Request the 30-page PDF",
    description: rt(
      "Fill in your details and the complete 30-page PDF unlocks instantly. Corinne is notified of every request."
    ),
    pdfUrl: "/files/lheeloo-and-luna-bath-time-episode-thursday-dummy-book.pdf",
    submitLabel: "Request the 30-page PDF",
    successHeading: "Thank you — the PDF is ready",
    successNote:
      "Your request has been sent to Corinne. In the meantime, the full 30-page PDF is available below.",
    downloadLabel: "Download the 30-page PDF",
  }),
  fields: [
    {
      type: "string",
      name: "heading",
      label: "Heading",
      ui: charLimit(60, "Heading above the request form."),
    },
    {
      type: "rich-text",
      name: "description",
      label: "Description",
      overrides: INLINE_RICH_TEXT,
      parser: SLATE_JSON_PARSER,
      ui: { description: "Short text below the heading explaining the request." },
    },
    {
      type: "string",
      name: "pdfUrl",
      label: "Dummy PDF",
      ui: {
        description:
          "Path or URL to the dummy-book PDF revealed after a successful request.",
      },
    },
    { type: "string", name: "submitLabel", label: "Submit Button Label", ui: charLimit(32) },
    {
      type: "string",
      name: "successHeading",
      label: "Success Heading",
      ui: charLimit(60, "Shown after the request is sent."),
    },
    {
      type: "string",
      name: "successNote",
      label: "Success Note",
      ui: { component: "textarea", ...charLimit(220, "Short note above the download button.") },
    },
    { type: "string", name: "downloadLabel", label: "Download Button Label", ui: charLimit(32) },
  ],
};

export const contactFormBlock: Template = {
  name: "contactForm",
  label: "Contact Form",
  ui: blockUi("contactForm", "Contact Form", null, {
    submitLabel: "Send Message",
  }),
  fields: [
    {
      type: "string",
      name: "submitLabel",
      label: "Submit Button Label",
      ui: charLimit(24, "Messages are delivered to the studio inbox automatically."),
    },
  ],
};

// ---------------------------------------------------------------------------
// Link-in-bio / standalone-page blocks
// ---------------------------------------------------------------------------

export const marqueeBlock: Template = {
  name: "marquee",
  label: "Announcement Marquee",
  ui: blockUi("marquee", "Marquee", "highlightText", {
    highlightText: "Big news",
    text: " — something exciting is coming soon",
  }),
  fields: [
    {
      type: "string",
      name: "highlightText",
      label: "Highlighted Text",
      ui: charLimit(40, "The first part of the announcement, shown in orange."),
    },
    {
      type: "string",
      name: "text",
      label: "Text",
      ui: charLimit(80, "The rest of the announcement, shown in muted color."),
    },
  ],
};

export const featuredReleaseBlock: Template = {
  name: "featuredRelease",
  label: "Featured Release",
  ui: blockUi("featuredRelease", "Featured Release", "title", {
    eyebrow: "New Featured Release",
    title: "Book Title",
    description: rt("A short description of the release."),
    ctaLabel: "Get the Book",
    ctaHref: "https://",
  }),
  fields: [
    {
      type: "string",
      name: "eyebrow",
      label: "Eyebrow Label",
      ui: charLimit(40, 'Small label above the title (e.g. "New Featured Release").'),
    },
    { type: "string", name: "title", label: "Title", required: true, ui: charLimit(60) },
    {
      type: "rich-text",
      name: "description",
      label: "Description",
      overrides: INLINE_RICH_TEXT,
      parser: SLATE_JSON_PARSER,
    },
    {
      type: "image",
      name: "coverImage",
      label: "Front Cover Image",
    },
    {
      type: "image",
      name: "backCoverImage",
      label: "Back Cover Image",
      ui: { description: "Optional second cover (shown alongside the front)." },
    },
    { type: "string", name: "ctaLabel", label: "Button Label", ui: charLimit(24) },
    {
      type: "string",
      name: "ctaHref",
      label: "Button URL",
      ui: {
        description: "Full URL (Amazon, shop, etc.).",
        validate: (value?: string) => {
          if (value && !/^(https?:\/\/|\/)/i.test(value)) {
            return "Links should start with https:// (or / for a page on this site).";
          }
          return undefined;
        },
      },
    },
  ],
};

export const kofiSupportBlock: Template = {
  name: "kofiSupport",
  label: "Ko-fi Support",
  ui: blockUi("kofiSupport", "Ko-fi Support", "heading", {
    heading: "Support the Studio",
    body: rt("If you enjoy the tutorials and books, consider buying a coffee on Ko-fi."),
    ctaLabel: "Support on Ko-fi",
    href: "https://ko-fi.com/bladeandquill",
  }),
  fields: [
    { type: "string", name: "heading", label: "Heading", ui: charLimit(60) },
    {
      type: "rich-text",
      name: "body",
      label: "Body Text",
      overrides: INLINE_RICH_TEXT,
      parser: SLATE_JSON_PARSER,
    },
    { type: "string", name: "ctaLabel", label: "Button Label", ui: charLimit(24) },
    { type: "string", name: "href", label: "Ko-fi URL" },
  ],
};

export const socialLinksBlock: Template = {
  name: "socialLinks",
  label: "Social Links",
  ui: blockUi("socialLinks", "Social Links", null, {
    links: [
      { platform: "youtube", url: "https://www.youtube.com/c/BladeQuillartacademy", label: "YouTube" },
      { platform: "instagram", url: "https://www.instagram.com/bladequillartacademy/", label: "Instagram" },
    ],
  }),
  fields: [
    {
      type: "string",
      name: "heading",
      label: "Heading (optional)",
      ui: charLimit(
        60,
        "When set, the links show inside a centered panel with this heading (like the Ko-fi support section). Leave blank for a simple icon row."
      ),
    },
    {
      type: "rich-text",
      name: "body",
      label: "Body Text (optional)",
      overrides: INLINE_RICH_TEXT,
      parser: SLATE_JSON_PARSER,
      ui: { description: "Short text under the heading (panel style only)." },
    },
    {
      type: "object",
      name: "links",
      label: "Links",
      list: true,
      ui: {
        itemProps: (item: Record<string, unknown> | undefined) => ({
          label: (item?.label as string) || (item?.platform as string) || "Link",
        }),
      },
      fields: [
        {
          type: "string",
          name: "platform",
          label: "Platform",
          options: [
            { value: "youtube", label: "YouTube" },
            { value: "instagram", label: "Instagram" },
            { value: "pinterest", label: "Pinterest" },
            { value: "amazon", label: "Amazon" },
            { value: "kofi", label: "Ko-fi" },
          ],
          ui: { description: "Controls which icon is shown." },
        },
        { type: "string", name: "url", label: "URL" },
        {
          type: "string",
          name: "label",
          label: "Label",
          ui: charLimit(32, "Accessible name for the link (read by screen readers)."),
        },
      ],
    },
  ],
};

export const reviewLinksBlock: Template = {
  name: "reviewLinks",
  label: "Review Buttons",
  ui: blockUi("reviewLinks", "Review Buttons", "heading", {
    heading: "Leave your reviews here",
    intro: rt("Reviews mean the world and truly help others discover the book."),
    thankYou: "Thank you so much for your support!",
    ctaHeading: "Review the book by clicking the button for your country!",
    links: [
      { label: "Review on Amazon.com", href: "https://", region: "US" },
    ],
  }),
  fields: [
    { type: "string", name: "heading", label: "Heading", ui: charLimit(60) },
    {
      type: "rich-text",
      name: "intro",
      label: "Intro Text",
      overrides: INLINE_RICH_TEXT,
      parser: SLATE_JSON_PARSER,
    },
    { type: "string", name: "thankYou", label: "Thank You Message", ui: charLimit(80) },
    { type: "string", name: "ctaHeading", label: "Buttons Heading", ui: charLimit(80) },
    {
      type: "object",
      name: "links",
      label: "Review Links",
      list: true,
      ui: {
        description: "One review button per region.",
        itemProps: (item: Record<string, unknown> | undefined) => ({
          label: (item?.label as string) || "Review link",
        }),
      },
      fields: [
        { type: "string", name: "label", label: "Button Label", ui: charLimit(32) },
        {
          type: "string",
          name: "href",
          label: "URL",
          ui: { description: "Full review URL (opens in a new tab)." },
        },
        {
          type: "string",
          name: "region",
          label: "Region",
          ui: { description: "Short region code for reference (e.g. US, UK, AU)." },
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Image showcase blocks — heroes
// ---------------------------------------------------------------------------

export const heroSplitImageBlock: Template = {
  name: "heroSplitImage",
  label: "Hero (Split Image)",
  ui: blockUi("heroSplitImage", "Hero (Split Image)", "heading", {
    eyebrow: "Featured Work",
    heading: "Showcase your\nbest piece",
    subheading: rt("Pair a bold headline with one large image — great for book launches, class promos, or portfolio highlights."),
    imagePosition: "right",
    ctaPrimary: "Learn More",
    ctaPrimaryLink: "/contact",
  }),
  fields: [
    {
      type: "string",
      name: "eyebrow",
      label: "Eyebrow (optional)",
      ui: { description: "Small label above the heading." },
    },
    {
      type: "string",
      name: "heading",
      label: "Heading",
      ui: { component: "textarea", ...charLimit(80, "Use a line break for a two-line headline.") },
    },
    {
      type: "rich-text",
      name: "subheading",
      label: "Subheading",
      overrides: INLINE_RICH_TEXT,
      parser: SLATE_JSON_PARSER,
    },
    {
      type: "image",
      name: "featuredImage",
      label: "Featured Image",
      ui: { description: "Large image shown beside the headline." },
    },
    {
      type: "string",
      name: "imageAlt",
      label: "Image Alt Text",
      ui: charLimit(125, "Short image description for screen readers."),
    },
    {
      type: "string",
      name: "imageCaption",
      label: "Image Caption (optional)",
      ui: charLimit(80),
    },
    {
      type: "string",
      name: "imagePosition",
      label: "Image Position",
      options: [
        { value: "right", label: "Image on right" },
        { value: "left", label: "Image on left" },
      ],
    },
    { type: "string", name: "ctaPrimary", label: "Primary Button Label", ui: charLimit(24) },
    { type: "string", name: "ctaPrimaryLink", label: "Primary Button Link" },
    { type: "string", name: "ctaSecondary", label: "Secondary Button Label (optional)", ui: charLimit(24) },
    { type: "string", name: "ctaSecondaryLink", label: "Secondary Button Link" },
  ],
};

export const heroFullBleedBlock: Template = {
  name: "heroFullBleed",
  label: "Hero (Full Bleed)",
  ui: blockUi("heroFullBleed", "Hero (Full Bleed)", "heading", {
    heading: "A cinematic\nfull-width moment",
    subheading: rt("Edge-to-edge artwork with text overlay — perfect for dramatic portfolio pieces or event banners."),
    overlay: "medium",
    textAlign: "center",
    minHeight: "tall",
    ctaLabel: "Explore",
    ctaLink: "/gallery",
  }),
  fields: [
    {
      type: "image",
      name: "backgroundImage",
      label: "Background Image",
      ui: { description: "Full-width image behind the text." },
    },
    {
      type: "string",
      name: "heading",
      label: "Heading",
      ui: { component: "textarea", ...charLimit(70, "Press Enter to create a line break.") },
    },
    {
      type: "rich-text",
      name: "subheading",
      label: "Subheading (optional)",
      overrides: INLINE_RICH_TEXT,
      parser: SLATE_JSON_PARSER,
    },
    {
      type: "string",
      name: "overlay",
      label: "Overlay Darkness",
      options: [
        { value: "light", label: "Light" },
        { value: "medium", label: "Medium" },
        { value: "dark", label: "Dark" },
      ],
    },
    {
      type: "string",
      name: "textAlign",
      label: "Text Alignment",
      options: [
        { value: "center", label: "Center" },
        { value: "left", label: "Bottom left" },
      ],
    },
    {
      type: "string",
      name: "minHeight",
      label: "Section Height",
      options: [
        { value: "medium", label: "Medium (60vh)" },
        { value: "tall", label: "Tall (80vh)" },
        { value: "short", label: "Short (45vh)" },
      ],
    },
    { type: "string", name: "ctaLabel", label: "Button Label (optional)", ui: charLimit(24) },
    { type: "string", name: "ctaLink", label: "Button Link" },
  ],
};

export const heroFloatingImagesBlock: Template = {
  name: "heroFloatingImages",
  label: "Hero (Floating Images)",
  ui: blockUi("heroFloatingImages", "Hero (Floating Images)", "heading", {
    eyebrow: "Portfolio",
    heading: "Art that floats\noff the page",
    subheading: rt("Scatter up to six images around the headline — like the homepage hero, but fully editable."),
    images: [],
    ctaPrimary: "View Gallery",
    ctaPrimaryLink: "/gallery",
  }),
  fields: [
    { type: "string", name: "eyebrow", label: "Eyebrow (optional)", ui: charLimit(40, "Small label above the heading.") },
    {
      type: "string",
      name: "heading",
      label: "Heading",
      ui: { component: "textarea", ...charLimit(70, "Press Enter to create a line break.") },
    },
    {
      type: "rich-text",
      name: "subheading",
      label: "Subheading (optional)",
      overrides: INLINE_RICH_TEXT,
      parser: SLATE_JSON_PARSER,
    },
    {
      type: "object",
      name: "images",
      label: "Floating Images",
      list: true,
      ui: {
        ...IMAGE_LIST_UI,
        description: "Add 2–6 images. They auto-position around the headline on desktop.",
      },
      fields: IMAGE_ITEM_FIELDS,
    },
    { type: "string", name: "ctaPrimary", label: "Primary Button Label (optional)", ui: charLimit(24) },
    { type: "string", name: "ctaPrimaryLink", label: "Primary Button Link" },
    { type: "string", name: "ctaSecondary", label: "Secondary Button Label (optional)", ui: charLimit(24) },
    { type: "string", name: "ctaSecondaryLink", label: "Secondary Button Link" },
  ],
};

export const heroImageGridBlock: Template = {
  name: "heroImageGrid",
  label: "Hero (Image Mosaic)",
  ui: blockUi("heroImageGrid", "Hero (Image Mosaic)", "heading", {
    eyebrow: "Gallery",
    heading: "A mosaic\nof your work",
    layout: "trio",
    images: [],
  }),
  fields: [
    { type: "string", name: "eyebrow", label: "Eyebrow (optional)", ui: charLimit(40, "Small label above the heading.") },
    {
      type: "string",
      name: "heading",
      label: "Heading",
      ui: { component: "textarea", ...charLimit(70, "Press Enter to create a line break.") },
    },
    {
      type: "rich-text",
      name: "subheading",
      label: "Subheading (optional)",
      overrides: INLINE_RICH_TEXT,
      parser: SLATE_JSON_PARSER,
    },
    {
      type: "string",
      name: "layout",
      label: "Grid Layout",
      options: [
        { value: "duo", label: "2 images" },
        { value: "trio", label: "3 images" },
        { value: "quad", label: "4 images" },
      ],
    },
    {
      type: "object",
      name: "images",
      label: "Images",
      list: true,
      ui: IMAGE_LIST_UI,
      fields: IMAGE_ITEM_FIELDS,
    },
    { type: "string", name: "ctaLabel", label: "Button Label (optional)", ui: charLimit(24) },
    { type: "string", name: "ctaLink", label: "Button Link" },
  ],
};

// ---------------------------------------------------------------------------
// Image showcase blocks — page sections
// ---------------------------------------------------------------------------

export const imageSpotlightBlock: Template = {
  name: "imageSpotlight",
  label: "Image (Spotlight)",
  ui: blockUi("imageSpotlight", "Image (Spotlight)", "heading", {
    eyebrow: "Featured",
    heading: "One piece,\nfront and center",
    caption: "A single large image with room to breathe.",
    aspect: "landscape",
  }),
  fields: [
    { type: "string", name: "eyebrow", label: "Eyebrow (optional)", ui: charLimit(40, "Small label above the heading.") },
    {
      type: "string",
      name: "heading",
      label: "Heading (optional)",
      ui: { component: "textarea", ...charLimit(70, "Press Enter to create a line break.") },
    },
    {
      type: "image",
      name: "image",
      label: "Image",
    },
    { type: "string", name: "alt", label: "Alt Text", ui: charLimit(125, "Short image description for screen readers.") },
    { type: "string", name: "caption", label: "Caption (optional)", ui: charLimit(80) },
    {
      type: "string",
      name: "aspect",
      label: "Aspect Ratio",
      options: [
        { value: "landscape", label: "Landscape (16:10)" },
        { value: "square", label: "Square (1:1)" },
        { value: "portrait", label: "Portrait (3:4)" },
        { value: "wide", label: "Wide banner (21:9)" },
      ],
    },
    {
      type: "rich-text",
      name: "body",
      label: "Body Text (optional)",
      overrides: INLINE_RICH_TEXT,
      parser: SLATE_JSON_PARSER,
    },
  ],
};

export const imageSideBySideBlock: Template = {
  name: "imageSideBySide",
  label: "Image (Side by Side)",
  ui: blockUi("imageSideBySide", "Image (Side by Side)", "heading", {
    heading: "Compare or contrast",
    leftImage: {},
    rightImage: {},
    style: "polaroid",
  }),
  fields: [
    {
      type: "string",
      name: "heading",
      label: "Heading (optional)",
      ui: charLimit(60),
    },
    {
      type: "object",
      name: "leftImage",
      label: "Left Image",
      fields: IMAGE_ITEM_FIELDS,
    },
    {
      type: "object",
      name: "rightImage",
      label: "Right Image",
      fields: IMAGE_ITEM_FIELDS,
    },
    {
      type: "string",
      name: "style",
      label: "Frame Style",
      options: [
        { value: "polaroid", label: "Polaroid frames" },
        { value: "clean", label: "Clean (no frame)" },
        { value: "rounded", label: "Rounded corners" },
      ],
    },
  ],
};

export const imageMasonryBlock: Template = {
  name: "imageMasonry",
  label: "Image (Masonry)",
  ui: blockUi("imageMasonry", "Image (Masonry)", "heading", {
    heading: "A wall of work",
    images: [],
  }),
  fields: [
    {
      type: "string",
      name: "heading",
      label: "Heading (optional)",
      ui: charLimit(60),
    },
    {
      type: "object",
      name: "images",
      label: "Images",
      list: true,
      ui: {
        ...IMAGE_LIST_UI,
        description: "Add 3–6 images for an asymmetric masonry layout.",
      },
      fields: [
        ...IMAGE_ITEM_FIELDS,
        {
          type: "string",
          name: "size",
          label: "Tile Size",
          options: [
            { value: "auto", label: "Auto" },
            { value: "tall", label: "Tall" },
            { value: "wide", label: "Wide" },
          ],
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Master list — every block available on every page
// ---------------------------------------------------------------------------

export const ALL_BLOCKS: Template[] = [
  // Heroes & headers
  homeHeroBlock,
  aboutHeroBlock,
  heroBlock,
  heroSplitImageBlock,
  heroFullBleedBlock,
  heroFloatingImagesBlock,
  heroImageGridBlock,
  pageHeaderBlock,
  // Content
  textBlock,
  storyBlock,
  timelineBlock,
  statsRowBlock,
  featureGridBlock,
  cardRowBlock,
  pillarsBlock,
  imageGalleryBlock,
  imageSpotlightBlock,
  imageSideBySideBlock,
  imageMasonryBlock,
  videoEmbedBlock,
  // Commerce & media
  featuredBookBlock,
  featuredReleaseBlock,
  productStripBlock,
  shopCatalogBlock,
  galleryGridBlock,
  downloadsGridBlock,
  tutorialsStripBlock,
  classesPitchBlock,
  blogFeedBlock,
  // Calls to action & forms
  ctaBandBlock,
  bigCtaBlock,
  newsletterSignupBlock,
  contactInfoBlock,
  contactFormBlock,
  dummyBookRequestBlock,
  kofiSupportBlock,
  reviewLinksBlock,
  // Standalone page extras
  marqueeBlock,
  socialLinksBlock,
];
