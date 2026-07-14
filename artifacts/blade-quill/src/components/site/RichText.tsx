import { TinaMarkdown, type Components } from "tinacms/dist/rich-text";
import { cn } from "@/lib/utils";
import { isRichText } from "@/lib/rich-text";

type Props = { value: unknown; className?: string };

const components: Components<{}> = {
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
      className={cn(
        "list-disc list-inside space-y-1",
        (props as { className?: string }).className,
      )}
    />
  ),
  ol: (props) => (
    <ol
      {...props}
      className={cn(
        "list-decimal list-inside space-y-1",
        (props as { className?: string }).className,
      )}
    />
  ),
};

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
      <TinaMarkdown content={value as any} components={components} />
    </div>
  );
}
