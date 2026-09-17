import { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PolaroidProps {
  children: ReactNode;
  caption?: string;
  className?: string;
  style?: CSSProperties;
  /** When true, the polaroid lifts slightly on hover. */
  hoverLift?: boolean;
}

/**
 * Clean framed photo card: paper-colored border with equal padding on all
 * sides, soft drop shadow, optional caption beneath. No tape, no tilt —
 * per client direction (Sep 2026).
 */
export function Polaroid({
  children,
  caption,
  className,
  style,
  hoverLift = false,
}: PolaroidProps) {
  return (
    <div
      className={cn("polaroid", hoverLift && "polaroid-hover", className)}
      style={{
        background: "var(--paper)",
        padding: 14,
        borderRadius: 3,
        boxShadow:
          "0 10px 30px rgba(46,34,34,0.18), 0 2px 4px rgba(46,34,34,0.1)",
        position: "relative",
        transition:
          "transform .35s var(--e-out), box-shadow .35s var(--e-out)",
        ...style,
      }}
    >
      {children}
      {caption && (
        <div
          style={{
            marginTop: 12,
            fontFamily: "var(--f-mono)",
            fontSize: 10,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--ink-mute)",
            textAlign: "center",
          }}
        >
          {caption}
        </div>
      )}
    </div>
  );
}
