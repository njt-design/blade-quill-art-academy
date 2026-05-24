import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

type Props = {
  src: string;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
};

export function ParallaxImage({
  src,
  alt,
  className = "",
  loading = "lazy",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  if (reduced) {
    return (
      <img
        src={src}
        alt={alt}
        loading={loading}
        className={`w-full h-full object-cover ${className}`}
      />
    );
  }

  return (
    <motion.div ref={ref} className="relative w-full h-full overflow-hidden">
      <motion.img
        src={src}
        alt={alt}
        loading={loading}
        style={{ y }}
        className={`absolute inset-0 w-full h-[120%] -top-[10%] object-cover ${className}`}
      />
    </motion.div>
  );
}
