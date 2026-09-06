// tina/config.ts
import React2, { useEffect } from "react";
import {
  defineConfig,
  wrapFieldsWithMeta
} from "tinacms";

// tina/blocks.ts
var RICH_TEXT_TEMPLATES = [
  {
    name: "ContentLink",
    label: "Link",
    inline: true,
    fields: [
      {
        type: "string",
        name: "url",
        label: "URL",
        required: true,
        ui: {
          description: "Site path (e.g. /shop) or full URL (e.g. https://\u2026)."
        }
      },
      {
        type: "string",
        name: "text",
        label: "Link Text",
        required: true,
        ui: { description: "The clickable words visitors see." }
      },
      {
        type: "boolean",
        name: "openInNewTab",
        label: "Open in new tab",
        ui: {
          description: "Turn on for external sites or PDFs. Shows a small \u2197 after the link text."
        }
      }
    ],
    ui: {
      defaultItem: {
        url: "https://",
        text: "Link text",
        openInNewTab: false
      }
    }
  }
];
var INLINE_RICH_TEXT = {
  toolbar: ["bold", "italic", "embed", "ul", "ol"],
  showFloatingToolbar: true
};
var SLATE_JSON_PARSER = { type: "slatejson" };
var charLimit = (max, description) => ({
  description: [description, `Max ${max} characters.`].filter(Boolean).join(" "),
  validate: (value) => {
    if (value && value.length > max) {
      return `Too long \u2014 ${value.length}/${max} characters. Please shorten so it fits nicely on the page.`;
    }
    return void 0;
  }
});
function textStyleFields() {
  return [
    {
      type: "object",
      name: "textStyle",
      label: "Text Style",
      ui: {
        description: "Optional size, heading type, font, and alignment for this section. Leave everything on Default to keep the design as-is."
      },
      fields: [
        {
          type: "string",
          name: "headingSize",
          label: "Heading Size",
          options: [
            { value: "default", label: "Default" },
            { value: "smaller", label: "Smaller" },
            { value: "larger", label: "Larger" },
            { value: "xl", label: "Extra Large" }
          ],
          ui: {
            description: "Scales this section's heading up or down. Mobile stays readable."
          }
        },
        {
          type: "string",
          name: "headingType",
          label: "Heading Type",
          options: [
            { value: "default", label: "Default (keep this section's style)" },
            { value: "h1", label: "Page Title (H1)" },
            { value: "h2", label: "Section Heading (H2)" },
            { value: "h3", label: "Sub-heading (H3)" }
          ],
          ui: {
            description: "Changes the HTML heading tag (for structure/SEO). Size is controlled separately above."
          }
        },
        {
          type: "string",
          name: "headingFont",
          label: "Heading Font",
          options: [
            { value: "default", label: "Default" },
            { value: "serif", label: "Serif (Young Serif)" },
            { value: "sans", label: "Sans (Quicksand)" }
          ]
        },
        {
          type: "string",
          name: "align",
          label: "Text Alignment",
          options: [
            { value: "default", label: "Default" },
            { value: "left", label: "Left" },
            { value: "center", label: "Center" }
          ]
        },
        {
          type: "string",
          name: "bodySize",
          label: "Body Text Size",
          options: [
            { value: "default", label: "Default" },
            { value: "large", label: "Large" }
          ],
          ui: {
            description: "Applies to supporting text under the heading (descriptions, body copy)."
          }
        }
      ]
    }
  ];
}
var rt = (text) => ({
  type: "root",
  children: [{ type: "p", children: [{ type: "text", text }] }]
});
var IMAGE_ITEM_FIELDS = [
  { type: "image", name: "src", label: "Image" },
  {
    type: "string",
    name: "alt",
    label: "Alt Text",
    ui: charLimit(125, "Short image description for screen readers.")
  },
  {
    type: "string",
    name: "caption",
    label: "Caption (optional)",
    ui: charLimit(80)
  }
];
var IMAGE_LIST_UI = {
  itemProps: (item) => ({
    label: item?.caption || item?.alt || "Image"
  })
};
function blockUi(name, label, titleField, defaultItem) {
  return {
    previewSrc: `/admin-previews/${name}.svg`,
    ...defaultItem ? { defaultItem } : {},
    itemProps: (item) => {
      const raw = titleField ? item?.[titleField] : void 0;
      const text = typeof raw === "string" && raw.trim() ? raw.split("\n")[0].trim() : "";
      return { label: text ? `${label} \u2014 ${text}` : label };
    }
  };
}
var heroBlock = {
  name: "hero",
  label: "Hero (Simple)",
  ui: blockUi("hero", "Hero (Simple)", "heading", {
    heading: "A big welcoming headline",
    subheading: rt("A short sentence that supports the headline."),
    ctaLabel: "Learn More",
    ctaLink: "/"
  }),
  fields: [
    {
      type: "string",
      name: "heading",
      label: "Heading",
      ui: charLimit(70, "Large heading text for this hero section.")
    },
    {
      type: "rich-text",
      name: "subheading",
      label: "Subheading",
      overrides: INLINE_RICH_TEXT,
      parser: SLATE_JSON_PARSER,
      templates: RICH_TEXT_TEMPLATES,
      ui: { description: "Supporting text shown below the heading." }
    },
    {
      type: "image",
      name: "backgroundImage",
      label: "Background Image",
      ui: {
        description: "Optional background image behind the hero. Prefer ~1920\xD71080 landscape. Upload into images/pages/."
      }
    },
    {
      type: "string",
      name: "ctaLabel",
      label: "Button Label",
      ui: charLimit(24, 'Text on the call-to-action button (e.g. "Get Started").')
    },
    {
      type: "string",
      name: "ctaLink",
      label: "Button Link",
      ui: { description: 'Relative URL the button links to (e.g. "/shop").' }
    },
    ...textStyleFields()
  ]
};
var textBlock = {
  name: "text",
  label: "Text Section",
  ui: blockUi("text", "Text", "heading", {
    heading: "Section heading",
    body: rt("Write anything here \u2014 paragraphs, lists, links, and more.")
  }),
  fields: [
    {
      type: "string",
      name: "heading",
      label: "Heading (optional)",
      ui: charLimit(70, "Optional heading above the text content.")
    },
    {
      type: "rich-text",
      name: "body",
      label: "Body",
      parser: SLATE_JSON_PARSER,
      templates: RICH_TEXT_TEMPLATES,
      overrides: {
        toolbar: [
          "heading",
          "bold",
          "italic",
          "embed",
          "ul",
          "ol",
          "quote",
          "code",
          "image"
        ],
        showFloatingToolbar: true
      },
      ui: {
        description: "Rich text content. To add a link: Embed \u2192 Link. Toggle Open in new tab for external sites (shows \u2197)."
      }
    },
    ...textStyleFields()
  ]
};
var imageGalleryBlock = {
  name: "imageGallery",
  label: "Image Gallery (Manual)",
  ui: blockUi("imageGallery", "Image Gallery", "heading", {
    heading: "Gallery",
    images: []
  }),
  fields: [
    {
      type: "string",
      name: "heading",
      label: "Heading (optional)",
      ui: charLimit(70, "Optional heading above the image grid.")
    },
    {
      type: "object",
      name: "images",
      label: "Images",
      list: true,
      ui: {
        itemProps: (item) => ({
          label: item?.caption || item?.alt || "Image"
        })
      },
      fields: [
        { type: "image", name: "src", label: "Image" },
        { type: "string", name: "alt", label: "Alt Text", ui: charLimit(125, "Short image description for screen readers.") },
        { type: "string", name: "caption", label: "Caption (optional)", ui: charLimit(80) }
      ]
    },
    ...textStyleFields()
  ]
};
var ctaBandBlock = {
  name: "ctaBand",
  label: "CTA Band",
  ui: blockUi("ctaBand", "CTA Band", "heading", {
    heading: "Ready to get started?",
    description: rt("One short supporting line goes here."),
    ctaLabel: "Get Started",
    ctaLink: "/contact",
    variant: "light"
  }),
  fields: [
    {
      type: "string",
      name: "heading",
      label: "Heading",
      ui: charLimit(70, "Bold heading for the call-to-action strip.")
    },
    {
      type: "rich-text",
      name: "description",
      label: "Description",
      overrides: INLINE_RICH_TEXT,
      parser: SLATE_JSON_PARSER,
      templates: RICH_TEXT_TEMPLATES,
      ui: { description: "Supporting line below the heading." }
    },
    { type: "string", name: "ctaLabel", label: "Button Label", ui: charLimit(24) },
    {
      type: "string",
      name: "ctaLink",
      label: "Button Link",
      ui: { description: 'Relative URL (e.g. "/shop").' }
    },
    {
      type: "string",
      name: "variant",
      label: "Style Variant",
      options: ["light", "dark"],
      ui: { description: 'Choose "dark" for a dark background with white text, or "light" for the default.' }
    },
    ...textStyleFields()
  ]
};
var videoEmbedBlock = {
  name: "videoEmbed",
  label: "Video Embed",
  ui: blockUi("videoEmbed", "Video", "heading", {
    heading: "Watch the video",
    youtubeUrl: ""
  }),
  fields: [
    {
      type: "string",
      name: "heading",
      label: "Heading (optional)",
      ui: charLimit(70, "Optional heading above the video.")
    },
    {
      type: "string",
      name: "youtubeUrl",
      label: "YouTube URL",
      ui: {
        description: "Full YouTube video URL (e.g. https://www.youtube.com/watch?v=abc123). The embed ID is extracted automatically.",
        validate: (value) => {
          if (value && !/youtube\.com|youtu\.be/i.test(value)) {
            return "Please paste a full YouTube link (youtube.com or youtu.be).";
          }
          return void 0;
        }
      }
    },
    ...textStyleFields()
  ]
};
var featureGridBlock = {
  name: "featureGrid",
  label: "Feature Grid",
  ui: blockUi("featureGrid", "Feature Grid", "heading", {
    heading: "What's included",
    items: [
      { icon: "Star", title: "First feature", description: rt("Describe the first feature here.") },
      { icon: "Brush", title: "Second feature", description: rt("Describe the second feature here.") },
      { icon: "BookOpen", title: "Third feature", description: rt("Describe the third feature here.") }
    ]
  }),
  fields: [
    {
      type: "string",
      name: "heading",
      label: "Heading (optional)",
      ui: charLimit(70, "Optional heading above the feature cards.")
    },
    {
      type: "object",
      name: "items",
      label: "Features",
      list: true,
      ui: {
        itemProps: (item) => ({
          label: item?.title || "Feature"
        })
      },
      fields: [
        {
          type: "string",
          name: "icon",
          label: "Icon Name",
          ui: { description: 'Lucide icon name (e.g. "Brush", "Star", "BookOpen"). Leave blank for no icon.' }
        },
        { type: "string", name: "title", label: "Title", ui: charLimit(48) },
        {
          type: "rich-text",
          name: "description",
          label: "Description",
          overrides: INLINE_RICH_TEXT,
          parser: SLATE_JSON_PARSER,
          templates: RICH_TEXT_TEMPLATES
        }
      ]
    },
    ...textStyleFields()
  ]
};
var bigCtaBlock = {
  name: "bigCta",
  label: "Big CTA",
  ui: blockUi("bigCta", "Big CTA", "heading", {
    eyebrow: "SAY HI",
    heading: "A big closing\nstatement.",
    highlightText: "closing",
    primaryLabel: "Get in Touch",
    primaryLink: "/contact"
  }),
  fields: [
    {
      type: "string",
      name: "eyebrow",
      label: "Eyebrow",
      ui: charLimit(40, "Small label above the heading.")
    },
    {
      type: "string",
      name: "heading",
      label: "Heading",
      ui: {
        component: "textarea",
        ...charLimit(90, "Large centered heading. Press Enter to create a line break.")
      }
    },
    {
      type: "string",
      name: "highlightText",
      label: "Highlighted Word",
      ui: charLimit(40, "A word or phrase from the heading to show in gradient color. Must match the heading text exactly.")
    },
    { type: "string", name: "primaryLabel", label: "Primary Button Label", ui: charLimit(24) },
    {
      type: "string",
      name: "primaryLink",
      label: "Primary Button Link",
      ui: { description: 'Relative URL (e.g. "/contact").' }
    },
    { type: "string", name: "secondaryLabel", label: "Secondary Button Label", ui: charLimit(24) },
    {
      type: "string",
      name: "secondaryLink",
      label: "Secondary Button Link",
      ui: { description: "Relative URL or full https:// link." }
    },
    ...textStyleFields()
  ]
};
var pageHeaderBlock = {
  name: "pageHeader",
  label: "Page Header",
  ui: blockUi("pageHeader", "Page Header", "heading", {
    heading: "Page Title",
    description: rt("A short introduction for this page.")
  }),
  fields: [
    {
      type: "string",
      name: "heading",
      label: "Heading",
      ui: charLimit(60, "The main page title shown at the top.")
    },
    {
      type: "rich-text",
      name: "description",
      label: "Description",
      overrides: INLINE_RICH_TEXT,
      parser: SLATE_JSON_PARSER,
      templates: RICH_TEXT_TEMPLATES,
      ui: { description: "Introductory text shown below the heading." }
    },
    ...textStyleFields()
  ]
};
var homeHeroBlock = {
  name: "homeHero",
  label: "Hero (Homepage)",
  ui: blockUi("homeHero", "Hero (Homepage)", "heading", {
    eyebrow: "\u2726 HELLO FROM THE STUDIO \u2726",
    heading: "I write books and teach\ndigital painting.",
    subheading: rt("A sentence about what the site offers."),
    ctaPrimary: "Explore the Shop",
    ctaPrimaryLink: "/shop",
    ctaSecondary: "Watch Tutorials",
    ctaSecondaryLink: "https://www.youtube.com/c/BladeQuillartacademy",
    metaLine: "EST. 2018 \xB7 NANTES, FR",
    marqueeItems: ["Author", "Illustrator", "Krita educator"]
  }),
  fields: [
    {
      type: "image",
      name: "backgroundImage",
      label: "Background Image",
      ui: {
        description: "Optional. Upload your own artwork to replace the default characters. It sits ON the taupe card (not stretched behind it) anchored to the bottom-right, with the heading and buttons on top \u2014 no tint is added. Use a PNG or WebP with a TRANSPARENT background (a white background will show as a white box). Best size: about 1800 pixels tall, under 1 MB. Upload into images/pages/. Leave empty to keep the default artwork."
      }
    },
    {
      type: "string",
      name: "eyebrow",
      label: "Eyebrow",
      ui: charLimit(40, "Small label above the big heading.")
    },
    {
      type: "string",
      name: "heading",
      label: "Heading",
      ui: {
        component: "textarea",
        ...charLimit(80, "The giant homepage heading. Press Enter once to split it into two lines \u2014 the second line shows in gradient color.")
      }
    },
    {
      type: "rich-text",
      name: "subheading",
      label: "Subheading",
      overrides: INLINE_RICH_TEXT,
      parser: SLATE_JSON_PARSER,
      templates: RICH_TEXT_TEMPLATES,
      ui: { description: "The sentence below the main heading." }
    },
    {
      type: "string",
      name: "ctaPrimary",
      label: "Primary Button Label",
      ui: charLimit(24, 'Text on the orange button (e.g. "Explore the Shop").')
    },
    {
      type: "string",
      name: "ctaPrimaryLink",
      label: "Primary Button Link",
      ui: { description: 'Relative URL (e.g. "/shop").' }
    },
    {
      type: "string",
      name: "ctaSecondary",
      label: "Secondary Button Label",
      ui: charLimit(24, "Text on the outline button next to the primary one.")
    },
    {
      type: "string",
      name: "ctaSecondaryLink",
      label: "Secondary Button Link",
      ui: { description: "Relative URL or a full https:// link (opens in a new tab)." }
    },
    {
      type: "string",
      name: "metaLine",
      label: "Meta Line",
      ui: charLimit(60, 'Small line between the quill marks (e.g. "EST. 2018 \xB7 NANTES, FR").')
    },
    {
      type: "string",
      name: "marqueeItems",
      label: "Scrolling Words",
      list: true,
      ui: { description: "Words that scroll across the bottom of the hero (e.g. Author, Illustrator). Keep each under 20 characters." }
    },
    ...textStyleFields()
  ]
};
var pillarsBlock = {
  name: "pillars",
  label: "Pillars (3 Cards)",
  ui: blockUi("pillars", "Pillars", "heading", {
    eyebrow: "THREE THREADS",
    heading: "Where would you like to start?",
    items: [
      { tag: "FIRST", title: "First card", sub: "One line about it", cta: "Read more", badge: "NEW", link: "/" },
      { tag: "SECOND", title: "Second card", sub: "One line about it", cta: "Read more", badge: "OPEN", link: "/" },
      { tag: "THIRD", title: "Third card", sub: "One line about it", cta: "Read more", badge: "HOT", link: "/" }
    ]
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
        itemProps: (item) => ({
          label: item?.title || "Card"
        }),
        description: "Three destination cards (media + wavy content panel). Each links somewhere on (or off) the site."
      },
      fields: [
        {
          type: "string",
          name: "tag",
          label: "Tag",
          ui: charLimit(16, 'Small label above the card title (e.g. "NEW BOOK").')
        },
        { type: "string", name: "title", label: "Title", ui: charLimit(48) },
        { type: "string", name: "sub", label: "Subtitle", ui: charLimit(60) },
        { type: "string", name: "cta", label: "Link Text", ui: charLimit(24) },
        {
          type: "string",
          name: "badge",
          label: "Corner Badge",
          ui: charLimit(16, 'Small pill in the top-right corner of the image (e.g. "LATEST").')
        },
        {
          type: "string",
          name: "link",
          label: "Link",
          ui: { description: "Relative URL or full https:// link (https links open in a new tab)." }
        },
        {
          type: "image",
          name: "image",
          label: "Image (optional)",
          ui: { description: "Leave empty to automatically show a product/video preview." }
        }
      ]
    },
    ...textStyleFields()
  ]
};
var featuredBookBlock = {
  name: "featuredBook",
  label: "Featured Book",
  ui: blockUi("featuredBook", "Featured Book", "heading", {
    eyebrow: "FEATURED RELEASE",
    heading: "The new book.",
    description: rt("A short description of the featured book."),
    stats: [
      { value: "$25", label: "SIGNED COPY" },
      { value: "$14", label: "EBOOK" },
      { value: "144", label: "FULL-COLOR PAGES" }
    ],
    ctaLabel: "Order Now",
    ctaLink: "/shop",
    secondaryLabel: "Browse the shop",
    secondaryLink: "/shop"
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
      templates: RICH_TEXT_TEMPLATES
    },
    {
      type: "object",
      name: "stats",
      label: "Stats Row",
      list: true,
      ui: {
        description: "Short figures shown above the buttons (price, page count, etc.).",
        itemProps: (item) => ({
          label: item?.value ? `${item.value} ${item?.label ?? ""}` : "Stat"
        })
      },
      fields: [
        { type: "string", name: "value", label: "Value", ui: charLimit(12, 'Short figure (e.g. "100K+").') },
        { type: "string", name: "label", label: "Label", ui: charLimit(24) }
      ]
    },
    { type: "string", name: "ctaLabel", label: "Primary Button Label", ui: charLimit(24) },
    {
      type: "string",
      name: "ctaLink",
      label: "Primary Button Link",
      ui: { description: 'Relative URL (e.g. "/shop/lheeloo-luna-cartoon-book").' }
    },
    { type: "string", name: "secondaryLabel", label: "Secondary Button Label", ui: charLimit(24) },
    { type: "string", name: "secondaryLink", label: "Secondary Button Link" },
    ...textStyleFields()
  ]
};
var classesPitchBlock = {
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
    metaTags: "Self-paced \xB7 Krita 5.2 \xB7 All skill levels"
  }),
  fields: [
    {
      type: "string",
      name: "eyebrow",
      label: "Eyebrow",
      ui: charLimit(40, 'Small label above the heading (e.g. "Now Enrolling").')
    },
    { type: "string", name: "heading", label: "Heading", ui: charLimit(60) },
    {
      type: "rich-text",
      name: "subheading",
      label: "Subheading",
      overrides: INLINE_RICH_TEXT,
      parser: SLATE_JSON_PARSER,
      templates: RICH_TEXT_TEMPLATES,
      ui: { description: "Shown inside the left panel of the classroom card." }
    },
    {
      type: "string",
      name: "bullets",
      label: "Bullet Points",
      list: true,
      ui: { description: "Numbered benefit bullets. Keep each under 60 characters." }
    },
    {
      type: "string",
      name: "metaTags",
      label: "Meta Line",
      ui: charLimit(80, 'Small line below the bullets (e.g. "Self-paced \xB7 Krita 5.2"). Separate items with "\xB7".')
    },
    { type: "string", name: "ctaLabel", label: "Primary Button Label", ui: charLimit(24) },
    {
      type: "string",
      name: "ctaLink",
      label: "Primary Button Link",
      ui: { description: 'Relative URL (e.g. "/classes").' }
    },
    { type: "string", name: "secondaryLabel", label: "Secondary Button Label", ui: charLimit(24) },
    { type: "string", name: "secondaryLink", label: "Secondary Button Link" },
    ...textStyleFields()
  ]
};
var tutorialsStripBlock = {
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
      { value: "bi-weekly", label: "new videos" }
    ]
  }),
  fields: [
    { type: "string", name: "eyebrow", label: "Eyebrow", ui: charLimit(40, "Small label above the heading.") },
    {
      type: "string",
      name: "headingPrefix",
      label: "Heading \u2014 Start",
      ui: charLimit(30, 'First words of the heading (e.g. "Join ").')
    },
    {
      type: "string",
      name: "headingHighlight",
      label: "Heading \u2014 Highlighted Part",
      ui: charLimit(40, 'Shown in warm gradient color (e.g. "100,000+ artists").')
    },
    {
      type: "string",
      name: "headingSuffix",
      label: "Heading \u2014 Second Line",
      ui: charLimit(40, 'Rest of the heading on the next line (e.g. "learning with me.").')
    },
    { type: "string", name: "buttonLabel", label: "Button Label", ui: charLimit(24) },
    {
      type: "string",
      name: "youtubeUrl",
      label: "YouTube Channel URL",
      ui: {
        description: "Full channel URL \u2014 the button links here. The videos in this strip are managed in the YouTube Tutorials collection (sidebar): the first 4 Featured videos appear, in that list's order."
      }
    },
    {
      type: "object",
      name: "stats",
      label: "Stats Row",
      list: true,
      ui: {
        itemProps: (item) => ({
          label: item?.value ? `${item.value} ${item?.label ?? ""}` : "Stat"
        })
      },
      fields: [
        { type: "string", name: "value", label: "Value", ui: charLimit(12, 'Short figure (e.g. "100K+").') },
        { type: "string", name: "label", label: "Label", ui: charLimit(24) }
      ]
    },
    ...textStyleFields()
  ]
};
var productStripBlock = {
  name: "productStrip",
  label: "Product Strip",
  ui: blockUi("productStrip", "Product Strip", "heading", {
    eyebrow: "FROM THE SHOP",
    heading: "Books, brushes, and guides.",
    viewAllLabel: "All products",
    viewAllLink: "/shop"
  }),
  fields: [
    { type: "string", name: "eyebrow", label: "Eyebrow", ui: charLimit(40, "Small label above the heading.") },
    { type: "string", name: "heading", label: "Heading", ui: charLimit(60) },
    { type: "string", name: "viewAllLabel", label: "View All Label", ui: charLimit(24) },
    {
      type: "string",
      name: "viewAllLink",
      label: "View All Link",
      ui: { description: 'Where the "view all" button goes (usually "/shop").' }
    },
    ...textStyleFields()
  ]
};
var blogFeedBlock = {
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
      privacyNote: "No spam. Unsubscribe anytime."
    }
  }),
  fields: [
    {
      type: "string",
      name: "heading",
      label: "Heading",
      ui: charLimit(60, "Heading above the list of recent blog posts (posts appear automatically).")
    },
    {
      type: "boolean",
      name: "showNewsletter",
      label: "Show Newsletter Panel",
      ui: { description: "Show the dark newsletter signup panel beside the posts." }
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
          templates: RICH_TEXT_TEMPLATES
        },
        { type: "string", name: "placeholderText", label: "Email Placeholder", ui: charLimit(32) },
        { type: "string", name: "ctaLabel", label: "Submit Button Label", ui: charLimit(24) },
        { type: "string", name: "privacyNote", label: "Privacy Note", ui: charLimit(80) }
      ]
    },
    ...textStyleFields()
  ]
};
var newsletterSignupBlock = {
  name: "newsletterSignup",
  label: "Newsletter Signup",
  ui: blockUi("newsletterSignup", "Newsletter", "heading", {
    eyebrow: "STUDIO NEWSLETTER",
    heading: "Stay in the Loop",
    subheading: rt("Get art tips, new tutorials, and announcements in your inbox."),
    placeholderText: "you@example.com",
    ctaLabel: "Subscribe",
    privacyNote: "No spam. Unsubscribe anytime."
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
      templates: RICH_TEXT_TEMPLATES
    },
    { type: "string", name: "placeholderText", label: "Email Placeholder", ui: charLimit(32) },
    { type: "string", name: "ctaLabel", label: "Submit Button Label", ui: charLimit(24) },
    { type: "string", name: "privacyNote", label: "Privacy Note", ui: charLimit(80) },
    ...textStyleFields()
  ]
};
var aboutHeroBlock = {
  name: "aboutHero",
  label: "Hero (Portrait)",
  ui: blockUi("aboutHero", "Hero (Portrait)", "heading", {
    eyebrow: "ABOUT \xB7 A STUDIO VISIT",
    heading: "I'm Corinne \u2014\nand I draw\nfor a living.",
    leadText: rt("A short introduction sentence."),
    ctaPrimary: "Get in Touch",
    ctaPrimaryLink: "/contact",
    ctaSecondary: "Visit the Shop",
    ctaSecondaryLink: "/shop",
    metaLine: "NANTES, FRANCE \xB7 EST. 2018",
    portraitCaption: "in the studio"
  }),
  fields: [
    { type: "string", name: "eyebrow", label: "Eyebrow", ui: charLimit(40, "Small label above the heading.") },
    {
      type: "string",
      name: "heading",
      label: "Heading",
      ui: {
        component: "textarea",
        ...charLimit(90, "Up to three lines (press Enter to break). The middle line shows in gradient color.")
      }
    },
    {
      type: "rich-text",
      name: "leadText",
      label: "Lead Text",
      overrides: INLINE_RICH_TEXT,
      parser: SLATE_JSON_PARSER,
      templates: RICH_TEXT_TEMPLATES,
      ui: { description: "The introductory sentence below the heading. Keep it to 1-2 sentences." }
    },
    { type: "string", name: "ctaPrimary", label: "Primary Button Label", ui: charLimit(24) },
    { type: "string", name: "ctaPrimaryLink", label: "Primary Button Link" },
    { type: "string", name: "ctaSecondary", label: "Secondary Button Label", ui: charLimit(24) },
    { type: "string", name: "ctaSecondaryLink", label: "Secondary Button Link" },
    {
      type: "string",
      name: "metaLine",
      label: "Meta Line",
      ui: charLimit(60, 'Small line under the buttons (e.g. "NANTES, FRANCE \xB7 EST. 2018"). Separate items with "\xB7".')
    },
    {
      type: "image",
      name: "portraitImage",
      label: "Portrait Image",
      ui: { description: "Photo shown in the large polaroid on the right." }
    },
    {
      type: "string",
      name: "portraitCaption",
      label: "Portrait Caption",
      ui: charLimit(48, "Handwritten-style caption under the portrait.")
    },
    {
      type: "image",
      name: "deskImage",
      label: "Desk Accent Image",
      ui: {
        description: "Smaller polaroid on the left of the collage (desktop only). Leave blank to hide."
      }
    },
    {
      type: "string",
      name: "deskCaption",
      label: "Desk Accent Caption",
      ui: charLimit(32, 'Small label on the desk polaroid (e.g. "from the desk").')
    },
    {
      type: "image",
      name: "screenImage",
      label: "Screen Accent Image",
      ui: {
        description: "Bottom-right polaroid in the collage (desktop only). Leave blank to hide."
      }
    },
    {
      type: "string",
      name: "screenCaption",
      label: "Screen Accent Caption",
      ui: charLimit(32, 'Small label on the screen polaroid (e.g. "krita screen").')
    },
    ...textStyleFields()
  ]
};
var statsRowBlock = {
  name: "statsRow",
  label: "Stats Row",
  ui: blockUi("statsRow", "Stats Row", null, {
    stats: [
      { value: "100K+", label: "YouTube subscribers" },
      { value: "1.5M", label: "video views" },
      { value: "65", label: "countries reached" },
      { value: "2", label: "illustrated books" }
    ]
  }),
  fields: [
    {
      type: "object",
      name: "stats",
      label: "Stats",
      list: true,
      ui: {
        itemProps: (item) => ({
          label: item?.value ? `${item.value} ${item?.label ?? ""}` : "Stat"
        })
      },
      fields: [
        { type: "string", name: "value", label: "Value", ui: charLimit(12, 'Short figure (e.g. "100K+").') },
        { type: "string", name: "label", label: "Label", ui: charLimit(24) }
      ]
    }
  ]
};
var storyBlock = {
  name: "story",
  label: "Story Section",
  ui: blockUi("story", "Story", "heading", {
    number: "01",
    label: "STORY",
    heading: "The story behind\nall of this.",
    paragraph1: rt("First paragraph of the story."),
    quote: rt("A pull-quote shown in the dark panel."),
    paragraph2: rt("Second paragraph of the story."),
    sideCaption: "my window in winter"
  }),
  fields: [
    {
      type: "string",
      name: "number",
      label: "Section Number",
      ui: charLimit(4, 'The small orange number in the left margin (e.g. "01").')
    },
    {
      type: "string",
      name: "label",
      label: "Section Label",
      ui: charLimit(24, 'The small label in the left margin (e.g. "STORY").')
    },
    {
      type: "string",
      name: "heading",
      label: "Heading",
      ui: { component: "textarea", ...charLimit(80, "Press Enter to create a line break.") }
    },
    {
      type: "rich-text",
      name: "paragraph1",
      label: "First Paragraph",
      overrides: INLINE_RICH_TEXT,
      parser: SLATE_JSON_PARSER,
      templates: RICH_TEXT_TEMPLATES
    },
    {
      type: "rich-text",
      name: "quote",
      label: "Pull Quote",
      overrides: INLINE_RICH_TEXT,
      parser: SLATE_JSON_PARSER,
      templates: RICH_TEXT_TEMPLATES,
      ui: { description: "Shown as a large quote in a dark rounded panel between the paragraphs." }
    },
    {
      type: "rich-text",
      name: "paragraph2",
      label: "Second Paragraph",
      overrides: INLINE_RICH_TEXT,
      parser: SLATE_JSON_PARSER,
      templates: RICH_TEXT_TEMPLATES
    },
    {
      type: "image",
      name: "sideImage",
      label: "Side Photo",
      ui: { description: "Small polaroid on the right of the story section (desktop)." }
    },
    {
      type: "string",
      name: "sideCaption",
      label: "Side Photo Caption",
      ui: charLimit(48, "Caption under the small polaroid on the right.")
    },
    ...textStyleFields()
  ]
};
var timelineBlock = {
  name: "timeline",
  label: "Timeline",
  ui: blockUi("timeline", "Timeline", "label", {
    number: "02",
    label: "TIMELINE",
    events: [
      { year: "2018", title: "It all started", description: "How things began." },
      { year: "2026", title: "Today", description: "Where things are now." }
    ]
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
        itemProps: (item) => ({
          label: item?.year ? `${item.year} \u2014 ${item?.title ?? ""}` : "Event"
        })
      },
      fields: [
        { type: "string", name: "year", label: "Year", ui: charLimit(12) },
        { type: "string", name: "title", label: "Title", ui: charLimit(48) },
        { type: "string", name: "description", label: "Description", ui: { component: "textarea", ...charLimit(220) } },
        {
          type: "image",
          name: "image",
          label: "Image",
          ui: { description: "Optional artwork shown beside this timeline event." }
        }
      ]
    },
    ...textStyleFields()
  ]
};
var cardRowBlock = {
  name: "cardRow",
  label: "Card Row",
  ui: blockUi("cardRow", "Card Row", "label", {
    number: "03",
    label: "WHAT I MAKE",
    cards: [
      { tag: "FIRST", title: "First card", body: "One or two sentences.", ctaLabel: "Learn more", link: "/" },
      { tag: "SECOND", title: "Second card", body: "One or two sentences.", ctaLabel: "Learn more", link: "/" },
      { tag: "THIRD", title: "Third card", body: "One or two sentences.", ctaLabel: "Learn more", link: "/" }
    ]
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
        itemProps: (item) => ({
          label: item?.title || "Card"
        })
      },
      fields: [
        {
          type: "string",
          name: "tag",
          label: "Tag",
          ui: charLimit(16, 'Small label above the title (e.g. "BOOKS").')
        },
        { type: "string", name: "title", label: "Title", ui: charLimit(48) },
        { type: "string", name: "body", label: "Body", ui: { component: "textarea", ...charLimit(220) } },
        {
          type: "image",
          name: "image",
          label: "Image",
          ui: { description: "Card thumbnail. Leave blank to use the default fallback art." }
        },
        { type: "string", name: "ctaLabel", label: "Link Text", ui: charLimit(24) },
        {
          type: "string",
          name: "link",
          label: "Link",
          ui: { description: "Relative URL or full https:// link (https links open in a new tab)." }
        }
      ]
    },
    ...textStyleFields()
  ]
};
var shopCatalogBlock = {
  name: "shopCatalog",
  label: "Shop Catalog",
  ui: blockUi("shopCatalog", "Shop Catalog", "heading", {
    heading: "The studio shop.",
    highlightText: "studio",
    description: rt("Books, digital guides, and curriculum."),
    showFeaturedBanner: true,
    emptyHeading: "No products found",
    emptyDescription: "Check back later for new releases."
  }),
  fields: [
    {
      type: "string",
      name: "heading",
      label: "Heading",
      ui: charLimit(48, "The big shop heading. Products themselves are managed under Shop Products.")
    },
    {
      type: "string",
      name: "highlightText",
      label: "Highlighted Word",
      ui: charLimit(40, "A word from the heading to show in gradient color. Must match the heading text exactly.")
    },
    {
      type: "rich-text",
      name: "description",
      label: "Description",
      overrides: INLINE_RICH_TEXT,
      parser: SLATE_JSON_PARSER,
      templates: RICH_TEXT_TEMPLATES
    },
    {
      type: "boolean",
      name: "showFeaturedBanner",
      label: "Show Featured Banner",
      ui: { description: "Show the dark featured-product banner above the grid." }
    },
    {
      type: "string",
      name: "emptyHeading",
      label: "Empty State Heading",
      ui: charLimit(60, "Heading shown when no products match the filter.")
    },
    {
      type: "string",
      name: "emptyDescription",
      label: "Empty State Description",
      ui: charLimit(120)
    },
    ...textStyleFields()
  ]
};
var galleryGridBlock = {
  name: "galleryGrid",
  label: "Art Gallery Grid",
  ui: blockUi("galleryGrid", "Art Gallery Grid", null, {
    emptyHeading: "Gallery is empty",
    emptyDescription: "Check back soon \u2014 new artwork is added regularly."
  }),
  fields: [
    {
      type: "string",
      name: "emptyHeading",
      label: "Empty State Heading",
      ui: charLimit(
        60,
        "Images are managed in the Gallery collection in Tina (sidebar). This heading only shows if the gallery is empty."
      )
    },
    {
      type: "string",
      name: "emptyDescription",
      label: "Empty State Description",
      ui: charLimit(120)
    },
    ...textStyleFields()
  ]
};
var downloadsGridBlock = {
  name: "downloadsGrid",
  label: "Downloads Grid",
  ui: blockUi("downloadsGrid", "Downloads Grid", null, {
    emptyHeading: "Free resources coming soon!",
    emptyDescription: "Coloring pages, guides, and more on the way."
  }),
  fields: [
    {
      type: "string",
      name: "emptyHeading",
      label: "Empty State Heading",
      ui: charLimit(
        60,
        "Downloads are managed in the Downloads collection in Tina (sidebar). This heading only shows when there are none."
      )
    },
    {
      type: "string",
      name: "emptyDescription",
      label: "Empty State Description",
      ui: charLimit(120)
    },
    ...textStyleFields()
  ]
};
var contactInfoBlock = {
  name: "contactInfo",
  label: "Contact Info",
  ui: blockUi("contactInfo", "Contact Info", "email", {
    email: "hello@example.com",
    location: "City, State"
  }),
  fields: [
    {
      type: "string",
      name: "email",
      label: "Email Address",
      ui: { description: "Shown publicly. Use a safe inbox, not a personal address." }
    },
    {
      type: "string",
      name: "location",
      label: "Location",
      ui: charLimit(48, 'General location (e.g. "Des Moines, IA").')
    }
  ]
};
var dummyBookRequestBlock = {
  name: "dummyBookRequest",
  label: "Dummy Book Request",
  ui: blockUi("dummyBookRequest", "Dummy Book Request", "heading", {
    heading: "Request the 30-page PDF",
    description: rt(
      "Fill in your details and the complete 30-page PDF unlocks instantly. Corinne is notified of every request."
    ),
    pdfUrl: "/files/lheeloo-and-luna-bath-time-episode-thursday-dummy-book.pdf",
    submitLabel: "Request the 30-page PDF",
    successHeading: "Thank you \u2014 the PDF is ready",
    successNote: "Your request has been sent to Corinne. In the meantime, the full 30-page PDF is available below.",
    downloadLabel: "Download the 30-page PDF"
  }),
  fields: [
    {
      type: "string",
      name: "heading",
      label: "Heading",
      ui: charLimit(60, "Heading above the request form.")
    },
    {
      type: "rich-text",
      name: "description",
      label: "Description",
      overrides: INLINE_RICH_TEXT,
      parser: SLATE_JSON_PARSER,
      templates: RICH_TEXT_TEMPLATES,
      ui: { description: "Short text below the heading explaining the request." }
    },
    {
      type: "string",
      name: "pdfUrl",
      label: "Dummy PDF",
      ui: {
        description: "Path or URL to the dummy-book PDF revealed after a successful request."
      }
    },
    { type: "string", name: "submitLabel", label: "Submit Button Label", ui: charLimit(32) },
    {
      type: "string",
      name: "successHeading",
      label: "Success Heading",
      ui: charLimit(60, "Shown after the request is sent.")
    },
    {
      type: "string",
      name: "successNote",
      label: "Success Note",
      ui: { component: "textarea", ...charLimit(220, "Short note above the download button.") }
    },
    { type: "string", name: "downloadLabel", label: "Download Button Label", ui: charLimit(32) },
    ...textStyleFields()
  ]
};
var contactFormBlock = {
  name: "contactForm",
  label: "Contact Form",
  ui: blockUi("contactForm", "Contact Form", null, {
    submitLabel: "Send Message"
  }),
  fields: [
    {
      type: "string",
      name: "submitLabel",
      label: "Submit Button Label",
      ui: charLimit(24, "Messages are delivered to the studio inbox automatically.")
    }
  ]
};
var marqueeBlock = {
  name: "marquee",
  label: "Announcement Marquee",
  ui: blockUi("marquee", "Marquee", "highlightText", {
    highlightText: "Big news",
    text: " \u2014 something exciting is coming soon"
  }),
  fields: [
    {
      type: "string",
      name: "highlightText",
      label: "Highlighted Text",
      ui: charLimit(40, "The first part of the announcement, shown in orange.")
    },
    {
      type: "string",
      name: "text",
      label: "Text",
      ui: charLimit(80, "The rest of the announcement, shown in muted color.")
    }
  ]
};
var featuredReleaseBlock = {
  name: "featuredRelease",
  label: "Featured Release",
  ui: blockUi("featuredRelease", "Featured Release", "title", {
    eyebrow: "New Featured Release",
    title: "Book Title",
    description: rt("A short description of the release."),
    ctaLabel: "Get the Book",
    ctaHref: "https://"
  }),
  fields: [
    {
      type: "string",
      name: "eyebrow",
      label: "Eyebrow Label",
      ui: charLimit(40, 'Small label above the title (e.g. "New Featured Release").')
    },
    { type: "string", name: "title", label: "Title", required: true, ui: charLimit(60) },
    {
      type: "rich-text",
      name: "description",
      label: "Description",
      overrides: INLINE_RICH_TEXT,
      parser: SLATE_JSON_PARSER,
      templates: RICH_TEXT_TEMPLATES
    },
    {
      type: "image",
      name: "coverImage",
      label: "Front Cover Image"
    },
    {
      type: "image",
      name: "backCoverImage",
      label: "Back Cover Image",
      ui: { description: "Optional second cover (shown alongside the front)." }
    },
    { type: "string", name: "ctaLabel", label: "Button Label", ui: charLimit(24) },
    {
      type: "string",
      name: "ctaHref",
      label: "Button URL",
      ui: {
        description: "Full URL (Amazon, shop, etc.).",
        validate: (value) => {
          if (value && !/^(https?:\/\/|\/)/i.test(value)) {
            return "Links should start with https:// (or / for a page on this site).";
          }
          return void 0;
        }
      }
    },
    ...textStyleFields()
  ]
};
var kofiSupportBlock = {
  name: "kofiSupport",
  label: "Ko-fi Support",
  ui: blockUi("kofiSupport", "Ko-fi Support", "heading", {
    heading: "Support the Studio",
    body: rt("If you enjoy the tutorials and books, consider buying a coffee on Ko-fi."),
    ctaLabel: "Support on Ko-fi",
    href: "https://ko-fi.com/bladeandquill"
  }),
  fields: [
    { type: "string", name: "heading", label: "Heading", ui: charLimit(60) },
    {
      type: "rich-text",
      name: "body",
      label: "Body Text",
      overrides: INLINE_RICH_TEXT,
      parser: SLATE_JSON_PARSER,
      templates: RICH_TEXT_TEMPLATES
    },
    { type: "string", name: "ctaLabel", label: "Button Label", ui: charLimit(24) },
    { type: "string", name: "href", label: "Ko-fi URL" },
    ...textStyleFields()
  ]
};
var socialLinksBlock = {
  name: "socialLinks",
  label: "Social Links",
  ui: blockUi("socialLinks", "Social Links", null, {
    links: [
      { platform: "youtube", url: "https://www.youtube.com/c/BladeQuillartacademy", label: "YouTube" },
      { platform: "instagram", url: "https://www.instagram.com/bladequillartacademy/", label: "Instagram" }
    ]
  }),
  fields: [
    {
      type: "string",
      name: "heading",
      label: "Heading (optional)",
      ui: charLimit(
        60,
        "When set, the links show inside a centered panel with this heading (like the Ko-fi support section). Leave blank for a simple icon row."
      )
    },
    {
      type: "rich-text",
      name: "body",
      label: "Body Text (optional)",
      overrides: INLINE_RICH_TEXT,
      parser: SLATE_JSON_PARSER,
      templates: RICH_TEXT_TEMPLATES,
      ui: { description: "Short text under the heading (panel style only)." }
    },
    {
      type: "object",
      name: "links",
      label: "Links",
      list: true,
      ui: {
        itemProps: (item) => ({
          label: item?.label || item?.platform || "Link"
        })
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
            { value: "kofi", label: "Ko-fi" }
          ],
          ui: { description: "Controls which icon is shown." }
        },
        { type: "string", name: "url", label: "URL" },
        {
          type: "string",
          name: "label",
          label: "Label",
          ui: charLimit(32, "Accessible name for the link (read by screen readers).")
        }
      ]
    },
    ...textStyleFields()
  ]
};
var reviewLinksBlock = {
  name: "reviewLinks",
  label: "Review Buttons",
  ui: blockUi("reviewLinks", "Review Buttons", "heading", {
    heading: "Leave your reviews here",
    intro: rt("Reviews mean the world and truly help others discover the book."),
    thankYou: "Thank you so much for your support!",
    ctaHeading: "Review the book by clicking the button for your country!",
    links: [
      { label: "Review on Amazon.com", href: "https://", region: "US" }
    ]
  }),
  fields: [
    { type: "string", name: "heading", label: "Heading", ui: charLimit(60) },
    {
      type: "rich-text",
      name: "intro",
      label: "Intro Text",
      overrides: INLINE_RICH_TEXT,
      parser: SLATE_JSON_PARSER,
      templates: RICH_TEXT_TEMPLATES
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
        itemProps: (item) => ({
          label: item?.label || "Review link"
        })
      },
      fields: [
        { type: "string", name: "label", label: "Button Label", ui: charLimit(32) },
        {
          type: "string",
          name: "href",
          label: "URL",
          ui: { description: "Full review URL (opens in a new tab)." }
        },
        {
          type: "string",
          name: "region",
          label: "Region",
          ui: { description: "Short region code for reference (e.g. US, UK, AU)." }
        }
      ]
    },
    ...textStyleFields()
  ]
};
var heroSplitImageBlock = {
  name: "heroSplitImage",
  label: "Hero (Split Image)",
  ui: blockUi("heroSplitImage", "Hero (Split Image)", "heading", {
    eyebrow: "Featured Work",
    heading: "Showcase your\nbest piece",
    subheading: rt("Pair a bold headline with one large image \u2014 great for book launches, class promos, or portfolio highlights."),
    imagePosition: "right",
    ctaPrimary: "Learn More",
    ctaPrimaryLink: "/contact"
  }),
  fields: [
    {
      type: "string",
      name: "eyebrow",
      label: "Eyebrow (optional)",
      ui: { description: "Small label above the heading." }
    },
    {
      type: "string",
      name: "heading",
      label: "Heading",
      ui: { component: "textarea", ...charLimit(80, "Use a line break for a two-line headline.") }
    },
    {
      type: "rich-text",
      name: "subheading",
      label: "Subheading",
      overrides: INLINE_RICH_TEXT,
      parser: SLATE_JSON_PARSER,
      templates: RICH_TEXT_TEMPLATES
    },
    {
      type: "image",
      name: "featuredImage",
      label: "Featured Image",
      ui: { description: "Large image shown beside the headline." }
    },
    {
      type: "string",
      name: "imageAlt",
      label: "Image Alt Text",
      ui: charLimit(125, "Short image description for screen readers.")
    },
    {
      type: "string",
      name: "imageCaption",
      label: "Image Caption (optional)",
      ui: charLimit(80)
    },
    {
      type: "string",
      name: "imagePosition",
      label: "Image Position",
      options: [
        { value: "right", label: "Image on right" },
        { value: "left", label: "Image on left" }
      ]
    },
    { type: "string", name: "ctaPrimary", label: "Primary Button Label", ui: charLimit(24) },
    { type: "string", name: "ctaPrimaryLink", label: "Primary Button Link" },
    { type: "string", name: "ctaSecondary", label: "Secondary Button Label (optional)", ui: charLimit(24) },
    { type: "string", name: "ctaSecondaryLink", label: "Secondary Button Link" },
    ...textStyleFields()
  ]
};
var heroFullBleedBlock = {
  name: "heroFullBleed",
  label: "Hero (Full Bleed)",
  ui: blockUi("heroFullBleed", "Hero (Full Bleed)", "heading", {
    heading: "A cinematic\nfull-width moment",
    subheading: rt("Edge-to-edge artwork with text overlay \u2014 perfect for dramatic portfolio pieces or event banners."),
    overlay: "medium",
    textAlign: "center",
    minHeight: "tall",
    ctaLabel: "Explore",
    ctaLink: "/gallery"
  }),
  fields: [
    {
      type: "image",
      name: "backgroundImage",
      label: "Background Image",
      ui: { description: "Full-width image behind the text." }
    },
    {
      type: "string",
      name: "heading",
      label: "Heading",
      ui: { component: "textarea", ...charLimit(70, "Press Enter to create a line break.") }
    },
    {
      type: "rich-text",
      name: "subheading",
      label: "Subheading (optional)",
      overrides: INLINE_RICH_TEXT,
      parser: SLATE_JSON_PARSER,
      templates: RICH_TEXT_TEMPLATES
    },
    {
      type: "string",
      name: "overlay",
      label: "Overlay Darkness",
      options: [
        { value: "light", label: "Light" },
        { value: "medium", label: "Medium" },
        { value: "dark", label: "Dark" }
      ]
    },
    {
      type: "string",
      name: "textAlign",
      label: "Text Alignment",
      options: [
        { value: "center", label: "Center" },
        { value: "left", label: "Bottom left" }
      ]
    },
    {
      type: "string",
      name: "minHeight",
      label: "Section Height",
      options: [
        { value: "medium", label: "Medium (60vh)" },
        { value: "tall", label: "Tall (80vh)" },
        { value: "short", label: "Short (45vh)" }
      ]
    },
    { type: "string", name: "ctaLabel", label: "Button Label (optional)", ui: charLimit(24) },
    { type: "string", name: "ctaLink", label: "Button Link" },
    ...textStyleFields()
  ]
};
var heroFloatingImagesBlock = {
  name: "heroFloatingImages",
  label: "Hero (Floating Images)",
  ui: blockUi("heroFloatingImages", "Hero (Floating Images)", "heading", {
    eyebrow: "Portfolio",
    heading: "Art that floats\noff the page",
    subheading: rt("Scatter up to six images around the headline \u2014 like the homepage hero, but fully editable."),
    images: [],
    ctaPrimary: "View Gallery",
    ctaPrimaryLink: "/gallery"
  }),
  fields: [
    { type: "string", name: "eyebrow", label: "Eyebrow (optional)", ui: charLimit(40, "Small label above the heading.") },
    {
      type: "string",
      name: "heading",
      label: "Heading",
      ui: { component: "textarea", ...charLimit(70, "Press Enter to create a line break.") }
    },
    {
      type: "rich-text",
      name: "subheading",
      label: "Subheading (optional)",
      overrides: INLINE_RICH_TEXT,
      parser: SLATE_JSON_PARSER,
      templates: RICH_TEXT_TEMPLATES
    },
    {
      type: "object",
      name: "images",
      label: "Floating Images",
      list: true,
      ui: {
        ...IMAGE_LIST_UI,
        description: "Add 2\u20136 images. They auto-position around the headline on desktop."
      },
      fields: IMAGE_ITEM_FIELDS
    },
    { type: "string", name: "ctaPrimary", label: "Primary Button Label (optional)", ui: charLimit(24) },
    { type: "string", name: "ctaPrimaryLink", label: "Primary Button Link" },
    { type: "string", name: "ctaSecondary", label: "Secondary Button Label (optional)", ui: charLimit(24) },
    { type: "string", name: "ctaSecondaryLink", label: "Secondary Button Link" },
    ...textStyleFields()
  ]
};
var heroImageGridBlock = {
  name: "heroImageGrid",
  label: "Hero (Image Mosaic)",
  ui: blockUi("heroImageGrid", "Hero (Image Mosaic)", "heading", {
    eyebrow: "Gallery",
    heading: "A mosaic\nof your work",
    layout: "trio",
    images: []
  }),
  fields: [
    { type: "string", name: "eyebrow", label: "Eyebrow (optional)", ui: charLimit(40, "Small label above the heading.") },
    {
      type: "string",
      name: "heading",
      label: "Heading",
      ui: { component: "textarea", ...charLimit(70, "Press Enter to create a line break.") }
    },
    {
      type: "rich-text",
      name: "subheading",
      label: "Subheading (optional)",
      overrides: INLINE_RICH_TEXT,
      parser: SLATE_JSON_PARSER,
      templates: RICH_TEXT_TEMPLATES
    },
    {
      type: "string",
      name: "layout",
      label: "Grid Layout",
      options: [
        { value: "duo", label: "2 images" },
        { value: "trio", label: "3 images" },
        { value: "quad", label: "4 images" }
      ]
    },
    {
      type: "object",
      name: "images",
      label: "Images",
      list: true,
      ui: IMAGE_LIST_UI,
      fields: IMAGE_ITEM_FIELDS
    },
    { type: "string", name: "ctaLabel", label: "Button Label (optional)", ui: charLimit(24) },
    { type: "string", name: "ctaLink", label: "Button Link" },
    ...textStyleFields()
  ]
};
var imageSpotlightBlock = {
  name: "imageSpotlight",
  label: "Image (Spotlight)",
  ui: blockUi("imageSpotlight", "Image (Spotlight)", "heading", {
    eyebrow: "Featured",
    heading: "One piece,\nfront and center",
    caption: "A single large image with room to breathe.",
    aspect: "landscape"
  }),
  fields: [
    { type: "string", name: "eyebrow", label: "Eyebrow (optional)", ui: charLimit(40, "Small label above the heading.") },
    {
      type: "string",
      name: "heading",
      label: "Heading (optional)",
      ui: { component: "textarea", ...charLimit(70, "Press Enter to create a line break.") }
    },
    {
      type: "image",
      name: "image",
      label: "Image"
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
        { value: "wide", label: "Wide banner (21:9)" }
      ]
    },
    {
      type: "rich-text",
      name: "body",
      label: "Body Text (optional)",
      overrides: INLINE_RICH_TEXT,
      parser: SLATE_JSON_PARSER,
      templates: RICH_TEXT_TEMPLATES
    },
    ...textStyleFields()
  ]
};
var imageSideBySideBlock = {
  name: "imageSideBySide",
  label: "Image (Side by Side)",
  ui: blockUi("imageSideBySide", "Image (Side by Side)", "heading", {
    heading: "Compare or contrast",
    leftImage: {},
    rightImage: {},
    style: "polaroid"
  }),
  fields: [
    {
      type: "string",
      name: "heading",
      label: "Heading (optional)",
      ui: charLimit(60)
    },
    {
      type: "object",
      name: "leftImage",
      label: "Left Image",
      fields: IMAGE_ITEM_FIELDS
    },
    {
      type: "object",
      name: "rightImage",
      label: "Right Image",
      fields: IMAGE_ITEM_FIELDS
    },
    {
      type: "string",
      name: "style",
      label: "Frame Style",
      options: [
        { value: "polaroid", label: "Polaroid frames" },
        { value: "clean", label: "Clean (no frame)" },
        { value: "rounded", label: "Rounded corners" }
      ]
    },
    ...textStyleFields()
  ]
};
var imageMasonryBlock = {
  name: "imageMasonry",
  label: "Image (Masonry)",
  ui: blockUi("imageMasonry", "Image (Masonry)", "heading", {
    heading: "A wall of work",
    images: []
  }),
  fields: [
    {
      type: "string",
      name: "heading",
      label: "Heading (optional)",
      ui: charLimit(60)
    },
    {
      type: "object",
      name: "images",
      label: "Images",
      list: true,
      ui: {
        ...IMAGE_LIST_UI,
        description: "Add 3\u20136 images for an asymmetric masonry layout."
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
            { value: "wide", label: "Wide" }
          ]
        }
      ]
    },
    ...textStyleFields()
  ]
};
var featuredVideoBlock = {
  name: "featuredVideo",
  label: "Newest Video (YouTube)",
  ui: blockUi("featuredVideo", "Newest Video", "heading", {
    eyebrow: "FRESH FROM THE STUDIO",
    heading: "Watch the newest lesson.",
    description: rt(
      "The latest Blade & Quill YouTube video, featured here automatically the moment it goes live."
    ),
    youtubeUrl: "",
    buttonLabel: "Subscribe on YouTube"
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
      templates: RICH_TEXT_TEMPLATES,
      ui: { description: "Short text beside the video." }
    },
    {
      type: "string",
      name: "youtubeUrl",
      label: "YouTube URL (optional override)",
      ui: {
        description: "Leave empty to automatically feature your newest upload. Paste a full YouTube link to pin a specific video instead.",
        validate: (value) => {
          if (value && !/youtube\.com|youtu\.be/i.test(value)) {
            return "Please paste a full YouTube link (youtube.com or youtu.be).";
          }
          return void 0;
        }
      }
    },
    {
      type: "string",
      name: "buttonLabel",
      label: "Button Label",
      ui: charLimit(24, "The button links to your YouTube channel.")
    },
    ...textStyleFields()
  ]
};
var galleryPreviewBlock = {
  name: "galleryPreview",
  label: "Gallery Preview",
  ui: blockUi("galleryPreview", "Gallery Preview", "heading", {
    eyebrow: "THE GALLERY",
    heading: "Artwork from the studio",
    description: rt(
      "Chibi-style cartoons and illustrations, all painted in Krita."
    ),
    maxItems: 6,
    viewAllLabel: "Browse the full gallery",
    viewAllLink: "/gallery"
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
      templates: RICH_TEXT_TEMPLATES
    },
    {
      type: "number",
      name: "maxItems",
      label: "Number of Artworks",
      ui: {
        description: "How many artworks to show (from the start of your Gallery collection). Default: 6."
      }
    },
    { type: "string", name: "viewAllLabel", label: "View All Button Label", ui: charLimit(32) },
    {
      type: "string",
      name: "viewAllLink",
      label: "View All Button Link",
      ui: { description: 'Usually "/gallery".' }
    },
    ...textStyleFields()
  ]
};
var downloadsPreviewBlock = {
  name: "downloadsPreview",
  label: "Downloads Preview",
  ui: blockUi("downloadsPreview", "Downloads Preview", "heading", {
    eyebrow: "FREE DOWNLOADS",
    heading: "Free guides & coloring pages",
    description: rt(
      "Printable coloring pages and free Krita guides \u2014 free for private use."
    ),
    maxItems: 4,
    viewAllLabel: "Browse all downloads",
    viewAllLink: "/downloads"
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
      templates: RICH_TEXT_TEMPLATES
    },
    {
      type: "number",
      name: "maxItems",
      label: "Number of Downloads",
      ui: {
        description: "How many downloads to show. Default: 4."
      }
    },
    { type: "string", name: "viewAllLabel", label: "View All Button Label", ui: charLimit(32) },
    {
      type: "string",
      name: "viewAllLink",
      label: "View All Button Link",
      ui: { description: 'Usually "/downloads".' }
    },
    ...textStyleFields()
  ]
};
var ALL_BLOCKS = [
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
  featuredVideoBlock,
  galleryPreviewBlock,
  downloadsPreviewBlock,
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
  socialLinksBlock
];

