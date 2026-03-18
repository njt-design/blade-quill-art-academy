import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "link" | "accent";
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
    default: "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 hover:shadow-primary/30",
    accent: "bg-accent text-accent-foreground shadow-lg shadow-accent/20 hover:bg-accent/90 hover:shadow-accent/30",
    secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
    outline: "border-2 border-primary/50 text-primary hover:bg-primary/10",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline",
  };

  const sizes: Record<string, string> = {
    default: "h-11 px-6 py-2",
    sm: "h-9 rounded-md px-4 text-xs",
    lg: "h-14 rounded-lg px-8 text-lg",
    icon: "h-11 w-11",
  };

  return cn(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium font-sans transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
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
