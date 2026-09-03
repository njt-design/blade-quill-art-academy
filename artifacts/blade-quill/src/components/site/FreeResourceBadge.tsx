import { cn } from "@/lib/utils";

/**
 * Circular "FREE" download badge shown on gallery artworks that include a
 * free downloadable resource. Paper backing keeps it legible over any image;
 * ink artwork matches the brand. Scales via the parent's width/height classes.
 */
export function FreeResourceBadge({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 72 72"
      className={cn("block", className)}
      role="img"
      aria-label="Includes a free download"
    >
      <circle cx="36" cy="36" r="35" fill="var(--paper)" />
      <circle
        cx="36"
        cy="36"
        r="30.5"
        fill="none"
        stroke="var(--ink)"
        strokeWidth="3"
      />
      <text
        x="36"
        y="32"
        textAnchor="middle"
        fill="var(--ink)"
        fontFamily="var(--font-sans)"
        fontWeight="700"
        fontSize="13.5"
        letterSpacing="1.2"
      >
        FREE
      </text>
      <g
        fill="none"
        stroke="var(--ink)"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M36 39v11" />
        <path d="M31 46l5 5 5-5" />
        <path d="M27.5 54.5h17" />
      </g>
    </svg>
  );
}