// tina/blog-blocks.ts
var rt2 = (text) => ({
  type: "root",
  children: [{ type: "p", children: [{ type: "text", text }] }]
});
function blogUi(previewName, label, titleField, defaultItem) {
  return {
    previewSrc: `/admin-previews/${previewName}.svg`,
    ...defaultItem ? { defaultItem } : {},
    itemProps: (item) => {
      const raw = titleField ? item?.[titleField] : void 0;
      const text = typeof raw === "string" && raw.trim() ? raw.split("\n")[0].trim() : "";
      return { label: text ? `${label} \u2014 ${text}` : label };
    }
  };
}
var blogHeadingBlock = {
  name: "heading",
  label: "Heading",
  ui: blogUi("heading", "Heading", "text", {
    number: "",
    text: "Section heading",
    level: "h2"
  }),
  fields: [
    {
      type: "string",
      name: "number",
      label: "Section Number (optional)",
      ui: charLimit(4, 'Optional number shown before the heading (e.g. "1" or "01").')
    },
    {
      type: "string",
      name: "text",
      label: "Heading",
      required: true,
      ui: charLimit(90, "The section title.")
    },
    {
      type: "string",
      name: "level",
      label: "Heading Level",
      options: [
        { value: "h2", label: "Section Heading (H2)" },
        { value: "h3", label: "Sub-heading (H3)" }
      ],
      ui: {
        description: "H2 for main sections, H3 for subsections. The post title is already H1."
      }
    }
  ]
};
var blogTextBlock = {
  ...textBlock,
  label: "Text",
  ui: blogUi("text", "Text", "heading", {
    heading: "",
    body: rt2("Write your paragraph here. You can add lists, links, and inline images.")
  })
};
var blogSpacerBlock = {
  name: "spacer",
  label: "Spacer",
  ui: blogUi("spacer", "Spacer", "size", {
    size: "medium"
  }),
  fields: [
    {
      type: "string",
      name: "size",
      label: "Size",
      options: [
        { value: "small", label: "Small" },
        { value: "medium", label: "Medium" },
        { value: "large", label: "Large" }
      ],
      ui: {
        description: "Adds vertical breathing room between sections. This is spacing only \u2014 not a page break."
      }
    }
  ]
};
var blogDividerBlock = {
  name: "divider",
  label: "Divider",
  ui: blogUi("divider", "Divider", null, {}),
  fields: [
    {
      type: "string",
      name: "style",
      label: "Style",
      options: [
        { value: "line", label: "Simple line" },
        { value: "dots", label: "Dots" }
      ],
      ui: { description: "Soft visual break between topics." }
    }
  ]
};
var blogImageBlock = {
  name: "image",
  label: "Image",
  ui: blogUi("imageSpotlight", "Image", "caption", {
    alt: "",
    caption: "",
    width: "content",
    aspect: "auto"
  }),
  fields: [
    {
      type: "image",
      name: "src",
      label: "Image",
      ui: {
        description: "Upload into images/blog/ when possible."
      }
    },
    {
      type: "string",
      name: "alt",
      label: "Alt Text",
      ui: charLimit(125, "Short image description for screen readers.")
    },
    {
      type: "string",
      name: "caption",
      label: "Caption (optional)",
      ui: charLimit(120)
    },
    {
      type: "string",
      name: "width",
      label: "Width",
      options: [
        { value: "content", label: "Content width (matches text)" },
        { value: "wide", label: "Wide (slightly wider than text)" }
      ],
      ui: { description: "How wide the image sits in the article column." }
    },
    {
      type: "string",
      name: "aspect",
      label: "Aspect Ratio",
      options: [
        { value: "auto", label: "Natural (use image\u2019s own ratio)" },
        { value: "landscape", label: "Landscape (16:10)" },
        { value: "square", label: "Square (1:1)" },
        { value: "portrait", label: "Portrait (3:4)" }
      ]
    }
  ]
};
var blogCalloutBlock = {
  name: "callout",
  label: "Callout / Tip",
  ui: blogUi("callout", "Callout", "title", {
    title: "Tip",
    body: rt2("A short tip, note, or warning for the reader."),
    tone: "tip"
  }),
  fields: [
    {
      type: "string",
      name: "title",
      label: "Title",
      ui: charLimit(40, 'e.g. "Tip", "Note", or "Remember".')
    },
    {
      type: "rich-text",
      name: "body",
      label: "Body",
      overrides: INLINE_RICH_TEXT,
      parser: SLATE_JSON_PARSER,
      templates: RICH_TEXT_TEMPLATES,
      ui: { description: "The callout content. Keep it short." }
    },
    {
      type: "string",
      name: "tone",
      label: "Tone",
      options: [
        { value: "tip", label: "Tip (warm highlight)" },
        { value: "note", label: "Note (neutral)" },
        { value: "warning", label: "Warning (stronger)" }
      ]
    }
  ]
};
var blogImagePairBlock = {
  ...imageSideBySideBlock,
  label: "Image Pair",
  ui: blogUi("imageSideBySide", "Image Pair", "heading", {
    heading: "",
    leftImage: {},
    rightImage: {},
    style: "clean"
  })
};
var blogGalleryBlock = {
  ...imageGalleryBlock,
  label: "Gallery",
  ui: blogUi("imageGallery", "Gallery", "heading", {
    heading: "",
    images: []
  })
};
var blogVideoBlock = {
  ...videoEmbedBlock,
  label: "Video",
  ui: blogUi("videoEmbed", "Video", "heading", {
    heading: "",
    youtubeUrl: ""
  })
};
var blogCtaBlock = {
  ...ctaBandBlock,
  label: "End CTA",
  ui: blogUi("ctaBand", "End CTA", "heading", {
    heading: "Ready for the next step?",
    description: rt2("One short supporting line goes here."),
    ctaLabel: "Get Started",
    ctaLink: "/contact",
    variant: "light"
  })
};
var BLOG_BLOCKS = [
  blogHeadingBlock,
  blogTextBlock,
  blogSpacerBlock,
  blogDividerBlock,
  blogImageBlock,
  blogImagePairBlock,
  blogGalleryBlock,
  blogVideoBlock,
  blogCalloutBlock,
  blogCtaBlock
];

