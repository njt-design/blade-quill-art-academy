import { CSSProperties, ElementType, ReactNode, isValidElement } from "react";
import { cn } from "@/lib/utils";
import { useReveal } from "./Reveal";

interface WordRevealProps {
  /** Preferred way to pass the headline content — a plain string. */
  text?: string;
  /** Fallback: extract text from JSX children. */
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  as?: ElementType;
  /** Per-word stagger in ms (default 60). */
  stepMs?: number;
}

function extractText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number")
    return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (isValidElement(node)) {
    const child = (node.props as { children?: ReactNode }).children;
    return child !== undefined ? extractText(child) : "";
  }
  return "";
}

/**
 * Splits the provided text into words, wraps each in its own
 * `overflow:hidden` mask (with descender padding), and animates upward as the
 * containing element enters the viewport. CSS lives in `index.css`
 * (`.word-reveal`).
 */
export function WordReveal({
  text,
  children,
  className,
  style,
  as: Tag = "span",
  stepMs = 60,
}: WordRevealProps) {
  const ref = useReveal<HTMLElement>({ threshold: 0.3 });
  const source = text != null ? String(text) : extractText(children);
  const words = source.split(/\s+/).filter(Boolean);
  return (
    <Tag
      ref={ref}
      className={cn("word-reveal", className)}
      style={style}
    >
      {words.map((w, i) => (
        <span key={`${w}-${i}`} className="word-reveal__mask">
          <span
            className="word-reveal__word"
            style={{ transitionDelay: `${i * stepMs}ms` }}
          >
            {w}
            {i < words.length - 1 ? "\u00A0" : ""}
          </span>
        </span>
      ))}
    </Tag>
  );
}
