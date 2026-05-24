import {
  ButtonHTMLAttributes,
  CSSProperties,
  MouseEvent,
  ReactNode,
} from "react";
import { cn } from "@/lib/utils";

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
  /** Generic click handler that works for both anchor and button elements. */
  onClick?: (
    e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => void;
}

const SIZES: Record<BtnSize, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-[22px] py-3.5 text-sm",
  lg: "px-7 py-[17px] text-[15px]",
};

const KINDS: Record<BtnKind, string> = {
  primary:
    "text-[var(--paper)] bg-[image:var(--g-cta)] [background-size:200%_200%] [background-position:0%_0%] " +
    "shadow-[0_6px_18px_rgba(229,89,52,0.32),0_2px_4px_rgba(229,89,52,0.18)] " +
    "hover:[background-position:100%_100%] hover:-translate-y-0.5 " +
    "hover:shadow-[0_10px_26px_rgba(229,89,52,0.42),0_3px_8px_rgba(229,89,52,0.22)]",
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
  className,
  style,
  ...rest
}: BtnProps) {
  const classes = cn(
    "relative inline-flex items-center justify-center gap-2.5 rounded-full whitespace-nowrap select-none overflow-hidden",
    "font-sans font-semibold tracking-[0.01em]",
    "transition-[transform,box-shadow,background-position] duration-200",
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
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className={classes}
        style={sharedStyle}
        onClick={rest.onClick}
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
      onClick={rest.onClick}
    >
      {inner}
    </button>
  );
}
