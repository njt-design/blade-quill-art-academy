import { useMemo } from "react";
import { useLocation } from "wouter";
import { tinaField } from "tinacms/react";
import { useListProducts, useListTutorials } from "@workspace/api-client-react";
import { useLiveProducts, useLiveTutorials } from "@/hooks/use-live-content";
import { FALLBACK_PRODUCTS, FALLBACK_TUTORIALS } from "@/lib/fallback-data";
import { hasCatalogProducts, resolveCatalogProducts } from "@/lib/products";
import { pickStripTutorials, resolveTutorials } from "@/lib/tutorials";
import { Reveal } from "@/components/site/Reveal";
import { type Block, followLink, isExternalLink } from "./block-utils";
import { SectionHeading, sectionAlignStyle } from "./text-style";

/** Top media fills — matched to brand card mock (rose / mist / ink). */
const MEDIA_BACKGROUNDS = [
  "color-mix(in srgb, var(--maroon) 42%, var(--paper))",
  "var(--paper)",
  "var(--ink)",
] as const;

const CONTENT_BG = "#F7F1EA";

interface PillarItem {
  tag?: string;
  title?: string;
  sub?: string;
  cta?: string;
  badge?: string;
  link?: string;
  image?: string;
}

interface Props {
  block: Block;
}

/** Soft wave between media and content (fills with content cream). */
function WaveEdge() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 h-3.5 w-full"
      viewBox="0 0 400 14"
      preserveAspectRatio="none"
    >
      <path
        fill={CONTENT_BG}
        d="M0 8c25 0 25-5 50-5s25 5 50 5 25-5 50-5 25 5 50 5 25-5 50-5 25 5 50 5 25-5 50-5 25 5 50 5V14H0Z"
      />
    </svg>
  );
}

