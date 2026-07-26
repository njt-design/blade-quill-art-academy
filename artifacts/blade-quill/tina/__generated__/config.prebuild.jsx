// tina/config.ts
import React, { useEffect } from "react";
import { defineConfig } from "tinacms";

// tina/blocks.ts
var INLINE_RICH_TEXT = {
  toolbar: ["bold", "italic", "link", "ul", "ol"],
  showFloatingToolbar: true
};
var SLATE_JSON_PARSER = { type: "slatejson" };
var rt = (text) => ({
  type: "root",
  children: [{ type: "p", children: [{ type: "text", text }] }]
});
var IMAGE_ITEM_FIELDS = [
  { type: "image", name: "src", label: "Image" },
  { type: "string", name: "alt", label: "Alt Text" },
  {
    type: "string",
    name: "caption",
    label: "Caption (optional)"
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
      ui: { description: "Large heading text for this hero section." }
    },
    {
      type: "rich-text",
      name: "subheading",
      label: "Subheading",
      overrides: INLINE_RICH_TEXT,
      parser: SLATE_JSON_PARSER,
      ui: { description: "Supporting text shown below the heading." }
    },
    {
      type: "image",
      name: "backgroundImage",
      label: "Background Image",
      ui: { description: "Optional background image behind the hero." }
    },
    {
      type: "string",
      name: "ctaLabel",
      label: "Button Label",
      ui: { description: 'Text on the call-to-action button (e.g. "Get Started").' }
    },
    {
      type: "string",
      name: "ctaLink",
      label: "Button Link",
      ui: { description: 'Relative URL the button links to (e.g. "/shop").' }
    }
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
      ui: { description: "Optional heading above the text content." }
    },
    {
      type: "rich-text",
      name: "body",
      label: "Body",
      parser: SLATE_JSON_PARSER,
      ui: { description: "Rich text content. Supports headings, bold, links, images, and more." }
    }
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
      ui: { description: "Optional heading above the image grid." }
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
        { type: "string", name: "alt", label: "Alt Text" },
        { type: "string", name: "caption", label: "Caption (optional)" }
      ]
    }
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
      ui: { description: "Bold heading for the call-to-action strip." }
    },
    {
      type: "rich-text",
      name: "description",
      label: "Description",
      overrides: INLINE_RICH_TEXT,
      parser: SLATE_JSON_PARSER,
      ui: { description: "Supporting line below the heading." }
    },
    { type: "string", name: "ctaLabel", label: "Button Label" },
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
    }
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
      ui: { description: "Optional heading above the video." }
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
    }
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
      ui: { description: "Optional heading above the feature cards." }
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
        { type: "string", name: "title", label: "Title" },
        {
          type: "rich-text",
          name: "description",
          label: "Description",
          overrides: INLINE_RICH_TEXT,
          parser: SLATE_JSON_PARSER
        }
      ]
    }
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
      ui: { description: "Small label above the heading." }
    },
    {
      type: "string",
      name: "heading",
      label: "Heading",
      ui: {
        component: "textarea",
        description: "Large centered heading. Press Enter to create a line break."
      }
    },
    {
      type: "string",
      name: "highlightText",
      label: "Highlighted Word",
      ui: { description: "A word or phrase from the heading to show in gradient color. Must match the heading text exactly." }
    },
    { type: "string", name: "primaryLabel", label: "Primary Button Label" },
    {
      type: "string",
      name: "primaryLink",
      label: "Primary Button Link",
      ui: { description: 'Relative URL (e.g. "/contact").' }
    },
    { type: "string", name: "secondaryLabel", label: "Secondary Button Label" },
    {
      type: "string",
      name: "secondaryLink",
      label: "Secondary Button Link",
      ui: { description: "Relative URL or full https:// link." }
    }
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
      ui: { description: "The main page title shown at the top." }
    },
    {
      type: "rich-text",
      name: "description",
      label: "Description",
      overrides: INLINE_RICH_TEXT,
      parser: SLATE_JSON_PARSER,
      ui: { description: "Introductory text shown below the heading." }
    }
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
      type: "string",
      name: "eyebrow",
      label: "Eyebrow",
      ui: { description: "Small label above the big heading." }
    },
    {
      type: "string",
      name: "heading",
      label: "Heading",
      ui: {
        component: "textarea",
        description: "The giant homepage heading. Press Enter once to split it into two lines \u2014 the second line shows in gradient color."
      }
    },
    {
      type: "rich-text",
      name: "subheading",
      label: "Subheading",
      overrides: INLINE_RICH_TEXT,
      parser: SLATE_JSON_PARSER,
      ui: { description: "The sentence below the main heading." }
    },
    {
      type: "string",
      name: "ctaPrimary",
      label: "Primary Button Label",
      ui: { description: 'Text on the orange button (e.g. "Explore the Shop").' }
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
      ui: { description: "Text on the outline button next to the primary one." }
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
      ui: { description: 'Small line between the quill marks (e.g. "EST. 2018 \xB7 NANTES, FR").' }
    },
    {
      type: "string",
      name: "marqueeItems",
      label: "Scrolling Words",
      list: true,
      ui: { description: "Words that scroll across the bottom of the hero (e.g. Author, Illustrator)." }
    }
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
    { type: "string", name: "eyebrow", label: "Eyebrow" },
    { type: "string", name: "heading", label: "Heading" },
    {
      type: "object",
      name: "items",
      label: "Cards",
      list: true,
      ui: {
        itemProps: (item) => ({
          label: item?.title || "Card"
        }),
        description: "Three polaroid-style cards. Each links somewhere on (or off) the site."
      },
      fields: [
        {
          type: "string",
          name: "tag",
          label: "Tag",
          ui: { description: 'Small label above the card title (e.g. "NEW BOOK").' }
        },
        { type: "string", name: "title", label: "Title" },
        { type: "string", name: "sub", label: "Subtitle" },
        { type: "string", name: "cta", label: "Link Text" },
        {
          type: "string",
          name: "badge",
          label: "Corner Badge",
          ui: { description: 'Small pill in the top-right corner of the image (e.g. "LATEST").' }
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
    }
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
    { type: "string", name: "eyebrow", label: "Eyebrow" },
    { type: "string", name: "heading", label: "Heading" },
    {
      type: "rich-text",
      name: "description",
      label: "Description",
      overrides: INLINE_RICH_TEXT,
      parser: SLATE_JSON_PARSER
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
        { type: "string", name: "value", label: "Value" },
        { type: "string", name: "label", label: "Label" }
      ]
    },
    { type: "string", name: "ctaLabel", label: "Primary Button Label" },
    {
      type: "string",
      name: "ctaLink",
      label: "Primary Button Link",
      ui: { description: 'Relative URL (e.g. "/shop/lheeloo-luna-cartoon-book").' }
    },
    { type: "string", name: "secondaryLabel", label: "Secondary Button Label" },
    { type: "string", name: "secondaryLink", label: "Secondary Button Link" }
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
      ui: { description: 'Small label above the heading (e.g. "Now Enrolling").' }
    },
    { type: "string", name: "heading", label: "Heading" },
    {
      type: "rich-text",
      name: "subheading",
      label: "Subheading",
      overrides: INLINE_RICH_TEXT,
      parser: SLATE_JSON_PARSER,
      ui: { description: "Shown inside the left panel of the classroom card." }
    },
    {
      type: "string",
      name: "bullets",
      label: "Bullet Points",
      list: true,
      ui: { description: "Numbered benefit bullets." }
    },
    {
      type: "string",
      name: "metaTags",
      label: "Meta Line",
      ui: { description: 'Small line below the bullets (e.g. "Self-paced \xB7 Krita 5.2"). Separate items with "\xB7".' }
    },
    { type: "string", name: "ctaLabel", label: "Primary Button Label" },
    {
      type: "string",
      name: "ctaLink",
      label: "Primary Button Link",
      ui: { description: 'Relative URL (e.g. "/classes").' }
    },
    { type: "string", name: "secondaryLabel", label: "Secondary Button Label" },
    { type: "string", name: "secondaryLink", label: "Secondary Button Link" }
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
    { type: "string", name: "eyebrow", label: "Eyebrow" },
    {
      type: "string",
      name: "headingPrefix",
      label: "Heading \u2014 Start",
      ui: { description: 'First words of the heading (e.g. "Join ").' }
    },
    {
      type: "string",
      name: "headingHighlight",
      label: "Heading \u2014 Highlighted Part",
      ui: { description: 'Shown in warm gradient color (e.g. "100,000+ artists").' }
    },
    {
      type: "string",
      name: "headingSuffix",
      label: "Heading \u2014 Second Line",
      ui: { description: 'Rest of the heading on the next line (e.g. "learning with me.").' }
    },
    { type: "string", name: "buttonLabel", label: "Button Label" },
    {
      type: "string",
      name: "youtubeUrl",
      label: "YouTube Channel URL",
      ui: { description: "Full channel URL \u2014 the button links here." }
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
        { type: "string", name: "value", label: "Value" },
        { type: "string", name: "label", label: "Label" }
      ]
    }
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
    { type: "string", name: "eyebrow", label: "Eyebrow" },
    { type: "string", name: "heading", label: "Heading" },
    { type: "string", name: "viewAllLabel", label: "View All Label" },
    {
      type: "string",
      name: "viewAllLink",
      label: "View All Link",
      ui: { description: 'Where the "view all" button goes (usually "/shop").' }
    }
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
      ui: { description: "Heading above the list of recent blog posts (posts appear automatically)." }
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
        { type: "string", name: "eyebrow", label: "Eyebrow" },
        { type: "string", name: "heading", label: "Heading" },
        {
          type: "rich-text",
          name: "subheading",
          label: "Description",
          overrides: INLINE_RICH_TEXT,
          parser: SLATE_JSON_PARSER
        },
        { type: "string", name: "placeholderText", label: "Email Placeholder" },
        { type: "string", name: "ctaLabel", label: "Submit Button Label" },
        { type: "string", name: "privacyNote", label: "Privacy Note" }
      ]
    }
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
    { type: "string", name: "eyebrow", label: "Eyebrow" },
    { type: "string", name: "heading", label: "Heading" },
    {
      type: "rich-text",
      name: "subheading",
      label: "Description",
      overrides: INLINE_RICH_TEXT,
      parser: SLATE_JSON_PARSER
    },
    { type: "string", name: "placeholderText", label: "Email Placeholder" },
    { type: "string", name: "ctaLabel", label: "Submit Button Label" },
    { type: "string", name: "privacyNote", label: "Privacy Note" }
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
    { type: "string", name: "eyebrow", label: "Eyebrow" },
    {
      type: "string",
      name: "heading",
      label: "Heading",
      ui: {
        component: "textarea",
        description: "Up to three lines (press Enter to break). The middle line shows in gradient color."
      }
    },
    {
      type: "rich-text",
      name: "leadText",
      label: "Lead Text",
      overrides: INLINE_RICH_TEXT,
      parser: SLATE_JSON_PARSER,
      ui: { description: "The introductory sentence below the heading. Keep it to 1-2 sentences." }
    },
    { type: "string", name: "ctaPrimary", label: "Primary Button Label" },
    { type: "string", name: "ctaPrimaryLink", label: "Primary Button Link" },
    { type: "string", name: "ctaSecondary", label: "Secondary Button Label" },
    { type: "string", name: "ctaSecondaryLink", label: "Secondary Button Link" },
    {
      type: "string",
      name: "metaLine",
      label: "Meta Line",
      ui: { description: 'Small line under the buttons (e.g. "NANTES, FRANCE \xB7 EST. 2018"). Separate items with "\xB7".' }
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
      ui: { description: "Handwritten-style caption under the portrait." }
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
      ui: { description: 'Small label on the desk polaroid (e.g. "from the desk").' }
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
      ui: { description: 'Small label on the screen polaroid (e.g. "krita screen").' }
    }
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
        { type: "string", name: "value", label: "Value" },
        { type: "string", name: "label", label: "Label" }
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
      ui: { description: 'The small orange number in the left margin (e.g. "01").' }
    },
    {
      type: "string",
      name: "label",
      label: "Section Label",
      ui: { description: 'The small label in the left margin (e.g. "STORY").' }
    },
    {
      type: "string",
      name: "heading",
      label: "Heading",
      ui: { component: "textarea", description: "Press Enter to create a line break." }
    },
    {
      type: "rich-text",
      name: "paragraph1",
      label: "First Paragraph",
      overrides: INLINE_RICH_TEXT,
      parser: SLATE_JSON_PARSER
    },
    {
      type: "rich-text",
      name: "quote",
      label: "Pull Quote",
      overrides: INLINE_RICH_TEXT,
      parser: SLATE_JSON_PARSER,
      ui: { description: "Shown as a large quote in a dark rounded panel between the paragraphs." }
    },
    {
      type: "rich-text",
      name: "paragraph2",
      label: "Second Paragraph",
      overrides: INLINE_RICH_TEXT,
      parser: SLATE_JSON_PARSER
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
      ui: { description: "Caption under the small polaroid on the right." }
    }
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
    { type: "string", name: "number", label: "Section Number" },
    { type: "string", name: "label", label: "Section Label" },
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
        { type: "string", name: "year", label: "Year" },
        { type: "string", name: "title", label: "Title" },
        { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
        {
          type: "image",
          name: "image",
          label: "Image",
          ui: { description: "Optional artwork shown beside this timeline event." }
        }
      ]
    }
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
    { type: "string", name: "number", label: "Section Number" },
    { type: "string", name: "label", label: "Section Label" },
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
          ui: { description: 'Small label above the title (e.g. "BOOKS").' }
        },
        { type: "string", name: "title", label: "Title" },
        { type: "string", name: "body", label: "Body", ui: { component: "textarea" } },
        {
          type: "image",
          name: "image",
          label: "Image",
          ui: { description: "Card thumbnail. Leave blank to use the default fallback art." }
        },
        { type: "string", name: "ctaLabel", label: "Link Text" },
        {
          type: "string",
          name: "link",
          label: "Link",
          ui: { description: "Relative URL or full https:// link (https links open in a new tab)." }
        }
      ]
    }
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
      ui: { description: "The big shop heading. Products themselves are managed under Shop Products." }
    },
    {
      type: "string",
      name: "highlightText",
      label: "Highlighted Word",
      ui: { description: "A word from the heading to show in gradient color. Must match the heading text exactly." }
    },
    {
      type: "rich-text",
      name: "description",
      label: "Description",
      overrides: INLINE_RICH_TEXT,
      parser: SLATE_JSON_PARSER
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
      ui: { description: "Heading shown when no products match the filter." }
    },
    {
      type: "string",
      name: "emptyDescription",
      label: "Empty State Description"
    }
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
      ui: { description: "Images load automatically from the gallery database. This heading only shows if the gallery is empty." }
    },
    {
      type: "string",
      name: "emptyDescription",
      label: "Empty State Description"
    }
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
      ui: { description: "Downloads load automatically. This heading only shows when there are none." }
    },
    {
      type: "string",
      name: "emptyDescription",
      label: "Empty State Description"
    }
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
      ui: { description: 'General location (e.g. "Des Moines, IA").' }
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
      ui: { description: "Heading above the request form." }
    },
    {
      type: "rich-text",
      name: "description",
      label: "Description",
      overrides: INLINE_RICH_TEXT,
      parser: SLATE_JSON_PARSER,
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
    { type: "string", name: "submitLabel", label: "Submit Button Label" },
    {
      type: "string",
      name: "successHeading",
      label: "Success Heading",
      ui: { description: "Shown after the request is sent." }
    },
    {
      type: "string",
      name: "successNote",
      label: "Success Note",
      ui: { component: "textarea", description: "Short note above the download button." }
    },
    { type: "string", name: "downloadLabel", label: "Download Button Label" }
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
      ui: { description: "Messages are delivered to the studio inbox automatically." }
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
      ui: { description: "The first part of the announcement, shown in orange." }
    },
    {
      type: "string",
      name: "text",
      label: "Text",
      ui: { description: "The rest of the announcement, shown in muted color." }
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
      ui: { description: 'Small label above the title (e.g. "New Featured Release").' }
    },
    { type: "string", name: "title", label: "Title", required: true },
    {
      type: "rich-text",
      name: "description",
      label: "Description",
      overrides: INLINE_RICH_TEXT,
      parser: SLATE_JSON_PARSER
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
    { type: "string", name: "ctaLabel", label: "Button Label" },
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
    }
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
    { type: "string", name: "heading", label: "Heading" },
    {
      type: "rich-text",
      name: "body",
      label: "Body Text",
      overrides: INLINE_RICH_TEXT,
      parser: SLATE_JSON_PARSER
    },
    { type: "string", name: "ctaLabel", label: "Button Label" },
    { type: "string", name: "href", label: "Ko-fi URL" }
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
      ui: {
        description: "When set, the links show inside a centered panel with this heading (like the Ko-fi support section). Leave blank for a simple icon row."
      }
    },
    {
      type: "rich-text",
      name: "body",
      label: "Body Text (optional)",
      overrides: INLINE_RICH_TEXT,
      parser: SLATE_JSON_PARSER,
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
          ui: { description: "Accessible name for the link (read by screen readers)." }
        }
      ]
    }
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
    { type: "string", name: "heading", label: "Heading" },
    {
      type: "rich-text",
      name: "intro",
      label: "Intro Text",
      overrides: INLINE_RICH_TEXT,
      parser: SLATE_JSON_PARSER
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
        itemProps: (item) => ({
          label: item?.label || "Review link"
        })
      },
      fields: [
        { type: "string", name: "label", label: "Button Label" },
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
    }
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
      ui: { component: "textarea", description: "Use a line break for a two-line headline." }
    },
    {
      type: "rich-text",
      name: "subheading",
      label: "Subheading",
      overrides: INLINE_RICH_TEXT,
      parser: SLATE_JSON_PARSER
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
      label: "Image Alt Text"
    },
    {
      type: "string",
      name: "imageCaption",
      label: "Image Caption (optional)"
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
    { type: "string", name: "ctaPrimary", label: "Primary Button Label" },
    { type: "string", name: "ctaPrimaryLink", label: "Primary Button Link" },
    { type: "string", name: "ctaSecondary", label: "Secondary Button Label (optional)" },
    { type: "string", name: "ctaSecondaryLink", label: "Secondary Button Link" }
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
      ui: { component: "textarea" }
    },
    {
      type: "rich-text",
      name: "subheading",
      label: "Subheading (optional)",
      overrides: INLINE_RICH_TEXT,
      parser: SLATE_JSON_PARSER
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
    { type: "string", name: "ctaLabel", label: "Button Label (optional)" },
    { type: "string", name: "ctaLink", label: "Button Link" }
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
    { type: "string", name: "eyebrow", label: "Eyebrow (optional)" },
    {
      type: "string",
      name: "heading",
      label: "Heading",
      ui: { component: "textarea" }
    },
    {
      type: "rich-text",
      name: "subheading",
      label: "Subheading (optional)",
      overrides: INLINE_RICH_TEXT,
      parser: SLATE_JSON_PARSER
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
    { type: "string", name: "ctaPrimary", label: "Primary Button Label (optional)" },
    { type: "string", name: "ctaPrimaryLink", label: "Primary Button Link" },
    { type: "string", name: "ctaSecondary", label: "Secondary Button Label (optional)" },
    { type: "string", name: "ctaSecondaryLink", label: "Secondary Button Link" }
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
    { type: "string", name: "eyebrow", label: "Eyebrow (optional)" },
    {
      type: "string",
      name: "heading",
      label: "Heading",
      ui: { component: "textarea" }
    },
    {
      type: "rich-text",
      name: "subheading",
      label: "Subheading (optional)",
      overrides: INLINE_RICH_TEXT,
      parser: SLATE_JSON_PARSER
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
    { type: "string", name: "ctaLabel", label: "Button Label (optional)" },
    { type: "string", name: "ctaLink", label: "Button Link" }
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
    { type: "string", name: "eyebrow", label: "Eyebrow (optional)" },
    {
      type: "string",
      name: "heading",
      label: "Heading (optional)",
      ui: { component: "textarea" }
    },
    {
      type: "image",
      name: "image",
      label: "Image"
    },
    { type: "string", name: "alt", label: "Alt Text" },
    { type: "string", name: "caption", label: "Caption (optional)" },
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
      parser: SLATE_JSON_PARSER
    }
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
      label: "Heading (optional)"
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
    }
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
      label: "Heading (optional)"
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
    }
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

