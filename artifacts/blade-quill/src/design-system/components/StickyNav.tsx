import type { AtomicCategory, DesignSystemEntry } from "../types";

interface Props {
  entries: DesignSystemEntry[];
}

const SECTIONS: { id: string; label: string; category?: AtomicCategory }[] = [
  { id: "blocks", label: "Page Blocks", category: "block" },
  { id: "brand", label: "Brand Components", category: "brand" },
  { id: "molecules", label: "Molecules", category: "molecule" },
  { id: "atoms", label: "Atoms", category: "atom" },
  { id: "tokens", label: "Tokens" },
  { id: "media-guide", label: "Images & Media" },
];

/** Preserve first-seen group order from the registry. */
function groupedEntries(entries: DesignSystemEntry[]) {
  const groups = new Map<string, DesignSystemEntry[]>();
  for (const entry of entries) {
    const key = entry.group ?? "";
    const list = groups.get(key) ?? [];
    list.push(entry);
    groups.set(key, list);
  }
  return [...groups.entries()];
}

export function StickyNav({ entries }: Props) {
  return (
    <nav className="hidden lg:block sticky top-4 w-60 shrink-0 max-h-[calc(100vh-2rem)] overflow-y-auto text-sm pr-2">
      <ul className="space-y-4">
        {SECTIONS.map((section) => {
          const sectionEntries = section.category
            ? entries.filter((e) => e.category === section.category)
            : [];
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className="font-medium text-foreground hover:text-primary transition-colors"
              >
                {section.label}
              </a>
              {sectionEntries.length > 0 && (
                <div className="mt-1 ml-3 space-y-2">
                  {groupedEntries(sectionEntries).map(([group, groupItems]) => (
                    <div key={group || "default"}>
                      {group && (
                        <p className="mt-2 mb-0.5 font-mono text-[10px] tracking-[0.14em] uppercase text-muted-foreground/70">
                          {group}
                        </p>
                      )}
                      <ul className="space-y-0.5">
                        {groupItems.map((entry) => (
                          <li key={entry.id}>
                            <a
                              href={`#${entry.id}`}
                              className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                              {entry.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
