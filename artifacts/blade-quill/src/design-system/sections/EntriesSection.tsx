import { Suspense } from "react";
import type { DesignSystemEntry } from "../types";
import { Section } from "../components/Section";
import { ShowcaseCard } from "../components/ShowcaseCard";

interface Props {
  id: string;
  title: string;
  intro?: string;
  entries: DesignSystemEntry[];
}

/** Preserve first-seen group order from the registry. */
function groupEntries(entries: DesignSystemEntry[]) {
  const groups = new Map<string, DesignSystemEntry[]>();
  for (const entry of entries) {
    const key = entry.group ?? "";
    const list = groups.get(key) ?? [];
    list.push(entry);
    groups.set(key, list);
  }
  return [...groups.entries()];
}

/**
 * Renders one page section (Blocks, Brand, Molecules, Atoms) with optional
 * sub-group headings and an admin-notes panel per entry.
 */
export function EntriesSection({ id, title, intro, entries }: Props) {
  return (
    <Section id={id} title={title}>
      {intro && (
        <p className="text-muted-foreground reading-width -mt-2">{intro}</p>
      )}
      {groupEntries(entries).map(([group, groupItems]) => (
        <div key={group || "default"} className="space-y-8">
          {group && (
            <h2 className="text-xl pt-4 border-b border-border pb-2">{group}</h2>
          )}
          {groupItems.map((entry) => (
            <ShowcaseCard
              key={entry.id}
              id={entry.id}
              name={entry.name}
              description={entry.description}
              guidelines={entry.guidelines}
            >
              <Suspense
                fallback={<div className="h-16 animate-pulse bg-muted rounded" />}
              >
                <entry.demo />
              </Suspense>
            </ShowcaseCard>
          ))}
        </div>
      ))}
    </Section>
  );
}
