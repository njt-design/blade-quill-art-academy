import type { CSSProperties, ReactNode } from "react";
import { tinaField } from "tinacms/react";
import { cn } from "@/lib/utils";

export type HeadingTag = "h1" | "h2" | "h3";

export interface TextStyleValues {
  headingSize?: string | null;
  headingType?: string | null;
  headingFont?: string | null;
  align?: string | null;
  bodySize?: string | null;
}

const SIZE_SCALE: Record<string, number> = {
  default: 1,
  smaller: 0.85,
  larger: 1.2,
  xl: 1.45,
};

/** Safe reader for `block.textStyle` from Tina JSON / GraphQL. */
export function getTextStyle(
  block: Record<string, unknown> | null | undefined
): TextStyleValues {
  const raw = block?.textStyle;
  if (!raw || typeof raw !== "object") return {};
  return raw as TextStyleValues;
}

function resolveTag(
  style: TextStyleValues,
  defaultTag: HeadingTag
): HeadingTag {
  const t = style.headingType;
  if (t === "h1" || t === "h2" || t === "h3") return t;
  return defaultTag;
}

function resolveScale(style: TextStyleValues): number {
  const key = style.headingSize ?? "default";
  return SIZE_SCALE[key] ?? 1;
}

function resolveFont(
  style: TextStyleValues,
  defaultTag: HeadingTag
): string | undefined {
  if (style.headingFont === "serif") return "var(--f-serif)";
  if (style.headingFont === "sans") return "var(--f-sans)";
  // Default: keep CSS base (h1 = display/serif, h2/h3 = heading/sans).
  // When the tag changes away from default, match the new tag's family.
  if (style.headingType && style.headingType !== "default") {
    return style.headingType === "h1" ? "var(--f-serif)" : "var(--f-sans)";
  }
  void defaultTag;
  return undefined;
}

function resolveAlign(style: TextStyleValues): CSSProperties["textAlign"] | undefined {
  if (style.align === "left") return "left";
  if (style.align === "center") return "center";
  return undefined;
}

/**
 * Scale a CSS font-size expression. Supports clamp()/px/rem and falls back
 * to wrapping the whole expression in calc() for complex values.
 */
export function scaleFontSize(baseSize: string, scale: number): string {
  if (scale === 1) return baseSize;
  const factor = String(scale);

  // clamp(min, preferred, max) — scale each length token that looks like a size.
  if (baseSize.trim().startsWith("clamp(")) {
    const inner = baseSize.trim().slice(6, -1);
    const parts = inner.split(",").map((p) => p.trim());
    if (parts.length === 3) {
      const scaled = parts.map((part) => {
        const m = part.match(/^(-?[\d.]+)(px|rem|em|vw|vh|%)$/);
        if (m) {
          const n = parseFloat(m[1]) * scale;
          const rounded = Number.isInteger(n) ? String(n) : n.toFixed(3).replace(/\.?0+$/, "");
          return `${rounded}${m[2]}`;
        }
        return `calc(${part} * ${factor})`;
      });
      return `clamp(${scaled.join(", ")})`;
    }
  }

  const simple = baseSize.trim().match(/^(-?[\d.]+)(px|rem|em|vw|vh|%)$/);
  if (simple) {
    const n = parseFloat(simple[1]) * scale;
    const rounded = Number.isInteger(n) ? String(n) : n.toFixed(3).replace(/\.?0+$/, "");
    return `${rounded}${simple[2]}`;
  }

  return `calc((${baseSize}) * ${factor})`;
}

export interface SectionHeadingProps {
  block: Record<string, unknown>;
  /** Tina field name for data-tina-field binding (usually "heading"). */
  field?: string;
  children: ReactNode;
  defaultTag: HeadingTag;
  /** The block's current size, e.g. clamp(30px, 4vw, 48px). */
  baseSize: string;
  className?: string;
  style?: CSSProperties;
  id?: string;
}

/**
 * Renders a section heading with optional CMS textStyle overrides.
 * Pass the block's existing tag + size as defaults so pages look identical
 * until Corinne changes a preset.
 */
export function SectionHeading({
  block,
  field = "heading",
  children,
  defaultTag,
  baseSize,
  className,
  style,
  id,
}: SectionHeadingProps) {
  const textStyle = getTextStyle(block);
  const Tag = resolveTag(textStyle, defaultTag);
  const scale = resolveScale(textStyle);
  const fontFamily = resolveFont(textStyle, defaultTag);
  const textAlign = resolveAlign(textStyle);

  const computed: CSSProperties = {
    fontSize: scaleFontSize(baseSize, scale),
    ...(fontFamily ? { fontFamily } : {}),
    ...(textAlign ? { textAlign } : {}),
    ...style,
  };

  return (
    <Tag
      id={id}
      className={cn(className)}
      style={computed}
      data-tina-field={tinaField(block, field)}
    >
      {children}
    </Tag>
  );
}

/** Style object for body/description wrappers under a styled heading. */
export function bodyTextStyle(
  block: Record<string, unknown> | null | undefined,
  baseSize?: string
): CSSProperties {
  const textStyle = getTextStyle(block);
  const style: CSSProperties = {};
  const align = resolveAlign(textStyle);
  if (align) style.textAlign = align;
  if (textStyle.bodySize === "large") {
    style.fontSize = baseSize
      ? scaleFontSize(baseSize, 1.15)
      : "1.15em";
  }
  return style;
}

/** Alignment-only style (for wrapping a whole text column). */
export function sectionAlignStyle(
  block: Record<string, unknown> | null | undefined
): CSSProperties {
  const align = resolveAlign(getTextStyle(block));
  return align ? { textAlign: align } : {};
}
