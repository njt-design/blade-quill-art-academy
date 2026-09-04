import { useLocation } from "wouter";
import { tinaField } from "tinacms/react";
import { ArtTile } from "@/components/site/ArtTile";
import { Btn } from "@/components/site/Btn";
import { BtnGroup } from "@/components/site/BtnGroup";
import { Reveal } from "@/components/site/Reveal";
import { RichText } from "@/components/site/RichText";
import { WordReveal } from "@/components/site/WordReveal";
import { type Block, followLink, isExternalLink } from "./block-utils";
import { FLOAT_SLOTS, type ShowcaseImage, splitHeading } from "./image-showcase-utils";
import { SectionHeading, bodyTextStyle, sectionAlignStyle } from "./text-style";

interface Props {
  block: Block;
}

export default function HeroFloatingImagesBlock({ block }: Props) {
  const [, setLocation] = useLocation();
  const headingLines = splitHeading((block.heading as string) || "Floating images");
  const images = ((block.images as ShowcaseImage[]) ?? []).filter((img) => img.src);
  const secondaryLink = block.ctaSecondaryLink as string | undefined;

  return (
    <section className="relative overflow-hidden pt-32 pb-20 lg:min-h-[88vh]">
      <div aria-hidden className="absolute inset-0 hidden md:block pointer-events-none">
        {images.slice(0, 6).map((img, i) => {
          const slot = FLOAT_SLOTS[i];
          if (!slot) return null;
          return (
            <div key={i} data-tina-field={tinaField(block, "images", i)}>
              <ArtTile
                palette={slot.palette}
                className="art-tile-grain"
                width={slot.width}
                height={slot.height}
                src={img.src}
                alt={img.alt || img.caption || "Artwork"}
                drift
                rotate={slot.rotate}
                interactive
                style={{
                  position: "absolute",
                  top: slot.top,
                  left: slot.left,
                  right: slot.right,
                  animationDelay: slot.delay,
                }}
              />
            </div>
          );
        })}
      </div>

      <div className="bq-container relative z-10">
        <div className="max-w-2xl mx-auto text-center" style={sectionAlignStyle(block)}>
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
            baseSize="clamp(40px, 6.5vw, 84px)"
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
                className="mb-8 mx-auto max-w-lg"
                style={{ fontSize: 17, color: "var(--ink-soft)", lineHeight: 1.7, ...bodyTextStyle(block) }}
                data-tina-field={tinaField(block, "subheading")}
              >
                <RichText value={block.subheading} />
              </div>
            </Reveal>
          ) : null}
          <Reveal>
            <BtnGroup align="center">
              {block.ctaPrimary ? (
                <Btn
                  kind="primary"
                  size="lg"
                  iconRight="→"
                  onClick={() =>
                    followLink(setLocation, block.ctaPrimaryLink as string | undefined, "/gallery")
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

        {images.length > 0 && (
          <div className="mt-12 grid grid-cols-2 gap-3 md:hidden">
            {images.slice(0, 4).map((img, i) => (
              <div key={i} data-tina-field={tinaField(block, "images", i)}>
                <ArtTile
                  palette={FLOAT_SLOTS[i]?.palette ?? "warm"}
                  width="100%"
                  height={160}
                  src={img.src}
                  alt={img.alt || "Artwork"}
                  radius={6}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
