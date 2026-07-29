import { useLocation } from "wouter";
import { tinaField } from "tinacms/react";
import { Btn } from "@/components/site/Btn";
import { Reveal } from "@/components/site/Reveal";
import { RichText } from "@/components/site/RichText";
import { WordReveal } from "@/components/site/WordReveal";
import { type Block, followLink } from "./block-utils";
import { type ShowcaseImage, splitHeading } from "./image-showcase-utils";
import { SectionHeading, bodyTextStyle, sectionAlignStyle } from "./text-style";

interface Props {
  block: Block;
}

function mosaicClass(layout: string, index: number): string {
  if (layout === "duo") {
    return index === 0 ? "col-span-1 row-span-2" : "col-span-1 row-span-2";
  }
  if (layout === "quad") {
    return index === 0 ? "col-span-2 row-span-2" : "col-span-1 row-span-1";
  }
  // trio default: first image spans two rows
  if (index === 0) return "col-span-1 md:col-span-1 row-span-2";
  return "col-span-1 row-span-1";
}

export default function HeroImageGridBlock({ block }: Props) {
  const [, setLocation] = useLocation();
  const layout = (block.layout as string) || "trio";
  const maxImages = layout === "duo" ? 2 : layout === "quad" ? 4 : 3;
  const images = ((block.images as ShowcaseImage[]) ?? []).filter((img) => img.src).slice(0, maxImages);
  const headingLines = splitHeading((block.heading as string) || "Mosaic");

  const gridCols =
    layout === "duo" ? "grid-cols-2" : layout === "quad" ? "grid-cols-2 md:grid-cols-3" : "grid-cols-2";

  return (
    <section className="py-14 lg:py-24">
      <div className="bq-container">
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-16 items-center">
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
              baseSize="clamp(36px, 5vw, 68px)"
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
                  className="mb-8 max-w-md"
                  style={{ fontSize: 17, color: "var(--ink-soft)", lineHeight: 1.7, ...bodyTextStyle(block) }}
                  data-tina-field={tinaField(block, "subheading")}
                >
                  <RichText value={block.subheading} />
                </div>
              </Reveal>
            ) : null}
            {block.ctaLabel ? (
              <Reveal>
                <Btn
                  kind="primary"
                  size="lg"
                  iconRight="→"
                  onClick={() => followLink(setLocation, block.ctaLink as string | undefined, "/gallery")}
                >
                  <span data-tina-field={tinaField(block, "ctaLabel")}>
                    {block.ctaLabel as string}
                  </span>
                </Btn>
              </Reveal>
            ) : null}
          </div>

          <Reveal>
            <div
              className={`grid ${gridCols} gap-3 auto-rows-[140px] md:auto-rows-[160px]`}
              style={{ minHeight: layout === "duo" ? 340 : 480 }}
            >
              {images.map((img, i) => (
                <div
                  key={i}
                  className={`overflow-hidden rounded-lg ${mosaicClass(layout, i)} flex items-center justify-center bg-[var(--paper-3)]`}
                  style={{ boxShadow: "0 8px 24px rgba(46,34,34,0.14)" }}
                  data-tina-field={tinaField(block, "images", i)}
                >
                  <img
                    src={img.src}
                    alt={img.alt || img.caption || "Artwork"}
                    className="img-fit"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
