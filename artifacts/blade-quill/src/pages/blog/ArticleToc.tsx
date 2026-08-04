import type { TocItem } from "./article-utils";

interface Props {
  items: TocItem[];
}

export default function ArticleToc({ items }: Props) {
  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Table of contents"
      className="mb-10 rounded-md border border-brown/15 bg-secondary/30 px-5 py-4"
    >
      <p className="text-xs uppercase tracking-widest font-bold text-brown mb-3">
        In this article
      </p>
      <ol className="space-y-2 list-none m-0 p-0">
        {items.map((item, i) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="text-sm font-sans text-foreground/85 hover:text-maroon transition-colors inline-flex gap-2"
            >
              <span className="text-maroon tabular-nums shrink-0">
                {item.number || String(i + 1)}.
              </span>
              <span>{item.text}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
