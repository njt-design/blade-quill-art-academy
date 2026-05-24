import { CSSProperties } from "react";

interface QuillMarkProps {
  size?: number;
  color?: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * Small decorative quill SVG used inside the gradient logo tile in the
 * Nav and Footer. Simple stroke + filled feather — not a complex drawing,
 * keeps small at 16-24px.
 */
export function QuillMark({
  size = 24,
  color = "currentColor",
  className,
  style,
}: QuillMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
      style={style}
    >
      <path
        d="M3 21 Q 10 14, 18 6 Q 19 5, 20 4.5"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M14 8 Q 18 7, 21 4 L 20 8 Q 17 10, 14 10 Z"
        fill={color}
        opacity={0.85}
      />
      <path
        d="M3 21 L 6 19"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
