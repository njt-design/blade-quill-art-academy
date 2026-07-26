import { useMemo, useState } from "react";
import { Link, useLocation, useRoute } from "wouter";
import {
  useCreateCheckoutSession,
  useGetProduct,
  useListProducts,
} from "@workspace/api-client-react";
import { useLiveProducts } from "@/hooks/use-live-content";
import { FALLBACK_PRODUCTS } from "@/lib/fallback-data";
import {
  findCatalogProduct,
  hasCatalogProducts,
  resolveCatalogProducts,
  type CatalogProduct,
} from "@/lib/products";
import { useCart } from "@/hooks/useCart";
import { cn } from "@/lib/utils";
import { flyToCart } from "@/lib/flyToCart";

import {
  ArtTile,
  type ArtTilePalette,
} from "@/components/site/ArtTile";
import { BookCover } from "@/components/site/BookCover";
import { Btn } from "@/components/site/Btn";
import { RichText } from "@/components/site/RichText";
import { InkUnderline } from "@/components/site/InkUnderline";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Reveal";

type TabKey = "description" | "inside" | "reviews" | "shipping";

interface FormatOption {
  name: string;
  meta: string;
}

function formatsForProduct(p: CatalogProduct): {
  label: string;
  options: FormatOption[];
} {
  switch (p.category) {
    case "physical":
      return {
        label: "FORMAT",
        options: [
          { name: "Hardcover", meta: `$${p.price.toFixed(0)} · signed` },
          { name: "Ebook", meta: "$14 · instant" },
        ],
      };
    case "digital":
      return {
        label: "LICENSE",
        options: [
          { name: "Personal", meta: `$${p.price.toFixed(0)}` },
          { name: "Commercial", meta: `$${(p.price * 2.5).toFixed(0)}` },
        ],
      };
    case "curriculum":
      return {
        label: "INCLUDED",
        options: [
          { name: "Self-paced", meta: `$${p.price.toFixed(0)}` },
          { name: "Live cohort", meta: `$${(p.price * 1.4).toFixed(0)}` },
        ],
      };
    default:
      return {
        label: "OPTIONS",
        options: [{ name: "Standard", meta: `$${p.price.toFixed(0)}` }],
      };
  }
}

