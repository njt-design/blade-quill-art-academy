import { useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { tinaField } from "tinacms/react";
import { useListProducts } from "@workspace/api-client-react";
import { useLiveProducts } from "@/hooks/use-live-content";
import { FALLBACK_CATEGORIES, FALLBACK_PRODUCTS } from "@/lib/fallback-data";
import {
  deriveCategories,
  hasCatalogProducts,
  resolveCatalogProducts,
  type CatalogProduct,
} from "@/lib/products";
import { BookCover } from "@/components/site/BookCover";
import { Btn } from "@/components/site/Btn";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Reveal";
import { RichText } from "@/components/site/RichText";
import { type Block } from "./block-utils";

const SORT_OPTIONS = ["Newest", "Price ↑", "Price ↓", "Best sellers"] as const;
type SortOption = (typeof SORT_OPTIONS)[number];

function sortProducts(products: CatalogProduct[], sort: SortOption): CatalogProduct[] {
  const copy = [...products];
  switch (sort) {
    case "Price ↑":
      return copy.sort((a, b) => a.price - b.price);
    case "Price ↓":
      return copy.sort((a, b) => b.price - a.price);
    case "Best sellers":
      return copy.sort(
        (a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured))
      );
    case "Newest":
    default:
      return copy.sort(
        (a, b) =>
          new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
      );
  }
}

/** Render the shop heading, showing the highlighted word in gradient text. */
function shopHeading(heading: string, highlight?: string) {
  if (!highlight || !heading.includes(highlight)) return heading;
  const [before, ...rest] = heading.split(highlight);
  return (
    <>
      {before}
      <span className="grad-text">{highlight}</span>
      {rest.join(highlight)}
    </>
  );
}

interface Props {
  block: Block;
}

