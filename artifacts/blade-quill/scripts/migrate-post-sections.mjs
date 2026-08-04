/**
 * One-shot: convert legacy post `body` rich-text into Post Sections.
 * Splits top-level h1/h2/h3 into Heading sections; remaining nodes become Text.
 *
 * Usage: node scripts/migrate-post-sections.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const postsDir = path.resolve(__dirname, "../content/posts");

function isHeading(node) {
  return node && (node.type === "h1" || node.type === "h2" || node.type === "h3");
}

function headingText(node) {
  const children = Array.isArray(node.children) ? node.children : [];
  return children
    .map((c) => {
      if (typeof c?.text === "string") return c.text;
      if (c?.type === "text" && typeof c.text === "string") return c.text;
      return "";
    })
    .join("")
    .trim();
}

function emptyRoot(children) {
  return { type: "root", children };
}

function migrateBody(body) {
  if (!body || body.type !== "root" || !Array.isArray(body.children)) {
    return [{ _template: "text", heading: "", body: body || emptyRoot([]) }];
  }

  const sections = [];
  let buffer = [];

  const flushText = () => {
    if (buffer.length === 0) return;
    // Skip buffers that are only empty paragraphs
    const hasContent = buffer.some((n) => {
      if (isHeading(n)) return true;
      if (n.type === "img") return true;
      if (n.type === "p") {
        const t = headingText(n);
        return Boolean(t) || (Array.isArray(n.children) && n.children.some((c) => c?.type === "img" || c?.type === "a"));
      }
      return true;
    });
    if (hasContent) {
      sections.push({
        _template: "text",
        heading: "",
        body: emptyRoot(buffer),
      });
    }
    buffer = [];
  };

  for (const node of body.children) {
    if (isHeading(node)) {
      flushText();
      const text = headingText(node);
      if (text) {
        sections.push({
          _template: "heading",
          number: "",
          text,
          level: node.type === "h3" ? "h3" : "h2",
        });
      }
      continue;
    }
    buffer.push(node);
  }
  flushText();

  return sections.length > 0
    ? sections
    : [{ _template: "text", heading: "", body: emptyRoot([]) }];
}

const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".json"));
let migrated = 0;

for (const file of files) {
  const full = path.join(postsDir, file);
  const post = JSON.parse(fs.readFileSync(full, "utf8"));

  if (Array.isArray(post.sections) && post.sections.length > 0) {
    console.log(`skip ${file} (already has sections)`);
    continue;
  }

  if (!post.body) {
    console.log(`skip ${file} (no body)`);
    continue;
  }

  post.sections = migrateBody(post.body);
  const hasHeadings = post.sections.some((s) => s._template === "heading");
  if (hasHeadings && post.showTableOfContents == null) {
    post.showTableOfContents = true;
  }
  delete post.body;

  fs.writeFileSync(full, JSON.stringify(post, null, 2) + "\n");
  console.log(`migrated ${file} → ${post.sections.length} sections`);
  migrated += 1;
}

console.log(`done (${migrated} files)`);
