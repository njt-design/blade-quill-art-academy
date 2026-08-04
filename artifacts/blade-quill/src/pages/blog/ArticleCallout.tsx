import { tinaField } from "tinacms/react";
import { RichText } from "@/components/site/RichText";
import { cn } from "@/lib/utils";
import type { Block } from "@/pages/blocks/block-utils";

interface Props {
  block: Block;
}

const TONE_CLASS: Record<string, string> = {
  tip: "border-maroon/30 bg-maroon/[0.06]",
  note: "border-brown/25 bg-secondary/50",
  warning: "border-amber-700/35 bg-amber-50/80",
};

export default function ArticleCallout({ block }: Props) {
  const tone = (block.tone as string) || "tip";

  return (
    <aside
      className={cn(
        "my-8 rounded-md border px-5 py-4",
        TONE_CLASS[tone] ?? TONE_CLASS.tip,
      )}
    >
      {block.title ? (
        <p
          className="text-xs uppercase tracking-widest font-bold text-maroon mb-2"
          data-tina-field={tinaField(block, "title")}
        >
          {block.title as string}
        </p>
      ) : null}
      {block.body ? (
        <div
          className="text-[0.98rem] font-sans leading-relaxed text-foreground/90"
          data-tina-field={tinaField(block, "body")}
        >
          <RichText value={block.body} />
        </div>
      ) : null}
    </aside>
  );
}
