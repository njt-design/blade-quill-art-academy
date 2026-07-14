/**
 * Generated GraphQL queries for block-based pages.
 *
 * Two Tina collections share content/pages:
 *  - "page"        → core site pages (home, about, shop, ...) — plain fields
 *  - "landingPage" → client-created pages — template-based (blank/event/...)
 *
 * Queries are generated from BLOCK_FIELDS so every block template stays
 * editable in Tina visual editing without hand-writing hundreds of inline
 * fragments. (This module is intentionally free of Vite-only APIs so it can
 * also run under Node for schema validation.)
 */

/** Must stay in sync with CORE_PAGE_SLUGS in tina/config.ts. */
export const CORE_PAGE_SLUGS = [
  "home",
  "about",
  "contact",
  "shop",
  "gallery",
  "downloads",
  "important-links",
] as const;

export function isCorePageSlug(slug: string): boolean {
  return (CORE_PAGE_SLUGS as readonly string[]).includes(slug);
}

/** Route served by each core page (mirrors the Tina router config). */
export function corePageRoute(slug: string): string {
  if (slug === "home") return "/";
  if (slug === "important-links") return "/important-links-page";
  return `/${slug}`;
}

/** GraphQL field selection for each block template (keyed by template name). */
const BLOCK_FIELDS: Record<string, string> = {
  hero: "heading subheading backgroundImage ctaLabel ctaLink",
  text: "heading body",
  imageGallery: "heading images { src alt caption }",
  ctaBand: "heading description ctaLabel ctaLink variant",
  videoEmbed: "heading youtubeUrl",
  featureGrid: "heading items { icon title description }",
  bigCta:
    "eyebrow heading highlightText primaryLabel primaryLink secondaryLabel secondaryLink",
  pageHeader: "heading description",
  homeHero:
    "eyebrow heading subheading ctaPrimary ctaPrimaryLink ctaSecondary ctaSecondaryLink metaLine marqueeItems",
  pillars: "eyebrow heading items { tag title sub cta badge link image }",
  featuredBook:
    "eyebrow heading description stats { value label } ctaLabel ctaLink secondaryLabel secondaryLink",
  classesPitch:
    "eyebrow heading subheading bullets metaTags ctaLabel ctaLink secondaryLabel secondaryLink",
  tutorialsStrip:
    "eyebrow headingPrefix headingHighlight headingSuffix buttonLabel youtubeUrl stats { value label }",
  productStrip: "eyebrow heading viewAllLabel viewAllLink",
  blogFeed:
    "heading showNewsletter newsletter { eyebrow heading subheading placeholderText ctaLabel privacyNote }",
  newsletterSignup:
    "eyebrow heading subheading placeholderText ctaLabel privacyNote",
  aboutHero:
    "eyebrow heading leadText ctaPrimary ctaPrimaryLink ctaSecondary ctaSecondaryLink metaLine portraitImage portraitCaption",
  statsRow: "stats { value label }",
  story: "number label heading paragraph1 quote paragraph2 sideCaption",
  timeline: "number label events { year title description }",
  cardRow: "number label cards { tag title body ctaLabel link }",
  shopCatalog:
    "heading highlightText description showFeaturedBanner emptyHeading emptyDescription",
  galleryGrid: "emptyHeading emptyDescription",
  downloadsGrid: "emptyHeading emptyDescription",
  contactInfo: "email location",
  contactForm: "submitLabel",
  marquee: "highlightText text",
  featuredRelease:
    "eyebrow title description coverImage backCoverImage ctaLabel ctaHref",
  kofiSupport: "heading body ctaLabel href",
  socialLinks: "links { platform url label }",
  reviewLinks: "heading intro thankYou ctaHeading links { label href region }",
};

export function pascalCase(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

/** Inline fragments for every block template under a given GraphQL type prefix. */
function blocksSelection(prefix: string): string {
  return Object.entries(BLOCK_FIELDS)
    .map(
      ([name, fields]) =>
        `... on ${prefix}${pascalCase(name)} { __typename ${fields} }`
    )
    .join("\n        ");
}

const SYS_SELECTION =
  "... on Document { _sys { filename basename hasReferences breadcrumbs path relativePath extension } id }";

/** Query for the protected core "page" collection. */
export const sitePageQuery = `
  query page($relativePath: String!) {
    page(relativePath: $relativePath) {
      ${SYS_SELECTION}
      __typename
      title
      layout
      blocks {
        ${blocksSelection("PageBlocks")}
      }
    }
  }
`;

/** Template names of the "landingPage" collection (client-created pages). */
export const NEW_PAGE_TEMPLATES = ["blank", "event", "promo", "info", "linkInBio"];

/** Query for the template-based "landingPage" collection. */
export const landingPageQuery = `
  query landingPage($relativePath: String!) {
    landingPage(relativePath: $relativePath) {
      ${SYS_SELECTION}
      __typename
      ${NEW_PAGE_TEMPLATES.map(
        (t) => `... on LandingPage${pascalCase(t)} {
        title
        layout
        blocks {
          ${blocksSelection(`LandingPage${pascalCase(t)}Blocks`)}
        }
      }`
      ).join("\n      ")}
    }
  }
`;

/** __typename Tina generates for a landing-page document, from its _template. */
export function landingPageTypename(template?: string): string {
  return `LandingPage${pascalCase(template || "blank")}`;
}
