import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join } from "path";

const CONTENT_DIR = join(import.meta.dirname, "..", "content");

function stringToRichText(str) {
  if (!str || typeof str !== "string") return str;
  const paras = str
    .split(/\n\n+/)
    .map((p) => p.replace(/\n/g, " ").trim())
    .filter(Boolean);
  if (paras.length === 0) {
    return { type: "root", children: [{ type: "p", children: [{ type: "text", text: "" }] }] };
  }
  return {
    type: "root",
    children: paras.map((text) => ({
      type: "p",
      children: [{ type: "text", text }],
    })),
  };
}

function isAlreadyRichText(val) {
  return val && typeof val === "object" && val.type === "root";
}

function convertField(obj, path) {
  const keys = path.split(".");
  let target = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!target || typeof target !== "object") return;
    target = target[keys[i]];
  }
  const lastKey = keys[keys.length - 1];
  if (!target || !(lastKey in target)) return;
  const val = target[lastKey];
  if (isAlreadyRichText(val)) return;
  if (typeof val !== "string") return;
  target[lastKey] = stringToRichText(val);
  console.log(`  ✓ ${path}`);
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf-8"));
}

function writeJson(path, data) {
  writeFileSync(path, JSON.stringify(data, null, 2) + "\n", "utf-8");
}

// Single-document collections with known field paths
const FIELD_MAP = {
  "home.json": [
    "hero.subheading",
    "artistBanner.bio",
    "classesSection.subheading",
    "classesSection.body",
    "newsletterSection.subheading",
    "bookPromo.description",
  ],
  "about.json": ["leadText", "paragraph1", "paragraph2"],
  "important-links.json": [
    "featuredRelease.description",
    "reviewsSection.intro",
    "kofiSection.body",
  ],
  "shop.json": ["pageDescription"],
  "gallery.json": ["pageDescription"],
  "downloads.json": ["pageDescription"],
  "contact.json": ["pageDescription"],
  "tutorials.json": ["pageDescription"],
};

console.log("Migrating single-document collections...");
for (const [file, fields] of Object.entries(FIELD_MAP)) {
  const filePath = join(CONTENT_DIR, file);
  console.log(`\n${file}:`);
  const data = readJson(filePath);
  for (const field of fields) {
    convertField(data, field);
  }
  writeJson(filePath, data);
}

// Products
console.log("\nMigrating products...");
const productsDir = join(CONTENT_DIR, "products");
for (const file of readdirSync(productsDir).filter((f) => f.endsWith(".json"))) {
  const filePath = join(productsDir, file);
  console.log(`\n${file}:`);
  const data = readJson(filePath);
  convertField(data, "description");
  writeJson(filePath, data);
}

// Posts (excerpt)
console.log("\nMigrating posts...");
const postsDir = join(CONTENT_DIR, "posts");
for (const file of readdirSync(postsDir).filter((f) => f.endsWith(".json"))) {
  const filePath = join(postsDir, file);
  console.log(`\n${file}:`);
  const data = readJson(filePath);
  convertField(data, "excerpt");
  convertField(data, "body");
  writeJson(filePath, data);
}

// Landing pages (blocks)
console.log("\nMigrating landing pages...");
const pagesDir = join(CONTENT_DIR, "pages");
for (const file of readdirSync(pagesDir).filter((f) => f.endsWith(".json"))) {
  const filePath = join(pagesDir, file);
  console.log(`\n${file}:`);
  const data = readJson(filePath);
  if (Array.isArray(data.blocks)) {
    for (const block of data.blocks) {
      if (block._template === "hero" && typeof block.subheading === "string") {
        block.subheading = stringToRichText(block.subheading);
        console.log(`  ✓ hero.subheading`);
      }
      if (block._template === "ctaBand" && typeof block.description === "string") {
        block.description = stringToRichText(block.description);
        console.log(`  ✓ ctaBand.description`);
      }
      if (block._template === "featureGrid" && Array.isArray(block.items)) {
        for (let i = 0; i < block.items.length; i++) {
          const item = block.items[i];
          if (typeof item.description === "string") {
            item.description = stringToRichText(item.description);
            console.log(`  ✓ featureGrid.items[${i}].description`);
          }
        }
      }
    }
  }
  writeJson(filePath, data);
}

console.log("\n✅ Migration complete.");
