import { tinaField } from "tinacms/react";
import { RichText } from "@/components/site/RichText";
import { type Block } from "./block-utils";

interface Props {
  block: Block;
}

export default function PageHeaderBlock({ block }: Props) {
  return (
    <section className="pt-10 pb-2">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-2xl mb-4">
          <h1
            className="text-3xl md:text-4xl font-display mb-3"
            data-tina-field={tinaField(block, "heading")}
          >
            {block.heading as string}
          </h1>
          {block.description ? (
            <div
              className="text-base text-muted-foreground font-sans"
              data-tina-field={tinaField(block, "description")}
            >
              <RichText value={block.description} />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
