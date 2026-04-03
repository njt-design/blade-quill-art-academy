import { defineConfig, type Template } from "tinacms";

// ---------------------------------------------------------------------------
// Block templates for landing pages
// ---------------------------------------------------------------------------

const heroBlock: Template = {
  name: "hero",
  label: "Hero Section",
  fields: [
    {
      type: "string",
      name: "heading",
      label: "Heading",
      ui: { description: "Large heading text for this hero section." },
    },
    {
      type: "string",
      name: "subheading",
      label: "Subheading",
      ui: {
        component: "textarea",
        description: "Supporting text shown below the heading.",
      },
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

const textBlock: Template = {
  name: "text",
  label: "Text Section",
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
      ui: { description: "Rich text content. Supports headings, bold, links, images, and more." },
    },
  ],
};

const imageGalleryBlock: Template = {
  name: "imageGallery",
  label: "Image Gallery",
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
      fields: [
        { type: "image", name: "src", label: "Image" },
        { type: "string", name: "alt", label: "Alt Text" },
        { type: "string", name: "caption", label: "Caption (optional)" },
      ],
    },
  ],
};

const ctaBandBlock: Template = {
  name: "ctaBand",
  label: "CTA Band",
  fields: [
    {
      type: "string",
      name: "heading",
      label: "Heading",
      ui: { description: "Bold heading for the call-to-action strip." },
    },
    {
      type: "string",
      name: "description",
      label: "Description",
      ui: { description: "Supporting line below the heading." },
    },
    {
      type: "string",
      name: "ctaLabel",
      label: "Button Label",
    },
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

const videoEmbedBlock: Template = {
  name: "videoEmbed",
  label: "Video Embed",
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
      ui: { description: "Full YouTube video URL (e.g. https://www.youtube.com/watch?v=abc123). The embed ID is extracted automatically." },
    },
  ],
};

