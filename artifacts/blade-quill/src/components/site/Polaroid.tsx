import { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PolaroidProps {
  children: ReactNode;
  caption?: string;
  rotate?: number;
  washi?: boolean;
  washiColor?: string;
  className?: string;
  style?: CSSProperties;
  /** When true, the polaroid straightens + lifts on hover (sketchbook touch). */
  hoverStraighten?: boolean;
}

/**
 * White-framed photo card with washi-tape strip on top, optional caption
 * beneath. Tilted at rest via `rotate` — combine with `hoverStraighten`
 * to get the "picked up off the desk" effect.
 */
export function Polaroid({
  children,
  caption,
  rotate = 0,
  washi = true,
  washiColor = "var(--gold)",
  className,
  style,
  hoverStraighten = false,
}: PolaroidProps) {
  return (
    <div
      className={cn("polaroid", hoverStraighten && "polaroid-hover", className)}
      style={{
        background: "var(--paper)",
        padding: "14px 14px 18px",
        borderRadius: 3,
        boxShadow:
          "0 10px 30px rgba(46,34,34,0.18), 0 2px 4px rgba(46,34,34,0.1)",
        transform: `rotate(${rotate}deg)`,
        position: "relative",
        transition:
          "transform .35s var(--e-out), box-shadow .35s var(--e-out)",
        ...style,
      }}
    >
      {washi && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: -10,
            left: "50%",
            transform: "translateX(-50%) rotate(-3deg)",
            width: 90,
            height: 22,
            background: washiColor,
            opacity: 0.7,
            backgroundImage:
              "repeating-linear-gradient(135deg, rgba(255,255,255,0.25) 0 4px, transparent 4px 12px)",
            boxShadow: "0 1px 2px rgba(46,34,34,0.18)",
          }}
        />
      )}
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
