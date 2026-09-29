import type { CSSProperties } from "react";
import { tinaField } from "tinacms/react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { richTextComponents } from "@/components/site/rich-text-components";
import { preserveBlankLines } from "@/lib/rich-text";
import { cn } from "@/lib/utils";
import { SectionHeading, bodyTextStyle, sectionAlignStyle } from "./text-style";

export type TextBlockAlign = "left" | "center" | "right";

interface Props {
  block: Record<string, unknown>;
  /**
   * Where the text column sits on the page and which way its text lines up.
   * "center" is the original Text Section. Text Style → Alignment (when not
   * Default) still overrides the text alignment, but not the column position.
   */
  align?: TextBlockAlign;
}

/** Column placement per preset: mx-auto centers, mr-auto hugs left, ml-auto hugs right. */
const COLUMN_CLASS: Record<TextBlockAlign, string> = {
  left: "mr-auto",
  center: "mx-auto",
  right: "ml-auto",
};

export default function TextBlock({ block, align = "center" }: Props) {
  // The centered block keeps its original look (browser-default left-aligned
  // text inside a centered column). Left/Right presets set text-align too.
  const presetStyle: CSSProperties =
    align === "center" ? {} : { textAlign: align };
  const override = sectionAlignStyle(block);
  const columnStyle = override.textAlign ? override : presetStyle;

  return (
    <section className="py-12">
      <div
        className={cn("container px-4 md:px-6 max-w-3xl", COLUMN_CLASS[align])}
        style={columnStyle}
      >
        {block.heading ? (
          <SectionHeading
            block={block}
            defaultTag="h2"
            baseSize="clamp(24px, 3vw, 30px)"
            className="font-heading mb-6"
          >
            {block.heading as string}
          </SectionHeading>
        ) : null}
        {block.body ? (
          <div
            className="prose prose-neutral max-w-none"
            style={bodyTextStyle(block)}
            data-tina-field={tinaField(block, "body")}
          >
            <TinaMarkdown
              content={preserveBlankLines(block.body) as any}
              components={richTextComponents}
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