const featureGridBlock: Template = {
  name: "featureGrid",
  label: "Feature Grid",
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
      fields: [
        {
          type: "string",
          name: "icon",
          label: "Icon Name",
          ui: { description: 'Lucide icon name (e.g. "Brush", "Star", "BookOpen"). Leave blank for no icon.' },
        },
        { type: "string", name: "title", label: "Title" },
        {
          type: "string",
          name: "description",
          label: "Description",
          ui: { component: "textarea" },
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Main config
// ---------------------------------------------------------------------------

export default defineConfig({
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
                ui: { description: "The large heading at the very top of the homepage. Use a newline to create a line break." },
              },
              {
                type: "string",
                name: "subheading",
                label: "Subheading",
                ui: { component: "textarea", description: "The sentence below the main heading. Describes what the site offers and who Corinne is." },
              },
              {
                type: "string",
                name: "ctaPrimary",
                label: "Primary CTA Label",
                ui: { description: 'Text on the orange button in the hero section (e.g. "Explore the Shop").' },
              },
              {
                type: "string",
                name: "ctaSecondary",
                label: "Secondary CTA Label",
                ui: { description: 'Text on the outline button next to the primary CTA (e.g. "Watch Tutorials").' },
              },
              {
                type: "image",
                name: "backgroundImage",
                label: "Background Image",
                ui: { description: "Optional hero background image. Currently not displayed but available for future use." },
              },
            ],
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
                ui: { description: 'Section heading above the thumbnail grid (e.g. "Latest").' },
              },
              {
                type: "string",
                name: "viewAllLabel",
                label: "View All Label",
                ui: { description: 'Link text on the right side (e.g. "View all").' },
              },
            ],
          },
          {
            type: "object",
            name: "featuredSection",
            label: "Featured Products Section",
            fields: [
              {
                type: "string",
                name: "heading",
                label: "Heading",
                ui: { description: 'The heading above the featured product cards (e.g. "Featured Artworks").' },
              },
              {
                type: "string",
                name: "subheading",
                label: "Subheading",
                ui: { description: "Short description below the heading in the featured products area." },
              },
              {
                type: "string",
                name: "viewAllLabel",
                label: "View All Label",
                ui: { description: 'The "View All" link text on the right side of the featured section header.' },
              },
            ],
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
                ui: { description: 'Small badge shown above the artist heading (e.g. "Author & Illustrator").' },
              },
              {
                type: "string",
                name: "heading",
                label: "Heading",
                ui: { description: 'The artist banner heading (e.g. "Meet Corinne").' },
              },
              {
                type: "string",
                name: "bio",
                label: "Bio",
                ui: { component: "textarea", description: "A short bio paragraph introducing the artist. Shown next to the portrait image." },
              },
              {
                type: "string",
                name: "ctaLabel",
                label: "CTA Label",
                ui: { description: 'Text on the button in the artist banner (e.g. "Read My Story"). Links to the About page.' },
              },
              {
                type: "image",
                name: "portraitImage",
                label: "Portrait Image",
                ui: { description: "The portrait photo shown in the artist banner section on the homepage." },
              },
            ],
          },
          {
            type: "object",
            name: "tutorialsSection",
            label: "Tutorials Section",
            fields: [
              {
                type: "string",
                name: "heading",
                label: "Heading",
                ui: { description: 'The heading above the tutorial preview cards (e.g. "Learn Digital Painting").' },
              },
              {
                type: "string",
                name: "subheading",
                label: "Subheading",
                ui: { description: "Short description of tutorial topics, shown below the tutorials heading." },
              },
              {
                type: "string",
                name: "browseAllLabel",
                label: "Browse All Label",
                ui: { description: 'The "Browse All" link text on the right side of the tutorials section header.' },
              },
            ],
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
                ui: { description: "The heading in the dark promo band at the bottom of the homepage." },
              },
              {
                type: "string",
                name: "description",
                label: "Description",
                ui: { description: "Short description line below the promo heading." },
              },
              {
                type: "string",
                name: "ctaLabel",
                label: "Button Label",
                ui: { description: 'Text on the orange button (e.g. "Order Now").' },
              },
              {
                type: "string",
                name: "ctaLink",
                label: "Button Link",
                ui: { description: 'Relative URL the button links to (e.g. "/shop/1").' },
              },
            ],
          },
        ],
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
            ui: { description: 'The main heading on the About page (e.g. "About Corinne").' },
          },
          {
            type: "image",
            name: "portraitImage",
            label: "Portrait Image",
            ui: { description: "The photo shown on the left side of the About page. Upload a square or portrait-oriented image." },
          },
          {
            type: "string",
            name: "leadText",
            label: "Lead Text",
            ui: { component: "textarea", description: "The bold introductory sentence at the top of the bio section. Keep it to 1-2 sentences." },
          },
          {
            type: "string",
            name: "paragraph1",
            label: "Paragraph 1",
            ui: { component: "textarea", description: "The first body paragraph. Talks about what Corinne offers, tutorials, and YouTube." },
          },
          {
            type: "string",
            name: "paragraph2",
            label: "Paragraph 2",
            ui: { component: "textarea", description: "The second body paragraph. Mentions Lheeloo & Luna, specialties, and the Blade & Quill mission." },
          },
          {
            type: "string",
            name: "skill1Label",
            label: "Skill 1 Label",
            ui: { description: 'First skill shown in the three-column grid (e.g. "Krita & Digital Painting").' },
          },
          {
            type: "string",
            name: "skill2Label",
            label: "Skill 2 Label",
            ui: { description: 'Middle skill in the three-column grid (e.g. "Character Design").' },
          },
          {
            type: "string",
            name: "skill3Label",
            label: "Skill 3 Label",
            ui: { description: 'Third skill in the three-column grid (e.g. "Color Theory").' },
          },
          {
            type: "string",
            name: "ctaPrimary",
            label: "Primary CTA Label",
            ui: { description: 'Text on the orange button at the bottom of the About page (e.g. "Get in Touch").' },
          },
          {
            type: "string",
            name: "ctaPrimaryLink",
            label: "Primary CTA Link",
            ui: { description: 'Where the primary CTA navigates to (e.g. "/contact").' },
          },
          {
            type: "string",
            name: "ctaSecondary",
            label: "Secondary CTA Label",
            ui: { description: 'Text on the outline button at the bottom of the About page (e.g. "View Gallery").' },
          },
          {
            type: "string",
            name: "ctaSecondaryLink",
            label: "Secondary CTA Link",
            ui: { description: 'Where the secondary CTA navigates to (e.g. "/gallery").' },
          },
        ],
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
            ui: { description: 'The main heading on the Contact page (e.g. "Get in Touch").' },
          },
          {
            type: "string",
            name: "pageDescription",
            label: "Page Description",
            ui: { component: "textarea", description: "The introductory text below the heading, before the contact form." },
          },
          {
            type: "string",
            name: "email",
            label: "Email Address",
            ui: { description: "Shown publicly on the Contact page. Use a safe inbox, not a personal address." },
          },
          {
            type: "string",
            name: "location",
            label: "Location",
            ui: { description: 'General location shown on the Contact page (e.g. "Des Moines, IA").' },
          },
        ],
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
            ui: { description: 'The main heading on the Shop page (e.g. "Shop"). Products are loaded from the database.' },
          },
          {
            type: "string",
            name: "pageDescription",
            label: "Page Description",
            ui: { component: "textarea", description: "The introductory text below the heading on the Shop page." },
          },
          {
            type: "string",
            name: "emptyHeading",
            label: "Empty State Heading",
            ui: { description: 'Heading shown when no products match the filter (e.g. "No products found").' },
          },
          {
            type: "string",
            name: "emptyDescription",
            label: "Empty State Description",
            ui: { description: "Supporting text shown when no products are available." },
          },
        ],
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
            ui: { description: 'The main heading on the Gallery page (e.g. "Gallery"). Images are loaded from the database.' },
          },
          {
            type: "string",
            name: "pageDescription",
            label: "Page Description",
            ui: { component: "textarea", description: "Introductory text below the heading. Mention your art style or invite visitors to click images." },
          },
          {
            type: "string",
            name: "emptyHeading",
            label: "Empty State Heading",
            ui: { description: 'Heading shown when the gallery has no images (e.g. "Gallery is empty").' },
          },
          {
            type: "string",
            name: "emptyDescription",
            label: "Empty State Description",
            ui: { description: "Supporting text shown when the gallery is empty." },
          },
        ],
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
            ui: { description: 'The main heading on the Tutorials page (e.g. "Tutorials").' },
          },
          {
            type: "string",
            name: "pageDescription",
            label: "Page Description",
            ui: { component: "textarea", description: "Introductory text below the heading. Describe what kinds of tutorials are available." },
          },
          {
            type: "string",
            name: "subscribeLabel",
            label: "Subscribe Button Label",
            ui: { description: 'Text on the red YouTube button at the top of the page (e.g. "Subscribe on YouTube").' },
          },
          {
            type: "string",
            name: "youtubeUrl",
            label: "YouTube Channel URL",
            ui: { description: "The full YouTube channel URL. Used for the Subscribe button and empty-state links." },
          },
          {
            type: "string",
            name: "emptyHeading",
            label: "Empty State Heading",
            ui: { description: 'Heading shown when no tutorials match the filter (e.g. "No tutorials found").' },
          },
          {
            type: "string",
            name: "emptyDescription",
            label: "Empty State Description",
            ui: { description: "Supporting text shown when no tutorials are available." },
          },
        ],
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
            ui: { description: 'The main heading on the Downloads page (e.g. "Free Resources").' },
          },
          {
            type: "string",
            name: "pageDescription",
            label: "Page Description",
            ui: { component: "textarea", description: "Introductory text below the heading. Describe what free resources are available." },
          },
          {
            type: "string",
            name: "emptyHeading",
            label: "Empty State Heading",
            ui: { description: 'Heading shown when no downloads are available (e.g. "Free resources coming soon!").' },
          },
          {
            type: "string",
            name: "emptyDescription",
            label: "Empty State Description",
            ui: { description: "Supporting text shown when no downloads are available." },
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
            ui: { description: "The post headline. Shows in the blog list and at the top of the post." },
          },
          {
            type: "string",
            name: "excerpt",
            label: "Excerpt",
            ui: { component: "textarea", description: "A 1-2 sentence summary shown on blog list cards." },
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
            ui: { description: "Topic tags for filtering (e.g. 'Krita', 'Behind the Scenes')." },
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            ui: { description: "The full post content. Supports headings, images, links, and embeds." },
          },
        ],
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
            const base =
              document._sys.basename?.replace(/\.json$/i, "") ??
              document._sys.filename?.replace(/\.json$/i, "") ??
              "";
            return `/p/${base}`;
          },
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Page Title",
            required: true,
            ui: { description: "The page title. Used in the browser tab and as a default heading." },
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
              featureGridBlock,
            ],
          },
        ],
      },
    ],
  },
});