const TABS: Array<{ key: TabKey; label: string }> = [
  { key: "description", label: "Description" },
  { key: "inside", label: "Inside" },
  { key: "reviews", label: "Reviews" },
  { key: "shipping", label: "Shipping & License" },
];

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

  const catalog = useLiveProducts();
  const catalogProduct = useMemo(
    () => findCatalogProduct(catalog, routeParam),
    [catalog, routeParam]
  );
  const numericId = Number(routeParam);
  const useApi =
    !catalogProduct && routeParam !== "" && !Number.isNaN(numericId);

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
    if (catalogProduct) return catalogProduct;
    if (apiProduct) {
      return { ...apiProduct, slug: String(apiProduct.id) };
    }
    return findCatalogProduct(catalog, routeParam);
  }, [catalogProduct, apiProduct, catalog, routeParam]);

  const isLoading = useApi && apiLoading && !product;
  const error = useApi ? apiError : undefined;

  const { mutate: checkout, isPending: isCheckingOut } =
    useCreateCheckoutSession({
      mutation: {
        onSuccess: (data: { url?: string }) => {
          if (data?.url) window.location.href = data.url;
        },
      },
    });

  const { addItem } = useCart();
  const [thumb, setThumb] = useState(0);
  const [formatIdx, setFormatIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<TabKey>("description");

  const formats = useMemo(
    () => (product ? formatsForProduct(product) : null),
    [product]
  );

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
  if (error || !product || !formats) {
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
  const palette: ArtTilePalette =
    PALETTE_BY_INDEX[product.id % PALETTE_BY_INDEX.length];

  return (
    <div className="page pt-12 pb-24">
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
                  style={{
                    borderRadius: 20,
                    background: isBook
                      ? "var(--paper-2)"
                      : "transparent",
                    boxShadow: "var(--sh-paper)",
                  }}
                >
                  {isBook ? (
                    <BookCover
                      title={product.name}
                      subtitle="C. HADAWAY"
                      palette="warm"
                      src={product.imageUrl}
                      alt={product.name}
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
                      src={product.imageUrl}
                      alt={product.name}
                      label={product.name}
                      radius={20}
                    />
                  )}
                </div>
              </Reveal>

              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 mt-4">
                {[0, 1, 2, 3, 4].map((i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setThumb(i)}
                    className={cn(
                      "relative overflow-hidden p-0 border-0 bg-transparent cursor-pointer",
                      i === 4 && "hidden sm:block"
                    )}
                    style={{
                      borderRadius: 10,
                      transform:
                        i === thumb ? "scale(1.04)" : "scale(1)",
                      transition: "transform .2s var(--e-out)",
                    }}
                    aria-label={`Thumbnail ${i + 1}`}
                  >
                    <ArtTile
                      palette={PALETTE_BY_INDEX[i]}
                      width="100%"
                      height={84}
                      src={i === 0 ? product.imageUrl : undefined}
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
                <div className="eyebrow-grad mb-4">
                  {product.featured ? "FEATURED" : "FROM THE STUDIO"}
                </div>
              </Reveal>
              <Reveal>
                <h1
                  className="mb-4"
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
                  style={{ color: "var(--ink-mute)", fontSize: 15 }}
                >
                  <RichText value={product.description} />
                </div>
              </Reveal>

              <Reveal>
                <div className="flex flex-wrap items-baseline gap-4 mb-8">
                  <span
                    className="grad-text-warm"
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

              <Reveal>
                <div className="mb-7">
                  <div className="eyebrow mb-3">{formats.label}</div>
                  <div className="flex gap-2.5 flex-wrap">
                    {formats.options.map((f, i) => {
                      const selected = i === formatIdx;
                      return (
                        <button
                          key={f.name}
                          type="button"
                          onClick={() => setFormatIdx(i)}
                          className={cn(
                            "relative text-left transition-all duration-300",
                            "format-tile"
                          )}
                          style={{
                            flex: "1 1 0",
                            minWidth: 140,
                            padding: "14px 16px",
                            background: selected
                              ? "var(--paper)"
                              : "transparent",
                            border: `1.5px solid ${
                              selected
                                ? "var(--ink)"
                                : "rgba(46,34,34,0.15)"
                            }`,
                            borderRadius: 14,
                            transform: selected
                              ? "translateY(-2px)"
                              : "translateY(0)",
                            boxShadow: selected
                              ? "var(--sh-md)"
                              : "none",
                            fontFamily: "var(--f-sans)",
                            transitionTimingFunction: "var(--e-out)",
                          }}
                        >
                          <div
                            style={{
                              fontSize: 14,
                              fontWeight: 600,
                              color: "var(--ink)",
                            }}
                          >
                            {f.name}
                          </div>
                          <div
                            className="mt-1"
                            style={{
                              fontFamily: "var(--f-mono)",
                              fontSize: 11,
                              color: "var(--ink-mute)",
                              letterSpacing: "0.04em",
                            }}
                          >
                            {f.meta}
                          </div>
                          {selected && (
                            <span
                              aria-hidden
                              className="absolute top-2 right-2.5 block w-2 h-2 rounded-full"
                              style={{ background: "var(--maroon)" }}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </Reveal>

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
                    {!product.inStock ? "Out of stock" : "Add to cart"}
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
                    {isCheckingOut ? "Redirecting…" : "Buy now"}
                  </Btn>
                </div>
              </Reveal>

              <Reveal>
                <div
                  className="flex flex-wrap gap-x-7 gap-y-3 py-5"
                  style={{
                    borderTop: "1px solid rgba(46,34,34,0.1)",
                    borderBottom: "1px solid rgba(46,34,34,0.1)",
                  }}
                >
                  {[
                    isBook
                      ? "Ships from Nantes"
                      : "Instant download",
                    "Stripe secure checkout",
                    "30-day returns",
                  ].map((label, i) => (
                    <div
                      key={label}
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
                      <span className="eyebrow">{label}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
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
            style={{
              borderBottom: "1px solid rgba(46,34,34,0.08)",
              marginBottom: 36,
            }}
          >
            {TABS.map((t) => {
              const active = tab === t.key;
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
            {tab === "description" && (
              <div className="grid lg:grid-cols-[2fr_1fr] gap-10 lg:gap-14">
                <div
                  style={{
                    fontSize: 16,
                    color: "var(--ink-soft)",
                    lineHeight: 1.8,
                  }}
                >
                  <RichText value={product.description} className="mb-4" />
                  <p className="mb-4">
                    Every page in the studio gets made in Krita from
                    sketch to final color. Includes process notes,
                    character studies, and a short epilogue from the
                    author.
                  </p>
                  <p>
                    Signed copies ship in a custom envelope with a
                    thank-you card. Digital editions are delivered by
                    email immediately after checkout.
                  </p>
                </div>
                <div
                  className="self-start p-7"
                  style={{
                    background: "var(--paper-2)",
                    borderRadius: 18,
                  }}
                >
                  <div className="eyebrow mb-4">DETAILS</div>
                  {[
                    ["Format", formats.options[formatIdx].name],
                    ["Category", product.category],
                    ["In stock", product.inStock ? "Yes" : "No"],
                    ["Studio", "Nantes, France"],
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

            {tab === "inside" && (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <ArtTile
                    key={i}
                    palette={PALETTE_BY_INDEX[i % 5]}
                    width="100%"
                    height={220}
                    label={isBook ? `SPREAD ${i}` : `PREVIEW ${i}`}
                  />
                ))}
              </div>
            )}

            {tab === "reviews" && (
              <div>
                <div className="flex flex-wrap items-baseline gap-4 mb-8">
                  <span
                    style={{
                      fontFamily: "var(--f-serif)",
                      fontSize: 56,
                      color: "var(--ink)",
                    }}
                  >
                    4.9
                  </span>
                  <span
                    style={{ color: "var(--gold)", fontSize: 22 }}
                  >
                    ★★★★★
                  </span>
                  <span
                    style={{ color: "var(--ink-mute)", fontSize: 14 }}
                  >
                    142 reviews
                  </span>
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                  {[
                    {
                      name: "Maya R.",
                      date: "MAY 2026",
                      body: "Absolutely beautiful. Worth every penny — even better in print than I'd imagined.",
                    },
                    {
                      name: "Tom K.",
                      date: "APR 2026",
                      body: "I bought the bundle and use the brushes every day now. Everything just fits together.",
                    },
                    {
                      name: "Liv H.",
                      date: "APR 2026",
                      body: "Quiet, gentle, and visually stunning. A book I keep on my desk to flip through.",
                    },
                    {
                      name: "David S.",
                      date: "MAR 2026",
                      body: "Corinne explains the why behind each decision. So much better than copying tutorials.",
                    },
                  ].map((r) => (
                    <div
                      key={r.name}
                      className="p-6"
                      style={{
                        background: "var(--paper-2)",
                        borderRadius: 16,
                      }}
                    >
                      <div
                        className="mb-2.5"
                        style={{ color: "var(--gold)" }}
                      >
                        ★★★★★
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
                        {r.name} · {r.date}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === "shipping" && (
              <div
                className="max-w-[640px]"
                style={{
                  fontSize: 16,
                  color: "var(--ink-soft)",
                  lineHeight: 1.8,
                }}
              >
                <p className="mb-4">
                  {isBook
                    ? "Hardcover copies ship from the studio in Nantes, France via tracked international post. Most orders arrive in 5–10 business days. Free shipping on orders over $50."
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
              </div>
            )}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section
          className="py-20"
          style={{ background: "var(--paper-2)" }}
        >
          <div className="bq-container">
            <div className="mb-10">
              <Reveal>
                <div className="eyebrow-grad mb-3">
                  MORE FROM THE STUDIO
                </div>
              </Reveal>
              <Reveal>
                <h2 style={{ fontSize: "clamp(28px, 3.6vw, 40px)" }}>
                  You might also like
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
