import { useMemo, useState } from "react";
import { Link, useLocation, useRoute } from "wouter";
import { tinaField } from "tinacms/react";
import {
  useCreateCheckoutSession,
  useGetProduct,
  useListProducts,
} from "@workspace/api-client-react";
import { useLiveProducts } from "@/hooks/use-live-content";
import { useLiveTina } from "@/hooks/use-live-tina";
import { FALLBACK_PRODUCTS } from "@/lib/fallback-data";
import { shopProductQuery } from "@/lib/product-query";
import { isInTinaEditor } from "@/lib/tina-live";
import {
  findCatalogProduct,
  getCatalogProduct,
  hasCatalogProducts,
  rawProductImages,
  resolveCatalogProducts,
  resolveProductThumbnails,
  toCatalogProduct,
  type CatalogProduct,
  type ProductReview,
} from "@/lib/products";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { checkoutErrorMessage } from "@/lib/checkout-error";
import { richTextToPlain, useSeo, type CmsSeo } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { flyToCart } from "@/lib/flyToCart";

import {
  ArtTile,
  type ArtTilePalette,
} from "@/components/site/ArtTile";
import { BookCover } from "@/components/site/BookCover";
import { Btn } from "@/components/site/Btn";
import { BtnGroup } from "@/components/site/BtnGroup";
import { CmsStatusPill } from "@/components/site/CmsStatusPill";
import { RichText } from "@/components/site/RichText";
import { InkUnderline } from "@/components/site/InkUnderline";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Reveal";

type TabKey = "description" | "inside" | "reviews" | "shipping";

const DEFAULT_REVIEWS: ProductReview[] = [
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
];

const DEFAULT_TRUST = [
  "Instant download",
  "Stripe secure checkout",
  "30-day returns",
];

function starString(count: number): string {
  const n = Math.round(Math.max(0, Math.min(5, count)));
  return "★".repeat(n) || "★";
}

const PALETTE_BY_INDEX: ArtTilePalette[] = [
  "warm",
  "rose",
  "violet",
  "twilight",
  "moss",
];

