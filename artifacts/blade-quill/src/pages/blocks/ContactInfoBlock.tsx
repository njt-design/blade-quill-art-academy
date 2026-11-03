import { Mail, MapPin } from "lucide-react";
import { tinaField } from "tinacms/react";
import { type Block } from "./block-utils";

interface Props {
  block: Block;
}

export default function ContactInfoBlock({ block }: Props) {
  return (
    <section className="py-2">
      <div className="bq-container">
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-6 mb-4 text-sm text-muted-foreground">
          {block.email ? (
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span data-tina-field={tinaField(block, "email")}>
                {block.email as string}
              </span>
            </div>
          ) : null}
          {block.location ? (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span data-tina-field={tinaField(block, "location")}>
                {block.location as string}
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
