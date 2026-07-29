import { tinaField } from "tinacms/react";
import { RichText } from "@/components/site/RichText";
import { type Block } from "./block-utils";
import { SectionHeading, bodyTextStyle, sectionAlignStyle } from "./text-style";

interface Props {
  block: Block;
}

export default function PageHeaderBlock({ block }: Props) {
  return (
    <section className="pt-10 pb-2">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-2xl mb-4" style={sectionAlignStyle(block)}>
          <SectionHeading
            block={block}
            defaultTag="h1"
            baseSize="clamp(30px, 3.5vw, 36px)"
            className="font-display mb-3"
          >
            {block.heading as string}
          </SectionHeading>
          {block.description ? (
            <div
              className="text-base text-muted-foreground font-sans"
              style={bodyTextStyle(block)}
              data-tina-field={tinaField(block, "description")}
            >
              <RichText value={block.description} />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
