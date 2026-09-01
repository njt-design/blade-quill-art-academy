import type { DesignSystemEntry } from "../types";
import type { ViewMode, ViewSection } from "../views";
import { ViewToggle } from "./ViewToggle";

interface Props {
  sections: ViewSection[];
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

/** Reference sections anchored at the bottom of the page in every view. */
const REFERENCE_LINKS = [
  { id: "tokens", label: "Tokens" },
  { id: "media-guide", label: "Images & Media" },
] as const;

/** Preserve first-seen group order from the entries. */
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

export function StickyNav({ sections, view, onViewChange }: Props) {
  return (
    <nav className="hidden lg:block sticky top-[72px] w-60 shrink-0 self-start h-[calc(100vh-72px)] overflow-y-auto overscroll-contain text-sm pr-2 pb-8">
      <div className="mb-4">
        <ViewToggle view={view} onChange={onViewChange} />
      </div>
      <ul className="space-y-4">
        {sections.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className="font-medium text-foreground hover:text-primary transition-colors"
            >
              {section.title}
            </a>
            {section.entries.length > 0 && (
              <div className="mt-1 ml-3 space-y-2">
                {groupedEntries(section.entries).map(([group, groupItems]) => (
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
        ))}
        {REFERENCE_LINKS.map((link) => (
          <li key={link.id}>
            <a
              href={`#${link.id}`}
              className="font-medium text-foreground hover:text-primary transition-colors"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