// tina/product-page-fields.ts
function richText(...paragraphs) {
  return {
    type: "root",
    children: paragraphs.map((text) => ({
      type: "p",
      children: [{ type: "text", text }]
    }))
  };
}
var emptyThumb = (alt) => ({ src: "", alt });
var SHOP_PRODUCT_DEFAULT_ITEM = {
  name: "New product",
  description: richText("A short description for shop cards and the top of the product page."),
  price: 15,
  category: "digital",
  image: "",
  galleryImages: [
    emptyThumb("Thumbnail 2"),
    emptyThumb("Thumbnail 3"),
    emptyThumb("Thumbnail 4"),
    emptyThumb("Thumbnail 5")
  ],
  spreadImages: [
    emptyThumb("Preview 1"),
    emptyThumb("Preview 2"),
    emptyThumb("Preview 3"),
    emptyThumb("Preview 4"),
    emptyThumb("Preview 5"),
    emptyThumb("Preview 6")
  ],
  featured: false,
  inStock: true,
  pageCopy: {
    eyebrow: "",
    coverSubtitle: "C. HADAWAY",
    fullDescription: richText(
      "Every page in the studio gets made in Krita from sketch to final color. Includes process notes, character studies, and a short epilogue from the author.",
      "Digital editions are delivered by email immediately after checkout."
    ),
    shippingNote: richText(
      "Digital downloads are delivered instantly to your email. License terms allow personal use; commercial licenses are available for studios and freelancers."
    ),
    supportEmail: "hello@bladeandquillacademy.com",
    paperbackLabel: "PAPERBACK",
    ebookLabel: "eBook",
    ebookStoresLabel: "GUMROAD \xB7 GOOGLE PLAY",
    addToCartLabel: "Add to cart",
    buyNowLabel: "Buy now",
    gumroadButtonLabel: "Get eBook on Gumroad",
    amazonButtonLabel: "Buy paperback on Amazon",
    googlePlayButtonLabel: "Get eBook on Google Play"
  },
  trustBullets: [
    { label: "Instant download" },
    { label: "Stripe secure checkout" },
    { label: "30-day returns" }
  ],
  details: {
    format: "",
    studio: "Nantes, France",
    rows: []
  },
  reviews: {
    rating: 4.9,
    countLabel: "142 reviews",
    items: [
      {
        name: "Maya R.",
        date: "MAY 2026",
        body: "Absolutely beautiful. Worth every penny \u2014 even better in print than I'd imagined.",
        stars: 5
      },
      {
        name: "Tom K.",
        date: "APR 2026",
        body: "I bought the bundle and use the brushes every day now. Everything just fits together.",
        stars: 5
      },
      {
        name: "Liv H.",
        date: "APR 2026",
        body: "Quiet, gentle, and visually stunning. A book I keep on my desk to flip through.",
        stars: 5
      },
      {
        name: "David S.",
        date: "MAR 2026",
        body: "Corinne explains the why behind each decision. So much better than copying tutorials.",
        stars: 5
      }
    ]
  },
  tabs: {
    descriptionLabel: "Description",
    insideLabel: "Inside",
    reviewsLabel: "Reviews",
    shippingLabel: "Shipping & License",
    showInside: true,
    showReviews: true,
    showShipping: true
  },
  related: {
    eyebrow: "MORE FROM THE STUDIO",
    heading: "You might also like",
    show: true
  }
};
var PRODUCT_PAGE_FIELDS = [
  {
    type: "object",
    name: "pageCopy",
    label: "Page Copy & Buttons",
    ui: {
      description: "Headlines, extra description, button labels, and book price labels on this product page."
    },
    fields: [
      {
        type: "string",
        name: "eyebrow",
        label: "Eyebrow (above the title)",
        ui: charLimit(
          40,
          "Small label above the product name. Leave blank to use FEATURED or FROM THE STUDIO automatically."
        )
      },
      {
        type: "string",
        name: "coverSubtitle",
        label: "Cover Author Line (books)",
        ui: charLimit(
          40,
          "Shown on the decorative book cover when no extra gallery image is selected (e.g. C. HADAWAY)."
        )
      },
      {
        type: "rich-text",
        name: "fullDescription",
        label: "Full Description (Description tab)",
        overrides: INLINE_RICH_TEXT,
        parser: SLATE_JSON_PARSER,
        templates: RICH_TEXT_TEMPLATES,
        ui: {
          description: "Longer copy under the Description tab. The short Description field above still shows under the title and on shop cards."
        }
      },
      {
        type: "rich-text",
        name: "shippingNote",
        label: "Shipping & License Copy",
        overrides: INLINE_RICH_TEXT,
        parser: SLATE_JSON_PARSER,
        templates: RICH_TEXT_TEMPLATES,
        ui: {
          description: "Body copy for the Shipping & License tab."
        }
      },
      {
        type: "string",
        name: "supportEmail",
        label: "Support Email",
        ui: charLimit(
          80,
          "Shown as a mailto link at the end of the Shipping & License tab. Leave blank to hide it."
        )
      },
      {
        type: "string",
        name: "paperbackLabel",
        label: "Paperback Price Label (books)",
        ui: charLimit(24, "Small label under the price on book pages (e.g. PAPERBACK).")
      },
      {
        type: "string",
        name: "ebookLabel",
        label: "eBook Title (books)",
        ui: charLimit(24, "The word shown next to the paperback price (e.g. eBook).")
      },
      {
        type: "string",
        name: "ebookStoresLabel",
        label: "eBook Stores Line (books)",
        ui: charLimit(40, "Small line under the eBook title (e.g. GUMROAD \xB7 GOOGLE PLAY).")
      },
      {
        type: "string",
        name: "addToCartLabel",
        label: "Add to Cart Button",
        ui: charLimit(24, "Digital / bundle / curriculum products.")
      },
      {
        type: "string",
        name: "buyNowLabel",
        label: "Buy Now Button",
        ui: charLimit(24, "Digital / bundle / curriculum products.")
      },
      {
        type: "string",
        name: "gumroadButtonLabel",
        label: "Gumroad Button (books)",
        ui: charLimit(40)
      },
      {
        type: "string",
        name: "amazonButtonLabel",
        label: "Amazon Button (books)",
        ui: charLimit(40)
      },
      {
        type: "string",
        name: "googlePlayButtonLabel",
        label: "Google Play Button (books)",
        ui: charLimit(40)
      }
    ]
  },
  {
    type: "object",
    name: "trustBullets",
    label: "Trust Badges",
    list: true,
    ui: {
      description: "The small checklist under Add to cart (Instant download, Stripe, returns). Remove every item to hide the row.",
      itemProps: (item) => ({
        label: item?.label || "Badge"
      }),
      defaultItem: { label: "New badge" }
    },
    fields: [
      {
        type: "string",
        name: "label",
        label: "Label",
        required: true,
        ui: charLimit(40)
      }
    ]
  },
  {
    type: "object",
    name: "details",
    label: "Details Box",
    ui: {
      description: "The DETAILS card on the Description tab. Format and Studio can be edited; extra rows are added below them."
    },
    fields: [
      {
        type: "string",
        name: "format",
        label: "Format",
        ui: charLimit(
          40,
          "Overrides the automatic format line (e.g. Paperback & eBook). Leave blank to keep the automatic value."
        )
      },
      {
        type: "string",
        name: "studio",
        label: "Studio",
        ui: charLimit(40, "e.g. Nantes, France. Leave blank to hide this row.")
      },
      {
        type: "object",
        name: "rows",
        label: "Extra Detail Rows",
        list: true,
        ui: {
          itemProps: (item) => ({
            label: [item?.label, item?.value].filter(Boolean).join(" \xB7 ") || "Row"
          }),
          defaultItem: { label: "", value: "" }
        },
        fields: [
          {
            type: "string",
            name: "label",
            label: "Label",
            required: true,
            ui: charLimit(24, "Left side, e.g. Pages or Age.")
          },
          {
            type: "string",
            name: "value",
            label: "Value",
            required: true,
            ui: charLimit(40, "Right side, e.g. 64 or Ages 8\u201312.")
          }
        ]
      }
    ]
  },
  {
    type: "object",
    name: "reviews",
    label: "Reviews",
    ui: {
      description: "The Reviews tab: overall rating plus each review card. Remove every review to hide the tab on the live site."
    },
    fields: [
      {
        type: "number",
        name: "rating",
        label: "Overall Rating",
        ui: { description: "The big number (e.g. 4.9). Use 0\u20135." }
      },
      {
        type: "string",
        name: "countLabel",
        label: "Review Count Label",
        ui: charLimit(32, "e.g. 142 reviews.")
      },
      {
        type: "object",
        name: "items",
        label: "Review Cards",
        list: true,
        ui: {
          itemProps: (item) => ({
            label: [item?.name, item?.date].filter(Boolean).join(" \xB7 ") || "Review"
          }),
          defaultItem: {
            name: "A reader",
            date: "",
            body: "",
            stars: 5
          }
        },
        fields: [
          {
            type: "string",
            name: "name",
            label: "Name",
            required: true,
            ui: charLimit(40)
          },
          {
            type: "string",
            name: "date",
            label: "Date",
            ui: charLimit(24, "e.g. MAY 2026.")
          },
          {
            type: "string",
            name: "body",
            label: "Review",
            ui: {
              component: "textarea",
              ...charLimit(400, "The quote on the card.")
            }
          },
          {
            type: "number",
            name: "stars",
            label: "Stars",
            ui: { description: "1 to 5. Defaults to 5 if left blank." }
          }
        ]
      }
    ]
  },
  {
    type: "object",
    name: "tabs",
    label: "Tabs",
    ui: {
      description: "Rename or hide the tabs under the product (Description is always shown)."
    },
    fields: [
      {
        type: "string",
        name: "descriptionLabel",
        label: "Description Tab Label",
        ui: charLimit(24)
      },
      {
        type: "string",
        name: "insideLabel",
        label: "Inside Tab Label",
        ui: charLimit(24)
      },
      {
        type: "string",
        name: "reviewsLabel",
        label: "Reviews Tab Label",
        ui: charLimit(24)
      },
      {
        type: "string",
        name: "shippingLabel",
        label: "Shipping Tab Label",
        ui: charLimit(32)
      },
      {
        type: "boolean",
        name: "showInside",
        label: "Show Inside Tab",
        ui: {
          description: "Off hides the Look Inside / Previews tab even if images are uploaded."
        }
      },
      {
        type: "boolean",
        name: "showReviews",
        label: "Show Reviews Tab"
      },
      {
        type: "boolean",
        name: "showShipping",
        label: "Show Shipping & License Tab"
      }
    ]
  },
  {
    type: "object",
    name: "related",
    label: "Related Products",
    ui: {
      description: "The \u201Cyou might also like\u201D row at the bottom of the page."
    },
    fields: [
      {
        type: "boolean",
        name: "show",
        label: "Show Related Products"
      },
      {
        type: "string",
        name: "eyebrow",
        label: "Eyebrow",
        ui: charLimit(40, "Small line above the heading.")
      },
      {
        type: "string",
        name: "heading",
        label: "Heading",
        ui: charLimit(60)
      }
    ]
  }
];

