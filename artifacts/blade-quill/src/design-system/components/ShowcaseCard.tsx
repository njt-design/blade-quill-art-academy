import type { ReactNode } from "react";

interface Props {
  id: string;
  name: string;
  description?: string;
  children: ReactNode;
}

export function ShowcaseCard({ id, name, description, children }: Props) {
  return (
    <div id={id} className="scroll-mt-24 rounded-xl border border-border bg-card p-6">
      <h3 className="text-lg mb-1">{name}</h3>
      {description && (
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
      )}
      <div className="rounded-lg border border-border/50 bg-background p-6 overflow-x-auto">
        {children}
      </div>
    </div>
  );
}
