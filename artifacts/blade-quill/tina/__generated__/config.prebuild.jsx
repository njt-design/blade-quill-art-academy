// tina/config.ts
import { defineConfig } from "tinacms";
var config_default = defineConfig({
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
      {
        name: "home",
        label: "Home Page",
        path: "content",
        match: {
          include: "home"
        },
        format: "json",
        fields: [
          {
            type: "object",
            name: "hero",
            label: "Hero Section",
            fields: [
              { type: "string", name: "heading", label: "Heading" },
              { type: "string", name: "subheading", label: "Subheading", ui: { component: "textarea" } },
              { type: "string", name: "ctaPrimary", label: "Primary CTA Label" },
              { type: "string", name: "ctaSecondary", label: "Secondary CTA Label" },
              { type: "image", name: "backgroundImage", label: "Background Image" }
            ]
          },
          {
            type: "object",
            name: "featuredSection",
            label: "Featured Section",
            fields: [
              { type: "string", name: "heading", label: "Heading" },
              { type: "string", name: "subheading", label: "Subheading" },
              { type: "string", name: "viewAllLabel", label: "View All Label" }
            ]
          },
          {
            type: "object",
            name: "artistBanner",
            label: "Artist Banner",
            fields: [
              { type: "string", name: "badge", label: "Badge Text" },
              { type: "string", name: "heading", label: "Heading" },
              { type: "string", name: "bio", label: "Bio", ui: { component: "textarea" } },
              { type: "string", name: "ctaLabel", label: "CTA Label" },
              { type: "image", name: "portraitImage", label: "Portrait Image" }
            ]
          },
          {
            type: "object",
            name: "tutorialsSection",
            label: "Tutorials Section",
            fields: [
              { type: "string", name: "heading", label: "Heading" },
              { type: "string", name: "subheading", label: "Subheading" },
              { type: "string", name: "browseAllLabel", label: "Browse All Label" }
            ]
          }
        ]
      },
      {
        name: "about",
        label: "About Page",
        path: "content",
        match: {
          include: "about"
        },
        format: "json",
        fields: [
          { type: "string", name: "pageTitle", label: "Page Title" },
          { type: "string", name: "leadText", label: "Lead Text", ui: { component: "textarea" } },
          { type: "string", name: "paragraph1", label: "Paragraph 1", ui: { component: "textarea" } },
          { type: "string", name: "paragraph2", label: "Paragraph 2", ui: { component: "textarea" } },
          { type: "string", name: "skill1Label", label: "Skill 1 Label" },
          { type: "string", name: "skill2Label", label: "Skill 2 Label" },
          { type: "string", name: "skill3Label", label: "Skill 3 Label" },
          { type: "string", name: "ctaPrimary", label: "Primary CTA Label" },
          { type: "string", name: "ctaSecondary", label: "Secondary CTA Label" }
        ]
      },
      {
        name: "contact",
        label: "Contact Page",
        path: "content",
        match: {
          include: "contact"
        },
        format: "json",
        fields: [
          { type: "string", name: "pageTitle", label: "Page Title" },
          { type: "string", name: "pageDescription", label: "Page Description", ui: { component: "textarea" } },
          { type: "string", name: "email", label: "Email Address" },
          { type: "string", name: "location", label: "Location" }
        ]
      },
      {
        name: "shop",
        label: "Shop Page",
        path: "content",
        match: {
          include: "shop"
        },
        format: "json",
        fields: [
          { type: "string", name: "pageTitle", label: "Page Title" },
          { type: "string", name: "pageDescription", label: "Page Description", ui: { component: "textarea" } }
        ]
      },
      {
        name: "gallery",
        label: "Gallery Page",
        path: "content",
        match: {
          include: "gallery"
        },
        format: "json",
        fields: [
          { type: "string", name: "pageTitle", label: "Page Title" },
          { type: "string", name: "pageDescription", label: "Page Description", ui: { component: "textarea" } }
        ]
      },
      {
        name: "tutorials",
        label: "Tutorials Page",
        path: "content",
        match: {
          include: "tutorials"
        },
        format: "json",
        fields: [
          { type: "string", name: "pageTitle", label: "Page Title" },
          { type: "string", name: "pageDescription", label: "Page Description", ui: { component: "textarea" } },
          { type: "string", name: "subscribeLabel", label: "Subscribe Label" },
          { type: "string", name: "youtubeUrl", label: "YouTube URL" }
        ]
      },
      {
        name: "downloads",
        label: "Downloads Page",
        path: "content",
        match: {
          include: "downloads"
        },
        format: "json",
        fields: [
          { type: "string", name: "pageTitle", label: "Page Title" },
          { type: "string", name: "pageDescription", label: "Page Description", ui: { component: "textarea" } }
        ]
      }
    ]
  }
});
export {
  config_default as default
};
