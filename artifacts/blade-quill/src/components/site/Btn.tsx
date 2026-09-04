import {
  ButtonHTMLAttributes,
  CSSProperties,
  MouseEvent,
  ReactNode,
} from "react";
import { cn } from "@/lib/utils";
import { maybeTrackAmazonClick } from "@/lib/analytics";

type BtnKind = "primary" | "outline" | "ghost" | "light";
type BtnSize = "sm" | "md" | "lg";

interface BtnProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "onClick"> {
  children: ReactNode;
  kind?: BtnKind;
  size?: BtnSize;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  /** Render as an `<a>` instead of a `<button>`. */
  href?: string;
  /** Open href in a new tab. */
  external?: boolean;
  /** Explicit anchor target — overrides `external` (e.g. "_top" to break out of an iframe). */
  target?: string;
  /** Save the href as a file (anchor `download` attribute). */
  download?: string | boolean;
  /** Analytics placement label when the href is an Amazon outbound link. */
  analyticsPlacement?: string;
  /** Generic click handler that works for both anchor and button elements. */
  onClick?: (
    e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => void;
}

const SIZES: Record<BtnSize, string> = {
  // min-h keeps even the small size at a comfortable touch-target height.
  sm: "px-4 py-2 text-xs min-h-11",
  md: "px-[22px] py-3.5 text-sm min-h-11",
  lg: "px-7 py-[17px] text-[15px]",
};

const KINDS: Record<BtnKind, string> = {
  primary:
    "text-[var(--paper)] bg-[image:var(--g-cta)] [background-size:200%_200%] [background-position:0%_0%] " +
    "hover:[background-position:100%_100%] hover:-translate-y-0.5 " +
    "hover:shadow-[var(--sh-sm)]",
  outline:
    "border-[1.5px] border-foreground text-foreground bg-transparent " +
    "hover:bg-foreground hover:text-[var(--paper)] hover:-translate-y-0.5 hover:shadow-md",
  ghost: "text-foreground btn-ghost-underline relative",
  light:
    "bg-[var(--paper)] text-foreground hover:-translate-y-0.5 hover:shadow-md",
};

/**
 * The brand button. Primary = gradient pill with hover sweep + lift.
 * Outline = ink border that fills on hover. Ghost = underline draws in
 * from the left. Light = paper-colored, for use on dark backgrounds.
 */
export function Btn({
  children,
  kind = "primary",
  size = "md",
  iconLeft,
  iconRight,
  href,
  external,
  target,
  download,
  analyticsPlacement,
  className,
  style,
  onClick,
  ...rest
}: BtnProps) {
  const handleClick = (e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    if (href) {
      maybeTrackAmazonClick(href, analyticsPlacement || "btn");
    }
    onClick?.(e);
  };
  const classes = cn(
    "relative inline-flex items-center justify-center gap-2.5 rounded-full whitespace-nowrap select-none overflow-hidden",
    "font-sans font-semibold tracking-[0.01em]",
    "transition-[transform,box-shadow,background-position] duration-200",
    "disabled:pointer-events-none disabled:opacity-50",
    SIZES[size],
    KINDS[kind],
    className
  );
  const inner = (
    <>
      {iconLeft && <span aria-hidden>{iconLeft}</span>}
      <span>{children}</span>
      {iconRight && (
        <span aria-hidden className="btn-arrow transition-transform">
          {iconRight}
        </span>
      )}
    </>
  );
  const sharedStyle: CSSProperties = {
    transitionTimingFunction: "var(--e-out)",
    ...style,
  };
  if (href) {
    return (
      <a
        href={href}
        target={target ?? (external ? "_blank" : undefined)}
        rel={target || external ? "noopener noreferrer" : undefined}
        download={download}
        className={classes}
        style={sharedStyle}
        onClick={handleClick}
      >
        {inner}
      </a>
    );
  }
  return (
    <button
      type="button"
      className={classes}
      style={sharedStyle}
      {...rest}
      onClick={handleClick}
    >
      {inner}
    </button>
  );
}
