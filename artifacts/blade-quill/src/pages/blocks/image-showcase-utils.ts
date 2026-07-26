import type { CSSProperties } from "react";
import type { ArtTilePalette } from "@/components/site/ArtTile";

export interface ShowcaseImage {
  src?: string;
  alt?: string;
  caption?: string;
  size?: string;
}

export const SHOWCASE_PALETTES: ArtTilePalette[] = [
  "lavender",
  "violet",
  "rose",
  "twilight",
  "moss",
  "warm",
];

export const captionStyle: CSSProperties = {
  fontFamily: "var(--f-serif)",
  fontSize: 14,
  fontStyle: "italic",
  color: "var(--ink-mute)",
};

export function splitHeading(text: string): string[] {
  return text.split("\n").filter(Boolean);
}

export function overlayOpacity(level?: string): number {
  switch (level) {
    case "light":
      return 0.35;
    case "dark":
      return 0.72;
    default:
      return 0.52;
  }
}

/** Auto-position floating hero tiles by list index (desktop only). */
export const FLOAT_SLOTS: Array<{
  top: number | string;
  left?: number | string;
  right?: number | string;
  width: number;
  height: number;
  rotate: number;
  palette: ArtTilePalette;
  delay?: string;
}> = [
  { top: 120, left: "4%", width: 170, height: 220, rotate: -7, palette: "lavender" },
  { top: 380, left: 70, width: 140, height: 180, rotate: 5, palette: "violet", delay: "1.2s" },
  { top: 640, left: "6%", width: 120, height: 160, rotate: -4, palette: "rose", delay: "2.4s" },
  { top: 100, right: "5%", width: 160, height: 210, rotate: 6, palette: "twilight" },
  { top: 360, right: "4%", width: 140, height: 180, rotate: -5, palette: "moss", delay: "1.8s" },
  { top: 600, right: 80, width: 130, height: 170, rotate: 4, palette: "warm", delay: "3s" },
];
