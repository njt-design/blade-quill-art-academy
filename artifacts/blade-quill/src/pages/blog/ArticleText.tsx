import { tinaField } from "tinacms/react";
import { TinaMarkdown, type Components } from "tinacms/dist/rich-text";
import { cn } from "@/lib/utils";
import type { Block } from "@/pages/blocks/block-utils";
import { SectionHeading, bodyTextStyle } from "@/pages/blocks/text-style";

interface Props {
  block: Block;
}

const proseComponents: Components<{
  img: { url: string; alt?: string; caption?: string };
}> = {
  p: (props) => <p {...props} />,
  break: () => <br />,
  a: (props) => (
    <a
      {...props}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "underline decoration-maroon/60 underline-offset-2 hover:text-maroon transition-colors",
        (props as { className?: string }).className,
      )}
    />
  ),
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
  img: (props) => {
    if (!props?.url) return null;
    return (
      <figure className="my-6">
        <img
          src={props.url}
          alt={props.alt || ""}
          className="w-full rounded-md"
          loading="lazy"
        />
        {props.caption ? (
          <figcaption className="mt-2 text-center text-sm text-muted-foreground">
            {props.caption}
          </figcaption>
        ) : null}
      </figure>
    );
  },
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
          <TinaMarkdown content={block.body as any} components={proseComponents} />
        </div>
      ) : null}
    </div>
  );
}
