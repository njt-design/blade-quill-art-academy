import { useMemo } from "react";
import { useLocation } from "wouter";
import { tinaField } from "tinacms/react";
import { useListProducts } from "@workspace/api-client-react";
import { useLiveProducts } from "@/hooks/use-live-content";
import { FALLBACK_PRODUCTS } from "@/lib/fallback-data";
import { galleryImageUrl } from "@/lib/artwork";
import { hasCatalogProducts, resolveCatalogProducts } from "@/lib/products";
import { ArtTile } from "@/components/site/ArtTile";
import { BookCover } from "@/components/site/BookCover";
import { Btn } from "@/components/site/Btn";
import { Polaroid } from "@/components/site/Polaroid";
import { Reveal } from "@/components/site/Reveal";
import { RichText } from "@/components/site/RichText";
import { type Block, followLink } from "./block-utils";
import { SectionHeading, bodyTextStyle, sectionAlignStyle } from "./text-style";

const STAT_COLORS = ["var(--maroon)", "var(--taupe)", "var(--ink)"];

const BOOK_SPREAD_SRC = `${import.meta.env.BASE_URL}images/puzzle-book-back.png`;
const BOOK_CHARACTER_SRC = galleryImageUrl("Chibi of the Sea");

interface StatItem {
  value?: string;
  label?: string;
}

interface Props {
  block: Block;
}

export default function FeaturedBookBlock({ block }: Props) {
  const [, setLocation] = useLocation();

  const catalog = useLiveProducts();
  const { data: products } = useListProducts(undefined, {
    query: { enabled: !hasCatalogProducts() },
  });
  const allProducts = useMemo(
    () => resolveCatalogProducts(products, FALLBACK_PRODUCTS, catalog),
    [products, catalog]
  );
  const featuredProduct = allProducts[0];

  // Keep original list indices for tinaField(block, "stats", i).
  const stats = (block.stats as StatItem[] | undefined) ?? [];
  const hasStats = stats.some((s) => s?.value || s?.label);

  return (
    <section
      className="relative py-16 sm:py-24 lg:py-28 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, var(--paper) 0%, var(--paper-2) 50%, var(--paper) 100%)",
      }}
    >
      <div className="bq-container relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <Reveal>
            <div className="relative flex gap-6 justify-center items-center">
              <BookCover
                title={featuredProduct?.name || "Lheeloo & Luna"}
                subtitle="CORINNE  HADAWAY"
                palette="warm"
                badge="NEW"
                width={280}
                height={380}
                drift
                src={featuredProduct?.imageUrl}
                alt={featuredProduct?.name}
                style={{ zIndex: 2, maxWidth: "100%" }}
              />
              {/* Accent polaroids don't fit next to the cover on phones. */}
              <div className="hidden sm:flex flex-col gap-4">
                <Polaroid rotate={3} washi={false}>
                  <ArtTile
                    palette="rose"
                    width={180}
                    height={130}
                    src={BOOK_SPREAD_SRC}
                    alt="Inside the book — puzzles and activities"
                    label="spread"
                    radius={2}
                  />
                </Polaroid>
                <Polaroid rotate={-4} washi={false}>
                  <ArtTile
                    palette="violet"
                    width={180}
                    height={130}
                    src={BOOK_CHARACTER_SRC}
                    alt="Chibi of the Sea character art"
                    label="character"
                    radius={2}
                  />
                </Polaroid>
              </div>
            </div>
          </Reveal>

          <div style={sectionAlignStyle(block)}>
            {block.eyebrow ? (
              <Reveal>
                <div className="eyebrow-grad mb-4" data-tina-field={tinaField(block, "eyebrow")}>
                  {block.eyebrow as string}
                </div>
              </Reveal>
            ) : null}
            <Reveal>
              <SectionHeading
                block={block}
                defaultTag="h2"
                baseSize="clamp(38px, 4.5vw, 58px)"
                className="mb-5"
                style={{ lineHeight: 1.05 }}
              >
                {(block.heading as string) || "The new book."}
              </SectionHeading>
            </Reveal>
            <Reveal>
              <div
                className="mb-7 max-w-[480px]"
                style={{ fontSize: 17, color: "var(--ink-soft)", lineHeight: 1.7, ...bodyTextStyle(block) }}
                data-tina-field={tinaField(block, "description")}
              >
                <RichText value={block.description} />
              </div>
            </Reveal>
            {hasStats && (
              <Reveal>
                <div
                  className="flex flex-wrap gap-9 mb-8 pb-6"
                  style={{ borderBottom: "1px solid rgba(46,34,34,0.1)" }}
                >
                  {stats.map((stat, i) => {
                    if (!stat?.value && !stat?.label) return null;
                    return (
                      <div
                        key={`${stat.label}-${i}`}
                        data-tina-field={tinaField(block, "stats", i)}
                      >
                        <div
                          style={{
                            fontFamily: "var(--f-serif)",
                            fontSize: 36,
                            color: STAT_COLORS[i % STAT_COLORS.length],
                          }}
                          data-tina-field={tinaField(stat, "value")}
                        >
                          {stat.value}
                        </div>
                        <div
                          className="eyebrow"
                          data-tina-field={tinaField(stat, "label")}
                        >
                          {stat.label}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Reveal>
            )}
            <Reveal>
              <div className="flex flex-wrap gap-3">
                {block.ctaLabel ? (
                  <Btn
                    kind="primary"
                    size="lg"
                    iconRight="→"
                    onClick={() =>
                      followLink(
                        setLocation,
                        block.ctaLink as string | undefined,
                        featuredProduct ? `/shop/${featuredProduct.slug}` : "/shop"
                      )
                    }
                  >
                    <span data-tina-field={tinaField(block, "ctaLabel")}>
                      {block.ctaLabel as string}
                    </span>
                  </Btn>
                ) : null}
                {block.secondaryLabel ? (
                  <Btn
                    kind="outline"
                    size="lg"
                    onClick={() =>
                      followLink(setLocation, block.secondaryLink as string | undefined, "/shop")
                    }
                  >
                    <span data-tina-field={tinaField(block, "secondaryLabel")}>
                      {block.secondaryLabel as string}
                    </span>
                  </Btn>
                ) : null}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
