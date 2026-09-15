import { tinaField } from "tinacms/react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { cn } from "@/lib/utils";
import { richTextComponents } from "@/components/site/rich-text-components";
import { preserveBlankLines } from "@/lib/rich-text";
import type { Block } from "@/pages/blocks/block-utils";
import { SectionHeading, bodyTextStyle } from "@/pages/blocks/text-style";

interface Props {
  block: Block;
}

/** Article bodies get the shared components plus roomier list spacing. */
const proseComponents: typeof richTextComponents = {
  ...richTextComponents,
  ul: (props) => (
    <ul
      {...props}
      className={cn("list-disc pl-5 space-y-1.5 my-4", (props as { className?: string }).className)}
    />
  ),
  ol: (props) => (
    <ol
      {...props}
      className={cn("list-decimal pl-5 space-y-1.5 my-4", (props as { className?: string }).className)}
    />
  ),
};

export default function ArticleText({ block }: Props) {
  return (
    <div className="mb-6">
      {block.heading ? (
        <SectionHeading
          block={block}
          defaultTag="h2"
          baseSize="clamp(22px, 2.8vw, 28px)"
          className="font-display mb-4"
        >
          {block.heading as string}
        </SectionHeading>
      ) : null}
      {block.body ? (
        <div
          className="prose prose-neutral max-w-none font-sans leading-relaxed text-[1.05rem] [&_p]:mb-4 [&_p:last-child]:mb-0"
          style={bodyTextStyle(block)}
          data-tina-field={tinaField(block, "body")}
        >
          <TinaMarkdown
            content={preserveBlankLines(block.body) as any}
            components={proseComponents}
          />
        </div>
      ) : null}
    </div>
  );
}
