import { tinaField } from "tinacms/react";
import { TinaMarkdown } from "tinacms/dist/rich-text";

interface Props {
  block: Record<string, unknown>;
}

export default function TextBlock({ block }: Props) {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        {block.heading && (
          <h2
            className="text-2xl md:text-3xl font-heading mb-6"
            data-tina-field={tinaField(block, "heading")}
          >
            {block.heading as string}
          </h2>
        )}
        {block.body && (
          <div
            className="prose prose-neutral max-w-none"
            data-tina-field={tinaField(block, "body")}
          >
            <TinaMarkdown content={block.body} />
          </div>
        )}
      </div>
    </section>
  );
}
