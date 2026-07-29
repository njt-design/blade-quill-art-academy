import { useLocation } from "wouter";
import { tinaField } from "tinacms/react";
import { productImageUrl, youtubeThumb } from "@/lib/artwork";
import { ArtTile, type ArtTilePalette } from "@/components/site/ArtTile";
import { Reveal } from "@/components/site/Reveal";
import { type Block, isExternalLink } from "./block-utils";
import { SidebarLabel } from "./SidebarLabel";
import { sectionAlignStyle } from "./text-style";

const CARD_PALETTES: ArtTilePalette[] = ["warm", "violet", "twilight"];

/* Default art per card when CMS image is empty. */
const CARD_ART_FALLBACK: Array<{ src?: string; alt: string }> = [
  { src: productImageUrl("physical"), alt: "Lheeloo & Luna book cover" },
  { src: productImageUrl("curriculum"), alt: "Digital art curriculum" },
  { src: youtubeThumb("63_gp_rFtOc"), alt: "Krita tutorial video" },
];

interface CardItem {
  tag?: string;
  title?: string;
  body?: string;
  image?: string;
  ctaLabel?: string;
  link?: string;
}

interface Props {
  block: Block;
}

export default function CardRowBlock({ block }: Props) {
  const [, setLocation] = useLocation();
  const cards = (block.cards as CardItem[] | undefined) ?? [];
  if (cards.length === 0) return null;

  return (
    <section className="py-20 lg:py-28">
      <div className="bq-container" style={sectionAlignStyle(block)}>
        <div className="grid lg:grid-cols-[180px_1fr] gap-10 lg:gap-14">
          <SidebarLabel
            number={block.number as string | undefined}
            label={(block.label as string) || ""}
            numberField={tinaField(block, "number")}
            labelField={tinaField(block, "label")}
          />
          <Reveal stagger>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cards.map((card, i) => {
                const palette = CARD_PALETTES[i % CARD_PALETTES.length];
                const fallback = CARD_ART_FALLBACK[i % CARD_ART_FALLBACK.length];
                const src = card.image || fallback.src;
                const inner = (
                  <>
                    <div data-tina-field={tinaField(card, "image")}>
                      <ArtTile
                        palette={palette}
                        width="100%"
                        height={140}
                        src={src}
                        alt={card.title || fallback.alt}
                        label={(card.tag || "").toLowerCase()}
                        style={{ marginBottom: 22 }}
                      />
                    </div>
                    {card.tag ? (
                      <div className="eyebrow-grad mb-3" data-tina-field={tinaField(card, "tag")}>
                        {card.tag}
                      </div>
                    ) : null}
                    <h3
                      className="mb-2.5"
                      style={{ fontSize: 24, lineHeight: 1.2 }}
                      data-tina-field={tinaField(card, "title")}
                    >
                      {card.title}
                    </h3>
                    {card.body ? (
                      <p
                        className="mb-5"
                        style={{ color: "var(--ink-soft)", fontSize: 14, lineHeight: 1.6 }}
                        data-tina-field={tinaField(card, "body")}
                      >
                        {card.body}
                      </p>
                    ) : null}
                    {card.ctaLabel ? (
                      <span
                        className="link-ink"
                        style={{
                          fontFamily: "var(--f-mono)",
                          fontSize: 12,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          fontWeight: 600,
                        }}
                        data-tina-field={tinaField(card, "ctaLabel")}
                      >
                        {card.ctaLabel} →
                      </span>
                    ) : null}
                  </>
                );
                const sharedStyle: React.CSSProperties = {
                  background: "var(--paper-2)",
                  borderRadius: 20,
                  padding: 28,
                  transition:
                    "transform .35s var(--e-out), box-shadow .35s var(--e-out)",
                  display: "block",
                  color: "inherit",
                  textDecoration: "none",
                };
                return isExternalLink(card.link) ? (
                  <a
                    key={`${card.title}-${i}`}
                    href={card.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="lane-card"
                    style={sharedStyle}
                    data-tina-field={tinaField(block, "cards", i)}
                  >
                    {inner}
                  </a>
                ) : (
                  <button
                    key={`${card.title}-${i}`}
                    type="button"
                    onClick={() => setLocation(card.link || "/")}
                    className="lane-card text-left cursor-pointer border-0"
                    style={sharedStyle}
                    data-tina-field={tinaField(block, "cards", i)}
                  >
                    {inner}
                  </button>
                );
              })}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
