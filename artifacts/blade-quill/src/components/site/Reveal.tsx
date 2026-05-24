import {
  ElementType,
  ReactNode,
  useEffect,
  useRef,
  CSSProperties,
} from "react";
import { cn } from "@/lib/utils";

interface RevealOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

/**
 * Adds `.in` to the returned ref'd element once it intersects the
 * viewport. Also fires an immediate `requestAnimationFrame` check so
 * elements already in viewport on mount don't sit invisible — the
 * exact behavior documented in HANDOFF.md ("Use IntersectionObserver +
 * an immediate rAF check").
 */
export function useReveal<T extends HTMLElement = HTMLElement>(
  opts: RevealOptions = {}
) {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const checkNow = () => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight - 40 && r.bottom > 0) {
        el.classList.add("in");
        return true;
      }
      return false;
    };
    const raf = window.requestAnimationFrame(() => {
      checkNow();
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add("in");
            if (opts.once !== false) io.unobserve(el);
          }
        });
      },
      {
        threshold: opts.threshold ?? 0.05,
        rootMargin: opts.rootMargin ?? "0px 0px 80px 0px",
      }
    );
    io.observe(el);
    return () => {
      window.cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [opts.threshold, opts.rootMargin, opts.once]);
  return ref;
}

interface RevealProps {
  children: ReactNode;
  stagger?: boolean;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
}

export function Reveal({
  children,
  stagger,
  as: Tag = "div",
  className,
  style,
}: RevealProps) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <Tag
      ref={ref}
      className={cn(stagger ? "reveal-stagger" : "reveal", className)}
      style={style}
    >
      {children}
    </Tag>
  );
}
