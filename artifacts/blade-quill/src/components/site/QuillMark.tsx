import { CSSProperties } from "react";

interface QuillMarkProps {
  /** Rendered width/height in px. Fill most of the tile — e.g. 32 in a 38px tile. */
  size?: number;
  className?: string;
  style?: CSSProperties;
}

/** White feather mark on a transparent background (client artwork, Oct 2026). */
const FEATHER_SRC = `${import.meta.env.BASE_URL}images/brand/feather-white.png`;

/**
 * Brand mark used inside the gradient logo tile in the Nav, Footer, and
 * standalone-page header. The artwork is white, so it must sit on a colored
 * tile (`var(--g-cta)`), not directly on the paper background.
 */
export function QuillMark({ size = 24, className, style }: QuillMarkProps) {
  return (
    <img
      src={FEATHER_SRC}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      draggable={false}
      className={className}
      style={{ display: "block", objectFit: "contain", ...style }}
    />
  );
}