// tina/seo.ts
import React from "react";
var h = React.createElement;
var CORE_PAGE_SLUGS = [
  "home",
  "about",
  "contact",
  "shop",
  "gallery",
  "downloads",
  "education",
  "publishers",
  "important-links"
];
function corePageRoute(basename) {
  const base = basename.replace(/\.json$/i, "");
  if (base === "home") return "/";
  if (base === "important-links") return "/important-links-page";
  return `/${base}`;
}
function liveUrlPath(folder, slug) {
  if (!slug) return null;
  if (folder === "posts") return `/blog/${slug}`;
  if (folder === "products") return `/shop/${slug}`;
  if (folder === "pages") {
    return CORE_PAGE_SLUGS.includes(slug) ? corePageRoute(slug) : `/p/${slug}`;
  }
  return null;
}
function docUrlPath(formId) {
  const match = /content\/(pages|posts|products)\/(.+?)\.json$/i.exec(formId);
  if (!match) return null;
  return liveUrlPath(match[1], match[2]);
}
var SKIP_KEYS = /* @__PURE__ */ new Set([
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
  "seoAssistant"
]);
var SKIP_KEY_SUFFIX = /(link|url|href|image|src|file)$/i;
var SKIP_VALUE = /^(\/|https?:|data:|mailto:|#)/i;
var ISO_DATE = /^\d{4}-\d{2}-\d{2}/;
function extractContentText(value, budget = 6e3) {
  const out = [];
  let used = 0;
  const visit = (node) => {
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
      for (const [key, val] of Object.entries(node)) {
        if (SKIP_KEYS.has(key) || SKIP_KEY_SUFFIX.test(key)) continue;
        visit(val);
      }
    }
  };
  visit(value);
  return out.join(" ").replace(/\s+/g, " ").trim();
}
var AUTO_FILL_MIN_CONTENT = 80;
function readTinaIdToken() {
  try {
    const raw = localStorage.getItem("tinacms-auth");
    if (raw) {
      const parsed = JSON.parse(raw);
      const token = parsed?.id_token?.trim();
      if (token && token !== "null") return token;
    }
  } catch {
  }
  return "LOCAL";
}
function makeSeoAssistant(kind) {
  const contentNoun = kind === "product" ? "product details" : kind === "post" ? "post" : "page";
  return function SeoAssistant(props) {
    const finalForm = props?.form && typeof props.form.change === "function" ? props.form : props?.tinaForm?.finalForm;
    const formId = typeof props?.tinaForm?.id === "string" ? props.tinaForm.id : "";
    const urlPath = docUrlPath(formId);
    const [status, setStatus] = React.useState("idle");
    const [message, setMessage] = React.useState("");
    const autoRanRef = React.useRef(false);
    const getValues = React.useCallback(
      () => finalForm?.getState?.()?.values ?? {},
      [finalForm]
    );
    const generate = React.useCallback(async () => {
      const values = getValues();
      const title = String(
        values?.title ?? values?.name ?? ""
      ).trim();
      const contentText = extractContentText(values);
      if (!title && contentText.length < 40) {
        setStatus("error");
        setMessage(`Write some ${contentNoun} content first, then try again.`);
        return;
      }
      setStatus("working");
      setMessage("Writing suggestions\u2026");
      try {
        const res = await fetch("/api/seo-suggest", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${readTinaIdToken()}`
          },
          body: JSON.stringify({
            kind,
            title,
            contentText,
            ...urlPath ? { url: urlPath } : {}
          })
        });
        const body = await res.json().catch(() => null);
        if (!res.ok || !body) {
          throw new Error(body?.error || "Could not generate suggestions.");
        }
        if (body.metaTitle) finalForm?.change?.("seo.metaTitle", body.metaTitle);
        if (body.metaDescription) {
          finalForm?.change?.("seo.metaDescription", body.metaDescription);
        }
        setStatus("done");
        setMessage(
          "Suggestions added below \u2014 edit anything you like, then save."
        );
      } catch (err) {
        setStatus("error");
        setMessage(
          err instanceof Error ? err.message : "Could not generate suggestions."
        );
      }
    }, [getValues, urlPath, contentNoun]);
    React.useEffect(() => {
      if (autoRanRef.current) return;
      autoRanRef.current = true;
      const values = getValues();
      const seo = values?.seo ?? {};
      if ((seo.metaTitle ?? "").trim() || (seo.metaDescription ?? "").trim()) {
        return;
      }
      const title = String(
        values?.title ?? values?.name ?? ""
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
      }
      void generate();
    }, []);
    const statusColor = status === "error" ? "#B3261E" : status === "done" ? "#3A6B3A" : "#776562";
    return h(
      "div",
      {
        style: {
          border: "1px solid rgba(0,0,0,0.12)",
          borderRadius: 8,
          background: "#FBF7F1",
          padding: "12px 14px",
          margin: "4px 0 8px",
          fontFamily: "system-ui, sans-serif"
        }
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
            lineHeight: 1.45
          }
        },
        "Fills the Search Listing fields below with suggestions written from this " + contentNoun + ". You can edit everything afterwards."
      ),
      h(
        "div",
        { style: { fontSize: 12, color: "#4A3838", marginBottom: 10 } },
        h("span", { style: { fontWeight: 600 } }, "Web address: "),
        urlPath ? h(
          "code",
          {
            style: {
              background: "rgba(0,0,0,0.06)",
              borderRadius: 4,
              padding: "1px 6px",
              fontSize: 11.5
            }
          },
          urlPath
        ) : h(
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
              opacity: status === "working" ? 0.7 : 1
            }
          },
          status === "working" ? "Writing\u2026" : "Suggest with AI"
        ),
        message ? h(
          "span",
          { style: { fontSize: 12, color: statusColor, lineHeight: 1.4 } },
          message
        ) : null
      )
    );
  };
}
function seoFields(kind) {
  const thing = kind === "product" ? "product" : kind === "post" ? "post" : "page";
  return [
    {
      type: "string",
      name: "seoAssistant",
      label: "SEO Assistant",
      ui: {
        // Display-only panel — never writes its own value.
        component: makeSeoAssistant(kind)
      }
    },
    {
      type: "object",
      name: "seo",
      label: "Search Listing (SEO)",
      ui: {
        description: `Optional. How this ${thing} appears in Google and other search engines. Leave empty to use the regular title, or use the SEO Assistant above for a head start.`
      },
      fields: [
        {
          type: "string",
          name: "metaTitle",
          label: "Search Title",
          ui: charLimit(
            60,
            "The clickable headline in search results. The site name is added automatically."
          )
        },
        {
          type: "string",
          name: "metaDescription",
          label: "Search Description",
          ui: {
            component: "textarea",
            ...charLimit(
              160,
              "The short blurb under the headline in search results. Aim for 120\u2013155 characters."
            )
          }
        }
      ]
    }
  ];
}

// tina/config.ts
var INSIGHTS_AUTH_MESSAGE = "bq-insights-auth";
function readTinaIdTokenFromStorage() {
  try {
    const raw = localStorage.getItem("tinacms-auth");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const token = parsed?.id_token?.trim();
    return token && token !== "null" ? token : null;
  } catch {
    return null;
  }
}
var DOWNLOAD_FILE_ACCEPT = ".pdf,.zip,.epub";
var DOWNLOAD_FILE_MAX_BYTES = 50 * 1024 * 1024;
function DownloadFileField(props) {
  const [status, setStatus] = React2.useState({ kind: "idle" });
  const fileInputRef = React2.useRef(null);
  const value = typeof props.input.value === "string" ? props.input.value.trim() : "";
  const fileName = value.split("/").pop() || "";
  const productName = () => {
    const values = props.form?.getState?.()?.values ?? props.tinaForm?.values ?? void 0;
    const name = values?.name;
    return typeof name === "string" ? name : "";
  };
  const upload = async (file) => {
    if (file.size > DOWNLOAD_FILE_MAX_BYTES) {
      setStatus({ kind: "error", message: "That file is over 50 MB. Compress it or split it into two files." });
      return;
    }
    const isLocalAdmin = typeof window !== "undefined" && /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname);
    const token = readTinaIdTokenFromStorage() ?? (isLocalAdmin ? "LOCAL" : null);
    if (!token) {
      setStatus({ kind: "error", message: "No Tina session found. Sign in again, then retry the upload." });
      return;
    }
    try {
      setStatus({ kind: "busy", message: "Preparing secure upload\u2026" });
      const prep = await fetch("/api/uploads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
          folder: productName()
        })
      });
      const prepBody = await prep.json().catch(() => ({}));
      if (!prep.ok || !prepBody.path || !prepBody.uploadUrl) {
        throw new Error(prepBody.error || `Upload could not be prepared (${prep.status})`);
      }
      setStatus({ kind: "busy", message: `Uploading ${file.name}\u2026` });
      const put = await fetch(prepBody.uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": prepBody.contentType || file.type || "application/octet-stream",
          "x-upsert": "true"
        },
        body: file
      });
      if (!put.ok) {
        const text = await put.text().catch(() => "");
        throw new Error(`Storage rejected the file (${put.status}) ${text}`.trim());
      }
      props.input.onChange(prepBody.path);
      setStatus({ kind: "done", message: `Uploaded ${file.name}. Remember to Save.` });
    } catch (err) {
      setStatus({
        kind: "error",
        message: err instanceof Error ? err.message : "Upload failed"
      });
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };
  const busy = status.kind === "busy";
  const statusColor = status.kind === "error" ? "#B23B3B" : status.kind === "done" ? "#2F7A4F" : "#776562";
  return React2.createElement(
    "div",
    { style: { display: "flex", flexDirection: "column", gap: 8 } },
    React2.createElement(
      "div",
      {
        style: {
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 12px",
          border: "1px solid rgba(0,0,0,0.12)",
          borderRadius: 8,
          background: "#FAF7F3"
        }
      },
      React2.createElement(
        "div",
        { style: { flex: 1, minWidth: 0 } },
        React2.createElement(
          "div",
          {
            style: {
              fontSize: 13,
              fontWeight: 600,
              color: "#4A3838",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap"
            },
            title: value || void 0
          },
          fileName || "No file uploaded yet"
        ),
        value ? React2.createElement(
          "div",
          { style: { fontSize: 11, color: "#776562", marginTop: 2 } },
          "Stored securely \xB7 buyers get a 48-hour link"
        ) : null
      ),
      React2.createElement(
        "button",
        {
          type: "button",
          disabled: busy,
          onClick: () => fileInputRef.current?.click(),
          style: {
            padding: "8px 14px",
            borderRadius: 999,
            border: "none",
            background: busy ? "#C9B7B7" : "#9A5151",
            color: "#fff",
            fontSize: 13,
            fontWeight: 600,
            cursor: busy ? "default" : "pointer",
            whiteSpace: "nowrap"
          }
        },
        busy ? "Uploading\u2026" : value ? "Replace file" : "Choose file"
      ),
      React2.createElement("input", {
        ref: fileInputRef,
        type: "file",
        accept: DOWNLOAD_FILE_ACCEPT,
        style: { display: "none" },
        onChange: (e) => {
          const file = e.target.files?.[0];
          if (file) void upload(file);
        }
      })
    ),
    status.kind !== "idle" ? React2.createElement(
      "div",
      { style: { fontSize: 12, color: statusColor } },
      status.message
    ) : null
  );
}
function InsightsRedirectScreen(_props) {
  const [iframeSrc, setIframeSrc] = React2.useState(null);
  const [status, setStatus] = React2.useState("Preparing Insights\u2026");
  const iframeRef = React2.useRef(null);
  const insightsUrl = typeof window !== "undefined" ? `${window.location.origin}/insights` : "/insights";
  const postTokenToIframe = React2.useCallback((token) => {
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
      setStatus("Connecting your Tina session\u2026");
      try {
        await fetch("/api/insights/session", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken: token })
        });
      } catch {
      }
      if (cancelled) return;
      setStatus("Loading dashboard\u2026");
      setIframeSrc(insightsUrl);
    };
    void boot();
    const onMessage = (event) => {
      if (event.origin !== window.location.origin) return;
      const data = event.data;
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
  return React2.createElement(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: "70vh",
        fontFamily: "system-ui, sans-serif"
      }
    },
    React2.createElement(
      "div",
      {
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          padding: "12px 16px",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
          flexShrink: 0
        }
      },
      React2.createElement(
        "div",
        { style: { fontSize: 14, color: "#4A3838" } },
        status
      ),
      React2.createElement(
        "a",
        {
          href: insightsUrl,
          target: "_top",
          rel: "noopener noreferrer",
          onClick: () => {
            const token = readTinaIdTokenFromStorage();
            if (!token) return;
            void fetch("/api/insights/session", {
              method: "POST",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ idToken: token })
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
            textDecoration: "none"
          }
        },
        "Open full page"
      )
    ),
    iframeSrc ? React2.createElement("iframe", {
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
        background: "#F7F1EA"
      }
    }) : React2.createElement(
      "div",
      {
        style: {
          flex: 1,
          display: "grid",
          placeItems: "center",
          color: "#776562",
          fontSize: 14
        }
      },
      status
    )
  );
}
function InsightsScreenIcon() {
  return React2.createElement(
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
      "aria-hidden": true
    },
    React2.createElement("path", { d: "M3 3v18h18" }),
    React2.createElement("path", { d: "M7 14v4" }),
    React2.createElement("path", { d: "M12 10v8" }),
    React2.createElement("path", { d: "M17 6v12" })
  );
}
function GuideScreen(_props) {
  const guideUrl = typeof window !== "undefined" ? `${window.location.origin}/guide` : "/guide";
  return React2.createElement(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: "70vh",
        fontFamily: "system-ui, sans-serif"
      }
    },
    React2.createElement(
      "div",
      {
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          padding: "12px 16px",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
          flexShrink: 0
        }
      },
      React2.createElement(
        "div",
        { style: { fontSize: 14, color: "#4A3838" } },
        "How to edit the site"
      ),
      React2.createElement(
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
            textDecoration: "none"
          }
        },
        "Open full page"
      )
    ),
    React2.createElement("iframe", {
      src: guideUrl,
      title: "Editing Guide",
      style: {
        flex: 1,
        width: "100%",
        minHeight: 0,
        border: "none",
        background: "#F7F1EA"
      }
    })
  );
}
function GuideScreenIcon() {
  return React2.createElement(
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
      "aria-hidden": true
    },
    React2.createElement("path", {
      d: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
    }),
    React2.createElement("path", {
      d: "M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"
    })
  );
}
var rt3 = (text) => ({
  type: "root",
  children: [{ type: "p", children: [{ type: "text", text }] }]
});
var CORE_PAGE_GLOB = `{${CORE_PAGE_SLUGS.join(",")}}`;
var pageFields = [
  {
    type: "string",
    name: "title",
    label: "Page Title",
    required: true,
    isTitle: true,
    ui: charLimit(60, "Shown in the browser tab and used to name the page in this list.")
  },
  {
    type: "string",
    name: "layout",
    label: "Page Layout",
    options: [
      { value: "standard", label: "Standard (with menu & footer)" },
      { value: "standalone", label: "Standalone (full page, no menu)" }
    ],
    ui: {
      description: "Standard pages show the site menu and footer. Standalone pages are full-screen with just a small logo header \u2014 great for link-in-bio or promo pages."
    }
  },
  {
    type: "object",
    name: "blocks",
    label: "Page Sections",
    list: true,
    ui: {
      visualSelector: true,
      description: "The sections on this page, top to bottom. Drag to reorder, click a section to edit it, or use the + button to add a new one."
    },
    templates: ALL_BLOCKS
  },
  ...seoFields("page")
];
function navLinkFields() {
  return [
    {
      type: "string",
      name: "label",
      label: "Label",
      required: true,
      ui: charLimit(24, "The text shown in the menu.")
    },
    {
      type: "string",
      name: "linkType",
      label: "Link Type",
      options: [
        { value: "page", label: "Site page" },
        { value: "path", label: "Site link (e.g. /blog or /cart)" },
        { value: "external", label: "External URL" }
      ],
      ui: {
        description: 'Where this link goes: pick "Site page" to link to one of your pages.'
      }
    },
    {
      type: "reference",
      name: "page",
      label: "Page",
      collections: ["page", "landingPage"],
      ui: { description: 'The page to link to (used when Link Type is "Site page").' }
    },
    {
      type: "string",
      name: "href",
      label: "URL / Path",
      ui: {
        description: 'For "Site link" use a path like /blog, /cart, /shop, /gallery, /downloads, /contact, /about, or /. For "External URL" paste the full https://\u2026 address. Prefer Link Type "Site page" whenever you can \u2014 that picks from your pages and cannot typo.'
      }
    }
  ];
}
var navItemProps = (item) => ({
  label: item?.label || "Menu item"
});
function newPageTemplate(name, label, defaultItem) {
  return { name, label, ui: { defaultItem }, fields: pageFields };
}
var blankPageTemplate = newPageTemplate("blank", "Blank Page", {
  title: "New Page",
  layout: "standard",
  blocks: []
});
var eventPageTemplate = newPageTemplate("event", "Event / Workshop", {
  title: "New Event",
  layout: "standard",
  blocks: [
    {
      _template: "hero",
      heading: "Your Event Name",
      subheading: rt3("When it happens, who it's for, and why it's exciting \u2014 one or two sentences."),
      ctaLabel: "Register Now",
      ctaLink: "/contact"
    },
    {
      _template: "featureGrid",
      heading: "What You'll Learn",
      items: [
        { icon: "Brush", title: "First topic", description: rt3("Describe the first topic.") },
        { icon: "Palette", title: "Second topic", description: rt3("Describe the second topic.") },
        { icon: "Star", title: "Third topic", description: rt3("Describe the third topic.") }
      ]
    },
    {
      _template: "text",
      heading: "About the Event",
      body: rt3("Tell visitors everything they need to know \u2014 schedule, format, what to bring, and how to prepare.")
    },
    {
      _template: "ctaBand",
      heading: "Ready to join?",
      description: rt3("Limited spots available."),
      ctaLabel: "Sign Up Today",
      ctaLink: "/contact",
      variant: "dark"
    }
  ]
});
var promoPageTemplate = newPageTemplate("promo", "Promo / Sale", {
  title: "New Promotion",
  layout: "standard",
  blocks: [
    {
      _template: "hero",
      heading: "Something special is here",
      subheading: rt3("Announce the promotion and what makes it a great deal."),
      ctaLabel: "Shop Now",
      ctaLink: "/shop"
    },
    {
      _template: "featuredRelease",
      eyebrow: "Featured",
      title: "The featured item",
      description: rt3("Describe the featured product or offer."),
      ctaLabel: "Get It Now",
      ctaHref: "/shop"
    },
    {
      _template: "productStrip",
      eyebrow: "FROM THE SHOP",
      heading: "More from the shop",
      viewAllLabel: "All products",
      viewAllLink: "/shop"
    },
    {
      _template: "ctaBand",
      heading: "Don't miss out",
      description: rt3("This offer won't last forever."),
      ctaLabel: "Shop the Sale",
      ctaLink: "/shop",
      variant: "dark"
    }
  ]
});
var infoPageTemplate = newPageTemplate("info", "Info Page", {
  title: "New Info Page",
  layout: "standard",
  blocks: [
    {
      _template: "pageHeader",
      heading: "Page Title",
      description: rt3("A short introduction to what this page covers.")
    },
    {
      _template: "text",
      body: rt3("Write the main content here. You can add headings, lists, links, and images.")
    }
  ]
});
var linkInBioPageTemplate = newPageTemplate("linkInBio", "Link-in-Bio / Landing", {
  title: "New Landing Page",
  layout: "standalone",
  blocks: [
    {
      _template: "marquee",
      highlightText: "Big news",
      text: " \u2014 something exciting is coming"
    },
    {
      _template: "featuredRelease",
      eyebrow: "New Featured Release",
      title: "The featured item",
      description: rt3("Describe what you're featuring."),
      ctaLabel: "Check It Out",
      ctaHref: "https://"
    },
    {
      _template: "kofiSupport",
      heading: "Support the Studio",
      body: rt3("If you enjoy the tutorials, books, and free resources, consider buying a coffee on Ko-fi."),
      ctaLabel: "Support on Ko-fi",
      href: "https://ko-fi.com/bladeandquill"
    },
    {
      _template: "socialLinks",
      links: [
        { platform: "youtube", url: "https://www.youtube.com/c/BladeQuillartacademy", label: "YouTube" },
        { platform: "instagram", url: "https://www.instagram.com/bladequillartacademy/", label: "Instagram" },
        { platform: "kofi", url: "https://ko-fi.com/bladeandquill", label: "Ko-fi" }
      ]
    }
  ]
});
var config_default = defineConfig({
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
    publicFolder: "public"
  },
  media: {
    tina: {
      mediaRoot: "images",
      publicFolder: "public"
    }
  },
  cmsCallback: (cms) => {
    cms.plugins.add({
      __type: "screen",
      name: "Insights",
      Component: InsightsRedirectScreen,
      Icon: InsightsScreenIcon,
      layout: "fullscreen",
      navCategory: "Dashboard"
    });
    cms.plugins.add({
      __type: "screen",
      name: "Guide",
      Component: GuideScreen,
      Icon: GuideScreenIcon,
      layout: "fullscreen",
      navCategory: "Help"
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
          router: ({ document }) => corePageRoute(document._sys.basename ?? document._sys.filename ?? "")
        },
        fields: pageFields
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
            slugify: (values) => String(values?.title ?? "new-page").toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "new-page"
          },
          router: ({ document }) => {
            const base = document._sys.basename?.replace(/\.json$/i, "") ?? document._sys.filename?.replace(/\.json$/i, "") ?? "";
            return `/p/${base}`;
          }
        },
        templates: [
          blankPageTemplate,
          eventPageTemplate,
          promoPageTemplate,
          infoPageTemplate,
          linkInBioPageTemplate
        ]
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
            slugify: (values) => String(values?.title ?? "new-post").toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "new-post"
          },
          router: ({ document }) => {
            const base = document._sys.basename?.replace(/\.json$/i, "") ?? document._sys.filename?.replace(/\.json$/i, "") ?? "";
            return `/blog/${base}`;
          }
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
              defaultValue: "New blog post"
            }
          },
          {
            type: "rich-text",
            name: "excerpt",
            label: "Excerpt",
            overrides: INLINE_RICH_TEXT,
            parser: SLATE_JSON_PARSER,
            templates: RICH_TEXT_TEMPLATES,
            ui: { description: "A 1-2 sentence summary shown on blog list cards." }
          },
          {
            type: "image",
            name: "coverImage",
            label: "Cover Image",
            ui: {
              description: "Featured image for the post and list cards. Prefer ~1600\xD7900 (16:9). Upload into images/blog/."
            }
          },
          {
            type: "datetime",
            name: "publishedAt",
            label: "Publish Date",
            ui: { description: "Controls sort order on the blog list. Newest posts appear first." }
          },
          {
            type: "string",
            name: "tags",
            label: "Tags",
            list: true,
            ui: {
              description: "Topic tags for filtering (e.g. 'Krita', 'Behind the Scenes'). Keep each under 24 characters."
            }
          },
          {
            type: "boolean",
            name: "showTableOfContents",
            label: "Show Table of Contents",
            ui: {
              description: "When on, a jump-link list is built automatically from Heading sections under the excerpt."
            }
          },
          {
            type: "object",
            name: "sections",
            label: "Post Sections",
            list: true,
            ui: {
              visualSelector: true,
              description: "Build the article from sections, top to bottom. Drag to reorder, click a section to edit, or use + to add Heading, Text, Spacer, Image, and more."
            },
            templates: BLOG_BLOCKS
          },
          ...seoFields("post")
        ]
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
          // Pre-fill every required field on a brand-new product. Tina refuses
          // to open any list-item panel (thumbnails, spreads, download files)
          // while a required field is empty — "Cannot navigate away from an
          // invalid form" — so a new product must start out valid. Product ID
          // is a unix-seconds stamp: unique, and far above the hand-numbered
          // legacy IDs (1–3). Price stays required so it is never guessed.
          // Spread because UICollection's published type omits defaultItem;
          // Tina's runtime reads collection.ui.defaultItem (its source even
          // carries "@ts-ignore internal types aren't up to date" there).
          ...{
            defaultItem: () => ({
              name: "New product",
              category: "digital",
              productId: Math.floor(Date.now() / 1e3),
              inStock: true,
              featured: false,
              createdAt: (/* @__PURE__ */ new Date()).toISOString()
            })
          },
          router: ({ document }) => {
            const base = document._sys.basename?.replace(/\.json$/i, "") ?? document._sys.filename?.replace(/\.json$/i, "") ?? "";
            return `/shop/${base}`;
          }
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
              defaultValue: "New product"
            }
          },
          {
            type: "rich-text",
            name: "description",
            label: "Description",
            overrides: INLINE_RICH_TEXT,
            parser: SLATE_JSON_PARSER,
            templates: RICH_TEXT_TEMPLATES,
            ui: {
              description: "Short description for shop cards and the product detail tab."
            }
          },
          {
            type: "number",
            name: "price",
            label: "Price (USD)",
            required: true,
            ui: {
              description: "Customer pays this amount at Stripe Checkout (USD, e.g. 24.99). Change it here \u2014 no Stripe dashboard needed. On a new product, set the price before adding images or files."
            }
          },
          {
            type: "string",
            name: "category",
            label: "Category",
            required: true,
            options: [
              { value: "physical", label: "Physical (book)" },
              { value: "digital", label: "Digital download" },
              { value: "bundle", label: "Bundle (several downloads)" },
              { value: "curriculum", label: "Curriculum" }
            ],
            ui: {
              description: "Controls card style and shop filters. Digital, Bundle, and Curriculum products deliver the Download Files below after payment."
            }
          },
          {
            type: "image",
            name: "image",
            label: "Cover Image (thumbnail 1)",
            ui: {
              description: "The large product photo and the first thumbnail. Prefer square or 3:4 portrait, at least 1200px wide. Upload into images/products/."
            }
          },
          {
            type: "object",
            name: "galleryImages",
            label: "More Thumbnails (under the big photo)",
            list: true,
            ui: {
              description: "Click + Add to upload more small images under the big photo. The Cover Image is always thumbnail 1; the first item here is thumbnail 2. Upload into images/products/.",
              max: 8,
              itemProps: (item) => ({
                label: item?.alt || item?.src?.split("/").pop() || "Thumbnail"
              }),
              defaultItem: {
                src: "",
                alt: ""
              }
            },
            fields: [
              {
                type: "image",
                name: "src",
                label: "Image",
                ui: {
                  description: "Click to upload or pick from Media. Square or 3:4 portrait works best. At least 800px wide."
                }
              },
              {
                type: "string",
                name: "alt",
                label: "Alt Text",
                ui: charLimit(
                  125,
                  "Short description for screen readers (e.g. \u201CBack cover\u201D or \u201CInterior page\u201D)."
                )
              }
            ]
          },
          {
            type: "object",
            name: "spreadImages",
            label: "Inside Tab Images (previews / spreads)",
            list: true,
            ui: {
              description: "These fill the Inside tab \u2014 the PREVIEW / SPREAD boxes. Click + Add for each page you want to show, then upload the image. Upload into images/products/.",
              max: 12,
              itemProps: (item) => ({
                label: item?.alt?.trim() || item?.src?.split("/").pop() || "Preview"
              }),
              defaultItem: {
                src: "",
                alt: ""
              }
            },
            fields: [
              {
                type: "image",
                name: "src",
                label: "Image",
                ui: {
                  description: "Click to upload or pick from Media. Landscape page spread or preview works best. At least 1200px wide."
                }
              },
              {
                type: "string",
                name: "alt",
                label: "Alt Text",
                ui: charLimit(
                  125,
                  "Short description for screen readers (e.g. \u201CPages 4\u20135\u201D or \u201CCharacter lineup\u201D)."
                )
              }
            ]
          },
          ...PRODUCT_PAGE_FIELDS,
          {
            type: "boolean",
            name: "featured",
            label: "Featured",
            ui: {
              description: "Featured products show a NEW badge and appear in homepage/shop highlights."
            }
          },
          {
            type: "boolean",
            name: "inStock",
            label: "In Stock",
            ui: {
              description: "When off, the product still appears in the shop but Buy now / cart checkout are blocked."
            }
          },
          {
            type: "object",
            name: "downloadFiles",
            label: "Download Files",
            list: true,
            ui: {
              description: "What the customer receives after paying (Digital, Bundle, and Curriculum products). Add one item per file \u2014 PDF, ZIP, or EPUB, up to 50 MB each. Each file gets its own download button on the thank-you page; with 2 or more files customers also get a Download All (.zip) button.",
              itemProps: (item) => ({
                label: item?.label?.trim() || item?.file?.split("/").pop() || "New file"
              }),
              defaultItem: {
                label: "",
                file: ""
              }
            },
            fields: [
              {
                type: "string",
                name: "file",
                label: "File",
                // Not `required`: an empty just-added item would make the whole
                // form invalid and lock Tina's panel navigation (see the
                // defaultItem note on this collection). Empty items are ignored
                // by checkout (toDownloadFiles in lib/checkout).
                ui: {
                  // Tina's Component typing predates custom-field props; same
                  // cast the SEO assistant uses in tina/seo.ts.
                  component: wrapFieldsWithMeta(DownloadFileField),
                  description: "Uploads go to private storage, never to the public site. Replace the file any time \u2014 customers always get the latest version."
                }
              },
              {
                type: "string",
                name: "label",
                label: "Button Label",
                ui: charLimit(
                  60,
                  "Text on the customer's download button, e.g. \u201CWorkbook (PDF)\u201D or \u201CBrush pack\u201D. Leave blank to use the file name."
                )
              }
            ]
          },
          {
            type: "string",
            name: "downloadUrl",
            label: "Legacy Download URL (advanced)",
            ui: {
              description: "Older single-link method. Use Download Files above instead; this is only read when that list is empty."
            }
          },
          {
            type: "string",
            name: "gumroadUrl",
            label: "Gumroad URL (optional)",
            ui: {
              description: "eBook or printable download on Gumroad. Shown as a buy button on book product pages."
            }
          },
          {
            type: "string",
            name: "amazonUrl",
            label: "Amazon URL (optional)",
            ui: {
              description: "Paperback listing on Amazon. Shown as a buy button on book product pages."
            }
          },
          {
            type: "string",
            name: "googlePlayUrl",
            label: "Google Play URL (optional)",
            ui: {
              description: "eBook listing on Google Play. Shown as a buy button on book product pages."
            }
          },
          {
            type: "number",
            name: "productId",
            label: "Product ID (advanced)",
            required: true,
            ui: {
              description: "Stable numeric ID for cart and Stripe \u2014 filled in automatically for new products. Must be unique. Never change it on an existing product."
            }
          },
          {
            type: "datetime",
            name: "createdAt",
            label: "Created Date",
            ui: { description: 'Used for "Newest" sort on the shop page.' }
          },
          ...seoFields("product")
        ]
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
          router: () => "/gallery"
        },
        fields: [
          {
            type: "object",
            name: "items",
            label: "Artwork",
            list: true,
            ui: {
              itemProps: (item) => ({
                label: item?.title || "Artwork"
              }),
              defaultItem: {
                title: "New artwork",
                description: "",
                image: "",
                downloadFile: ""
              },
              description: "Images on the Gallery page, top to bottom (shown in a masonry grid). Drag to reorder. Add an optional free downloadable resource on any piece \u2014 it shows a FREE badge on the grid."
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
                )
              },
              {
                type: "image",
                name: "image",
                label: "Image",
                required: true,
                ui: {
                  description: "The artwork shown in the grid and lightbox. Prefer at least 1200px on the long edge. Upload into images/gallery/ or images/squarespace/digital-paintings/."
                }
              },
              {
                type: "string",
                name: "description",
                label: "Description (optional)",
                ui: charLimit(
                  200,
                  "Short caption under the title in the lightbox."
                )
              },
              {
                type: "image",
                name: "downloadFile",
                label: "Free Downloadable Resource (optional)",
                ui: {
                  description: "A free file visitors can grab from the lightbox (coloring page, high-res image, PDF, etc.). When set, the artwork shows a FREE badge in the grid and a 'Sketch Download' button next to the full-image download. Upload via Media, or paste a path like /files/coloring-page.pdf. Leave empty if this piece has no free resource."
                }
              }
            ]
          }
        ]
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
          router: () => "/downloads"
        },
        fields: [
          {
            type: "object",
            name: "items",
            label: "Free Downloads",
            list: true,
            ui: {
              itemProps: (item) => ({
                label: item?.title || "Download"
              }),
              defaultItem: {
                title: "New download",
                description: "",
                file: "",
                fileType: "PDF",
                thumbnail: ""
              },
              description: "The free resources on the Downloads page, top to bottom. Drag to reorder. Remove any item to take it off the site."
            },
            fields: [
              {
                type: "string",
                name: "title",
                label: "Title",
                required: true,
                ui: charLimit(80, "Shown on the download card.")
              },
              {
                type: "string",
                name: "description",
                label: "Description (optional)",
                ui: charLimit(200, "One or two sentences under the title.")
              },
              {
                type: "image",
                name: "file",
                label: "Downloadable File",
                required: true,
                ui: {
                  description: "The file visitors get when they click Free Download (PDF, JPG, PNG, ZIP, etc.). Upload via Media, or paste a path like /files/coloring-page.pdf."
                }
              },
              {
                type: "string",
                name: "fileType",
                label: "File Type Badge",
                required: true,
                options: ["PDF", "JPG", "PNG", "ZIP", "MP4", "EPUB"],
                ui: {
                  description: "Shown as a small badge on the card image. Pick the format of the file."
                }
              },
              {
                type: "image",
                name: "thumbnail",
                label: "Card Image (optional)",
                ui: {
                  description: "Preview image on the card. Prefer 4:3 landscape, at least 800px wide. Upload into images/downloads/."
                }
              }
            ]
          }
        ]
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
          router: () => "/"
        },
        fields: [
          {
            type: "object",
            name: "items",
            label: "Videos",
            list: true,
            ui: {
              itemProps: (item) => ({
                label: item?.title || "Video"
              }),
              defaultItem: {
                title: "New video",
                youtubeId: "",
                description: "",
                topic: "",
                featured: false
              },
              description: "Your YouTube tutorial videos, top to bottom. Drag to reorder. Videos marked Featured appear in the homepage YouTube strip (up to 4, in this order)."
            },
            fields: [
              {
                type: "string",
                name: "title",
                label: "Video Title",
                required: true,
                ui: charLimit(90, "Shown under the video thumbnail.")
              },
              {
                type: "string",
                name: "youtubeId",
                label: "YouTube Video ID",
                required: true,
                ui: charLimit(
                  20,
                  "The 11-character code from the video URL \u2014 the part after watch?v= (e.g. 63_gp_rFtOc)."
                )
              },
              {
                type: "string",
                name: "description",
                label: "Description (optional)",
                ui: charLimit(200, "One or two sentences about the video.")
              },
              {
                type: "string",
                name: "topic",
                label: "Topic (optional)",
                ui: charLimit(32, 'Grouping label (e.g. "Learning Krita", "Brushes").')
              },
              {
                type: "boolean",
                name: "featured",
                label: "Featured on Homepage",
                ui: {
                  description: "Featured videos appear in the homepage YouTube strip \u2014 the first 4 featured videos (in this list's order) are shown."
                }
              }
            ]
          }
        ]
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
          router: () => "/"
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
                href: "/"
              },
              description: "The links in the site header, left to right. Drag to reorder. Add Dropdown Items to a link to group pages under it."
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
                    href: "/"
                  },
                  description: "Optional links shown in a dropdown under this menu item."
                },
                fields: navLinkFields()
              }
            ]
          },
          {
            type: "object",
            name: "footerColumns",
            label: "Footer Columns",
            list: true,
            ui: {
              itemProps: (item) => ({
                label: item?.heading || "Footer column"
              }),
              defaultItem: {
                heading: "Explore",
                links: [{ label: "Home", linkType: "path", href: "/" }]
              },
              description: "The link columns in the site footer, left to right. Drag to reorder."
            },
            fields: [
              {
                type: "string",
                name: "heading",
                label: "Column Heading",
                required: true,
                ui: charLimit(32)
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
                    href: "/"
                  }
                },
                fields: navLinkFields()
              }
            ]
          }
        ]
      }
    ]
  }
});
export {
  config_default as default
};