export default function ShopCatalogBlock({ block }: Props) {
  const [, setLocation] = useLocation();
  const [activeCategories, setActiveCategories] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState<SortOption>("Newest");
  const [sortOpen, setSortOpen] = useState(false);

  const catalog = useLiveProducts();
  const { data: productsRaw, isLoading } = useListProducts(
    {},
    { query: { enabled: !hasCatalogProducts() } }
  );
  const allProducts = useMemo(
    () => resolveCatalogProducts(productsRaw, FALLBACK_PRODUCTS, catalog),
    [productsRaw, catalog]
  );
  const categories = useMemo(() => {
    const derived = deriveCategories(allProducts);
    return derived.length > 0 ? derived : FALLBACK_CATEGORIES;
  }, [allProducts]);

  const featuredProduct = useMemo(
    () => allProducts.find((p) => p.featured) || allProducts[0] || null,
    [allProducts]
  );
  const showFeaturedBanner = block.showFeaturedBanner !== false && featuredProduct;

  const filtered = useMemo(() => {
    const base =
      activeCategories.size === 0
        ? allProducts
        : allProducts.filter((p) => activeCategories.has(p.category as string));
    return sortProducts(base, sort);
  }, [allProducts, activeCategories, sort]);

  const toggleCategory = (id: string) => {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="page pt-12 pb-24">
      {/* ── HEADER ─────────────────────────────────────────── */}
      <section className="py-10">
        <div className="bq-container">
          <div className="eyebrow mb-3.5">
            <Link href="/" className="link-ink">
              HOME
            </Link>
            <span className="mx-2">/</span>
            <span>SHOP</span>
          </div>
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <h1
                  className="mb-3.5"
                  style={{ fontSize: "clamp(48px, 6vw, 76px)", lineHeight: 1.05 }}
                  data-tina-field={tinaField(block, "heading")}
                >
                  {shopHeading(
                    (block.heading as string) || "The studio shop.",
                    block.highlightText as string | undefined
                  )}
                </h1>
                <div
                  className="max-w-[540px]"
                  style={{ fontSize: 17, color: "var(--ink-soft)", lineHeight: 1.6 }}
                  data-tina-field={tinaField(block, "description")}
                >
                  <RichText value={block.description} />
                </div>
              </div>
              <div className="flex items-center gap-3.5">
                <span
                  style={{
                    fontFamily: "var(--f-mono)",
                    fontSize: 11,
                    color: "var(--ink-mute)",
                    letterSpacing: "0.08em",
                  }}
                >
                  {allProducts.length} PRODUCTS
                </span>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setSortOpen((v) => !v)}
                    className="inline-flex items-center gap-2 rounded-full px-4 py-2 transition-colors"
                    style={{
                      border: "1.5px solid var(--ink)",
                      color: "var(--ink)",
                      background: "transparent",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--f-mono)",
                        fontSize: 11,
                        letterSpacing: "0.08em",
                      }}
                    >
                      SORT · {sort.toUpperCase()}
                    </span>
                    <span style={{ fontSize: 9 }}>▼</span>
                  </button>
                  {sortOpen && (
                    <div
                      className="absolute right-0 z-10 min-w-[180px] mt-1.5 p-1.5"
                      style={{
                        background: "var(--paper)",
                        boxShadow: "var(--sh-lg)",
                        borderRadius: 12,
                      }}
                    >
                      {SORT_OPTIONS.map((opt) => {
                        const isActive = sort === opt;
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => {
                              setSort(opt);
                              setSortOpen(false);
                            }}
                            className="w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-maroon/40 active:bg-secondary"
                            style={{
                              fontWeight: isActive ? 600 : 500,
                              color: isActive ? "var(--maroon)" : "var(--ink)",
                              background: "transparent",
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.background = "var(--paper-2)")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.background = "transparent")
                            }
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FEATURED BANNER ─────────────────────────────────── */}
      {showFeaturedBanner && (
        <section className="pt-5 pb-10">
          <div className="bq-container">
            <Reveal>
              <div
                className="relative overflow-hidden grid lg:grid-cols-[1fr_1.3fr]"
                style={{
                  background: "var(--g-ink)",
                  borderRadius: 24,
                  boxShadow: "var(--sh-lg)",
                }}
              >
                <div
                  className="relative flex flex-col justify-center p-6 sm:p-12"
                  style={{ color: "var(--paper)" }}
                >
                  <div className="eyebrow mb-3.5" style={{ color: "var(--gold)" }}>
                    FEATURED RELEASE
                  </div>
                  <h2
                    className="mb-4"
                    style={{
                      fontSize: "clamp(28px, 4vw, 38px)",
                      lineHeight: 1.1,
                      color: "var(--paper)",
                    }}
                  >
                    {featuredProduct.name}
                  </h2>
                  <div
                    className="mb-6 max-w-[380px]"
                    style={{ color: "var(--paper-3)", fontSize: 14, lineHeight: 1.6 }}
                  >
                    <RichText value={featuredProduct.description} />
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    <Btn
                      kind="primary"
                      iconRight="→"
                      onClick={() => setLocation(`/shop/${featuredProduct.slug}`)}
                    >
                      View · ${featuredProduct.price.toFixed(0)}
                    </Btn>
                    <Btn
                      kind="light"
                      onClick={() => setLocation(`/shop/${featuredProduct.slug}`)}
                    >
                      Details
                    </Btn>
                  </div>
                </div>
                <div className="relative flex items-center justify-center p-6 sm:p-10">
                  <BookCover
                    title={featuredProduct.name}
                    palette="warm"
                    badge="FEATURED"
                    subtitle="C. HADAWAY"
                    width={220}
                    height={300}
                    drift
                    src={featuredProduct.imageUrl}
                    alt={featuredProduct.name}
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* ── FILTERS + GRID ──────────────────────────────────── */}
      <section className="pt-10">
        <div className="bq-container">
          <div className="grid lg:grid-cols-[240px_1fr] gap-12">
            <aside>
              <div className="lg:sticky lg:top-28">
                <div className="mb-8">
                  <div className="eyebrow mb-3.5" style={{ color: "var(--ink)" }}>
                    Type
                  </div>
                  <div className="flex flex-col gap-2.5">
                    {categories.map((cat) => {
                      const id = String(cat.id);
                      const checked = activeCategories.has(id);
                      return (
                        <label
                          key={id}
                          className="filter-row flex items-center gap-3 cursor-pointer"
                          style={{
                            fontSize: 14,
                            color: checked ? "var(--ink)" : "var(--ink-soft)",
                            fontWeight: checked ? 600 : 500,
                          }}
                        >
                          <span
                            className="grid place-items-center"
                            style={{
                              width: 18,
                              height: 18,
                              borderRadius: 4,
                              border: `1.5px solid ${
                                checked ? "var(--maroon)" : "rgba(46,34,34,0.25)"
                              }`,
                              background: checked ? "var(--maroon)" : "transparent",
                              transition:
                                "background .2s var(--e-out), border-color .2s var(--e-out)",
                            }}
                          >
                            {checked && (
                              <svg width={10} height={10} viewBox="0 0 12 12" fill="none">
                                <path
                                  d="M2 6.5 L 5 9.5 L 10 3"
                                  stroke="white"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                          </span>
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleCategory(id)}
                            className="hidden"
                          />
                          <span>
                            {cat.label}
                            {typeof cat.productCount === "number" && (
                              <span
                                className="ml-2"
                                style={{
                                  fontFamily: "var(--f-mono)",
                                  fontSize: 11,
                                  color: "var(--ink-faint)",
                                }}
                              >
                                {cat.productCount}
                              </span>
                            )}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <Btn kind="ghost" size="sm" onClick={() => setActiveCategories(new Set())}>
                  Clear filters
                </Btn>
              </div>
            </aside>

            <Reveal stagger>
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="animate-pulse rounded-2xl"
                      style={{ background: "var(--paper-3)", height: 360 }}
                    />
                  ))}
                </div>
              ) : filtered.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
                  {filtered.map((product, i) => (
                    <ProductCard key={product.id} product={product} index={i} />
                  ))}
                </div>
              ) : (
                <div
                  className="text-center py-20 rounded-2xl"
                  style={{
                    border: "1px dashed var(--paper-deep)",
                    background: "var(--paper-2)",
                  }}
                >
                  <h3
                    className="text-xl mb-2"
                    style={{ color: "var(--ink-mute)" }}
                    data-tina-field={tinaField(block, "emptyHeading")}
                  >
                    {(block.emptyHeading as string) || "No products found"}
                  </h3>
                  <p
                    className="text-sm"
                    style={{ color: "var(--ink-faint)" }}
                    data-tina-field={tinaField(block, "emptyDescription")}
                  >
                    {(block.emptyDescription as string) ||
                      "Check back later for new releases."}
                  </p>
                </div>
              )}
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