export default function ProductDetail() {
  const [, params] = useRoute("/shop/:id");
  const [, setLocation] = useLocation();
  const routeParam = params?.id ?? "";

  // Prefer slug from the catalog so Tina visual editing binds to the right file.
  const catalog = useLiveProducts();
  const catalogMatch = useMemo(
    () => findCatalogProduct(catalog, routeParam),
    [catalog, routeParam]
  );
  const productSlug =
    catalogMatch?.slug ||
    getCatalogProduct(routeParam)?.slug ||
    (routeParam && Number.isNaN(Number(routeParam)) ? routeParam : "");

  const seedRaw = productSlug
    ? (getCatalogProduct(productSlug) as unknown as Record<string, unknown> | undefined)
    : undefined;
  // Seed shape matches the GraphQL document (image, not imageUrl).
  const seedDoc = seedRaw
    ? {
        __typename: "ShopProduct" as const,
        productId: seedRaw.id,
        name: seedRaw.name,
        description: seedRaw.description,
        price: seedRaw.price,
        category: seedRaw.category,
        image: seedRaw.imageUrl,
        galleryImages: Array.isArray(seedRaw.galleryImages)
          ? seedRaw.galleryImages
          : [],
        spreadImages: Array.isArray(seedRaw.spreadImages)
          ? seedRaw.spreadImages
          : [],
        pageCopy: seedRaw.pageCopy,
        trustBullets: seedRaw.trustBullets,
        details: seedRaw.details,
        reviews: seedRaw.reviews,
        tabs: seedRaw.tabs,
        related: seedRaw.related,
        gumroadUrl: seedRaw.gumroadUrl,
        downloadUrl: seedRaw.downloadUrl,
        amazonUrl: seedRaw.amazonUrl,
        googlePlayUrl: seedRaw.googlePlayUrl,
        featured: seedRaw.featured,
        inStock: seedRaw.inStock,
        createdAt: seedRaw.createdAt,
        seo: seedRaw.seo,
      }
    : {};

  const { data: tinaData, freshness } = useLiveTina({
    query: shopProductQuery,
    variables: { relativePath: productSlug ? `${productSlug}.json` : "__missing__.json" },
    data: { shopProduct: seedDoc },
  });

  const tinaProduct = useMemo(() => {
    const doc = tinaData.shopProduct as Record<string, unknown> | undefined;
    if (!doc || !productSlug || !doc.name) return null;
    return toCatalogProduct(productSlug, {
      ...doc,
      // GraphQL uses `image`; catalog mapper accepts image or imageUrl.
      image: doc.image ?? doc.imageUrl,
    });
  }, [tinaData, productSlug]);

  const numericId = Number(routeParam);
  const useApi =
    !tinaProduct &&
    !catalogMatch &&
    routeParam !== "" &&
    !Number.isNaN(numericId);

  const {
    data: apiProduct,
    isLoading: apiLoading,
    error: apiError,
  } = useGetProduct(numericId, {
    query: { enabled: useApi },
  });
  const { data: allProductsRaw } = useListProducts(
    {},
    { query: { enabled: !hasCatalogProducts() } }
  );
  const allProducts = useMemo(
    () => resolveCatalogProducts(allProductsRaw, FALLBACK_PRODUCTS, catalog),
    [allProductsRaw, catalog]
  );

  const product = useMemo((): CatalogProduct | undefined => {
    if (tinaProduct) return tinaProduct;
    if (catalogMatch) return catalogMatch;
    if (apiProduct) {
      return {
        ...apiProduct,
        slug: String(apiProduct.id),
        galleryImages: [],
        spreadImages: [],
      };
    }
    return findCatalogProduct(catalog, routeParam);
  }, [tinaProduct, catalogMatch, apiProduct, catalog, routeParam]);

  /** Tina document used for data-tina-field bindings (visual editing). */
  const tinaDoc = (tinaData.shopProduct ?? null) as Record<string, unknown> | null;

  const seo = (tinaDoc?.seo ?? null) as CmsSeo | null;
  useSeo({
    title: seo?.metaTitle || product?.name,
    description: seo?.metaDescription || richTextToPlain(product?.description),
    image: product?.imageUrl,
    type: "product",
  });

  const isLoading = useApi && apiLoading && !product;
  const error = useApi ? apiError : undefined;

  const { toast } = useToast();
  const { mutate: checkout, isPending: isCheckingOut } =
    useCreateCheckoutSession({
      mutation: {
        onSuccess: (data: { url?: string }) => {
          if (data?.url) window.location.href = data.url;
        },
        onError: (err: unknown) => {
          toast({
            variant: "destructive",
            title: "Checkout isn't available right now",
            description: checkoutErrorMessage(err),
          });
        },
      },
    });

  const { addItem } = useCart();
  const [thumb, setThumb] = useState(0);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<TabKey>("description");

  const related = useMemo(() => {
    if (!product) return [];
    return allProducts.filter((p) => p.id !== product.id).slice(0, 4);
  }, [allProducts, product]);

  if (isLoading) {
    return (
      <div className="page pt-32 pb-24">
        <div className="bq-container">
          <div
            className="animate-pulse rounded-2xl"
            style={{ background: "var(--paper-3)", height: 480 }}
          />
        </div>
      </div>
    );
  }
  if (error || !product) {
    return (
      <div className="page pt-32 pb-24 text-center">
        <p style={{ color: "var(--ink-mute)" }}>Product not found.</p>
        <Btn
          kind="ghost"
          className="mt-6"
          onClick={() => setLocation("/shop")}
        >
          ← Back to shop
        </Btn>
      </div>
    );
  }

  const isBook = product.category === "physical";
  const inEditor = isInTinaEditor();
  const copy = product.pageCopy;
  const palette: ArtTilePalette =
    PALETTE_BY_INDEX[product.id % PALETTE_BY_INDEX.length];
  const editorGallery = inEditor
    ? rawProductImages(tinaDoc, "galleryImages")
    : product.galleryImages;
  let thumbnails = resolveProductThumbnails(
    { ...product, galleryImages: editorGallery },
    { includeEmpty: inEditor }
  );
  if (inEditor && thumbnails.length < 5) {
    thumbnails = [
      ...thumbnails,
      ...Array.from({ length: 5 - thumbnails.length }, () => ({
        src: "",
        alt: "",
      })),
    ];
  }
  const editorSpreads = inEditor
    ? rawProductImages(tinaDoc, "spreadImages")
    : product.spreadImages;
  const spreads =
    inEditor && editorSpreads.length === 0
      ? Array.from({ length: 6 }, () => ({ src: "", alt: "" }))
      : editorSpreads;
  const activeThumb = thumbnails[thumb] ?? thumbnails[0] ?? null;
  const activeSrc = activeThumb?.src || product.imageUrl;
  const activeAlt = activeThumb?.alt || product.name;
  const showBookCover =
    isBook && (!activeSrc || activeSrc === product.imageUrl);
  const eyebrow =
    copy?.eyebrow || (product.featured ? "FEATURED" : "FROM THE STUDIO");
  const coverSubtitle = copy ? copy.coverSubtitle ?? "" : "C. HADAWAY";
  const trustBullets =
    product.trustBullets ?? DEFAULT_TRUST.map((label) => ({ label }));
  const reviewItems = product.reviews ? product.reviews.items : DEFAULT_REVIEWS;
  const reviewRating = product.reviews?.rating ?? 4.9;
  const reviewCountLabel = product.reviews?.countLabel ?? "142 reviews";
  const pageTabs: Array<{ key: TabKey; label: string; show: boolean }> = [
    {
      key: "description",
      label: product.tabs?.descriptionLabel || "Description",
      show: true,
    },
    {
      key: "inside",
      label: product.tabs?.insideLabel || "Inside",
      show:
        product.tabs?.showInside !== false &&
        (inEditor || spreads.length > 0),
    },
    {
      key: "reviews",
      label: product.tabs?.reviewsLabel || "Reviews",
      show:
        product.tabs?.showReviews !== false &&
        (inEditor || reviewItems.length > 0),
    },
    {
      key: "shipping",
      label: product.tabs?.shippingLabel || "Shipping & License",
      show:
        product.tabs?.showShipping !== false &&
        (inEditor ||
          Boolean(copy?.shippingNote) ||
          Boolean(copy?.supportEmail) ||
          !copy),
    },
  ];
  const visibleTabs = pageTabs.filter((t) => t.show);
  const currentTab = visibleTabs.some((t) => t.key === tab) ? tab : "description";

  return (
    <div className="page pt-12 pb-24">
      <CmsStatusPill freshness={freshness} />
      <div className="bq-container py-5">
        <div className="eyebrow" style={{ color: "var(--ink-mute)" }}>
          <Link href="/" className="link-ink">
            HOME
          </Link>
          <span className="mx-2">/</span>
          <Link href="/shop" className="link-ink">
            SHOP
          </Link>
          <span className="mx-2">/</span>
          <span style={{ color: "var(--ink)" }}>
            {product.name.toUpperCase()}
          </span>
        </div>
      </div>

      <section className="pt-8 pb-16">
        <div className="bq-container">
          <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16">
            <div>
              <Reveal>
                <div
                  className="relative flex items-center justify-center overflow-hidden h-[min(60vh,560px)] sm:h-[560px]"
                  data-tina-field={
                    tinaDoc
                      ? tinaField(
                          tinaDoc,
                          thumb === 0 || !product.galleryImages[thumb - 1]
                            ? "image"
                            : "galleryImages"
                        )
                      : undefined
                  }
                  style={{
                    borderRadius: 20,
                    background: showBookCover
                      ? "var(--paper-2)"
                      : "transparent",
                    boxShadow: "var(--sh-paper)",
                  }}
                >
                  {showBookCover ? (
                    <BookCover
                      title={product.name}
                      subtitle={coverSubtitle}
                      palette="warm"
                      src={activeSrc}
                      alt={activeAlt}
                      width={300}
                      height={420}
                      style={{
                        transform: `scale(${1 + thumb * 0.04}) rotate(${
                          thumb * 2 - 4
                        }deg)`,
                        transition: "transform .5s var(--e-out)",
                      }}
                    />
                  ) : (
                    <ArtTile
                      palette={palette}
                      width="100%"
                      height="100%"
                      src={activeSrc || undefined}
                      alt={activeAlt}
                      label={product.name}
                      radius={20}
                    />
                  )}
                </div>
              </Reveal>

              <div
                className="grid grid-cols-4 sm:grid-cols-5 gap-3 mt-4"
                data-tina-field={
                  tinaDoc ? tinaField(tinaDoc, "galleryImages") : undefined
                }
              >
                {thumbnails.map((slot, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setThumb(i)}
                    className="relative overflow-hidden p-0 border-0 bg-transparent cursor-pointer"
                    data-tina-field={
                      tinaDoc
                        ? i === 0
                          ? tinaField(tinaDoc, "image")
                          : tinaField(tinaDoc, "galleryImages", i - 1)
                        : undefined
                    }
                    style={{
                      borderRadius: 10,
                      transform:
                        i === thumb ? "scale(1.04)" : "scale(1)",
                      transition: "transform .2s var(--e-out)",
                    }}
                    aria-label={
                      slot?.alt
                        ? `Thumbnail ${i + 1}: ${slot.alt}`
                        : `Thumbnail ${i + 1}`
                    }
                  >
                    <ArtTile
                      palette={PALETTE_BY_INDEX[i]}
                      width="100%"
                      height={84}
                      src={slot?.src || undefined}
                      alt={slot?.alt || `${product.name} thumbnail ${i + 1}`}
                      label={`${i + 1}`}
                      radius={10}
                      style={{ opacity: i === thumb ? 1 : 0.7 }}
                    />
                    {i === thumb && (
                      <span
                        aria-hidden
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          border: "2.5px solid var(--maroon)",
                          borderRadius: 10,
                        }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Reveal>
                <div
                  className="eyebrow-grad mb-4"
                  data-tina-field={
                    tinaDoc ? tinaField(tinaDoc, "pageCopy") : undefined
                  }
                >
                  {eyebrow}
                </div>
              </Reveal>
              <Reveal>
                <h1
                  className="mb-4"
                  data-tina-field={tinaDoc ? tinaField(tinaDoc, "name") : undefined}
                  style={{
                    fontSize: "clamp(36px, 4.5vw, 52px)",
                    lineHeight: 1.05,
                  }}
                >
                  {product.name}
                </h1>
              </Reveal>
              <Reveal>
                <div
                  className="mb-7"
                  data-tina-field={
                    tinaDoc ? tinaField(tinaDoc, "description") : undefined
                  }
                  style={{ color: "var(--ink-mute)", fontSize: 15 }}
                >
                  <RichText value={product.description} />
                </div>
              </Reveal>

              {isBook ? (
                <Reveal>
                  <div
                    className="flex flex-wrap gap-9 mb-8 pb-6"
                    style={{ borderBottom: "1px solid rgba(46,34,34,0.1)" }}
                  >
                    <div>
                      <div
                        data-tina-field={
                          tinaDoc ? tinaField(tinaDoc, "price") : undefined
                        }
                        style={{
                          fontFamily: "var(--f-serif)",
                          fontSize: 36,
                          color: "var(--maroon)",
                        }}
                      >
                        ${product.price.toFixed(2)}
                      </div>
                      <div
                        className="eyebrow"
                        data-tina-field={
                          tinaDoc ? tinaField(tinaDoc, "pageCopy") : undefined
                        }
                      >
                        {copy?.paperbackLabel || "PAPERBACK"}
                      </div>
                    </div>
                    <div>
                      <div
                        data-tina-field={
                          tinaDoc ? tinaField(tinaDoc, "pageCopy") : undefined
                        }
                        style={{
                          fontFamily: "var(--f-serif)",
                          fontSize: 36,
                          color: "var(--ink)",
                        }}
                      >
                        {copy?.ebookLabel || "eBook"}
                      </div>
                      <div
                        className="eyebrow"
                        data-tina-field={
                          tinaDoc ? tinaField(tinaDoc, "pageCopy") : undefined
                        }
                      >
                        {copy?.ebookStoresLabel || "GUMROAD · GOOGLE PLAY"}
                      </div>
                    </div>
                  </div>
                </Reveal>
              ) : (
                <Reveal>
                  <div className="flex flex-wrap items-baseline gap-4 mb-8">
                    <span
                      className="grad-text-warm"
                      data-tina-field={
                        tinaDoc ? tinaField(tinaDoc, "price") : undefined
                      }
                      style={{
                        fontFamily: "var(--f-serif)",
                        fontSize: 48,
                      }}
                    >
                      ${product.price.toFixed(2)}
                    </span>
                    {!product.inStock && (
                      <span
                        style={{
                          fontFamily: "var(--f-mono)",
                          fontSize: 11,
                          background: "rgba(184,74,94,0.12)",
                          color: "var(--maroon-deep)",
                          padding: "5px 10px",
                          borderRadius: 999,
                          letterSpacing: "0.08em",
                        }}
                      >
                        OUT OF STOCK
                      </span>
                    )}
                  </div>
                </Reveal>
              )}

              {isBook ? (
                <Reveal>
                  {/* BtnGroup: primary first in DOM — renders on the right on
                      desktop, on top when stacked. Exactly one primary exists:
                      Gumroad when available, otherwise Amazon. */}
                  <BtnGroup className="mb-8">
                    {product.gumroadUrl ? (
                      <Btn
                        kind="primary"
                        size="lg"
                        iconRight="→"
                        href={product.gumroadUrl}
                        external
                      >
                        {copy?.gumroadButtonLabel || "Get eBook on Gumroad"}
                      </Btn>
                    ) : product.amazonUrl ? (
                      <Btn
                        kind="primary"
                        size="lg"
                        iconRight="→"
                        href={product.amazonUrl}
                        external
                        analyticsPlacement="product_detail"
                      >
                        {copy?.amazonButtonLabel || "Buy paperback on Amazon"}
                      </Btn>
                    ) : null}
                    {product.googlePlayUrl ? (
                      <Btn
                        kind="outline"
                        size="lg"
                        href={product.googlePlayUrl}
                        external
                      >
                        {copy?.googlePlayButtonLabel ||
                          "Get eBook on Google Play"}
                      </Btn>
                    ) : null}
                    {product.gumroadUrl && product.amazonUrl ? (
                      <Btn
                        kind="outline"
                        size="lg"
                        iconRight="→"
                        href={product.amazonUrl}
                        external
                        analyticsPlacement="product_detail"
                      >
                        {copy?.amazonButtonLabel || "Buy paperback on Amazon"}
                      </Btn>
                    ) : null}
                  </BtnGroup>
                </Reveal>
              ) : (
                <>

                  <Reveal>
                    <div className="flex items-stretch gap-3 mb-3.5">
                      <div
                        className="inline-flex items-center overflow-hidden"
                        style={{
                          border: "1.5px solid var(--ink)",
                          borderRadius: 999,
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => setQty(Math.max(1, qty - 1))}
                          className="w-11 h-[52px] text-lg cursor-pointer bg-transparent"
                          style={{ color: "var(--ink)" }}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <div
                          className="w-8 text-center"
                          style={{
                            fontFamily: "var(--f-sans)",
                            fontWeight: 600,
                            fontSize: 15,
                          }}
                        >
                          {qty}
                        </div>
                        <button
                          type="button"
                          onClick={() => setQty(qty + 1)}
                          className="w-11 h-[52px] text-lg cursor-pointer bg-transparent"
                          style={{ color: "var(--ink)" }}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <Btn
                        kind="outline"
                        size="lg"
                        className="flex-1 h-[52px]"
                        disabled={!product.inStock}
                        onClick={(e) => {
                          addItem(
                            {
                              id: product.id,
                              slug: product.slug,
                              name: product.name,
                              price: product.price,
                              imageUrl: product.imageUrl,
                              category: product.category,
                            },
                            qty
                          );
                          flyToCart(e.currentTarget);
                        }}
                      >
                        {!product.inStock
                          ? "Out of stock"
                          : copy?.addToCartLabel || "Add to cart"}
                      </Btn>
                      <Btn
                        kind="primary"
                        size="lg"
                        iconRight="→"
                        className="flex-1 h-[52px]"
                        disabled={isCheckingOut || !product.inStock}
                        onClick={() => {
                          if (!product.inStock) return;
                          checkout({
                            data: {
                              productId: product.id,
                              quantity: qty,
                              productSlug: product.slug,
                            },
                          });
                        }}
                      >
                        {isCheckingOut
                          ? "Redirecting…"
                          : copy?.buyNowLabel || "Buy now"}
                      </Btn>
                    </div>
                  </Reveal>

                  <Reveal>
                    {trustBullets.length > 0 && (
                    <div
                      className="flex flex-wrap gap-x-7 gap-y-3 py-5"
                      data-tina-field={
                        tinaDoc ? tinaField(tinaDoc, "trustBullets") : undefined
                      }
                      style={{
                        borderTop: "1px solid rgba(46,34,34,0.1)",
                        borderBottom: "1px solid rgba(46,34,34,0.1)",
                      }}
                    >
                      {trustBullets.map((item, i) => (
                        <div
                          key={`${item.label}-${i}`}
                          className="flex items-center gap-2.5"
                        >
                          <span
                            aria-hidden
                            className="block w-2 h-2 rounded-full"
                            style={{
                              background: [
                                "var(--maroon)",
                                "var(--gold)",
                                "var(--taupe)",
                              ][i % 3],
                            }}
                          />
                          <span className="eyebrow">{item.label}</span>
                        </div>
                      ))}
                    </div>
                    )}
                  </Reveal>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section
        className="py-10"
        style={{ borderTop: "1px solid rgba(46,34,34,0.08)" }}
      >
        <div className="bq-container">
          <div
            className="flex flex-wrap gap-9 relative"
            data-tina-field={tinaDoc ? tinaField(tinaDoc, "tabs") : undefined}
            style={{
              borderBottom: "1px solid rgba(46,34,34,0.08)",
              marginBottom: 36,
            }}
          >
            {visibleTabs.map((t) => {
              const active = currentTab === t.key;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTab(t.key)}
                  className="relative bg-transparent border-0 cursor-pointer py-4 px-0"
                  style={{
                    fontFamily: "var(--f-sans)",
                    fontWeight: active ? 600 : 500,
                    fontSize: 15,
                    color: active
                      ? "var(--ink)"
                      : "var(--ink-mute)",
                    transition: "color .2s",
                  }}
                >
                  {t.label}
                  {active && (
                    <span
                      className="absolute left-0 right-0"
                      style={{ bottom: -1, height: 6 }}
                    >
                      <InkUnderline color="var(--maroon)" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="min-h-[260px]">
            {currentTab === "description" && (
              <div className="grid lg:grid-cols-[2fr_1fr] gap-10 lg:gap-14">
                <div
                  style={{
                    fontSize: 16,
                    color: "var(--ink-soft)",
                    lineHeight: 1.8,
                  }}
                >
                  <RichText value={product.description} className="mb-4" />
                  {copy ? (
                    <div
                      data-tina-field={
                        tinaDoc ? tinaField(tinaDoc, "pageCopy") : undefined
                      }
                    >
                      <RichText value={copy.fullDescription} />
                    </div>
                  ) : (
                    <>
                      <p className="mb-4">
                        {isBook
                          ? "Paperback copies are available on Amazon. eBooks are on Gumroad and Google Play — choose whichever store works best for you."
                          : "Every page in the studio gets made in Krita from sketch to final color. Includes process notes, character studies, and a short epilogue from the author."}
                      </p>
                      {!isBook && (
                        <p>
                          Digital editions are delivered by email immediately after
                          checkout.
                        </p>
                      )}
                    </>
                  )}
                </div>
                <div
                  className="self-start p-7"
                  data-tina-field={
                    tinaDoc ? tinaField(tinaDoc, "details") : undefined
                  }
                  style={{
                    background: "var(--paper-2)",
                    borderRadius: 18,
                  }}
                >
                  <div className="eyebrow mb-4">DETAILS</div>
                  {[
                    [
                      "Format",
                      product.details?.format ||
                        (isBook ? "Paperback & eBook" : "Digital download"),
                    ],
                    ...(isBook ? [] : [["License", "Personal use"] as const]),
                    ["Category", product.category],
                    ...(isBook
                      ? []
                      : [["In stock", product.inStock ? "Yes" : "No"] as const]),
                    ...(product.details
                      ? product.details.studio
                        ? [["Studio", product.details.studio] as const]
                        : []
                      : [["Studio", "Nantes, France"] as const]),
                    ...(product.details?.rows ?? []).map(
                      (row) => [row.label, row.value] as const
                    ),
                  ].map(([k, v]) => (
                    <div
                      key={k}
                      className="flex justify-between py-3 text-sm"
                      style={{
                        borderBottom:
                          "1px dashed rgba(46,34,34,0.12)",
                      }}
                    >
                      <span style={{ color: "var(--ink-mute)" }}>{k}</span>
                      <span
                        style={{ fontWeight: 600, color: "var(--ink)" }}
                      >
                        {v}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentTab === "inside" && (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
                {spreads.map((spread, i) => {
                  const label = isBook ? `SPREAD ${i + 1}` : `PREVIEW ${i + 1}`;
                  return (
                    <div
                      key={i}
                      data-tina-field={
                        tinaDoc
                          ? tinaField(tinaDoc, "spreadImages", i)
                          : undefined
                      }
                    >
                      <ArtTile
                        palette={PALETTE_BY_INDEX[i % 5]}
                        width="100%"
                        height={220}
                        label={spread.src ? spread.alt || label : label}
                        src={spread.src || undefined}
                        alt={spread.alt || label}
                      />
                    </div>
                  );
                })}
              </div>
            )}

            {currentTab === "reviews" && (
              <div data-tina-field={tinaDoc ? tinaField(tinaDoc, "reviews") : undefined}>
                <div className="flex flex-wrap items-baseline gap-4 mb-8">
                  <span
                    style={{
                      fontFamily: "var(--f-serif)",
                      fontSize: 56,
                      color: "var(--ink)",
                    }}
                  >
                    {Number.isInteger(reviewRating)
                      ? reviewRating
                      : reviewRating.toFixed(1)}
                  </span>
                  <span
                    style={{ color: "var(--gold)", fontSize: 22 }}
                  >
                    {starString(reviewRating)}
                  </span>
                  {reviewCountLabel ? (
                    <span
                      style={{ color: "var(--ink-mute)", fontSize: 14 }}
                    >
                      {reviewCountLabel}
                    </span>
                  ) : null}
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                  {reviewItems.map((r, i) => (
                    <div
                      key={`${r.name}-${i}`}
                      className="p-6"
                      data-tina-field={
                        tinaDoc ? tinaField(tinaDoc, "reviews") : undefined
                      }
                      style={{
                        background: "var(--paper-2)",
                        borderRadius: 16,
                      }}
                    >
                      <div
                        className="mb-2.5"
                        style={{ color: "var(--gold)" }}
                      >
                        {starString(r.stars)}
                      </div>
                      <p
                        className="mb-3.5 italic"
                        style={{
                          fontSize: 14,
                          color: "var(--ink-soft)",
                          lineHeight: 1.7,
                        }}
                      >
                        “{r.body}”
                      </p>
                      <div className="eyebrow">
                        {r.date ? `${r.name} · ${r.date}` : r.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentTab === "shipping" && (
              <div
                className="max-w-[640px]"
                style={{
                  fontSize: 16,
                  color: "var(--ink-soft)",
                  lineHeight: 1.8,
                }}
              >
                {copy ? (
                  <>
                    <div
                      data-tina-field={
                        tinaDoc ? tinaField(tinaDoc, "pageCopy") : undefined
                      }
                    >
                      <RichText value={copy.shippingNote} className="mb-4" />
                    </div>
                    {copy.supportEmail ? (
                      <p
                        data-tina-field={
                          tinaDoc ? tinaField(tinaDoc, "pageCopy") : undefined
                        }
                      >
                        Questions? Email{" "}
                        <a
                          href={`mailto:${copy.supportEmail}`}
                          className="link-ink"
                          style={{ color: "var(--maroon)" }}
                        >
                          {copy.supportEmail}
                        </a>
                        .
                      </p>
                    ) : null}
                  </>
                ) : (
                  <>
                    <p className="mb-4">
                      {isBook
                        ? "Paperback copies are sold on Amazon. eBooks are available on Gumroad and Google Play — instant delivery, no shipping."
                        : "Digital downloads are delivered instantly to your email. License terms allow personal use; commercial licenses are available for studios and freelancers."}
                    </p>
                    <p>
                      Questions? Email{" "}
                      <a
                        href="mailto:hello@bladeandquillacademy.com"
                        className="link-ink"
                        style={{ color: "var(--maroon)" }}
                      >
                        hello@bladeandquillacademy.com
                      </a>
                      .
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {related.length > 0 && product.related?.show !== false && (
        <section
          className="py-20"
          data-tina-field={tinaDoc ? tinaField(tinaDoc, "related") : undefined}
          style={{ background: "var(--paper-2)" }}
        >
          <div className="bq-container">
            <div className="mb-10">
              <Reveal>
                <div className="eyebrow-grad mb-3">
                  {product.related?.eyebrow || "MORE FROM THE STUDIO"}
                </div>
              </Reveal>
              <Reveal>
                <h2 style={{ fontSize: "clamp(28px, 3.6vw, 40px)" }}>
                  {product.related?.heading || "You might also like"}
                </h2>
              </Reveal>
            </div>
            <Reveal stagger>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
                {related.map((rel, i) => (
                  <ProductCard key={rel.id} product={rel} index={i} />
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      )}
    </div>
  );
}
