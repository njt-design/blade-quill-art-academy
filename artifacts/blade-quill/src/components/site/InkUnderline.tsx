import { CSSProperties } from "react";

interface InkUnderlineProps {
  color?: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * Hand-drawn curvy SVG path used under active nav links, active product
 * detail tabs, and editorial accents. Stroke color is themable via the
 * `color` prop (defaults to brand maroon).
 */
export function InkUnderline({
  color = "var(--maroon)",
  className,
  style,
}: InkUnderlineProps) {
  return (
    <svg
      viewBox="0 0 200 12"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={className}
      style={{ width: "100%", height: 10, display: "block", ...style }}
    >
      <path
        d="M2 6 Q 50 1, 100 5 T 198 7"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
