import { tinaField } from "tinacms/react";
import { cn } from "@/lib/utils";
import type { Block } from "@/pages/blocks/block-utils";

interface Props {
  block: Block;
}

const ASPECT_CLASS: Record<string, string> = {
  landscape: "aspect-[16/10]",
  square: "aspect-square",
  portrait: "aspect-[3/4] max-w-md mx-auto",
};

export default function ArticleImage({ block }: Props) {
  const src = block.src as string | undefined;
  const alt = (block.alt as string) || "";
  const caption = block.caption as string | undefined;
  const width = (block.width as string) || "content";
  const aspect = (block.aspect as string) || "auto";

  if (!src) {
    return (
      <div
        className="my-6 rounded-md bg-muted/50 aspect-[16/10] flex items-center justify-center text-sm text-muted-foreground"
        data-tina-field={tinaField(block, "src")}
      >
        Add an image
      </div>
    );
  }

  const framed = aspect !== "auto" && ASPECT_CLASS[aspect];

  return (
    <figure
      className={cn("my-8", width === "wide" && "md:-mx-6 lg:-mx-10")}
      data-tina-field={tinaField(block, "src")}
    >
      {framed ? (
        <div className={cn("overflow-hidden rounded-md bg-[var(--paper-3)]", ASPECT_CLASS[aspect])}>
          <img src={src} alt={alt} className="w-full h-full object-cover" loading="lazy" />
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          className="w-full rounded-md"
          loading="lazy"
          data-tina-field={tinaField(block, "alt")}
        />
      )}
      {caption ? (
        <figcaption
          className="mt-2.5 text-center text-sm text-muted-foreground font-sans"
          data-tina-field={tinaField(block, "caption")}
        >
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
