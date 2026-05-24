import type { DesignSystemEntry } from "../types";

interface Props {
  entries: DesignSystemEntry[];
}

const SECTIONS = [
  { id: "organisms", label: "Organisms" },
  { id: "molecules", label: "Molecules" },
  { id: "atoms", label: "Atoms" },
  { id: "tokens", label: "Tokens" },
] as const;

export function StickyNav({ entries }: Props) {
  return (
    <nav className="hidden lg:block sticky top-4 w-56 shrink-0 max-h-[calc(100vh-2rem)] overflow-y-auto text-sm">
      <ul className="space-y-4">
        {SECTIONS.map((section) => {
          const sectionEntries = entries.filter(
            (e) =>
              (section.id === "organisms" && e.category === "organism") ||
              (section.id === "molecules" && e.category === "molecule") ||
              (section.id === "atoms" && e.category === "atom"),
          );
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className="font-medium text-foreground hover:text-primary transition-colors"
              >
                {section.label}
              </a>
              {sectionEntries.length > 0 && (
                <ul className="mt-1 ml-3 space-y-0.5">
                  {sectionEntries.map((entry) => (
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
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
