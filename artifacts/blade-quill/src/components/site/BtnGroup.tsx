import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Brand button-group ordering rule:
 *
 *   horizontal (sm+):  secondary … PRIMARY   (primary on the RIGHT)
 *   stacked (mobile):  PRIMARY on top, secondary below
 *
 * Write children in priority order — PRIMARY FIRST, then secondaries.
 * `sm:flex-row-reverse` flips the horizontal visual order so the primary
 * lands on the right, while the mobile column keeps it on top. (Same
 * pattern as the shadcn alert-dialog footer.)
 *
 * Note on `align`: with row-reverse the main axis runs right-to-left, so
 * the justify values are intentionally inverted — "start" (visual left)
 * packs toward flex-end, and vice versa.
 */
const ALIGN = {
  start: "sm:justify-end",
  center: "sm:justify-center",
  end: "sm:justify-start",
} as const;

interface BtnGroupProps {
  children: ReactNode;
  /** Horizontal alignment of the group on sm+ screens. Default "start" (left). */
  align?: keyof typeof ALIGN;
  className?: string;
}

export function BtnGroup({ children, align = "start", className }: BtnGroupProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row-reverse sm:items-center",
        ALIGN[align],
        className
      )}
    >
      {children}
    </div>
  );
}
