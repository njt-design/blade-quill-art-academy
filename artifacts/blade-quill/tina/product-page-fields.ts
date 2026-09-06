import type { TinaField } from "tinacms";
import {
  charLimit,
  INLINE_RICH_TEXT,
  RICH_TEXT_TEMPLATES,
  SLATE_JSON_PARSER,
} from "./blocks";

/** Build a Slate rich-text value from one or more paragraphs. */
export function richText(...paragraphs: string[]) {
  return {
    type: "root",
    children: paragraphs.map((text) => ({
      type: "p",
      children: [{ type: "text", text }],
    })),
  };
}

const emptyThumb = (alt: string) => ({ src: "", alt });

/**
 * Starter values for a new Shop Product — matches the current product page
 * so Corinne can replace copy instead of inventing the layout from scratch.
 */
export const SHOP_PRODUCT_DEFAULT_ITEM = {
  name: "New product",
  description: richText("A short description for shop cards and the top of the product page."),
  price: 15,
  category: "digital",
  image: "",
  galleryImages: [
    emptyThumb("Thumbnail 2"),
    emptyThumb("Thumbnail 3"),
    emptyThumb("Thumbnail 4"),
    emptyThumb("Thumbnail 5"),
  ],
  spreadImages: [
    emptyThumb("Preview 1"),
    emptyThumb("Preview 2"),
    emptyThumb("Preview 3"),
    emptyThumb("Preview 4"),
    emptyThumb("Preview 5"),
    emptyThumb("Preview 6"),
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
    ebookStoresLabel: "GUMROAD · GOOGLE PLAY",
    addToCartLabel: "Add to cart",
    buyNowLabel: "Buy now",
    gumroadButtonLabel: "Get eBook on Gumroad",
    amazonButtonLabel: "Buy paperback on Amazon",
    googlePlayButtonLabel: "Get eBook on Google Play",
  },
  purchaseOptions: {
    groupLabel: "LICENSE",
    options: [
      { name: "Personal", meta: "$15" },
      { name: "Commercial", meta: "$37" },
    ],
  },
  trustBullets: [
    { label: "Instant download" },
    { label: "Stripe secure checkout" },
    { label: "30-day returns" },
  ],
  details: {
    format: "",
    studio: "Nantes, France",
    rows: [],
  },
  reviews: {
    rating: 4.9,
    countLabel: "142 reviews",
    items: [
      {
        name: "Maya R.",
        date: "MAY 2026",
        body: "Absolutely beautiful. Worth every penny — even better in print than I'd imagined.",
        stars: 5,
      },
      {
        name: "Tom K.",
        date: "APR 2026",
        body: "I bought the bundle and use the brushes every day now. Everything just fits together.",
        stars: 5,
      },
      {
        name: "Liv H.",
        date: "APR 2026",
        body: "Quiet, gentle, and visually stunning. A book I keep on my desk to flip through.",
        stars: 5,
      },
      {
        name: "David S.",
        date: "MAR 2026",
        body: "Corinne explains the why behind each decision. So much better than copying tutorials.",
        stars: 5,
      },
    ],
  },
  tabs: {
    descriptionLabel: "Description",
    insideLabel: "Inside",
    reviewsLabel: "Reviews",
    shippingLabel: "Shipping & License",
    showInside: true,
    showReviews: true,
    showShipping: true,
  },
  related: {
    eyebrow: "MORE FROM THE STUDIO",
    heading: "You might also like",
    show: true,
  },
};

