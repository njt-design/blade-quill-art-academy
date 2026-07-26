import { CSSProperties } from "react";
import { cn } from "@/lib/utils";

export type ArtTilePalette =
  | "warm"
  | "rose"
  | "violet"
  | "lavender"
  | "twilight"
  | "moss"
  | "paper"
  | "ink";

/* Palette keys are kept from the old brand; gradients rebuilt from the
   2026 palette (gold / maroon / brown / taupe / blush), subtle only. */
const PALETTES: Record<ArtTilePalette, string> = {
  warm: "linear-gradient(135deg, #D9B783 0%, #C29E63 100%)",
  rose: "linear-gradient(135deg, #A96A6A 0%, #9A5151 100%)",
  violet: "linear-gradient(135deg, #776562 0%, #714B4B 100%)",
  lavender: "linear-gradient(180deg, #776562 0%, #9A5151 100%)",
  twilight:
    "linear-gradient(180deg, #5A3B3B 0%, #714B4B 60%, #9A5151 100%)",
  moss: "linear-gradient(135deg, #776562 0%, #D9B783 100%)",
  paper: "linear-gradient(180deg, #D6C6BF 0%, #BFA89E 100%)",
  ink: "linear-gradient(135deg, #4A3838 0%, #2E2222 100%)",
};

interface ArtTileProps {
  palette?: ArtTilePalette;
  label?: string;
  width?: number | string;
  height?: number | string;
  drift?: boolean;
  rotate?: number;
  /** Real image src — when provided we render the image and keep the label as overlay. */
  src?: string;
  alt?: string;
  className?: string;
  style?: CSSProperties;
  radius?: number;
  /** Lift, straighten, zoom media, and shine on hover (hero floating tiles). */
  interactive?: boolean;
}

const POSITION_KEYS = [
  "position",
  "top",
  "left",
  "right",
  "bottom",
  "animationDelay",
  "zIndex",
] as const;

function splitHeroLayoutStyle(style?: CSSProperties): {
  wrap: CSSProperties;
  inner: CSSProperties;
} {
  if (!style) return { wrap: {}, inner: {} };
  const wrap: CSSProperties = {};
  const inner: CSSProperties = { ...style };
  for (const key of POSITION_KEYS) {
    if (key in style && style[key] !== undefined) {
      wrap[key] = style[key];
      delete inner[key];
    }
  }
  return { wrap, inner };
}

/**
 * Gradient-block placeholder for any artwork slot. Every artwork on the
 * live site should be a real image — these are the on-brand fallbacks
 * (warm gradient + monospace label) until assets arrive.
 */
export function ArtTile({
  palette = "warm",
  label,
  width = "100%",
  height = 200,
  drift,
  rotate,
  src,
  alt,
  className,
  style,
  radius = 8,
  interactive,
}: ArtTileProps) {
  const rot = rotate ? `${rotate}deg` : "0deg";
  const labelColor =
    palette === "paper" ? "var(--ink-mute)" : "rgba(255,255,255,0.78)";

  const tileFaceStyle: CSSProperties = {
    width: interactive ? "100%" : width,
    height: interactive ? "100%" : height,
    background: src ? undefined : PALETTES[palette],
    borderRadius: radius,
    position: "relative",
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(46,34,34,0.12)",
    transform: interactive || !rotate ? undefined : `rotate(${rot})`,
    "--rot": interactive ? undefined : rot,
    ...(src
      ? { display: "flex", alignItems: "center", justifyContent: "center" }
      : {}),
  };

  const { wrap: wrapLayout, inner: innerLayout } = splitHeroLayoutStyle(style);

  const face = (
    <>
      {src && (
        <img
          src={src}
          alt={alt ?? label ?? ""}
          loading="lazy"
          className="art-tile-media max-w-full max-h-full w-auto h-auto object-contain"
        />
      )}
      {label && (
        <span
          className={interactive ? "art-tile-label" : undefined}
          style={{
            position: "absolute",
            bottom: 10,
            left: 12,
            zIndex: 4,
            fontFamily: "var(--f-mono)",
            fontSize: 9,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: labelColor,
            textShadow: src ? "0 1px 2px rgba(0,0,0,0.4)" : undefined,
          }}
        >
          {label}
        </span>
      )}
    </>
  );

  if (interactive) {
    return (
      <div
        className={cn("hero-art-tile-wrap", drift && "drift")}
        style={
          {
            width,
            height,
            transform: rotate ? `rotate(${rot})` : undefined,
            "--rot": rot,
            ...wrapLayout,
          } as CSSProperties
        }
      >
        <div
          className={cn("hero-art-tile", className)}
          style={{ ...tileFaceStyle, ...innerLayout }}
        >
          {face}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(drift && "drift", className)}
      style={{ ...tileFaceStyle, ...style } as CSSProperties}
    >
      {face}
    </div>
  );
}
