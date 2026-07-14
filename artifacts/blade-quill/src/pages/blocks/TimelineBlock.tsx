import { tinaField } from "tinacms/react";
import { ArtTile, type ArtTilePalette } from "@/components/site/ArtTile";
import { Reveal } from "@/components/site/Reveal";
import { type Block } from "./block-utils";
import { SidebarLabel } from "./SidebarLabel";

const EVENT_PALETTES: ArtTilePalette[] = ["warm", "rose", "warm", "violet", "twilight"];

interface TimelineEvent {
  year?: string;
  title?: string;
  description?: string;
}

interface Props {
  block: Block;
}

export default function TimelineBlock({ block }: Props) {
  const events = (block.events as TimelineEvent[] | undefined) ?? [];
  if (events.length === 0) return null;

  return (
    <section className="py-20 lg:py-28 relative" style={{ background: "var(--paper-2)" }}>
      <div className="bq-container">
        <div className="grid lg:grid-cols-[180px_1fr] gap-10 lg:gap-14">
          <SidebarLabel
            number={block.number as string | undefined}
            label={(block.label as string) || "TIMELINE"}
          />
          <div className="relative">
            <span
              aria-hidden
              className="absolute"
              style={{
                top: 24,
                bottom: 24,
                left: 11,
                width: 2,
                background:
                  "linear-gradient(180deg, var(--maroon) 0%, var(--gold-deep) 50%, var(--taupe) 100%)",
              }}
            />
            <Reveal stagger>
              {events.map((e, i) => (
                <div
                  key={`${e.year}-${i}`}
                  className="relative grid lg:grid-cols-[1fr_200px] gap-6 lg:gap-8 items-start"
                  style={{ paddingLeft: 56, paddingBottom: 44 }}
                  data-tina-field={tinaField(block, "events", i)}
                >
                  <span
                    aria-hidden
                    className="absolute block rounded-full"
                    style={{
                      left: 0,
                      top: 6,
                      width: 24,
                      height: 24,
                      background: "var(--paper)",
                      border: "3px solid var(--maroon)",
                      boxShadow: "0 0 0 4px var(--paper-2)",
                    }}
                  />
                  <div>
                    <div
                      className="mb-2"
                      style={{
                        fontFamily: "var(--f-mono)",
                        fontSize: 12,
                        color: "var(--maroon)",
                        letterSpacing: "0.12em",
                      }}
                    >
                      {e.year}
                    </div>
                    <h3 className="mb-2" style={{ fontSize: 26, lineHeight: 1.2 }}>
                      {e.title}
                    </h3>
                    <p style={{ color: "var(--ink-mute)", fontSize: 14, lineHeight: 1.6 }}>
                      {e.description}
                    </p>
                  </div>
                  <ArtTile
                    palette={EVENT_PALETTES[i % EVENT_PALETTES.length]}
                    width="100%"
                    height={120}
                    label={e.year}
                  />
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
