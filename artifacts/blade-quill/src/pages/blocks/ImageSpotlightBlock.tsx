import { tinaField } from "tinacms/react";
import { ArtTile } from "@/components/site/ArtTile";
import { Polaroid } from "@/components/site/Polaroid";
import { Reveal } from "@/components/site/Reveal";
import { RichText } from "@/components/site/RichText";
import { type Block } from "./block-utils";
import { captionStyle, splitHeading } from "./image-showcase-utils";
import { SectionHeading, bodyTextStyle, sectionAlignStyle } from "./text-style";

interface Props {
  block: Block;
}

const ASPECT_CLASS: Record<string, string> = {
  landscape: "aspect-[16/10]",
  square: "aspect-square",
  portrait: "aspect-[3/4] max-w-md mx-auto",
  wide: "aspect-[21/9]",
};

export default function ImageSpotlightBlock({ block }: Props) {
  const aspect = (block.aspect as string) || "landscape";
  const headingLines = block.heading ? splitHeading(block.heading as string) : [];

  return (
    <section className="py-16 lg:py-24" style={sectionAlignStyle(block)}>
      <div className="bq-container max-w-4xl mx-auto">
        {block.eyebrow ? (
          <Reveal>
            <div className="eyebrow-grad mb-4 text-center" data-tina-field={tinaField(block, "eyebrow")}>
              {block.eyebrow as string}
            </div>
          </Reveal>
        ) : null}
        {headingLines.length > 0 && (
          <Reveal>
            <SectionHeading
              block={block}
              defaultTag="h2"
              baseSize="clamp(28px, 4vw, 44px)"
              className="mb-10 text-center"
              style={{ lineHeight: 1.15 }}
            >
              {headingLines.map((line, i) => (
                <span key={`${line}-${i}`}>
                  {i > 0 && <br />}
                  {line}
                </span>
              ))}
            </SectionHeading>
          </Reveal>
        )}
        <Reveal>
          <div data-tina-field={tinaField(block, "image")}>
            <Polaroid rotate={1} washiColor="var(--gold-deep)" hoverStraighten>
              <div className={`overflow-hidden ${ASPECT_CLASS[aspect] ?? ASPECT_CLASS.landscape} img-fit-wrap bg-[var(--paper-3)]`}>
                {block.image ? (
                  <img
                    src={block.image as string}
                    alt={(block.alt as string) || "Spotlight image"}
                    className="img-fit"
                    loading="lazy"
                  />
                ) : (
                  <ArtTile palette="moss" width="100%" height={280} radius={2} />
                )}
              </div>
              {block.caption ? (
                <div className="mt-3 text-center" style={captionStyle} data-tina-field={tinaField(block, "caption")}>
                  {block.caption as string}
                </div>
              ) : null}
            </Polaroid>
          </div>
        </Reveal>
        {block.body ? (
          <Reveal>
            <div
              className="mt-8 max-w-2xl mx-auto text-center"
              style={{ fontSize: 16, color: "var(--ink-soft)", lineHeight: 1.75, ...bodyTextStyle(block) }}
              data-tina-field={tinaField(block, "body")}
            >
              <RichText value={block.body} />
            </div>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
