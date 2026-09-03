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
  "education",
  "publishers",
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

/** Shared CMS typography presets — must stay in sync with textStyleFields() in tina/blocks.ts. */
const TEXT_STYLE_SELECTION =
  "textStyle { headingSize headingType headingFont align bodySize }";

/** Append textStyle selection to a block field list. */
function withTextStyle(fields: string): string {
  return `${fields} ${TEXT_STYLE_SELECTION}`;
}

/** GraphQL field selection for each block template (keyed by template name). */
const BLOCK_FIELDS: Record<string, string> = {
  hero: withTextStyle("heading subheading backgroundImage ctaLabel ctaLink"),
  text: withTextStyle("heading body"),
  imageGallery: withTextStyle("heading images { src alt caption }"),
  ctaBand: withTextStyle("heading description ctaLabel ctaLink variant"),
  videoEmbed: withTextStyle("heading youtubeUrl"),
  featureGrid: withTextStyle("heading items { icon title description }"),
  bigCta: withTextStyle(
    "eyebrow heading highlightText primaryLabel primaryLink secondaryLabel secondaryLink"
  ),
  pageHeader: withTextStyle("heading description"),
  homeHero: withTextStyle(
    "eyebrow heading subheading ctaPrimary ctaPrimaryLink ctaSecondary ctaSecondaryLink metaLine marqueeItems backgroundImage"
  ),
  pillars: withTextStyle(
    "eyebrow heading items { tag title sub cta badge link image }"
  ),
  featuredBook: withTextStyle(
    "eyebrow heading description stats { value label } ctaLabel ctaLink secondaryLabel secondaryLink"
  ),
  classesPitch: withTextStyle(
    "eyebrow heading subheading bullets metaTags ctaLabel ctaLink secondaryLabel secondaryLink"
  ),
  tutorialsStrip: withTextStyle(
    "eyebrow headingPrefix headingHighlight headingSuffix buttonLabel youtubeUrl stats { value label }"
  ),
  productStrip: withTextStyle("eyebrow heading viewAllLabel viewAllLink"),
  blogFeed: withTextStyle(
    "heading showNewsletter newsletter { eyebrow heading subheading placeholderText ctaLabel privacyNote }"
  ),
  newsletterSignup: withTextStyle(
    "eyebrow heading subheading placeholderText ctaLabel privacyNote"
  ),
  aboutHero: withTextStyle(
    "eyebrow heading leadText ctaPrimary ctaPrimaryLink ctaSecondary ctaSecondaryLink metaLine portraitImage portraitCaption deskImage deskCaption screenImage screenCaption"
  ),
  statsRow: "stats { value label }",
  story: withTextStyle(
    "number label heading paragraph1 quote paragraph2 sideImage sideCaption"
  ),
  timeline: withTextStyle(
    "number label events { year title description image }"
  ),
  cardRow: withTextStyle(
    "number label cards { tag title body image ctaLabel link }"
  ),
  shopCatalog: withTextStyle(
    "heading highlightText description showFeaturedBanner emptyHeading emptyDescription"
  ),
  galleryGrid: withTextStyle("emptyHeading emptyDescription"),
  downloadsGrid: withTextStyle("emptyHeading emptyDescription"),
  contactInfo: "email location",
  contactForm: "submitLabel",
  dummyBookRequest: withTextStyle(
    "heading description pdfUrl submitLabel successHeading successNote downloadLabel"
  ),
  marquee: "highlightText text",
  featuredRelease: withTextStyle(
    "eyebrow title description coverImage backCoverImage ctaLabel ctaHref"
  ),
  kofiSupport: withTextStyle("heading body ctaLabel href"),
  socialLinks: withTextStyle("heading body links { platform url label }"),
  reviewLinks: withTextStyle(
    "heading intro thankYou ctaHeading links { label href region }"
  ),
  heroSplitImage: withTextStyle(
    "eyebrow heading subheading featuredImage imageAlt imageCaption imagePosition ctaPrimary ctaPrimaryLink ctaSecondary ctaSecondaryLink"
  ),
  heroFullBleed: withTextStyle(
    "backgroundImage heading subheading overlay textAlign minHeight ctaLabel ctaLink"
  ),
  heroFloatingImages: withTextStyle(
    "eyebrow heading subheading images { src alt caption } ctaPrimary ctaPrimaryLink ctaSecondary ctaSecondaryLink"
  ),
  heroImageGrid: withTextStyle(
    "eyebrow heading subheading layout images { src alt caption } ctaLabel ctaLink"
  ),
  imageSpotlight: withTextStyle("eyebrow heading image alt caption aspect body"),
  imageSideBySide: withTextStyle(
    "heading leftImage { src alt caption } rightImage { src alt caption } style"
  ),
  imageMasonry: withTextStyle("heading images { src alt caption size }"),
  featuredVideo: withTextStyle("eyebrow heading description youtubeUrl buttonLabel"),
  galleryPreview: withTextStyle(
    "eyebrow heading description maxItems viewAllLabel viewAllLink"
  ),
  downloadsPreview: withTextStyle(
    "eyebrow heading description maxItems viewAllLabel viewAllLink"
  ),
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

/** Optional per-document search-listing fields (tina/seo.ts). */
const SEO_SELECTION = "seo { metaTitle metaDescription }";

/** Query for the protected core "page" collection. */
export const sitePageQuery = `
  query page($relativePath: String!) {
    page(relativePath: $relativePath) {
      ${SYS_SELECTION}
      __typename
      title
      layout
      ${SEO_SELECTION}
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
        ${SEO_SELECTION}
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
