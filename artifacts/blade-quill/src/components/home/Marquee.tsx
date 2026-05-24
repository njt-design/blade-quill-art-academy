import { useReducedMotion } from "framer-motion";

type Speed = "slow" | "medium" | "fast";
type Variant = "loop" | "single";

type Props = {
  children: React.ReactNode;
  className?: string;
  speed?: Speed;
  pauseOnHover?: boolean;
  /** "loop" duplicates content for a seamless fill; "single" shows one copy until it exits. */
  variant?: Variant;
};

const SPEED_SECONDS: Record<Speed, number> = {
  slow: 40,
  medium: 28,
  fast: 18,
};

export function Marquee({
  children,
  className = "",
  speed = "medium",
  pauseOnHover = true,
  variant = "loop",
}: Props) {
  const reduced = useReducedMotion();
  const duration = SPEED_SECONDS[speed];

  if (reduced) {
    return (
      <div className={`overflow-hidden ${className}`} aria-hidden>
        <div className="flex justify-center px-4 py-3">{children}</div>
      </div>
    );
  }

  if (variant === "single") {
    return (
      <div className={`overflow-hidden ${className}`} aria-hidden>
        <div
          className="home-marquee-single inline-block whitespace-nowrap"
          style={{ animationDuration: `${duration}s` }}
        >
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`overflow-hidden ${pauseOnHover ? "group/marquee" : ""} ${className}`}
      aria-hidden
    >
      <div
        className="home-marquee-track flex w-max"
        style={{ animationDuration: `${duration}s` }}
      >
        <div className="flex shrink-0 items-center gap-8 px-4">{children}</div>
        <div className="flex shrink-0 items-center gap-8 px-4" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
