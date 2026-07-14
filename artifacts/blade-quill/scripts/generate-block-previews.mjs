/**
 * Generates simple wireframe SVG thumbnails for the Tina "Add Section"
 * visual selector (ui.previewSrc on each block template).
 *
 * Run: node scripts/generate-block-previews.mjs
 * Output: public/admin-previews/<blockName>.svg
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "admin-previews");

const INK = "#1f1a14";
const PAPER = "#fbf6ec";
const PAPER2 = "#f0e8d8";
const ORANGE = "#e55934";
const VIOLET = "#6b5ba8";
const MUTE = "#c9bfa9";

// motif → rough wireframe of the section shape
const BLOCKS = [
  ["homeHero", "Hero — Homepage", "heroCenter"],
  ["aboutHero", "Hero — Portrait", "heroSplit"],
  ["hero", "Hero — Simple", "heroCenter"],
  ["pageHeader", "Page Header", "header"],
  ["text", "Text Section", "text"],
  ["story", "Story Section", "textSide"],
  ["timeline", "Timeline", "timeline"],
  ["statsRow", "Stats Row", "stats"],
  ["featureGrid", "Feature Grid", "grid3"],
  ["cardRow", "Card Row", "grid3"],
  ["pillars", "Pillars — 3 Cards", "grid3"],
  ["imageGallery", "Image Gallery", "masonry"],
  ["videoEmbed", "Video Embed", "video"],
  ["featuredBook", "Featured Book", "featureSplit"],
  ["featuredRelease", "Featured Release", "featureSplit"],
  ["productStrip", "Product Strip", "grid4"],
  ["shopCatalog", "Shop Catalog", "catalog"],
  ["galleryGrid", "Art Gallery Grid", "masonry"],
  ["downloadsGrid", "Downloads Grid", "grid4"],
  ["tutorialsStrip", "YouTube Strip", "darkGrid"],
  ["classesPitch", "Classes Pitch", "featureSplit"],
  ["blogFeed", "Blog Feed", "listSide"],
  ["ctaBand", "CTA Band", "band"],
  ["bigCta", "Big CTA", "heroCenter"],
  ["newsletterSignup", "Newsletter Signup", "form"],
  ["contactInfo", "Contact Info", "header"],
  ["contactForm", "Contact Form", "form"],
  ["kofiSupport", "Ko-fi Support", "centerCard"],
  ["reviewLinks", "Review Buttons", "centerCard"],
  ["marquee", "Announcement Marquee", "band"],
  ["socialLinks", "Social Links", "dots"],
];

const rect = (x, y, w, h, fill, rx = 3) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}"/>`;
const line = (x, y, w, fill = MUTE) => rect(x, y, w, 8, fill, 4);

function motifSvg(motif) {
  switch (motif) {
    case "heroCenter":
      return [
        line(120, 50, 160, INK),
        line(100, 66, 200, INK),
        line(140, 88, 120),
        rect(150, 108, 46, 16, ORANGE, 8),
        rect(204, 108, 46, 16, PAPER2, 8),
      ].join("");
    case "heroSplit":
      return [
        line(40, 55, 120, INK),
        line(40, 71, 90, INK),
        line(40, 93, 130),
        rect(40, 113, 44, 14, ORANGE, 7),
        rect(230, 45, 90, 90, VIOLET, 4),
        rect(255, 70, 90, 90, PAPER2, 4),
      ].join("");
    case "header":
      return [line(40, 60, 150, INK), line(40, 82, 250), line(40, 98, 200)].join("");
    case "text":
      return [
        line(40, 50, 130, INK),
        line(40, 74, 280),
        line(40, 90, 280),
        line(40, 106, 220),
      ].join("");
    case "textSide":
      return [
        rect(40, 50, 30, 8, ORANGE, 4),
        line(90, 50, 120, INK),
        line(90, 74, 170),
        line(90, 90, 170),
        rect(285, 50, 75, 75, PAPER2, 4),
      ].join("");
    case "timeline":
      return [
        rect(60, 45, 3, 100, ORANGE, 1),
        ...[0, 1, 2].flatMap((i) => [
          `<circle cx="61" cy="${58 + i * 36}" r="7" fill="${PAPER}" stroke="${ORANGE}" stroke-width="3"/>`,
          line(85, 53 + i * 36, 100 - i * 10, INK),
          line(85, 66 + i * 36, 150),
        ]),
      ].join("");
    case "stats":
      return [0, 1, 2, 3]
        .flatMap((i) => [
          line(45 + i * 85, 70, 50, i % 2 ? VIOLET : ORANGE),
          line(45 + i * 85, 92, 60),
        ])
        .join("");
    case "grid3":
      return [0, 1, 2]
        .flatMap((i) => [
          rect(45 + i * 108, 45, 92, 70, PAPER2, 4),
          line(45 + i * 108, 125, 70, INK),
          line(45 + i * 108, 140, 92),
        ])
        .join("");
    case "grid4":
      return [0, 1, 2, 3]
        .flatMap((i) => [
          rect(38 + i * 84, 55, 70, 60, PAPER2, 4),
          line(38 + i * 84, 125, 55, INK),
        ])
        .join("");
    case "masonry":
      return [
        rect(45, 45, 92, 90, PAPER2, 4),
        rect(153, 45, 92, 60, MUTE, 4),
        rect(261, 45, 92, 80, PAPER2, 4),
        rect(153, 115, 92, 45, PAPER2, 4),
      ].join("");
    case "video":
      return [
        rect(100, 42, 200, 110, INK, 6),
        `<polygon points="188,80 188,114 218,97" fill="${PAPER}"/>`,
      ].join("");
    case "featureSplit":
      return [
        rect(45, 45, 130, 105, VIOLET, 4),
        line(200, 55, 130, INK),
        line(200, 78, 150),
        line(200, 94, 150),
        rect(200, 118, 55, 16, ORANGE, 8),
      ].join("");
    case "catalog":
      return [
        line(40, 42, 130, INK),
        rect(40, 65, 70, 8, MUTE, 4),
        rect(40, 80, 55, 8, MUTE, 4),
        ...[0, 1].flatMap((r) =>
          [0, 1, 2].map((c) => rect(130 + c * 80, 60 + r * 55, 66, 45, PAPER2, 4))
        ),
      ].join("");
    case "darkGrid":
      return [
        rect(0, 0, 400, 220, INK, 0),
        line(40, 42, 150, PAPER),
        ...[0, 1, 2, 3].map((i) => rect(38 + i * 84, 70, 70, 50, "#3a332a", 4)),
        line(40, 140, 300, "#3a332a"),
      ].join("");
    case "listSide":
      return [
        ...[0, 1, 2].flatMap((i) => [
          rect(40, 48 + i * 34, 46, 24, PAPER2, 3),
          line(96, 55 + i * 34, 110, INK),
        ]),
        rect(240, 45, 120, 110, INK, 8),
        line(255, 65, 80, PAPER),
        rect(255, 115, 90, 14, ORANGE, 7),
      ].join("");
    case "band":
      return [
        rect(0, 75, 400, 55, PAPER2, 0),
        line(40, 95, 150, INK),
        rect(280, 90, 70, 22, ORANGE, 11),
      ].join("");
    case "form":
      return [
        rect(110, 45, 180, 110, INK, 8),
        line(125, 60, 100, PAPER),
        rect(125, 85, 150, 16, "#3a332a", 8),
        rect(125, 110, 150, 18, ORANGE, 9),
      ].join("");
    case "centerCard":
      return [
        rect(90, 40, 220, 120, PAPER2, 8),
        `<circle cx="200" cy="70" r="14" fill="${VIOLET}"/>`,
        line(150, 96, 100, INK),
        line(130, 114, 140),
        rect(160, 132, 80, 16, ORANGE, 8),
      ].join("");
    case "dots":
      return [0, 1, 2, 3]
        .map((i) => `<circle cx="${145 + i * 38}" cy="98" r="12" fill="${i % 2 ? VIOLET : ORANGE}"/>`)
        .join("");
    default:
      return "";
  }
}

mkdirSync(OUT_DIR, { recursive: true });

for (const [name, label, motif] of BLOCKS) {
  const dark = motif === "darkGrid";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="220" viewBox="0 0 400 220">
  <rect width="400" height="220" fill="${PAPER}"/>
  ${motifSvg(motif)}
  <rect x="0" y="182" width="400" height="38" fill="${dark ? "#141110" : INK}"/>
  <text x="16" y="206" font-family="ui-monospace, Menlo, monospace" font-size="15" letter-spacing="1" fill="${PAPER}">${label.toUpperCase()}</text>
</svg>
`;
  writeFileSync(join(OUT_DIR, `${name}.svg`), svg);
  console.log(`wrote ${name}.svg`);
}
console.log(`\n${BLOCKS.length} previews → ${OUT_DIR}`);
