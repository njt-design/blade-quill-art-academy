import { useLocation } from "wouter";
import { tinaField } from "tinacms/react";
import { ArtTile } from "@/components/site/ArtTile";
import { Btn } from "@/components/site/Btn";
import { BtnGroup } from "@/components/site/BtnGroup";
import { Polaroid } from "@/components/site/Polaroid";
import { Reveal } from "@/components/site/Reveal";
import { RichText } from "@/components/site/RichText";
import { WordReveal } from "@/components/site/WordReveal";
import { type Block, followLink, isExternalLink } from "./block-utils";
import { captionStyle, splitHeading } from "./image-showcase-utils";
import { SectionHeading, bodyTextStyle, sectionAlignStyle } from "./text-style";

interface Props {
  block: Block;
}

export default function HeroSplitImageBlock({ block }: Props) {
  const [, setLocation] = useLocation();
  const imageRight = (block.imagePosition as string) !== "left";
  const headingLines = splitHeading((block.heading as string) || "Showcase");
  const secondaryLink = block.ctaSecondaryLink as string | undefined;

  const imagePanel = (
    <Reveal>
      <div data-tina-field={tinaField(block, "featuredImage")}>
        <Polaroid
          rotate={imageRight ? 3 : -3}
          washiColor="var(--maroon)"
          hoverStraighten
          style={{ maxWidth: 520, margin: "0 auto" }}
        >
          <ArtTile
            palette="warm"
            width="100%"
            height={420}
            src={block.featuredImage as string | undefined}
            alt={(block.imageAlt as string) || "Featured artwork"}
            radius={2}
          />
          {block.imageCaption ? (
            <div className="mt-3 text-center" style={captionStyle} data-tina-field={tinaField(block, "imageCaption")}>
              {block.imageCaption as string}
            </div>
          ) : null}
        </Polaroid>
      </div>
    </Reveal>
  );

  const textPanel = (
    <div style={sectionAlignStyle(block)}>
      {block.eyebrow ? (
        <Reveal>
          <div className="eyebrow-grad mb-5" data-tina-field={tinaField(block, "eyebrow")}>
            {block.eyebrow as string}
          </div>
        </Reveal>
      ) : null}
      <SectionHeading
        block={block}
        defaultTag="h1"
        baseSize="clamp(36px, 5.5vw, 72px)"
        className="mb-7"
        style={{ lineHeight: 1.05 }}
      >
        {headingLines.map((line, i) => (
          <span key={`${line}-${i}`}>
            {i > 0 && <br />}
            {i === 1 ? (
              <span className="grad-text">
                <WordReveal text={line} />
              </span>
            ) : (
              <WordReveal text={line} />
            )}
          </span>
        ))}
      </SectionHeading>
      {block.subheading ? (
        <Reveal>
          <div
            className="mb-8 max-w-[480px]"
            style={{ fontSize: 17, color: "var(--ink-soft)", lineHeight: 1.7, ...bodyTextStyle(block) }}
            data-tina-field={tinaField(block, "subheading")}
          >
            <RichText value={block.subheading} />
          </div>
        </Reveal>
      ) : null}
      <Reveal>
        <BtnGroup>
          {block.ctaPrimary ? (
            <Btn
              kind="primary"
              size="lg"
              iconRight="→"
              onClick={() =>
                followLink(setLocation, block.ctaPrimaryLink as string | undefined, "/contact")
              }
            >
              <span data-tina-field={tinaField(block, "ctaPrimary")}>
                {block.ctaPrimary as string}
              </span>
            </Btn>
          ) : null}
          {block.ctaSecondary ? (
            isExternalLink(secondaryLink) ? (
              <Btn kind="outline" size="lg" href={secondaryLink} external iconRight="↗">
                <span data-tina-field={tinaField(block, "ctaSecondary")}>
                  {block.ctaSecondary as string}
                </span>
              </Btn>
            ) : (
              <Btn
                kind="outline"
                size="lg"
                onClick={() => followLink(setLocation, secondaryLink, "/shop")}
              >
                <span data-tina-field={tinaField(block, "ctaSecondary")}>
                  {block.ctaSecondary as string}
                </span>
              </Btn>
            )
          ) : null}
        </BtnGroup>
      </Reveal>
    </div>
  );

  return (
    <section className="py-14 lg:py-24 relative overflow-hidden">
      <div className="bq-container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {imageRight ? (
            <>
              {textPanel}
              {imagePanel}
            </>
          ) : (
            <>
              {imagePanel}
              {textPanel}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
