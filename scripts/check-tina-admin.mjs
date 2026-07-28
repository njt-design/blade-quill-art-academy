#!/usr/bin/env node
/**
 * Guardrails for the pre-built Tina admin SPA.
 *
 * 1. Dev-clobber: fail if public/admin/index.html points at localhost:4001
 *    (tinacms dev rewrites the committed production admin).
 * 2. Lock drift: if tina/config.ts or tina/blocks.ts changed in the staged
 *    (or working-tree) set, require tina-lock.json + public/admin to change too.
 *
 * Usage:
 *   node scripts/check-tina-admin.mjs           # working tree vs HEAD
 *   node scripts/check-tina-admin.mjs --staged  # git staged files only
 */
import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const app = join(root, "artifacts/blade-quill");
const adminIndex = join(app, "public/admin/index.html");
const schemaFiles = [
  "artifacts/blade-quill/tina/config.ts",
  "artifacts/blade-quill/tina/blocks.ts",
];
const regenFiles = [
  "artifacts/blade-quill/tina/tina-lock.json",
  "artifacts/blade-quill/public/admin/index.html",
];

const stagedOnly = process.argv.includes("--staged");
let failed = false;

function changedPaths() {
  if (stagedOnly) {
    const out = execSync("git diff --cached --name-only --diff-filter=ACMR", {
      cwd: root,
      encoding: "utf8",
    });
    return out.split("\n").map((s) => s.trim()).filter(Boolean);
  }
  const out = execSync("git diff --name-only HEAD --diff-filter=ACMR", {
    cwd: root,
    encoding: "utf8",
  });
  const untracked = execSync("git ls-files --others --exclude-standard", {
    cwd: root,
    encoding: "utf8",
  });
  return [...out.split("\n"), ...untracked.split("\n")]
    .map((s) => s.trim())
    .filter(Boolean);
}

// --- 1. Dev-clobber check -------------------------------------------------
if (existsSync(adminIndex)) {
  const html = readFileSync(adminIndex, "utf8");
  if (html.includes("localhost:4001") || html.includes("127.0.0.1:4001")) {
    console.error(`
✖ Tina admin was overwritten by the local dev server.

  ${adminIndex}
  references localhost:4001 — committing this breaks /admin in production
  ("Failed loading TinaCMS assets").

  Fix:
    git restore artifacts/blade-quill/public/admin/
`);
    failed = true;
  }
} else {
  console.error(`
✖ Missing Tina admin SPA at artifacts/blade-quill/public/admin/index.html

  Regenerate with:
    cd artifacts/blade-quill && pnpm run build:deploy
    git restore artifacts/blade-quill/public/admin/.gitignore
`);
  failed = true;
}

// --- 2. Lock / admin drift check ------------------------------------------
const changed = new Set(changedPaths());
const schemaChanged = schemaFiles.some((f) => changed.has(f));
if (schemaChanged) {
  const missing = regenFiles.filter((f) => !changed.has(f));
  // Also accept any change under public/admin/assets/
  const adminAssetsTouched = [...changed].some((f) =>
    f.startsWith("artifacts/blade-quill/public/admin/")
  );
  const lockTouched = changed.has("artifacts/blade-quill/tina/tina-lock.json");
  if (!lockTouched || !adminAssetsTouched) {
    console.error(`
✖ Tina schema changed without regenerating the admin + lock.

  Changed schema file(s):
${schemaFiles.filter((f) => changed.has(f)).map((f) => `    - ${f}`).join("\n")}

  Missing regenerations:
${!lockTouched ? "    - artifacts/blade-quill/tina/tina-lock.json\n" : ""}${
      !adminAssetsTouched
        ? "    - artifacts/blade-quill/public/admin/ (index.html + assets)\n"
        : ""
    }
  A stale lock breaks /admin login after sign-in (Tina Cloud indexes the lock).

  Fix (from repo root, with artifacts/blade-quill/.env symlinked):
    cd artifacts/blade-quill
    pnpm run build:deploy
    git restore public/admin/.gitignore
    git add tina/__generated__/ tina/tina-lock.json public/admin/
`);
    failed = true;
  } else if (missing.length && !adminAssetsTouched) {
    // unreachable helper — kept for clarity
    void missing;
  }
}

if (failed) {
  process.exit(1);
}

console.log("✓ Tina admin guardrails passed");
