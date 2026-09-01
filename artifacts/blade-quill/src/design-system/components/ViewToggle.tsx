import type { ViewMode } from "../views";
import { cn } from "@/lib/utils";

const OPTIONS: { value: ViewMode; label: string }[] = [
  { value: "size", label: "By size" },
  { value: "page", label: "By page" },
  { value: "atomic", label: "Atomic" },
];

interface Props {
  view: ViewMode;
  onChange: (view: ViewMode) => void;
}

/** Segmented control switching how the catalog is organized. */
export function ViewToggle({ view, onChange }: Props) {
  return (
    <div
      role="group"
      aria-label="Organize the catalog"
      className="inline-flex rounded-full border border-border bg-background p-0.5 text-xs"
    >
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={view === option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "rounded-full px-3 py-1.5 font-medium transition-colors whitespace-nowrap",
            view === option.value
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
