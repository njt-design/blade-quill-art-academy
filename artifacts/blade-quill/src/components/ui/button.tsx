import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

export function buttonVariants({
  variant = "default",
  size = "default",
  className = "",
}: {
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  className?: string;
} = {}): string {
  const variants: Record<string, string> = {
    // Primary speaks the brand CTA language — same gradient sweep + lift as
    // `Btn kind="primary"`. Never override with flat bg-maroon; if a CTA
    // looks different from this, it's drift.
    default:
      "text-[var(--paper)] bg-[image:var(--g-cta)] [background-size:200%_200%] [background-position:0%_0%] " +
      "hover:[background-position:100%_100%] hover:-translate-y-0.5 hover:shadow-[var(--sh-sm)]",
    secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
    // Same ink outline as `Btn kind="outline"` — fills ink on hover.
    outline:
      "border-[1.5px] border-foreground text-foreground bg-transparent hover:bg-foreground hover:text-[var(--paper)] hover:-translate-y-0.5 hover:shadow-md",
    // Neutral wash only — gold (--accent) is never a button fill or hover.
    ghost: "hover:bg-secondary hover:text-secondary-foreground",
    link: "text-primary underline-offset-4 hover:underline",
  };

  const sizes: Record<string, string> = {
    default: "h-11 px-6 py-2",
    sm: "h-9 px-4 text-xs",
    lg: "h-14 px-8 text-lg",
    icon: "h-11 w-11",
  };

  return cn(
    "inline-flex items-center justify-center whitespace-nowrap rounded-full font-medium font-sans transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
    variants[variant ?? "default"],
    sizes[size ?? "default"],
    className
  );
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={buttonVariants({ variant, size, className })}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
