import { useRef } from "react";
import {
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";

type ScrollScaleMode = "exit" | "reveal";

type Options = {
  mode?: ScrollScaleMode;
};

type ScrollScaleResult = {
  ref: React.RefObject<HTMLDivElement | null>;
  scale: MotionValue<number>;
  opacity: MotionValue<number>;
  reduced: boolean;
};

export function useScrollScale(options: Options = {}): ScrollScaleResult {
  const { mode = "exit" } = options;
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() ?? false;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(
    scrollYProgress,
    mode === "exit" ? [0, 0.5, 1] : [0, 0.35, 0.65, 1],
    mode === "exit" ? [1, 1, 0.97] : [0.96, 1, 1, 1],
  );

  const opacity = useTransform(
    scrollYProgress,
    mode === "exit" ? [0, 0.5, 1] : [0, 0.35, 0.65, 1],
    mode === "exit" ? [1, 1, 0.8] : [0.7, 1, 1, 1],
  );

  return { ref, scale, opacity, reduced };
}
