// tina/config.ts
import { defineConfig } from "tinacms";
var INLINE_RICH_TEXT = {
  toolbar: ["bold", "italic", "link", "ul", "ol"],
  showFloatingToolbar: true
};
var SLATE_JSON_PARSER = { type: "slatejson" };
var heroBlock = {
  name: "hero",
  label: "Hero Section",
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
      ui: {
        description: "Supporting text shown below the heading."
      }
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
  label: "Image Gallery",
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
    {
      type: "string",
      name: "ctaLabel",
      label: "Button Label"
    },
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
      ui: { description: "Full YouTube video URL (e.g. https://www.youtube.com/watch?v=abc123). The embed ID is extracted automatically." }
    }
  ]
};
var featureGridBlock = {
  name: "featureGrid",
  label: "Feature Grid",
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
  schema: {
    collections: [
      // ---------------------------------------------------------------
      // Home Page
      // ---------------------------------------------------------------
      {
        name: "home",
        label: "Home Page",
        path: "content",
        match: { include: "home" },
        format: "json",
        ui: { router: () => "/" },
        fields: [
          {
            type: "object",
            name: "hero",
            label: "Hero Section",
            fields: [
              {
                type: "string",
                name: "heading",
                label: "Heading",
                ui: { description: "The large heading at the very top of the homepage. Use a newline to create a line break." }
              },
              {
                type: "rich-text",
                name: "subheading",
                label: "Subheading",
                overrides: INLINE_RICH_TEXT,
                parser: SLATE_JSON_PARSER,
                ui: { description: "The sentence below the main heading. Describes what the site offers and who Corinne is." }
              },
              {
                type: "string",
                name: "ctaPrimary",
                label: "Primary CTA Label",
                ui: { description: 'Text on the orange button in the hero section (e.g. "Explore the Shop").' }
              },
              {
                type: "string",
                name: "ctaSecondary",
                label: "Secondary CTA Label",
                ui: { description: 'Text on the outline button next to the primary CTA (e.g. "Watch Tutorials").' }
              },
              {
                type: "image",
                name: "backgroundImage",
                label: "Background Image",
                ui: { description: "Hero image shown below the heading and CTAs on the homepage." }
              }
            ]
          },
          {
            type: "object",
            name: "latestSection",
            label: "Latest Gallery Section",
            fields: [
              {
                type: "string",
                name: "heading",
                label: "Heading",
                ui: { description: 'Section heading above the thumbnail grid (e.g. "Latest").' }
              },
              {
                type: "string",
                name: "viewAllLabel",
                label: "View All Label",
                ui: { description: 'Link text on the right side (e.g. "View all").' }
              }
            ]
          },
          {
            type: "object",
            name: "featuredSection",
            label: "Books & Ebooks Section",
            fields: [
              {
                type: "string",
                name: "heading",
                label: "Heading",
                ui: { description: 'Heading for the Books & Ebooks section (e.g. "Books & Ebooks").' }
              },
              {
                type: "string",
                name: "subheading",
                label: "Subheading",
                ui: { description: "Short description below the Books & Ebooks heading." }
              },
              {
                type: "string",
                name: "viewAllLabel",
                label: "View All Label",
                ui: { description: 'The "View All" link text on the right side of the featured section header.' }
              }
            ]
          },
          {
            type: "object",
            name: "artistBanner",
            label: "Artist Banner",
            fields: [
              {
                type: "string",
                name: "badge",
                label: "Badge Text",
                ui: { description: 'Small badge shown above the artist heading (e.g. "Author & Illustrator").' }
              },
              {
                type: "string",
                name: "heading",
                label: "Heading",
                ui: { description: 'The artist banner heading (e.g. "Meet Corinne").' }
              },
              {
                type: "rich-text",
                name: "bio",
                label: "Bio",
                overrides: INLINE_RICH_TEXT,
                parser: SLATE_JSON_PARSER,
                ui: { description: "A short bio paragraph introducing the artist. Shown next to the portrait image." }
              },
              {
                type: "string",
                name: "ctaLabel",
                label: "CTA Label",
                ui: { description: 'Text on the button in the artist banner (e.g. "Read My Story"). Links to the About page.' }
              },
              {
                type: "image",
                name: "portraitImage",
                label: "Portrait Image",
                ui: { description: "The portrait photo shown in the artist banner section on the homepage." }
              }
            ]
          },
          {
            type: "object",
            name: "tutorialsSection",
            label: "Featured Video Tutorial Section",
            fields: [
              {
                type: "string",
                name: "heading",
                label: "Heading",
                ui: { description: 'Heading above the featured video (e.g. "Featured Video Tutorial").' }
              },
              {
                type: "string",
                name: "subheading",
                label: "Subheading",
                ui: { description: "Short description below the featured video heading." }
              },
              {
                type: "string",
                name: "browseAllLabel",
                label: "Browse All Label",
                ui: { description: "Button text linking to the full tutorials page." }
              }
            ]
          },
          {
            type: "object",
            name: "classesSection",
            label: "Krita Education Classes Section",
            fields: [
              {
                type: "string",
                name: "eyebrow",
                label: "Eyebrow",
                ui: { description: 'Small label above the heading (e.g. "Now Enrolling").' }
              },
              {
                type: "string",
                name: "heading",
                label: "Heading",
                ui: { description: 'Main heading (e.g. "Enroll in My Krita Education Classes").' }
              },
              {
                type: "rich-text",
                name: "subheading",
                label: "Subheading",
                overrides: INLINE_RICH_TEXT,
                parser: SLATE_JSON_PARSER,
                ui: { description: "Supporting line below the heading." }
              },
              {
                type: "rich-text",
                name: "body",
                label: "Body (optional)",
                overrides: INLINE_RICH_TEXT,
                parser: SLATE_JSON_PARSER,
                ui: { description: "Optional extra paragraph." }
              },
              {
                type: "string",
                name: "bullets",
                label: "Bullet Points",
                list: true,
                ui: { description: "Benefit bullets shown with checkmarks." }
              },
              {
                type: "string",
                name: "ctaLabel",
                label: "CTA Label",
                ui: { description: 'Primary button text (e.g. "Reserve Your Spot").' }
              },
              {
                type: "string",
                name: "ctaLink",
                label: "CTA Link",
                ui: { description: 'Relative URL for the CTA (e.g. "/classes").' }
              },
              {
                type: "string",
                name: "metaTags",
                label: "Meta Line",
                ui: { description: 'Small line below the button (e.g. "Self-paced \xB7 Krita 5.2").' }
              },
              {
                type: "image",
                name: "image",
                label: "Section Image",
                ui: { description: "Image shown beside the classes pitch." }
              }
            ]
          },
          {
            type: "object",
            name: "blogSection",
            label: "Recent Blog Posts Section",
            fields: [
              {
                type: "string",
                name: "heading",
                label: "Heading",
                ui: { description: 'Section heading (e.g. "Recent Blog Posts").' }
              },
              {
                type: "string",
                name: "subheading",
                label: "Subheading",
                ui: { description: "Short description below the blog section heading." }
              },
              {
                type: "string",
                name: "viewAllLabel",
                label: "View All Label",
                ui: { description: "Link text to the blog index." }
              }
            ]
          },
          {
            type: "object",
            name: "newsletterSection",
            label: "Newsletter Section",
            fields: [
              {
                type: "string",
                name: "heading",
                label: "Heading",
                ui: { description: 'Newsletter heading (e.g. "Stay in the Loop").' }
              },
              {
                type: "rich-text",
                name: "subheading",
                label: "Subheading",
                overrides: INLINE_RICH_TEXT,
                parser: SLATE_JSON_PARSER,
                ui: { description: "Description encouraging signup." }
              },
              {
                type: "string",
                name: "placeholderText",
                label: "Email Placeholder",
                ui: { description: "Placeholder text in the email input." }
              },
              {
                type: "string",
                name: "ctaLabel",
                label: "Submit Button Label",
                ui: { description: 'Button text (e.g. "Subscribe").' }
              },
              {
                type: "string",
                name: "privacyNote",
                label: "Privacy Note",
                ui: { description: 'Small text below the form (e.g. "No spam.").' }
              }
            ]
          },
          {
            type: "object",
            name: "bookPromo",
            label: "Book Promo Banner",
            fields: [
              {
                type: "string",
                name: "heading",
                label: "Heading",
                ui: { description: "The heading in the dark promo band at the bottom of the homepage." }
              },
              {
                type: "rich-text",
                name: "description",
                label: "Description",
                overrides: INLINE_RICH_TEXT,
                parser: SLATE_JSON_PARSER,
                ui: { description: "Short description line below the promo heading." }
              },
              {
                type: "string",
                name: "ctaLabel",
                label: "Button Label",
                ui: { description: 'Text on the orange button (e.g. "Order Now").' }
              },
              {
                type: "string",
                name: "ctaLink",
                label: "Button Link",
                ui: { description: 'Relative URL the button links to (e.g. "/shop/1").' }
              }
            ]
          }
        ]
      },
      // ---------------------------------------------------------------
      // About Page
      // ---------------------------------------------------------------
      {
        name: "about",
        label: "About Page",
        path: "content",
        match: { include: "about" },
        format: "json",
        ui: { router: () => "/about" },
        fields: [
          {
            type: "string",
            name: "pageTitle",
            label: "Page Title",
            ui: { description: 'The main heading on the About page (e.g. "About Corinne").' }
          },
          {
            type: "image",
            name: "portraitImage",
            label: "Portrait Image",
            ui: { description: "The photo shown on the left side of the About page. Upload a square or portrait-oriented image." }
          },
          {
            type: "rich-text",
            name: "leadText",
            label: "Lead Text",
            overrides: INLINE_RICH_TEXT,
            parser: SLATE_JSON_PARSER,
            ui: { description: "The bold introductory sentence at the top of the bio section. Keep it to 1-2 sentences." }
          },
          {
            type: "rich-text",
            name: "paragraph1",
            label: "Paragraph 1",
            overrides: INLINE_RICH_TEXT,
            parser: SLATE_JSON_PARSER,
            ui: { description: "The first body paragraph. Talks about what Corinne offers, tutorials, and YouTube." }
          },
          {
            type: "rich-text",
            name: "paragraph2",
            label: "Paragraph 2",
            overrides: INLINE_RICH_TEXT,
            parser: SLATE_JSON_PARSER,
            ui: { description: "The second body paragraph. Mentions Lheeloo & Luna, specialties, and the Blade & Quill mission." }
          },
          {
            type: "string",
            name: "skill1Label",
            label: "Skill 1 Label",
            ui: { description: 'First skill shown in the three-column grid (e.g. "Krita & Digital Painting").' }
          },
          {
            type: "string",
            name: "skill2Label",
            label: "Skill 2 Label",
            ui: { description: 'Middle skill in the three-column grid (e.g. "Character Design").' }
          },
          {
            type: "string",
            name: "skill3Label",
            label: "Skill 3 Label",
            ui: { description: 'Third skill in the three-column grid (e.g. "Color Theory").' }
          },
          {
            type: "string",
            name: "ctaPrimary",
            label: "Primary CTA Label",
            ui: { description: 'Text on the orange button at the bottom of the About page (e.g. "Get in Touch").' }
          },
          {
            type: "string",
            name: "ctaPrimaryLink",
            label: "Primary CTA Link",
            ui: { description: 'Where the primary CTA navigates to (e.g. "/contact").' }
          },
          {
            type: "string",
            name: "ctaSecondary",
            label: "Secondary CTA Label",
            ui: { description: 'Text on the outline button at the bottom of the About page (e.g. "View Gallery").' }
          },
          {
            type: "string",
            name: "ctaSecondaryLink",
            label: "Secondary CTA Link",
            ui: { description: 'Where the secondary CTA navigates to (e.g. "/gallery").' }
          }
        ]
      },
      // ---------------------------------------------------------------
      // Important Links Page (standalone review hub)
      // ---------------------------------------------------------------
      {
        name: "importantLinks",
        label: "Single Landing Pages",
        path: "content",
        match: { include: "important-links" },
        format: "json",
        ui: { router: () => "/important-links-page" },
        fields: [
          {
            type: "string",
            name: "pageTitle",
            label: "Page Title",
            ui: { description: "Browser tab title for this page." }
          },
          {
            type: "object",
            name: "featuredRelease",
            label: "Featured Release",
            ui: { description: "Highlight the newest book at the top of the page." },
            fields: [
              {
                type: "string",
                name: "eyebrow",
                label: "Eyebrow Label",
                ui: { description: 'Small label above the title (e.g. "New Featured Release").' }
              },
              {
                type: "string",
                name: "title",
                label: "Book Title",
                required: true
              },
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
                label: "Front Cover Image",
                ui: { description: "Leave empty to show the gradient placeholder cover." }
              },
              {
                type: "image",
                name: "backCoverImage",
                label: "Back Cover Image",
                ui: { description: "Optional second cover (shown alongside the front)." }
              },
              {
                type: "string",
                name: "ctaLabel",
                label: "Button Label"
              },
              {
                type: "string",
                name: "ctaHref",
                label: "Button URL",
                ui: { description: "Full URL (Amazon, shop, etc.)." }
              }
            ]
          },
          {
            type: "object",
            name: "reviewsSection",
            label: "Reviews Section",
            fields: [
              {
                type: "string",
                name: "heading",
                label: "Heading"
              },
              {
                type: "rich-text",
                name: "intro",
                label: "Intro Text",
                overrides: INLINE_RICH_TEXT,
                parser: SLATE_JSON_PARSER
              },
              {
                type: "string",
                name: "thankYou",
                label: "Thank You Message"
              },
              {
                type: "string",
                name: "ctaHeading",
                label: "CTA Section Heading"
              }
            ]
          },
          {
            type: "object",
            name: "reviewLinks",
            label: "Review Links",
            list: true,
            ui: { description: "Amazon review buttons, one per region." },
            fields: [
              {
                type: "string",
                name: "label",
                label: "Button Label",
                required: true
              },
              {
                type: "string",
                name: "href",
                label: "URL",
                required: true,
                ui: { description: "Full Amazon review URL (opens in new tab)." }
              },
              {
                type: "string",
                name: "region",
                label: "Region",
                ui: { description: "Short region code for reference (e.g. US, UK, AU)." }
              }
            ]
          },
          {
            type: "object",
            name: "kofiSection",
            label: "Ko-fi Support Section",
            fields: [
              {
                type: "string",
                name: "heading",
                label: "Heading"
              },
              {
                type: "rich-text",
                name: "body",
                label: "Body Text",
                overrides: INLINE_RICH_TEXT,
                parser: SLATE_JSON_PARSER
              },
              {
                type: "string",
                name: "ctaLabel",
                label: "Button Label"
              },
              {
                type: "string",
                name: "href",
                label: "Ko-fi URL"
              }
            ]
          }
        ]
      },
      // ---------------------------------------------------------------
      // Contact Page
      // ---------------------------------------------------------------
      {
        name: "contact",
        label: "Contact Page",
        path: "content",
        match: { include: "contact" },
        format: "json",
        ui: { router: () => "/contact" },
        fields: [
          {
            type: "string",
            name: "pageTitle",
            label: "Page Title",
            ui: { description: 'The main heading on the Contact page (e.g. "Get in Touch").' }
          },
          {
            type: "rich-text",
            name: "pageDescription",
            label: "Page Description",
            overrides: INLINE_RICH_TEXT,
            parser: SLATE_JSON_PARSER,
            ui: { description: "The introductory text below the heading, before the contact form." }
          },
          {
            type: "string",
            name: "email",
            label: "Email Address",
            ui: { description: "Shown publicly on the Contact page. Use a safe inbox, not a personal address." }
          },
          {
            type: "string",
            name: "location",
            label: "Location",
            ui: { description: 'General location shown on the Contact page (e.g. "Des Moines, IA").' }
          }
        ]
      },
      // ---------------------------------------------------------------
      // Shop Page
      // ---------------------------------------------------------------
      {
        name: "shop",
        label: "Shop Page",
        path: "content",
        match: { include: "shop" },
        format: "json",
        ui: { router: () => "/shop" },
        fields: [
          {
            type: "string",
            name: "pageTitle",
            label: "Page Title",
            ui: { description: 'The main heading on the Shop page (e.g. "Shop"). Product cards are managed under Shop Products.' }
          },
          {
            type: "rich-text",
            name: "pageDescription",
            label: "Page Description",
            overrides: INLINE_RICH_TEXT,
            parser: SLATE_JSON_PARSER,
            ui: { description: "The introductory text below the heading on the Shop page." }
          },
          {
            type: "string",
            name: "emptyHeading",
            label: "Empty State Heading",
            ui: { description: 'Heading shown when no products match the filter (e.g. "No products found").' }
          },
          {
            type: "string",
            name: "emptyDescription",
            label: "Empty State Description",
            ui: { description: "Supporting text shown when no products are available." }
          }
        ]
      },
      // ---------------------------------------------------------------
      // Gallery Page
      // ---------------------------------------------------------------
      {
        name: "gallery",
        label: "Gallery Page",
        path: "content",
        match: { include: "gallery" },
        format: "json",
        ui: { router: () => "/gallery" },
        fields: [
          {
            type: "string",
            name: "pageTitle",
            label: "Page Title",
            ui: { description: 'The main heading on the Gallery page (e.g. "Gallery"). Images are loaded from the database.' }
          },
          {
            type: "rich-text",
            name: "pageDescription",
            label: "Page Description",
            overrides: INLINE_RICH_TEXT,
            parser: SLATE_JSON_PARSER,
            ui: { description: "Introductory text below the heading. Mention your art style or invite visitors to click images." }
          },
          {
            type: "string",
            name: "emptyHeading",
            label: "Empty State Heading",
            ui: { description: 'Heading shown when the gallery has no images (e.g. "Gallery is empty").' }
          },
          {
            type: "string",
            name: "emptyDescription",
            label: "Empty State Description",
            ui: { description: "Supporting text shown when the gallery is empty." }
          }
        ]
      },
      // ---------------------------------------------------------------
      // Tutorials Page
      // ---------------------------------------------------------------
      {
        name: "tutorials",
        label: "Tutorials Page",
        path: "content",
        match: { include: "tutorials" },
        format: "json",
        ui: { router: () => "/tutorials" },
        fields: [
          {
            type: "string",
            name: "pageTitle",
            label: "Page Title",
            ui: { description: 'The main heading on the Tutorials page (e.g. "Tutorials").' }
          },
          {
            type: "rich-text",
            name: "pageDescription",
            label: "Page Description",
            overrides: INLINE_RICH_TEXT,
            parser: SLATE_JSON_PARSER,
            ui: { description: "Introductory text below the heading. Describe what kinds of tutorials are available." }
          },
          {
            type: "string",
            name: "subscribeLabel",
            label: "Subscribe Button Label",
            ui: { description: 'Text on the red YouTube button at the top of the page (e.g. "Subscribe on YouTube").' }
          },
          {
            type: "string",
            name: "youtubeUrl",
            label: "YouTube Channel URL",
            ui: { description: "The full YouTube channel URL. Used for the Subscribe button and empty-state links." }
          },
          {
            type: "string",
            name: "emptyHeading",
            label: "Empty State Heading",
            ui: { description: 'Heading shown when no tutorials match the filter (e.g. "No tutorials found").' }
          },
          {
            type: "string",
            name: "emptyDescription",
            label: "Empty State Description",
            ui: { description: "Supporting text shown when no tutorials are available." }
          }
        ]
      },
      // ---------------------------------------------------------------
      // Downloads Page
      // ---------------------------------------------------------------
      {
        name: "downloads",
        label: "Downloads Page",
        path: "content",
        match: { include: "downloads" },
        format: "json",
        ui: { router: () => "/downloads" },
        fields: [
          {
            type: "string",
            name: "pageTitle",
            label: "Page Title",
            ui: { description: 'The main heading on the Downloads page (e.g. "Free Resources").' }
          },
          {
            type: "rich-text",
            name: "pageDescription",
            label: "Page Description",
            overrides: INLINE_RICH_TEXT,
            parser: SLATE_JSON_PARSER,
            ui: { description: "Introductory text below the heading. Describe what free resources are available." }
          },
          {
            type: "string",
            name: "emptyHeading",
            label: "Empty State Heading",
            ui: { description: 'Heading shown when no downloads are available (e.g. "Free resources coming soon!").' }
          },
          {
            type: "string",
            name: "emptyDescription",
            label: "Empty State Description",
            ui: { description: "Supporting text shown when no downloads are available." }
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
              description: "Stable numeric ID for cart and checkout. Use a unique number for each product (e.g. 1, 2, 3)."
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
            overrides: INLINE_RICH_TEXT,
            parser: SLATE_JSON_PARSER,
            ui: {
              description: "Short description for shop cards and the product detail tab."
            }
          },
          {
            type: "number",
            name: "price",
            label: "Price (USD)",
            required: true,
            ui: { description: "Price in US dollars (e.g. 24.99)." }
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
              description: "Optional external purchase link. Leave blank to use site cart/checkout only."
            }
          },
          {
            type: "string",
            name: "downloadUrl",
            label: "Download URL",
            ui: { description: "Optional direct download link for digital products." }
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
            ui: { description: "When off, the product still appears but checkout may be disabled." }
          },
          {
            type: "datetime",
            name: "createdAt",
            label: "Created Date",
            ui: { description: "Used for \u201CNewest\u201D sort on the shop page." }
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
            ui: { description: "The post headline. Shows in the blog list and at the top of the post." }
          },
          {
            type: "rich-text",
            name: "excerpt",
            label: "Excerpt",
            overrides: INLINE_RICH_TEXT,
            parser: SLATE_JSON_PARSER,
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
            parser: SLATE_JSON_PARSER,
            ui: { description: "The full post content. Supports headings, images, links, and embeds." }
          }
        ]
      },
      // ---------------------------------------------------------------
      // Landing Pages (block-based)
      // ---------------------------------------------------------------
      {
        name: "landingPage",
        label: "Landing Pages",
        path: "content/pages",
        format: "json",
        ui: {
          router: ({ document }) => {
            const base = document._sys.basename?.replace(/\.json$/i, "") ?? document._sys.filename?.replace(/\.json$/i, "") ?? "";
            return `/p/${base}`;
          }
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Page Title",
            required: true,
            ui: { description: "The page title. Used in the browser tab and as a default heading." }
          },
          {
            type: "object",
            name: "blocks",
            label: "Page Sections",
            list: true,
            templates: [
              heroBlock,
              textBlock,
              imageGalleryBlock,
              ctaBandBlock,
              videoEmbedBlock,
              featureGridBlock
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