export default function PillarsBlock({ block }: Props) {
  const [, setLocation] = useLocation();
  const items = ((block.items as PillarItem[] | undefined) ?? []).slice(0, 3);

  const catalog = useLiveProducts();
  const { data: products } = useListProducts(undefined, {
    query: { enabled: !hasCatalogProducts() },
  });
  const tutorialCatalog = useLiveTutorials();
  const { data: tutorials } = useListTutorials(
    { featured: true },
    { query: { enabled: import.meta.env.PROD && tutorialCatalog.length === 0 } }
  );

  const allProducts = useMemo(
    () => resolveCatalogProducts(products, FALLBACK_PRODUCTS, catalog),
    [products, catalog]
  );

  const featuredVideo = useMemo(() => {
    const list = resolveTutorials(
      Array.isArray(tutorials) ? tutorials : undefined,
      FALLBACK_TUTORIALS,
      tutorialCatalog
    );
    return pickStripTutorials(list, 1)[0];
  }, [tutorials, tutorialCatalog]);

  const autoPreviews = useMemo(() => {
    const book = allProducts.find((p) => p.category === "physical");
    const curriculum = allProducts.find((p) => p.category === "curriculum");
    return [
      { src: book?.imageUrl, alt: book?.name },
      { src: curriculum?.imageUrl, alt: curriculum?.name },
      { src: undefined as string | undefined, alt: undefined as string | undefined },
    ];
  }, [allProducts]);

  if (items.length === 0) return null;

  return (
    <section className="py-24 lg:py-28">
      <div className="bq-container">
        <div className="mb-14 text-center md:mb-16" style={sectionAlignStyle(block)}>
          {block.eyebrow ? (
            <Reveal>
              <div className="eyebrow mb-3.5" data-tina-field={tinaField(block, "eyebrow")}>
                {block.eyebrow as string}
              </div>
            </Reveal>
          ) : null}
          {block.heading ? (
            <Reveal>
              <SectionHeading
                block={block}
                defaultTag="h2"
                baseSize="clamp(34px, 4.5vw, 52px)"
              >
                {block.heading as string}
              </SectionHeading>
            </Reveal>
          ) : null}
        </div>

        <Reveal stagger>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-7">
            {items.map((p, i) => {
              const isYoutubeLink =
                isExternalLink(p.link) && /youtube\.com|youtu\.be/i.test(p.link ?? "");
              const youtubeId =
                !p.image && isYoutubeLink ? featuredVideo?.youtubeId : undefined;
              const previewSrc =
                p.image ||
                (youtubeId
                  ? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`
                  : autoPreviews[i]?.src);
              const previewAlt = p.image
                ? p.title
                : autoPreviews[i]?.alt ?? p.title ?? "";
              const mediaBg = MEDIA_BACKGROUNDS[i % MEDIA_BACKGROUNDS.length];
              const duration = youtubeId ? "14:22" : undefined;

              return (
                <button
                  key={`${p.title}-${i}`}
                  type="button"
                  onClick={() => followLink(setLocation, p.link)}
                  className="group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--maroon)] focus-visible:ring-offset-2"
                  data-tina-field={tinaField(block, "items", i)}
                >
                  <article
                    className="flex h-full flex-col overflow-hidden rounded-[8px] transition-[transform,box-shadow] duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_18px_40px_rgba(46,34,34,0.16)]"
                    style={{
                      background: CONTENT_BG,
                      boxShadow: "0 12px 32px rgba(46,34,34,0.12), 0 2px 6px rgba(46,34,34,0.06)",
                      transitionTimingFunction: "var(--e-out)",
                    }}
                  >
                    {/* Media */}
                    <div
                      className="relative h-[220px] shrink-0 overflow-hidden sm:h-[240px]"
                      style={{ background: mediaBg }}
                      data-tina-field={tinaField(p, "image")}
                    >
                      {previewSrc ? (
                        <img
                          src={previewSrc}
                          alt={previewAlt}
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          style={{ transitionTimingFunction: "var(--e-out)" }}
                        />
                      ) : null}

                      {youtubeId ? (
                        <div
                          aria-hidden
                          className="absolute inset-0 grid place-items-center"
                        >
                          <span
                            className="grid size-14 place-items-center rounded-full transition-transform duration-300 group-hover:scale-110"
                            style={{
                              background: "rgba(247,241,234,0.92)",
                              color: "var(--ink)",
                              boxShadow: "0 8px 24px rgba(46,34,34,0.25)",
                            }}
                          >
                            <svg width="18" height="20" viewBox="0 0 18 20" fill="currentColor">
                              <path d="M17.5 8.134c1.333.77 1.333 2.962 0 3.732L3.25 19.33C1.917 20.1.25 19.13.25 17.598V2.402C.25.87 1.917-.1 3.25.67l14.25 7.464Z" />
                            </svg>
                          </span>
                        </div>
                      ) : null}

                      {p.badge ? (
                        <span
                          className="absolute left-4 top-4"
                          style={{
                            background: "var(--ink)",
                            color: "var(--paper)",
                            fontFamily: "var(--f-mono)",
                            fontSize: 10,
                            letterSpacing: "0.12em",
                            padding: "6px 12px",
                            borderRadius: 999,
                            fontWeight: 600,
                          }}
                          data-tina-field={tinaField(p, "badge")}
                        >
                          {p.badge}
                        </span>
                      ) : null}

                      {duration ? (
                        <span
                          className="absolute right-4 top-4"
                          style={{
                            background: "rgba(46,34,34,0.72)",
                            color: "var(--paper)",
                            fontFamily: "var(--f-mono)",
                            fontSize: 11,
                            letterSpacing: "0.04em",
                            padding: "4px 8px",
                            borderRadius: 6,
                          }}
                        >
                          {duration}
                        </span>
                      ) : null}

                      <WaveEdge />
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col px-6 pb-7 pt-5 sm:px-7">
                      {p.tag ? (
                        <div
                          className="mb-3"
                          style={{
                            fontFamily: "var(--f-mono)",
                            fontSize: 11,
                            letterSpacing: "0.14em",
                            textTransform: "uppercase",
                            fontWeight: 600,
                            color: "var(--maroon)",
                          }}
                          data-tina-field={tinaField(p, "tag")}
                        >
                          {p.tag}
                        </div>
                      ) : null}

                      <h3
                        className="mb-3"
                        style={{
                          fontFamily: "var(--f-sans)",
                          fontSize: 22,
                          lineHeight: 1.25,
                          fontWeight: 600,
                          color: "var(--ink)",
                          letterSpacing: "-0.01em",
                        }}
                        data-tina-field={tinaField(p, "title")}
                      >
                        {p.title}
                      </h3>

                      {p.sub ? (
                        <p
                          className="mb-6 text-[15px] leading-[1.55]"
                          style={{ color: "var(--ink-mute)" }}
                          data-tina-field={tinaField(p, "sub")}
                        >
                          {p.sub}
                        </p>
                      ) : null}

                      {p.cta ? (
                        <span
                          className="mt-auto inline-flex items-center gap-1.5 border-b pb-0.5 transition-opacity group-hover:opacity-80"
                          style={{
                            fontFamily: "var(--f-mono)",
                            fontSize: 12,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            fontWeight: 600,
                            color: "var(--maroon)",
                            borderColor: "var(--maroon)",
                            alignSelf: "flex-start",
                          }}
                          data-tina-field={tinaField(p, "cta")}
                        >
                          {p.cta} →
                        </span>
                      ) : null}
                    </div>
                  </article>
                </button>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
