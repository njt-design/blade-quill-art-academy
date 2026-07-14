import { useLocation } from "wouter";
import { tinaField } from "tinacms/react";
import { ArtTile, type ArtTilePalette } from "@/components/site/ArtTile";
import { Reveal } from "@/components/site/Reveal";
import { type Block, isExternalLink } from "./block-utils";
import { SidebarLabel } from "./SidebarLabel";

const CARD_PALETTES: ArtTilePalette[] = ["warm", "violet", "twilight"];

interface CardItem {
  tag?: string;
  title?: string;
  body?: string;
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
      <div className="bq-container">
        <div className="grid lg:grid-cols-[180px_1fr] gap-10 lg:gap-14">
          <SidebarLabel
            number={block.number as string | undefined}
            label={(block.label as string) || ""}
          />
          <Reveal stagger>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cards.map((card, i) => {
                const palette = CARD_PALETTES[i % CARD_PALETTES.length];
                const inner = (
                  <>
                    <ArtTile
                      palette={palette}
                      width="100%"
                      height={140}
                      label={(card.tag || "").toLowerCase()}
                      style={{ marginBottom: 22 }}
                    />
                    {card.tag ? <div className="eyebrow-grad mb-3">{card.tag}</div> : null}
                    <h3 className="mb-2.5" style={{ fontSize: 24, lineHeight: 1.2 }}>
                      {card.title}
                    </h3>
                    {card.body ? (
                      <p
                        className="mb-5"
                        style={{ color: "var(--ink-soft)", fontSize: 14, lineHeight: 1.6 }}
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
