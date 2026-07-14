import type { Template } from "tinacms";

const INLINE_RICH_TEXT = {
  toolbar: ["bold", "italic", "link", "ul", "ol"] as Array<
    "bold" | "italic" | "link" | "ul" | "ol"
  >,
  showFloatingToolbar: true,
};

/** JSON collections store Slate AST directly — skip markdown re-parsing. */
const SLATE_JSON_PARSER = { type: "slatejson" as const };

/** Build a Slate rich-text value from a plain sentence (for defaultItem seeds). */
const rt = (text: string) => ({
  type: "root",
  children: [{ type: "p", children: [{ type: "text", text }] }],
});

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
      ui: { description: "Large heading text for this hero section." },
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
      ui: { description: "Optional background image behind the hero." },
    },
    {
      type: "string",
      name: "ctaLabel",
      label: "Button Label",
      ui: { description: 'Text on the call-to-action button (e.g. "Get Started").' },
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
      ui: { description: "Optional heading above the text content." },
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
      ui: { description: "Optional heading above the image grid." },
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
        { type: "string", name: "alt", label: "Alt Text" },
        { type: "string", name: "caption", label: "Caption (optional)" },
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
      ui: { description: "Bold heading for the call-to-action strip." },
    },
    {
      type: "rich-text",
      name: "description",
      label: "Description",
      overrides: INLINE_RICH_TEXT,
      parser: SLATE_JSON_PARSER,
      ui: { description: "Supporting line below the heading." },
    },
    { type: "string", name: "ctaLabel", label: "Button Label" },
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
      ui: { description: "Optional heading above the video." },
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
      ui: { description: "Optional heading above the feature cards." },
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
        { type: "string", name: "title", label: "Title" },
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
      ui: { description: "Small label above the heading." },
    },
    {
      type: "string",
      name: "heading",
      label: "Heading",
      ui: {
        component: "textarea",
        description: "Large centered heading. Press Enter to create a line break.",
      },
    },
    {
      type: "string",
      name: "highlightText",
      label: "Highlighted Word",
      ui: { description: "A word or phrase from the heading to show in gradient color. Must match the heading text exactly." },
    },
    { type: "string", name: "primaryLabel", label: "Primary Button Label" },
    {
      type: "string",
      name: "primaryLink",
      label: "Primary Button Link",
      ui: { description: 'Relative URL (e.g. "/contact").' },
    },
    { type: "string", name: "secondaryLabel", label: "Secondary Button Label" },
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
      ui: { description: "The main page title shown at the top." },
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
      ui: { description: "Small label above the big heading." },
    },
    {
      type: "string",
      name: "heading",
      label: "Heading",
      ui: {
        component: "textarea",
        description: "The giant homepage heading. Press Enter once to split it into two lines — the second line shows in gradient color.",
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
      ui: { description: 'Text on the orange button (e.g. "Explore the Shop").' },
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
      ui: { description: "Text on the outline button next to the primary one." },
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
      ui: { description: 'Small line between the quill marks (e.g. "EST. 2018 · NANTES, FR").' },
    },
    {
      type: "string",
      name: "marqueeItems",
      label: "Scrolling Words",
      list: true,
      ui: { description: "Words that scroll across the bottom of the hero (e.g. Author, Illustrator)." },
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
    { type: "string", name: "eyebrow", label: "Eyebrow" },
    { type: "string", name: "heading", label: "Heading" },
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
          ui: { description: 'Small label above the card title (e.g. "NEW BOOK").' },
        },
        { type: "string", name: "title", label: "Title" },
        { type: "string", name: "sub", label: "Subtitle" },
        { type: "string", name: "cta", label: "Link Text" },
        {
          type: "string",
          name: "badge",
          label: "Corner Badge",
          ui: { description: 'Small pill in the top-right corner of the image (e.g. "LATEST").' },
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
    { type: "string", name: "eyebrow", label: "Eyebrow" },
    { type: "string", name: "heading", label: "Heading" },
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
        { type: "string", name: "value", label: "Value" },
        { type: "string", name: "label", label: "Label" },
      ],
    },
    { type: "string", name: "ctaLabel", label: "Primary Button Label" },
    {
      type: "string",
      name: "ctaLink",
      label: "Primary Button Link",
      ui: { description: 'Relative URL (e.g. "/shop/lheeloo-luna-cartoon-book").' },
    },
    { type: "string", name: "secondaryLabel", label: "Secondary Button Label" },
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
      ui: { description: 'Small label above the heading (e.g. "Now Enrolling").' },
    },
    { type: "string", name: "heading", label: "Heading" },
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
      ui: { description: "Numbered benefit bullets." },
    },
    {
      type: "string",
      name: "metaTags",
      label: "Meta Line",
      ui: { description: 'Small line below the bullets (e.g. "Self-paced · Krita 5.2"). Separate items with "·".' },
    },
    { type: "string", name: "ctaLabel", label: "Primary Button Label" },
    {
      type: "string",
      name: "ctaLink",
      label: "Primary Button Link",
      ui: { description: 'Relative URL (e.g. "/classes").' },
    },
    { type: "string", name: "secondaryLabel", label: "Secondary Button Label" },
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
    { type: "string", name: "eyebrow", label: "Eyebrow" },
    {
      type: "string",
      name: "headingPrefix",
      label: "Heading — Start",
      ui: { description: 'First words of the heading (e.g. "Join ").' },
    },
    {
      type: "string",
      name: "headingHighlight",
      label: "Heading — Highlighted Part",
      ui: { description: 'Shown in warm gradient color (e.g. "100,000+ artists").' },
    },
    {
      type: "string",
      name: "headingSuffix",
      label: "Heading — Second Line",
      ui: { description: 'Rest of the heading on the next line (e.g. "learning with me.").' },
    },
    { type: "string", name: "buttonLabel", label: "Button Label" },
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
        { type: "string", name: "value", label: "Value" },
        { type: "string", name: "label", label: "Label" },
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
    { type: "string", name: "eyebrow", label: "Eyebrow" },
    { type: "string", name: "heading", label: "Heading" },
    { type: "string", name: "viewAllLabel", label: "View All Label" },
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
      ui: { description: "Heading above the list of recent blog posts (posts appear automatically)." },
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
        { type: "string", name: "eyebrow", label: "Eyebrow" },
        { type: "string", name: "heading", label: "Heading" },
        {
          type: "rich-text",
          name: "subheading",
          label: "Description",
          overrides: INLINE_RICH_TEXT,
          parser: SLATE_JSON_PARSER,
        },
        { type: "string", name: "placeholderText", label: "Email Placeholder" },
        { type: "string", name: "ctaLabel", label: "Submit Button Label" },
        { type: "string", name: "privacyNote", label: "Privacy Note" },
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
    { type: "string", name: "eyebrow", label: "Eyebrow" },
    { type: "string", name: "heading", label: "Heading" },
    {
      type: "rich-text",
      name: "subheading",
      label: "Description",
      overrides: INLINE_RICH_TEXT,
      parser: SLATE_JSON_PARSER,
    },
    { type: "string", name: "placeholderText", label: "Email Placeholder" },
    { type: "string", name: "ctaLabel", label: "Submit Button Label" },
    { type: "string", name: "privacyNote", label: "Privacy Note" },
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
    { type: "string", name: "eyebrow", label: "Eyebrow" },
    {
      type: "string",
      name: "heading",
      label: "Heading",
      ui: {
        component: "textarea",
        description: "Up to three lines (press Enter to break). The middle line shows in gradient color.",
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
    { type: "string", name: "ctaPrimary", label: "Primary Button Label" },
    { type: "string", name: "ctaPrimaryLink", label: "Primary Button Link" },
    { type: "string", name: "ctaSecondary", label: "Secondary Button Label" },
    { type: "string", name: "ctaSecondaryLink", label: "Secondary Button Link" },
    {
      type: "string",
      name: "metaLine",
      label: "Meta Line",
      ui: { description: 'Small line under the buttons (e.g. "NANTES, FRANCE · EST. 2018"). Separate items with "·".' },
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
      ui: { description: "Handwritten-style caption under the portrait." },
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
        { type: "string", name: "value", label: "Value" },
        { type: "string", name: "label", label: "Label" },
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
      ui: { description: 'The small orange number in the left margin (e.g. "01").' },
    },
    {
      type: "string",
      name: "label",
      label: "Section Label",
      ui: { description: 'The small label in the left margin (e.g. "STORY").' },
    },
    {
      type: "string",
      name: "heading",
      label: "Heading",
      ui: { component: "textarea", description: "Press Enter to create a line break." },
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
      type: "string",
      name: "sideCaption",
      label: "Side Photo Caption",
      ui: { description: "Caption under the small polaroid on the right." },
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
    { type: "string", name: "number", label: "Section Number" },
    { type: "string", name: "label", label: "Section Label" },
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
        { type: "string", name: "year", label: "Year" },
        { type: "string", name: "title", label: "Title" },
        { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
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
    { type: "string", name: "number", label: "Section Number" },
    { type: "string", name: "label", label: "Section Label" },
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
          ui: { description: 'Small label above the title (e.g. "BOOKS").' },
        },
        { type: "string", name: "title", label: "Title" },
        { type: "string", name: "body", label: "Body", ui: { component: "textarea" } },
        { type: "string", name: "ctaLabel", label: "Link Text" },
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
      ui: { description: "The big shop heading. Products themselves are managed under Shop Products." },
    },
    {
      type: "string",
      name: "highlightText",
      label: "Highlighted Word",
      ui: { description: "A word from the heading to show in gradient color. Must match the heading text exactly." },
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
      ui: { description: "Heading shown when no products match the filter." },
    },
    {
      type: "string",
      name: "emptyDescription",
      label: "Empty State Description",
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
      ui: { description: "Images load automatically from the gallery database. This heading only shows if the gallery is empty." },
    },
    {
      type: "string",
      name: "emptyDescription",
      label: "Empty State Description",
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
      ui: { description: "Downloads load automatically. This heading only shows when there are none." },
    },
    {
      type: "string",
      name: "emptyDescription",
      label: "Empty State Description",
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
      ui: { description: 'General location (e.g. "Des Moines, IA").' },
    },
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
      ui: { description: "Messages are delivered to the studio inbox automatically." },
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
      ui: { description: "The first part of the announcement, shown in orange." },
    },
    {
      type: "string",
      name: "text",
      label: "Text",
      ui: { description: "The rest of the announcement, shown in muted color." },
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
      ui: { description: 'Small label above the title (e.g. "New Featured Release").' },
    },
    { type: "string", name: "title", label: "Title", required: true },
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
    { type: "string", name: "ctaLabel", label: "Button Label" },
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
    { type: "string", name: "heading", label: "Heading" },
    {
      type: "rich-text",
      name: "body",
      label: "Body Text",
      overrides: INLINE_RICH_TEXT,
      parser: SLATE_JSON_PARSER,
    },
    { type: "string", name: "ctaLabel", label: "Button Label" },
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
          ui: { description: "Accessible name for the link (read by screen readers)." },
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
    { type: "string", name: "heading", label: "Heading" },
    {
      type: "rich-text",
      name: "intro",
      label: "Intro Text",
      overrides: INLINE_RICH_TEXT,
      parser: SLATE_JSON_PARSER,
    },
    { type: "string", name: "thankYou", label: "Thank You Message" },
    { type: "string", name: "ctaHeading", label: "Buttons Heading" },
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
        { type: "string", name: "label", label: "Button Label" },
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
// Master list — every block available on every page
// ---------------------------------------------------------------------------

export const ALL_BLOCKS: Template[] = [
  // Heroes & headers
  homeHeroBlock,
  aboutHeroBlock,
  heroBlock,
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
  kofiSupportBlock,
  reviewLinksBlock,
  // Standalone page extras
  marqueeBlock,
  socialLinksBlock,
];
