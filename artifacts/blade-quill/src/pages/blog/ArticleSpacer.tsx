import { tinaField } from "tinacms/react";
import type { Block } from "@/pages/blocks/block-utils";

interface Props {
  block: Block;
}

const SIZE_CLASS: Record<string, string> = {
  small: "h-6 md:h-8",
  medium: "h-10 md:h-14",
  large: "h-16 md:h-24",
};

export default function ArticleSpacer({ block }: Props) {
  const size = (block.size as string) || "medium";
  return (
    <div
      className={SIZE_CLASS[size] ?? SIZE_CLASS.medium}
      aria-hidden="true"
      data-tina-field={tinaField(block, "size")}
    />
  );
}
