import { ArrowUpRight } from "lucide-react";
import { tinaField } from "tinacms/react";
import { Btn } from "@/components/site/Btn";
import { Reveal } from "@/components/site/Reveal";
import { RichText } from "@/components/site/RichText";
import { type Block } from "./block-utils";
import { SectionHeading, bodyTextStyle, sectionAlignStyle } from "./text-style";

interface ReviewLink {
  label?: string;
  href?: string;
  region?: string;
}

interface Props {
  block: Block;
}

export default function ReviewLinksBlock({ block }: Props) {
  const links = (block.links as ReviewLink[] | undefined) ?? [];
  const visibleLinks = links.some((l) => l?.label && l?.href);

  return (
    <div className="px-6 md:px-8 py-6">
      <div className="mx-auto max-w-5xl">
        <Reveal className="w-full">
          <section
            className="home-panel p-6 md:p-8 text-center w-full"
            style={sectionAlignStyle(block)}
          >
            {block.heading ? (
              <SectionHeading
                block={block}
                defaultTag="h2"
                baseSize="clamp(24px, 3vw, 30px)"
                className="font-display text-foreground mb-3 leading-tight"
              >
                {block.heading as string}
              </SectionHeading>
            ) : null}
            {block.intro ? (
              <div style={bodyTextStyle(block)} data-tina-field={tinaField(block, "intro")}>
                <RichText
                  value={block.intro}
                  className="font-sans text-sm md:text-base text-muted-foreground reading-width mx-auto mb-4 leading-relaxed"
                />
              </div>
            ) : null}
            {block.ctaHeading ? (
              <p
                className="font-sans font-medium text-foreground mb-5"
                data-tina-field={tinaField(block, "ctaHeading")}
              >
                {block.ctaHeading as string}
              </p>
            ) : null}
            {visibleLinks && (
              <div className="flex flex-wrap items-center justify-center gap-3 mb-5">
                {links.map((link, i) => {
                  if (!link?.label || !link?.href) return null;
                  return (
                    <span key={`${link.region}-${i}`} data-tina-field={tinaField(block, "links", i)}>
                      <Btn
                        href={link.href}
                        external
                        analyticsPlacement="review_links"
                        kind="outline"
                        size="md"
                        iconRight={<ArrowUpRight className="w-4 h-4" />}
                      >
                        {link.label}
                      </Btn>
                    </span>
                  );
                })}
              </div>
            )}
            {block.thankYou ? (
              <p
                className="font-sans text-sm text-muted-foreground"
                data-tina-field={tinaField(block, "thankYou")}
              >
                {block.thankYou as string}
              </p>
            ) : null}
          </section>
        </Reveal>
      </div>
    </div>
  );
}
