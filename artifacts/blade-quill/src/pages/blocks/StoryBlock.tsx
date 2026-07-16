import { tinaField } from "tinacms/react";
import { galleryImageUrl } from "@/lib/artwork";
import { ArtTile } from "@/components/site/ArtTile";
import { Polaroid } from "@/components/site/Polaroid";
import { Reveal } from "@/components/site/Reveal";
import { RichText } from "@/components/site/RichText";
import { type Block } from "./block-utils";
import { SidebarLabel } from "./SidebarLabel";

const STUDIO_ART = galleryImageUrl("Landscape");

interface Props {
  block: Block;
}

export default function StoryBlock({ block }: Props) {
  const headingLines = ((block.heading as string) || "").split("\n").filter(Boolean);

  return (
    <section className="py-20 lg:py-28">
      <div className="bq-container">
        <div className="grid lg:grid-cols-[180px_1fr_240px] gap-10 lg:gap-14 items-start">
          <SidebarLabel
            number={block.number as string | undefined}
            label={(block.label as string) || "STORY"}
            numberField={tinaField(block, "number")}
            labelField={tinaField(block, "label")}
          />
          <div className="max-w-[640px]">
            {headingLines.length > 0 && (
              <Reveal>
                <h2
                  className="mb-7"
                  style={{ fontSize: "clamp(32px, 4vw, 44px)", lineHeight: 1.2 }}
                  data-tina-field={tinaField(block, "heading")}
                >
                  {headingLines.map((line, i) => (
                    <span key={`${line}-${i}`}>
                      {i > 0 && <br />}
                      {line}
                    </span>
                  ))}
                </h2>
              </Reveal>
            )}
            {block.paragraph1 ? (
              <Reveal>
                <div
                  className="mb-6"
                  style={{ fontSize: 16, color: "var(--ink-soft)", lineHeight: 1.8 }}
                  data-tina-field={tinaField(block, "paragraph1")}
                >
                  <RichText value={block.paragraph1} />
                </div>
              </Reveal>
            ) : null}
            {block.quote ? (
              <Reveal>
                <div
                  className="relative mb-8 p-8 pl-10"
                  style={{
                    background: "var(--g-ink)",
                    color: "var(--paper)",
                    borderRadius: 18,
                  }}
                >
                  <span
                    aria-hidden
                    className="absolute"
                    style={{
                      top: -10,
                      left: 32,
                      fontFamily: "var(--f-serif)",
                      fontSize: 90,
                      lineHeight: 1,
                      color: "var(--maroon)",
                    }}
                  >
                    "
                  </span>
                  <div
                    style={{
                      fontFamily: "var(--f-serif)",
                      fontSize: 22,
                      lineHeight: 1.45,
                      fontStyle: "italic",
                      color: "var(--paper)",
                    }}
                    data-tina-field={tinaField(block, "quote")}
                  >
                    <RichText value={block.quote} />
                  </div>
                </div>
              </Reveal>
            ) : null}
            {block.paragraph2 ? (
              <Reveal>
                <div
                  style={{ fontSize: 16, color: "var(--ink-soft)", lineHeight: 1.8 }}
                  data-tina-field={tinaField(block, "paragraph2")}
                >
                  <RichText value={block.paragraph2} />
                </div>
              </Reveal>
            ) : null}
          </div>

          <div
            className="hidden lg:block lg:sticky lg:top-28"
            data-tina-field={tinaField(block, "sideImage")}
          >
            <Polaroid rotate={3} washiColor="var(--gold-deep)" hoverStraighten>
              <ArtTile
                palette="moss"
                width="100%"
                height={240}
                src={(block.sideImage as string | undefined) || STUDIO_ART}
                alt="Digital landscape painting"
                radius={2}
              />
              {block.sideCaption ? (
                <div
                  className="mt-3 text-center"
                  style={{
                    fontFamily: "var(--f-serif)",
                    fontSize: 13,
                    fontStyle: "italic",
                    color: "var(--ink-mute)",
                  }}
                  data-tina-field={tinaField(block, "sideCaption")}
                >
                  {block.sideCaption as string}
                </div>
              ) : null}
            </Polaroid>
          </div>
        </div>
      </div>
    </section>
  );
}
