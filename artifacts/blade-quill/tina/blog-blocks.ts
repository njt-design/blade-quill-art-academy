import type { Template } from "tinacms";
import {
  charLimit,
  textBlock,
  imageGalleryBlock,
  imageSideBySideBlock,
  videoEmbedBlock,
  ctaBandBlock,
} from "./blocks";

const INLINE_RICH_TEXT = {
  toolbar: ["bold", "italic", "link", "ul", "ol"] as Array<
    "bold" | "italic" | "link" | "ul" | "ol"
  >,
  showFloatingToolbar: true,
};

const SLATE_JSON_PARSER = { type: "slatejson" as const };

const rt = (text: string) => ({
  type: "root",
  children: [{ type: "p", children: [{ type: "text", text }] }],
});

/**
 * Shared UI config for blog section templates — preview image + sidebar label.
 * Reuses existing admin-preview SVGs where a close match exists.
 */
function blogUi(
  previewName: string,
  label: string,
  titleField: string | null,
  defaultItem?: Record<string, unknown>
) {
  return {
    previewSrc: `/admin-previews/${previewName}.svg`,
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
// Blog-only section templates
// ---------------------------------------------------------------------------

export const blogHeadingBlock: Template = {
  name: "heading",
  label: "Heading",
  ui: blogUi("heading", "Heading", "text", {
    number: "",
    text: "Section heading",
    level: "h2",
  }),
  fields: [
    {
      type: "string",
      name: "number",
      label: "Section Number (optional)",
      ui: charLimit(4, 'Optional number shown before the heading (e.g. "1" or "01").'),
    },
    {
      type: "string",
      name: "text",
      label: "Heading",
      required: true,
      ui: charLimit(90, "The section title."),
    },
    {
      type: "string",
      name: "level",
      label: "Heading Level",
      options: [
        { value: "h2", label: "Section Heading (H2)" },
        { value: "h3", label: "Sub-heading (H3)" },
      ],
      ui: {
        description: "H2 for main sections, H3 for subsections. The post title is already H1.",
      },
    },
  ],
};

/** Blog text — same fields as page text, friendlier label for articles. */
export const blogTextBlock: Template = {
  ...textBlock,
  label: "Text",
  ui: blogUi("text", "Text", "heading", {
    heading: "",
    body: rt("Write your paragraph here. You can add lists, links, and inline images."),
  }),
};

export const blogSpacerBlock: Template = {
  name: "spacer",
  label: "Spacer",
  ui: blogUi("spacer", "Spacer", "size", {
    size: "medium",
  }),
  fields: [
    {
      type: "string",
      name: "size",
      label: "Size",
      options: [
        { value: "small", label: "Small" },
        { value: "medium", label: "Medium" },
        { value: "large", label: "Large" },
      ],
      ui: {
        description:
          "Adds vertical breathing room between sections. This is spacing only — not a page break.",
      },
    },
  ],
};

export const blogDividerBlock: Template = {
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
        { value: "dots", label: "Dots" },
      ],
      ui: { description: "Soft visual break between topics." },
    },
  ],
};

export const blogImageBlock: Template = {
  name: "image",
  label: "Image",
  ui: blogUi("imageSpotlight", "Image", "caption", {
    alt: "",
    caption: "",
    width: "content",
    aspect: "auto",
  }),
  fields: [
    {
      type: "image",
      name: "src",
      label: "Image",
      ui: {
        description: "Upload into images/blog/ when possible.",
      },
    },
    {
      type: "string",
      name: "alt",
      label: "Alt Text",
      ui: charLimit(125, "Short image description for screen readers."),
    },
    {
      type: "string",
      name: "caption",
      label: "Caption (optional)",
      ui: charLimit(120),
    },
    {
      type: "string",
      name: "width",
      label: "Width",
      options: [
        { value: "content", label: "Content width (matches text)" },
        { value: "wide", label: "Wide (slightly wider than text)" },
      ],
      ui: { description: "How wide the image sits in the article column." },
    },
    {
      type: "string",
      name: "aspect",
      label: "Aspect Ratio",
      options: [
        { value: "auto", label: "Natural (use image’s own ratio)" },
        { value: "landscape", label: "Landscape (16:10)" },
        { value: "square", label: "Square (1:1)" },
        { value: "portrait", label: "Portrait (3:4)" },
      ],
    },
  ],
};

export const blogCalloutBlock: Template = {
  name: "callout",
  label: "Callout / Tip",
  ui: blogUi("callout", "Callout", "title", {
    title: "Tip",
    body: rt("A short tip, note, or warning for the reader."),
    tone: "tip",
  }),
  fields: [
    {
      type: "string",
      name: "title",
      label: "Title",
      ui: charLimit(40, 'e.g. "Tip", "Note", or "Remember".'),
    },
    {
      type: "rich-text",
      name: "body",
      label: "Body",
      overrides: INLINE_RICH_TEXT,
      parser: SLATE_JSON_PARSER,
      ui: { description: "The callout content. Keep it short." },
    },
    {
      type: "string",
      name: "tone",
      label: "Tone",
      options: [
        { value: "tip", label: "Tip (warm highlight)" },
        { value: "note", label: "Note (neutral)" },
        { value: "warning", label: "Warning (stronger)" },
      ],
    },
  ],
};

/** Side-by-side images for before/after — reuse page fields, article-friendly label. */
export const blogImagePairBlock: Template = {
  ...imageSideBySideBlock,
  label: "Image Pair",
  ui: blogUi("imageSideBySide", "Image Pair", "heading", {
    heading: "",
    leftImage: {},
    rightImage: {},
    style: "clean",
  }),
};

export const blogGalleryBlock: Template = {
  ...imageGalleryBlock,
  label: "Gallery",
  ui: blogUi("imageGallery", "Gallery", "heading", {
    heading: "",
    images: [],
  }),
};

export const blogVideoBlock: Template = {
  ...videoEmbedBlock,
  label: "Video",
  ui: blogUi("videoEmbed", "Video", "heading", {
    heading: "",
    youtubeUrl: "",
  }),
};

export const blogCtaBlock: Template = {
  ...ctaBandBlock,
  label: "End CTA",
  ui: blogUi("ctaBand", "End CTA", "heading", {
    heading: "Ready for the next step?",
    description: rt("One short supporting line goes here."),
    ctaLabel: "Get Started",
    ctaLink: "/contact",
    variant: "light",
  }),
};

/**
 * Curated section templates for blog posts — article reading layout, not the
 * full marketing page block library.
 */
export const BLOG_BLOCKS: Template[] = [
  blogHeadingBlock,
  blogTextBlock,
  blogSpacerBlock,
  blogDividerBlock,
  blogImageBlock,
  blogImagePairBlock,
  blogGalleryBlock,
  blogVideoBlock,
  blogCalloutBlock,
  blogCtaBlock,
];
