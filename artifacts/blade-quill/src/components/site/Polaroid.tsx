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
 * Rounded photo wrapper. The paper "polaroid" frame was removed per client
 * direction (Nov 2026): images render bare with rounded corners (the radius
 * lives on the image / ArtTile at each call site), with an optional italic
 * caption beneath. The name is kept so existing blocks don't churn.
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
        position: "relative",
        transition: "transform .35s var(--e-out)",
        ...style,
      }}
    >
      {children}
      {caption && (
        <div
          style={{
            marginTop: 12,
            fontFamily: "var(--f-serif)",
            fontSize: 13,
            fontStyle: "italic",
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
