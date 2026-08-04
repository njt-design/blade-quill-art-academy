import { tinaField } from "tinacms/react";
import type { Block } from "@/pages/blocks/block-utils";
import { headingAnchorId } from "./article-utils";

interface Props {
  block: Block;
  headingIndex?: number;
}

export default function ArticleHeading({ block, headingIndex = 0 }: Props) {
  const text = String(block.text ?? "");
  const number = block.number ? String(block.number).trim() : "";
  const level = block.level === "h3" ? "h3" : "h2";
  const id = headingAnchorId(text, headingIndex);
  const Tag = level;

  return (
    <Tag
      id={id}
      className={
        level === "h2"
          ? "font-display text-2xl md:text-[1.75rem] text-foreground mt-10 mb-4 scroll-mt-24"
          : "font-display text-xl md:text-2xl text-foreground mt-8 mb-3 scroll-mt-24"
      }
      data-tina-field={tinaField(block, "text")}
    >
      {number ? (
        <span className="text-maroon mr-2 tabular-nums" data-tina-field={tinaField(block, "number")}>
          {number}.
        </span>
      ) : null}
      {text}
    </Tag>
  );
}
