import { useState, useEffect } from "react";
import {
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";

export { useReducedMotion };

export const EDITORIAL_SPRING = { stiffness: 60, damping: 20 };
export const ELECTRIC_SPRING = { stiffness: 120, damping: 18 };

/**
 * Scrubs a numeric CSS value in sync with the scroll position of a container.
 * Returns a spring-smoothed MotionValue.
 */
export function useParallaxValue(
  containerRef: React.RefObject<HTMLElement | null>,
  outputRange: [number, number],
  options?: {
    inputRange?: [number, number];
    offset?: [string, string];
    spring?: { stiffness: number; damping: number };
  },
): MotionValue<number> {
  const { scrollYProgress } = useScroll({
    target: containerRef as React.RefObject<HTMLElement>,
    offset: (options?.offset ?? ["start start", "end start"]) as any,
  });
  const raw = useTransform(
    scrollYProgress,
    options?.inputRange ?? [0, 1],
    outputRange,
  );
  return useSpring(raw, options?.spring ?? EDITORIAL_SPRING);
}

/** Returns true once page scroll exceeds the given threshold (px). */
export function useScrolledPast(threshold = 60): boolean {
  const [past, setPast] = useState(false);
  useEffect(() => {
    const handler = () => setPast(window.scrollY > threshold);
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, [threshold]);
  return past;
}

export const staggerContainer = (staggerSec = 0.08) => ({
  hidden: {},
  visible: { transition: { staggerChildren: staggerSec } },
});

export const fadeUp = (y = 16) => ({
  hidden: { opacity: 0, y },
  visible: { opacity: 1, y: 0 },
});

export const fadeScale = (scale = 0.97, y = 20) => ({
  hidden: { opacity: 0, y, scale },
  visible: { opacity: 1, y: 0, scale: 1 },
});
