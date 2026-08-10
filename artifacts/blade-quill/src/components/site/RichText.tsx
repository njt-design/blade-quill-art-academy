import { TinaMarkdown } from "tinacms/dist/rich-text";
import { cn } from "@/lib/utils";
import { isRichText } from "@/lib/rich-text";
import { richTextComponents } from "@/components/site/rich-text-components";

type Props = { value: unknown; className?: string };

export function RichText({ value, className }: Props) {
  if (!value) return null;

  const wrapperClass = cn(
    "space-y-4 [&_p:empty]:min-h-[1em] [&_li>p]:mb-0 [&_li>p]:space-y-0",
    className,
  );

  if (typeof value === "string") {
    const paragraphs = value.split(/\n\n+/).filter(Boolean);
    if (paragraphs.length === 0) return null;
    return (
      <div className={wrapperClass}>
        {paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    );
  }

  if (!isRichText(value)) return null;

  return (
    <div className={wrapperClass}>
      <TinaMarkdown content={value as any} components={richTextComponents} />
    </div>
  );
}
