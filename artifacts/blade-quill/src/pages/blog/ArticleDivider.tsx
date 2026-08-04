import { tinaField } from "tinacms/react";
import type { Block } from "@/pages/blocks/block-utils";

interface Props {
  block: Block;
}

export default function ArticleDivider({ block }: Props) {
  const style = (block.style as string) || "line";

  return (
    <div className="my-8 flex justify-center" data-tina-field={tinaField(block, "style")}>
      {style === "dots" ? (
        <div className="flex items-center gap-2 text-brown/50" aria-hidden="true">
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
        </div>
      ) : (
        <hr className="w-full max-w-xs border-0 border-t border-brown/25" />
      )}
    </div>
  );
}
