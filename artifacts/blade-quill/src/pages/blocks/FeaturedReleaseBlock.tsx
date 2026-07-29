import { ArrowUpRight } from "lucide-react";
import { tinaField } from "tinacms/react";
import { Btn } from "@/components/site/Btn";
import { Reveal } from "@/components/site/Reveal";
import { RichText } from "@/components/site/RichText";
import { type Block } from "./block-utils";
import { SectionHeading, bodyTextStyle, sectionAlignStyle } from "./text-style";

interface Props {
  block: Block;
}

export default function FeaturedReleaseBlock({ block }: Props) {
  const frontCoverSrc = (block.coverImage as string | undefined)?.trim() || undefined;
  const backCoverSrc = (block.backCoverImage as string | undefined)?.trim() || undefined;
  const title = block.title as string | undefined;

  return (
    <div className="px-6 md:px-8 py-6">
      <div className="mx-auto max-w-5xl">
        <Reveal className="w-full">
          <section
            className="home-panel p-6 md:p-8 w-full !overflow-visible"
            aria-labelledby="featured-release-heading"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
              <div className="flex flex-col items-center gap-15 pb-15 md:pb-0">
                <div
                  className="flex flex-row items-center justify-center gap-3 md:gap-5 overflow-visible w-full"
                  data-tina-field={tinaField(block, "coverImage")}
                >
                  {frontCoverSrc && (
                    <div className="w-[46%] max-w-[200px] shrink-0">
                      <img
                        src={frontCoverSrc}
                        alt={`${title ?? "Book"} front cover`}
                        className="w-full h-auto object-contain rounded shadow-[0_12px_32px_rgba(46,34,34,0.18)]"
                        style={{ transform: "rotate(-2deg)" }}
                      />
                    </div>
                  )}
                  {backCoverSrc && (
                    <div className="w-[46%] max-w-[200px] shrink-0">
                      <img
                        src={backCoverSrc}
                        alt={`${title ?? "Book"} back cover`}
                        className="w-full h-auto object-contain rounded shadow-[0_12px_32px_rgba(46,34,34,0.18)]"
                        style={{ transform: "rotate(2deg)" }}
                      />
                    </div>
                  )}
                </div>
                {block.ctaLabel && block.ctaHref ? (
                  <div data-tina-field={tinaField(block, "ctaLabel")}>
                    <Btn
                      href={block.ctaHref as string}
                      external
                      analyticsPlacement="featured_release"
                      kind="primary"
                      size="lg"
                      iconRight={<ArrowUpRight className="w-4 h-4" />}
                    >
                      {block.ctaLabel as string}
                    </Btn>
                  </div>
                ) : null}
              </div>

              <div className="text-center md:text-left" style={sectionAlignStyle(block)}>
                {block.eyebrow ? (
                  <p
                    className="eyebrow text-maroon mb-3"
                    data-tina-field={tinaField(block, "eyebrow")}
                  >
                    {block.eyebrow as string}
                  </p>
                ) : null}
                <SectionHeading
                  block={block}
                  field="title"
                  id="featured-release-heading"
                  defaultTag="h2"
                  baseSize="clamp(24px, 3vw, 30px)"
                  className="font-display text-foreground mb-3 leading-tight"
                >
                  {title}
                </SectionHeading>
                {block.description ? (
                  <div style={bodyTextStyle(block)} data-tina-field={tinaField(block, "description")}>
                    <RichText
                      value={block.description}
                      className="font-sans text-sm md:text-base text-muted-foreground leading-relaxed"
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </section>
        </Reveal>
      </div>
    </div>
  );
}
