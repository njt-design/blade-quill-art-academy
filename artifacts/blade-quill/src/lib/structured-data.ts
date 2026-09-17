/**
 * Schema.org JSON-LD structured data — how the site's entities (Corinne,
 * her books/products, blog posts) get into Google's Knowledge Graph and
 * qualify for rich results.
 *
 * Everything is injected at runtime with the current origin so it works on
 * the production domain, subdomains (newrelease.*), and preview deploys
 * alike. Google renders JavaScript, so runtime injection is indexed the same
 * as the rest of this SPA's head tags (see seo.ts).
 *
 * Entities reference each other by stable `@id` URLs so crawlers see one
 * connected graph: WebSite → published by Organization → founded by Person
 * (Corinne) → who authored each BlogPosting and sells each Product.
 */
import { useEffect } from "react";
import { toAbsoluteUrl } from "@/lib/seo";

const SITE_NAME = "Blade & Quill Art Academy";

/** Public profiles that identify Corinne / the brand across the web. */
const SAME_AS = [
  "https://www.youtube.com/c/BladeQuillartacademy",
  "https://www.instagram.com/bladequillartacademy/",
  "https://ko-fi.com/bladeandquill",
];

function personId(): string {
  return `${window.location.origin}/#person`;
}

function organizationId(): string {
  return `${window.location.origin}/#organization`;
}

function websiteId(): string {
  return `${window.location.origin}/#website`;
}

/** Upsert (or remove, when data is null) a JSON-LD script tag keyed by name. */
function upsertJsonLdScript(key: string, data: object | null): void {
  const existing = document.head.querySelector<HTMLScriptElement>(
    `script[type="application/ld+json"][data-jsonld="${key}"]`
  );
  if (!data) {
    existing?.remove();
    return;
  }
  let el = existing;
  if (!el) {
    el = document.createElement("script");
    el.type = "application/ld+json";
    el.dataset.jsonld = key;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

/**
 * Keep a JSON-LD script in the document head while the caller is mounted.
 * Pass null to emit nothing (e.g. content still loading / not found).
 * Values update live as CMS data changes in the Tina editor.
 */
export function useJsonLd(key: string, data: object | null): void {
  const serialized = data ? JSON.stringify(data) : null;
  useEffect(() => {
    upsertJsonLdScript(key, serialized ? JSON.parse(serialized) : null);
    return () => upsertJsonLdScript(key, null);
  }, [key, serialized]);
}

/** Site-wide graph: WebSite + Organization + Person, linked by @id. */
function siteGraph(): object {
  const origin = window.location.origin;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": websiteId(),
        name: SITE_NAME,
        url: `${origin}/`,
        publisher: { "@id": organizationId() },
        inLanguage: "en",
      },
      {
        "@type": "Organization",
        "@id": organizationId(),
        name: SITE_NAME,
        url: `${origin}/`,
        founder: { "@id": personId() },
        sameAs: SAME_AS,
      },
      {
        "@type": "Person",
        "@id": personId(),
        name: "Corinne Hadaway",
        alternateName: "Corinne",
        description:
          "French author and illustrator, creator of the Lheeloo & Luna series and the Blade & Quill Art Academy Krita tutorials.",
        jobTitle: "Author & Illustrator",
        image: toAbsoluteUrl("/images/Profile-Corinne_About-page.jpg"),
        url: `${origin}/about`,
        worksFor: { "@id": organizationId() },
        sameAs: SAME_AS,
        knowsAbout: [
          "Digital art",
          "Krita",
          "Illustration",
          "Children's books",
        ],
      },
    ],
  };
}

/** Inject the site-wide entity graph once for the whole app. */
export function useSiteJsonLd(): void {
  useEffect(() => {
    upsertJsonLdScript("site", siteGraph());
  }, []);
}

export interface BlogPostingJsonLdInput {
  title: string;
  description?: string;
  /** Site path or absolute URL. */
  image?: string;
  /** ISO date string. */
  publishedAt?: string;
  tags?: string[];
  /** Canonical URL of the post (defaults to the current address). */
  url?: string;
}

export function blogPostingJsonLd(input: BlogPostingJsonLdInput): object {
  const url = input.url ?? window.location.href;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    headline: input.title,
    ...(input.description ? { description: input.description } : {}),
    ...(input.image ? { image: toAbsoluteUrl(input.image) } : {}),
    ...(input.publishedAt ? { datePublished: input.publishedAt } : {}),
    ...(input.tags?.length ? { keywords: input.tags.join(", ") } : {}),
    author: { "@id": personId() },
    publisher: { "@id": organizationId() },
    inLanguage: "en",
    isPartOf: { "@id": websiteId() },
  };
}

export interface ProductJsonLdInput {
  name: string;
  /** Plain-text description (rich text already flattened). */
  description?: string;
  /** Cover + gallery images; site paths or absolute URLs. */
  images: string[];
  /** Stable identifier used as the SKU. */
  sku?: string;
  price: number;
  inStock: boolean;
  /** Canonical URL of the product page (defaults to the current address). */
  url?: string;
}

export function productJsonLd(input: ProductJsonLdInput): object {
  const url = input.url ?? window.location.href;
  const images = input.images
    .map((src) => src?.trim())
    .filter((src): src is string => Boolean(src))
    .map((src) => toAbsoluteUrl(src));
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: input.name,
    ...(input.description ? { description: input.description } : {}),
    ...(images.length ? { image: images } : {}),
    ...(input.sku ? { sku: input.sku } : {}),
    url,
    brand: { "@type": "Brand", name: SITE_NAME },
    offers: {
      "@type": "Offer",
      url,
      price: input.price.toFixed(2),
      priceCurrency: "USD",
      availability: input.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: { "@id": organizationId() },
    },
  };
}
