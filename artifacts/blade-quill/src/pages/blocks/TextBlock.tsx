import { tinaField } from "tinacms/react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { richTextComponents } from "@/components/site/rich-text-components";
import { SectionHeading, bodyTextStyle, sectionAlignStyle } from "./text-style";

interface Props {
  block: Record<string, unknown>;
}

export default function TextBlock({ block }: Props) {
  return (
    <section className="py-12">
      <div
        className="container mx-auto px-4 md:px-6 max-w-3xl"
        style={sectionAlignStyle(block)}
      >
        {block.heading && (
          <SectionHeading
            block={block}
            defaultTag="h2"
            baseSize="clamp(24px, 3vw, 30px)"
            className="font-heading mb-6"
          >
            {block.heading as string}
          </SectionHeading>
        )}
        {block.body && (
          <div
            className="prose prose-neutral max-w-none"
            style={bodyTextStyle(block)}
            data-tina-field={tinaField(block, "body")}
          >
            <TinaMarkdown
              content={block.body as any}
              components={richTextComponents}
            />
          </div>
        )}
      </div>
    </section>
  );
}
