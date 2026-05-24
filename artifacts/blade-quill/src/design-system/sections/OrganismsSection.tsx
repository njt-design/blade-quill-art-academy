import { Suspense } from "react";
import type { DesignSystemEntry } from "../types";
import { Section } from "../components/Section";
import { ShowcaseCard } from "../components/ShowcaseCard";

interface Props {
  entries: DesignSystemEntry[];
}

export function OrganismsSection({ entries }: Props) {
  return (
    <Section id="organisms" title="Organisms">
      {entries.map((entry) => (
        <ShowcaseCard
          key={entry.id}
          id={entry.id}
          name={entry.name}
          description={entry.description}
        >
          <Suspense
            fallback={
              <div className="h-16 animate-pulse bg-muted rounded" />
            }
          >
            <entry.demo />
          </Suspense>
        </ShowcaseCard>
      ))}
    </Section>
  );
}
