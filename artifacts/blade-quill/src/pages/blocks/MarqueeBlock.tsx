import { tinaField } from "tinacms/react";
import { Marquee } from "@/components/home/Marquee";
import { type Block } from "./block-utils";

interface Props {
  block: Block;
}

export default function MarqueeBlock({ block }: Props) {
  const highlightText = block.highlightText as string | undefined;
  const text = block.text as string | undefined;
  if (!highlightText && !text) return null;

  return (
    <div className="border-b border-border/85">
      <p className="sr-only">
        {highlightText}
        {text}
      </p>
      <Marquee
        className="bg-secondary py-2 font-sans text-xs md:text-sm uppercase tracking-[0.18em] text-foreground"
        speed="slow"
        pauseOnHover={false}
        variant="single"
      >
        <span data-tina-field={tinaField(block, "highlightText")}>
          {highlightText ? <span className="text-maroon">{highlightText}</span> : null}
          {text ? <span className="text-muted-foreground">{text}</span> : null}
        </span>
      </Marquee>
    </div>
  );
}
