import { useMemo } from "react";
import { useLocation } from "wouter";
import { tinaField } from "tinacms/react";
import { useListProducts, useListTutorials } from "@workspace/api-client-react";
import { useLiveProducts } from "@/hooks/use-live-content";
import { FALLBACK_PRODUCTS, FALLBACK_TUTORIALS } from "@/lib/fallback-data";
import { hasCatalogProducts, resolveCatalogProducts } from "@/lib/products";
import { ArtTile, type ArtTilePalette } from "@/components/site/ArtTile";
import { Polaroid } from "@/components/site/Polaroid";
import { Reveal } from "@/components/site/Reveal";
import { TutorialThumb } from "@/components/site/TutorialThumb";
import { type Block, followLink, isExternalLink } from "./block-utils";
import { SectionHeading, sectionAlignStyle } from "./text-style";

const PILLAR_STYLES: Array<{
  palette: ArtTilePalette;
  washi: string;
  rotate: number;
}> = [
  { palette: "warm", washi: "var(--maroon)", rotate: -1.2 },
  { palette: "violet", washi: "var(--taupe)", rotate: 0.5 },
  { palette: "twilight", washi: "var(--gold-deep)", rotate: 1.2 },
];

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

export default function PillarsBlock({ block }: Props) {
  const [, setLocation] = useLocation();
  const items = ((block.items as PillarItem[] | undefined) ?? []).slice(0, 3);

  const catalog = useLiveProducts();
  const { data: products } = useListProducts(undefined, {
    query: { enabled: !hasCatalogProducts() },
  });
  const { data: tutorials } = useListTutorials(
    { featured: true },
    { query: { enabled: import.meta.env.PROD } }
  );

  const allProducts = useMemo(
    () => resolveCatalogProducts(products, FALLBACK_PRODUCTS, catalog),
    [products, catalog]
  );

  const featuredVideo = useMemo(() => {
    const list =
      Array.isArray(tutorials) && tutorials.length > 0
        ? tutorials
        : FALLBACK_TUTORIALS.filter((t) => t.featured);
    return list[0];
  }, [tutorials]);

  // Automatic preview art when a card has no image: book cover, curriculum
  // image, or the featured YouTube thumbnail for external video links.
  const autoPreviews = useMemo(() => {
    const book = allProducts.find((p) => p.category === "physical");
    const curriculum = allProducts.find((p) => p.category === "curriculum");
    return [
      { src: book?.imageUrl, alt: book?.name },
      { src: curriculum?.imageUrl, alt: curriculum?.name },
      { src: undefined, alt: undefined },
    ];
  }, [allProducts]);

  if (items.length === 0) return null;

  return (
    <section className="py-24 lg:py-28">
      <div className="bq-container">
        <div className="text-center mb-16" style={sectionAlignStyle(block)}>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {items.map((p, i) => {
              const style = PILLAR_STYLES[i % PILLAR_STYLES.length];
              const isYoutubeLink = isExternalLink(p.link) && /youtube\.com|youtu\.be/i.test(p.link ?? "");
              const youtubeId = !p.image && isYoutubeLink ? featuredVideo?.youtubeId : undefined;
              const previewSrc = p.image || autoPreviews[i]?.src;
              const previewAlt = p.image ? p.title : autoPreviews[i]?.alt ?? p.title;
              return (
                <button
                  key={`${p.title}-${i}`}
                  type="button"
                  onClick={() => followLink(setLocation, p.link)}
                  className="text-left cursor-pointer focus:outline-none"
                  data-tina-field={tinaField(block, "items", i)}
                >
                  <Polaroid rotate={style.rotate} washiColor={style.washi} hoverStraighten>
                    <div className="relative">
                      {youtubeId ? (
                        <TutorialThumb
                          palette={style.palette}
                          youtubeId={youtubeId}
                          width="100%"
                          height={280}
                          style={{ borderRadius: 2 }}
                        />
                      ) : (
                        <ArtTile
                          palette={style.palette}
                          src={previewSrc}
                          alt={previewAlt}
                          width="100%"
                          height={280}
                          radius={2}
                        />
                      )}
                      {p.badge ? (
                        <span
                          className="absolute top-3 right-3"
                          style={{
                            background: "var(--ink)",
                            color: "var(--paper)",
                            fontFamily: "var(--f-mono)",
                            fontSize: 10,
                            letterSpacing: "0.12em",
                            padding: "5px 10px",
                            borderRadius: 999,
                          }}
                        >
                          {p.badge}
                        </span>
                      ) : null}
                    </div>
                    <div className="pt-5 px-1.5 pb-1">
                      {p.tag ? <div className="eyebrow-grad mb-2.5">{p.tag}</div> : null}
                      <h3 className="mb-2.5" style={{ fontSize: 26, lineHeight: 1.15 }}>
                        {p.title}
                      </h3>
                      {p.sub ? (
                        <p className="mb-4 text-sm" style={{ color: "var(--ink-mute)" }}>
                          {p.sub}
                        </p>
                      ) : null}
                      {p.cta ? (
                        <span
                          className="link-ink"
                          style={{
                            fontFamily: "var(--f-mono)",
                            fontSize: 12,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            fontWeight: 600,
                            color: "var(--ink)",
                          }}
                        >
                          {p.cta} →
                        </span>
                      ) : null}
                    </div>
                  </Polaroid>
                </button>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
