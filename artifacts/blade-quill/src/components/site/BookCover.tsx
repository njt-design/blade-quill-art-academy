import { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type BookCoverPalette =
  | "warm"
  | "rose"
  | "violet"
  | "twilight"
  | "paper";

interface BookCoverProps {
  title?: ReactNode;
  vol?: string;
  subtitle?: string;
  palette?: BookCoverPalette;
  badge?: string;
  width?: number | string;
  height?: number | string;
  drift?: boolean;
  /** Real cover art src — when provided we render an <img> instead of the gradient placeholder. */
  src?: string;
  alt?: string;
  className?: string;
  style?: CSSProperties;
  rotate?: number;
}

/* Palette keys are kept from the old brand; gradients rebuilt from the
   2026 palette (gold / maroon / brown / taupe / blush), subtle only. */
const PALETTES: Record<BookCoverPalette, { bg: string; ink: string }> = {
  warm: {
    bg: "linear-gradient(160deg, #C29E63 0%, #D9B783 60%, #E5CCA4 100%)",
    ink: "#2E2222",
  },
  rose: {
    bg: "linear-gradient(160deg, #9A5151 0%, #A96A6A 100%)",
    ink: "#EFE7E2",
  },
  violet: {
    bg: "linear-gradient(160deg, #776562 0%, #714B4B 100%)",
    ink: "#EFE7E2",
  },
  twilight: {
    bg: "linear-gradient(180deg, #5A3B3B 0%, #714B4B 50%, #9A5151 100%)",
    ink: "#EFE7E2",
  },
  paper: {
    bg: "linear-gradient(180deg, #D6C6BF 0%, #BFA89E 100%)",
    ink: "#2E2222",
  },
};

/**
 * Stylized placeholder book cover (gradient background, serif title,
 * spine highlight, drop shadow). When a real cover image is available,
 * pass `src` to render it edge-to-edge inside the same frame.
 */
export function BookCover({
  title,
  vol,
  subtitle,
  palette = "warm",
  badge,
  width = "100%",
  height = 380,
  drift,
  src,
  alt,
  className,
  style,
  rotate,
}: BookCoverProps) {
  const p = PALETTES[palette];
  const rot = rotate ? `${rotate}deg` : "0deg";

  return (
    <div
      className={cn(drift && "drift", className)}
      style={
        {
          position: "relative",
          width,
          height,
          background: src ? undefined : p.bg,
          color: p.ink,
          borderRadius: 4,
          padding: src ? 0 : "8% 9%",
          display: "flex",
          flexDirection: "column",
          justifyContent: src ? "center" : "space-between",
          alignItems: src ? "center" : undefined,
          boxShadow:
            "0 8px 20px rgba(46,34,34,0.16), inset -3px 0 8px rgba(0,0,0,0.12)",
          overflow: "hidden",
          fontFamily: "var(--f-serif)",
          transform: rotate ? `rotate(${rot})` : undefined,
          "--rot": rot,
          ...style,
        } as CSSProperties
      }
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          width: 6,
          background:
            "linear-gradient(90deg, rgba(0,0,0,0.18), transparent)",
        }}
      />
      {src ? (
        <img
          src={src}
          alt={alt ?? (typeof title === "string" ? title : "Book cover")}
          className="max-w-full max-h-full w-auto h-auto object-contain"
        />
      ) : (
        <>
          <div>
            {badge && (
              <span
                style={{
                  display: "inline-block",
                  fontFamily: "var(--f-mono)",
                  fontSize: 9,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  border: `1px solid ${p.ink}`,
                  padding: "3px 7px",
                  opacity: 0.7,
                }}
              >
                {badge}
              </span>
            )}
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "clamp(20px, 4.2vw, 32px)",
                lineHeight: 1.05,
                fontWeight: 400,
                marginBottom: 4,
              }}
            >
              {title}
            </div>
            {vol && (
              <div
                style={{
                  fontFamily: "var(--f-mono)",
                  fontSize: 10,
                  letterSpacing: "0.28em",
                  opacity: 0.7,
                  marginTop: 8,
                }}
              >
                {vol}
              </div>
            )}
          </div>
          <div
            style={{
              textAlign: "center",
              fontFamily: "var(--f-mono)",
              fontSize: 9,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              opacity: 0.65,
            }}
          >
            {subtitle}
          </div>
        </>
      )}
    </div>
  );
}