// tina/config.ts
function InsightsRedirectScreen(_props) {
  useEffect(() => {
    window.location.assign("/insights");
  }, []);
  return React.createElement(
    "div",
    { style: { padding: 32, fontFamily: "system-ui, sans-serif" } },
    "Opening Owner Insights\u2026"
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
      "aria-hidden": true
    },
    React.createElement("path", { d: "M3 3v18h18" }),
    React.createElement("path", { d: "M7 14v4" }),
    React.createElement("path", { d: "M12 10v8" }),
    React.createElement("path", { d: "M17 6v12" })
  );
}
var INLINE_RICH_TEXT2 = {
  toolbar: ["bold", "italic", "link", "ul", "ol"],
  showFloatingToolbar: true
};
var SLATE_JSON_PARSER2 = { type: "slatejson" };
var rt2 = (text) => ({
  type: "root",
  children: [{ type: "p", children: [{ type: "text", text }] }]
});
var CORE_PAGE_SLUGS = [
  "home",
  "about",
  "contact",
  "shop",
  "gallery",
  "downloads",
  "publishers",
  "important-links"
];
var CORE_PAGE_GLOB = `{${CORE_PAGE_SLUGS.join(",")}}`;
var pageFields = [
  {
    type: "string",
    name: "title",
    label: "Page Title",
    required: true,
    isTitle: true,
    ui: { description: "Shown in the browser tab and used to name the page in this list." }
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
  }
];
function corePageRoute(basename) {
  const base = basename.replace(/\.json$/i, "");
  if (base === "home") return "/";
  if (base === "important-links") return "/important-links-page";
  return `/${base}`;
}
function navLinkFields() {
  return [
    {
      type: "string",
      name: "label",
      label: "Label",
      required: true,
      ui: { description: "The text shown in the menu." }
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
        description: 'Used for "Site link" (e.g. /blog) or "External URL" (e.g. https://youtube.com/...).'
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
      subheading: rt2("When it happens, who it's for, and why it's exciting \u2014 one or two sentences."),
      ctaLabel: "Register Now",
      ctaLink: "/contact"
    },
    {
      _template: "featureGrid",
      heading: "What You'll Learn",
      items: [
        { icon: "Brush", title: "First topic", description: rt2("Describe the first topic.") },
        { icon: "Palette", title: "Second topic", description: rt2("Describe the second topic.") },
        { icon: "Star", title: "Third topic", description: rt2("Describe the third topic.") }
      ]
    },
    {
      _template: "text",
      heading: "About the Event",
      body: rt2("Tell visitors everything they need to know \u2014 schedule, format, what to bring, and how to prepare.")
    },
    {
      _template: "ctaBand",
      heading: "Ready to join?",
      description: rt2("Limited spots available."),
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
      subheading: rt2("Announce the promotion and what makes it a great deal."),
      ctaLabel: "Shop Now",
      ctaLink: "/shop"
    },
    {
      _template: "featuredRelease",
      eyebrow: "Featured",
      title: "The featured item",
      description: rt2("Describe the featured product or offer."),
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
      description: rt2("This offer won't last forever."),
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
      description: rt2("A short introduction to what this page covers.")
    },
    {
      _template: "text",
      body: rt2("Write the main content here. You can add headings, lists, links, and images.")
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
      description: rt2("Describe what you're featuring."),
      ctaLabel: "Check It Out",
      ctaHref: "https://"
    },
    {
      _template: "kofiSupport",
      heading: "Support the Studio",
      body: rt2("If you enjoy the tutorials, books, and free resources, consider buying a coffee on Ko-fi."),
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
          router: ({ document }) => corePageRoute(document._sys.basename ?? document._sys.filename ?? "")
        },
        fields: pageFields
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
              description: "The link columns in the site footer, left to right. Drag to reorder."
            },
            fields: [
              {
                type: "string",
                name: "heading",
                label: "Column Heading",
                required: true
              },
              {
                type: "object",
                name: "links",
                label: "Links",
                list: true,
                ui: { itemProps: navItemProps },
                fields: navLinkFields()
              }
            ]
          }
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
          router: ({ document }) => {
            const base = document._sys.basename?.replace(/\.json$/i, "") ?? document._sys.filename?.replace(/\.json$/i, "") ?? "";
            return `/shop/${base}`;
          }
        },
        fields: [
          {
            type: "number",
            name: "productId",
            label: "Product ID",
            required: true,
            ui: {
              description: "Stable numeric ID for cart and Stripe checkout. Keep unique and do not renumber existing products (e.g. 1, 2, 3)."
            }
          },
          {
            type: "string",
            name: "name",
            label: "Name",
            required: true,
            ui: { description: "Product title shown on cards and the detail page." }
          },
          {
            type: "rich-text",
            name: "description",
            label: "Description",
            overrides: INLINE_RICH_TEXT2,
            parser: SLATE_JSON_PARSER2,
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
              description: "Customer pays this amount at Stripe Checkout (USD, e.g. 24.99). Change it here \u2014 no Stripe dashboard needed."
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
              { value: "curriculum", label: "Curriculum" }
            ],
            ui: { description: "Controls card style and shop filters." }
          },
          {
            type: "image",
            name: "image",
            label: "Cover Image",
            ui: { description: "Product image for shop grid and detail gallery." }
          },
          {
            type: "string",
            name: "gumroadUrl",
            label: "Gumroad URL",
            ui: {
              description: "Optional post-purchase fallback link shown after Stripe payment if no Download URL is set. Not used for checkout."
            }
          },
          {
            type: "string",
            name: "downloadUrl",
            label: "Download URL",
            ui: {
              description: "After Stripe payment, digital/curriculum products get a 48-hour download link that redirects here. Prefer a file on this site (e.g. /files/guide.pdf)."
            }
          },
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
            type: "datetime",
            name: "createdAt",
            label: "Created Date",
            ui: { description: 'Used for "Newest" sort on the shop page.' }
          }
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
          // Use basename without extension so the URL matches /blog/:slug (wouter route)
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
            ui: { description: "The post headline. Shows in the blog list and at the top of the post." }
          },
          {
            type: "rich-text",
            name: "excerpt",
            label: "Excerpt",
            overrides: INLINE_RICH_TEXT2,
            parser: SLATE_JSON_PARSER2,
            ui: { description: "A 1-2 sentence summary shown on blog list cards." }
          },
          {
            type: "image",
            name: "coverImage",
            label: "Cover Image",
            ui: { description: "Featured image shown at the top of the post and on list cards." }
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
            ui: { description: "Topic tags for filtering (e.g. 'Krita', 'Behind the Scenes')." }
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            parser: SLATE_JSON_PARSER2,
            ui: { description: "The full post content. Supports headings, images, links, and embeds." }
          }
        ]
      }
    ]
  }
});
export {
  config_default as default
};