/** All product-page regions that were previously hardcoded in the frontend. */
export const PRODUCT_PAGE_FIELDS: TinaField[] = [
  {
    type: "object",
    name: "pageCopy",
    label: "Page Copy & Buttons",
    ui: {
      description:
        "Headlines, extra description, button labels, and book price labels on this product page.",
    },
    fields: [
      {
        type: "string",
        name: "eyebrow",
        label: "Eyebrow (above the title)",
        ui: charLimit(
          40,
          "Small label above the product name. Leave blank to use FEATURED or FROM THE STUDIO automatically."
        ),
      },
      {
        type: "string",
        name: "coverSubtitle",
        label: "Cover Author Line (books)",
        ui: charLimit(
          40,
          "Shown on the decorative book cover when no extra gallery image is selected (e.g. C. HADAWAY)."
        ),
      },
      {
        type: "rich-text",
        name: "fullDescription",
        label: "Full Description (Description tab)",
        overrides: INLINE_RICH_TEXT,
        parser: SLATE_JSON_PARSER,
        templates: RICH_TEXT_TEMPLATES,
        ui: {
          description:
            "Longer copy under the Description tab. The short Description field above still shows under the title and on shop cards.",
        },
      },
      {
        type: "rich-text",
        name: "shippingNote",
        label: "Shipping & License Copy",
        overrides: INLINE_RICH_TEXT,
        parser: SLATE_JSON_PARSER,
        templates: RICH_TEXT_TEMPLATES,
        ui: {
          description: "Body copy for the Shipping & License tab.",
        },
      },
      {
        type: "string",
        name: "supportEmail",
        label: "Support Email",
        ui: charLimit(
          80,
          "Shown as a mailto link at the end of the Shipping & License tab. Leave blank to hide it."
        ),
      },
      {
        type: "string",
        name: "paperbackLabel",
        label: "Paperback Price Label (books)",
        ui: charLimit(24, "Small label under the price on book pages (e.g. PAPERBACK)."),
      },
      {
        type: "string",
        name: "ebookLabel",
        label: "eBook Title (books)",
        ui: charLimit(24, "The word shown next to the paperback price (e.g. eBook)."),
      },
      {
        type: "string",
        name: "ebookStoresLabel",
        label: "eBook Stores Line (books)",
        ui: charLimit(40, "Small line under the eBook title (e.g. GUMROAD · GOOGLE PLAY)."),
      },
      {
        type: "string",
        name: "addToCartLabel",
        label: "Add to Cart Button",
        ui: charLimit(24, "Digital / bundle / curriculum products."),
      },
      {
        type: "string",
        name: "buyNowLabel",
        label: "Buy Now Button",
        ui: charLimit(24, "Digital / bundle / curriculum products."),
      },
      {
        type: "string",
        name: "gumroadButtonLabel",
        label: "Gumroad Button (books)",
        ui: charLimit(40),
      },
      {
        type: "string",
        name: "amazonButtonLabel",
        label: "Amazon Button (books)",
        ui: charLimit(40),
      },
      {
        type: "string",
        name: "googlePlayButtonLabel",
        label: "Google Play Button (books)",
        ui: charLimit(40),
      },
    ],
  },
  {
    type: "object",
    name: "purchaseOptions",
    label: "License / Format Tiles",
    ui: {
      description:
        "The selectable tiles under the price (Personal / Commercial, Hardcover / Ebook, etc.). These are for display — Stripe still charges the Price field above.",
    },
    fields: [
      {
        type: "string",
        name: "groupLabel",
        label: "Group Label",
        ui: charLimit(24, "Small heading above the tiles (e.g. LICENSE, FORMAT, OPTIONS)."),
      },
      {
        type: "object",
        name: "options",
        label: "Tiles",
        list: true,
        ui: {
          itemProps: (item: Record<string, unknown> | undefined) => ({
            label:
              [item?.name, item?.meta].filter(Boolean).join(" · ") || "Tile",
          }),
          defaultItem: { name: "Option", meta: "" },
          description:
            "Add, remove, or rewrite the tiles. Leave this list empty to use automatic tiles from the product category and price.",
        },
        fields: [
          {
            type: "string",
            name: "name",
            label: "Name",
            required: true,
            ui: charLimit(32, "e.g. Personal, Commercial, Hardcover."),
          },
          {
            type: "string",
            name: "meta",
            label: "Price / Note",
            ui: charLimit(40, "The smaller line under the name, e.g. $15 or $14 · instant."),
          },
        ],
      },
    ],
  },
  {
    type: "object",
    name: "trustBullets",
    label: "Trust Badges",
    list: true,
    ui: {
      description:
        "The small checklist under Add to cart (Instant download, Stripe, returns). Remove every item to hide the row.",
      itemProps: (item: Record<string, unknown> | undefined) => ({
        label: (item?.label as string) || "Badge",
      }),
      defaultItem: { label: "New badge" },
    },
    fields: [
      {
        type: "string",
        name: "label",
        label: "Label",
        required: true,
        ui: charLimit(40),
      },
    ],
  },
  {
    type: "object",
    name: "details",
    label: "Details Box",
    ui: {
      description:
        "The DETAILS card on the Description tab. Format and Studio can be edited; extra rows are added below them.",
    },
    fields: [
      {
        type: "string",
        name: "format",
        label: "Format",
        ui: charLimit(
          40,
          "Overrides the automatic format line (e.g. Paperback & eBook). Leave blank to keep the automatic value."
        ),
      },
      {
        type: "string",
        name: "studio",
        label: "Studio",
        ui: charLimit(40, "e.g. Nantes, France. Leave blank to hide this row."),
      },
      {
        type: "object",
        name: "rows",
        label: "Extra Detail Rows",
        list: true,
        ui: {
          itemProps: (item: Record<string, unknown> | undefined) => ({
            label:
              [item?.label, item?.value].filter(Boolean).join(" · ") || "Row",
          }),
          defaultItem: { label: "", value: "" },
        },
        fields: [
          {
            type: "string",
            name: "label",
            label: "Label",
            required: true,
            ui: charLimit(24, "Left side, e.g. Pages or Age."),
          },
          {
            type: "string",
            name: "value",
            label: "Value",
            required: true,
            ui: charLimit(40, "Right side, e.g. 64 or Ages 8–12."),
          },
        ],
      },
    ],
  },
  {
    type: "object",
    name: "reviews",
    label: "Reviews",
    ui: {
      description:
        "The Reviews tab: overall rating plus each review card. Remove every review to hide the tab on the live site.",
    },
    fields: [
      {
        type: "number",
        name: "rating",
        label: "Overall Rating",
        ui: { description: "The big number (e.g. 4.9). Use 0–5." },
      },
      {
        type: "string",
        name: "countLabel",
        label: "Review Count Label",
        ui: charLimit(32, "e.g. 142 reviews."),
      },
      {
        type: "object",
        name: "items",
        label: "Review Cards",
        list: true,
        ui: {
          itemProps: (item: Record<string, unknown> | undefined) => ({
            label:
              [item?.name, item?.date].filter(Boolean).join(" · ") || "Review",
          }),
          defaultItem: {
            name: "A reader",
            date: "",
            body: "",
            stars: 5,
          },
        },
        fields: [
          {
            type: "string",
            name: "name",
            label: "Name",
            required: true,
            ui: charLimit(40),
          },
          {
            type: "string",
            name: "date",
            label: "Date",
            ui: charLimit(24, "e.g. MAY 2026."),
          },
          {
            type: "string",
            name: "body",
            label: "Review",
            ui: {
              component: "textarea",
              ...charLimit(400, "The quote on the card."),
            },
          },
          {
            type: "number",
            name: "stars",
            label: "Stars",
            ui: { description: "1 to 5. Defaults to 5 if left blank." },
          },
        ],
      },
    ],
  },
  {
    type: "object",
    name: "tabs",
    label: "Tabs",
    ui: {
      description: "Rename or hide the tabs under the product (Description is always shown).",
    },
    fields: [
      {
        type: "string",
        name: "descriptionLabel",
        label: "Description Tab Label",
        ui: charLimit(24),
      },
      {
        type: "string",
        name: "insideLabel",
        label: "Inside Tab Label",
        ui: charLimit(24),
      },
      {
        type: "string",
        name: "reviewsLabel",
        label: "Reviews Tab Label",
        ui: charLimit(24),
      },
      {
        type: "string",
        name: "shippingLabel",
        label: "Shipping Tab Label",
        ui: charLimit(32),
      },
      {
        type: "boolean",
        name: "showInside",
        label: "Show Inside Tab",
        ui: {
          description:
            "Off hides the Look Inside / Previews tab even if images are uploaded.",
        },
      },
      {
        type: "boolean",
        name: "showReviews",
        label: "Show Reviews Tab",
      },
      {
        type: "boolean",
        name: "showShipping",
        label: "Show Shipping & License Tab",
      },
    ],
  },
  {
    type: "object",
    name: "related",
    label: "Related Products",
    ui: {
      description: "The “you might also like” row at the bottom of the page.",
    },
    fields: [
      {
        type: "boolean",
        name: "show",
        label: "Show Related Products",
      },
      {
        type: "string",
        name: "eyebrow",
        label: "Eyebrow",
        ui: charLimit(40, "Small line above the heading."),
      },
      {
        type: "string",
        name: "heading",
        label: "Heading",
        ui: charLimit(60),
      },
    ],
  },
];
