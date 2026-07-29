import { Fragment } from "react";
import { useLocation } from "wouter";
import { tinaField } from "tinacms/react";
import { Btn } from "@/components/site/Btn";
import { Reveal } from "@/components/site/Reveal";
import { type Block, followLink, isExternalLink } from "./block-utils";
import { SectionHeading, sectionAlignStyle } from "./text-style";

/** Render a heading line, wrapping the highlighted phrase in gradient text. */
function highlightLine(line: string, highlight?: string) {
  if (!highlight || !line.includes(highlight)) return line;
  const [before, ...rest] = line.split(highlight);
  return (
    <>
      {before}
      <span className="grad-text">{highlight}</span>
      {rest.join(highlight)}
    </>
  );
}

interface Props {
  block: Block;
}

export default function BigCtaBlock({ block }: Props) {
  const [, setLocation] = useLocation();
  const headingLines = ((block.heading as string) || "").split("\n").filter(Boolean);
  const highlight = block.highlightText as string | undefined;
  const secondaryLink = block.secondaryLink as string | undefined;

  return (
    <section
      className="py-24 lg:py-28 relative overflow-hidden text-center"
      style={sectionAlignStyle(block)}
    >
      <div className="bq-container relative">
        {block.eyebrow ? (
          <Reveal>
            <div className="eyebrow-grad mb-5" data-tina-field={tinaField(block, "eyebrow")}>
              {block.eyebrow as string}
            </div>
          </Reveal>
        ) : null}
        {headingLines.length > 0 && (
          <Reveal>
            <SectionHeading
              block={block}
              defaultTag="h2"
              baseSize="clamp(42px, 6vw, 72px)"
              className="mb-7"
              style={{ lineHeight: 1.05 }}
            >
              {headingLines.map((line, i) => (
                <Fragment key={`${line}-${i}`}>
                  {i > 0 && <br />}
                  {highlightLine(line, highlight)}
                </Fragment>
              ))}
            </SectionHeading>
          </Reveal>
        )}
        <Reveal>
          <div className="flex flex-wrap justify-center gap-3">
            {block.primaryLabel ? (
              <Btn
                kind="primary"
                size="lg"
                iconRight="→"
                onClick={() =>
                  followLink(setLocation, block.primaryLink as string | undefined, "/contact")
                }
              >
                <span data-tina-field={tinaField(block, "primaryLabel")}>
                  {block.primaryLabel as string}
                </span>
              </Btn>
            ) : null}
            {block.secondaryLabel ? (
              isExternalLink(secondaryLink) ? (
                <Btn kind="outline" size="lg" href={secondaryLink} external iconRight="↗">
                  <span data-tina-field={tinaField(block, "secondaryLabel")}>
                    {block.secondaryLabel as string}
                  </span>
                </Btn>
              ) : (
                <Btn
                  kind="outline"
                  size="lg"
                  onClick={() => followLink(setLocation, secondaryLink, "/")}
                >
                  <span data-tina-field={tinaField(block, "secondaryLabel")}>
                    {block.secondaryLabel as string}
                  </span>
                </Btn>
              )
            ) : null}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
