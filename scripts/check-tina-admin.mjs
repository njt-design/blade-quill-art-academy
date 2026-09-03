#!/usr/bin/env node
/**
 * Guardrails for the pre-built Tina admin SPA.
 *
 * 1. Dev-clobber: fail if public/admin/index.html points at localhost:4001
 *    (tinacms dev rewrites the committed production admin).
 * 2. Lock drift: if tina/config.ts or tina/blocks.ts changed in the staged
 *    (or working-tree) set, require tina-lock.json + public/admin to change too.
 * 3. Empty credentials: fail if the admin bundle points at
 *    content.tinajs.io/.../content/undefined or lacks a UUID Client ID
 *    (tinacms build without TINA_PUBLIC_CLIENT_ID → "No Access" on login).
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

// --- 1b. Empty Tina Cloud credentials in admin bundle ---------------------
// Login uses the Client ID embedded in the content API URL. Building without
// TINA_PUBLIC_CLIENT_ID bakes content/undefined and every login returns "No Access".
// Note: a bare clientId:"" string also appears in healthy --local builds (library
// default); the reliable signal is the content API URL containing the UUID-shaped
// Client ID — either content.tinajs.io/.../content/<uuid> or, since the zstd
// workaround, the same-origin /tina-api proxy (see docs/tina-cloud-zstd-issue.md).
const UUID_IN_CONTENT_URL =
  /(content\.tinajs\.io|tina-api)\/[^/"']+\/content\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\//i;

function adminBundlePathsToCheck() {
  // Only the HTML entrypoint embeds the content API Client ID.
  // Other index-*.js / mermaid chunks are unrelated and must not be scanned.
  if (!existsSync(adminIndex)) return [];
  const html = readFileSync(adminIndex, "utf8");
  const paths = [];
  for (const m of html.matchAll(/\/admin\/assets\/(index-[a-z0-9]+\.js)/g)) {
    paths.push(join(app, "public/admin/assets", m[1]));
  }
  return [...new Set(paths)].filter((p) => existsSync(p));
}

for (const bundlePath of adminBundlePathsToCheck()) {
  const js = readFileSync(bundlePath, "utf8");
  const hasUndefined = js.includes("content/undefined");
  const hasUuid = UUID_IN_CONTENT_URL.test(js);
  if (hasUndefined || !hasUuid) {
    console.error(`
✖ Tina admin bundle is missing Tina Cloud credentials.

  ${bundlePath}
  ${hasUndefined ? 'contains "content/undefined"' : "has no UUID-shaped content API Client ID"}

  Production /admin will show "No Access" for every login method because
  Tina talks to project "undefined".

  Fix (from repo root, with TINA_PUBLIC_CLIENT_ID + TINA_TOKEN in .env):
    cd artifacts/blade-quill
    pnpm run build:deploy
    git restore public/admin/.gitignore
    # Confirm the new index-*.js contains content/.../<your-client-id>/github/
`);
    failed = true;
    break;
  }
}

// --- 2. Lock / admin drift check ------------------------------------------
const changed = new Set(changedPaths());
const schemaChanged = schemaFiles.some((f) => changed.has(f));
if (schemaChanged) {
  // Also accept any change under public/admin/assets/
  const adminAssetsTouched = [...changed].some((f) =>
    f.startsWith("artifacts/blade-quill/public/admin/")
  );
  const lockTouched = changed.has("artifacts/blade-quill/tina/tina-lock.json");
  const lockPath = join(app, "tina/tina-lock.json");
  const lockExists = existsSync(lockPath);

  // Admin SPA must be regenerated whenever config/blocks change.
  // tina-lock.json only mutates when the GraphQL content schema changes —
  // cmsCallback / UI-only edits in config.ts leave the lock byte-identical,
  // so requiring it in the diff would block valid commits.
  if (!adminAssetsTouched || !lockExists) {
    console.error(`
✖ Tina schema changed without regenerating the admin + lock.

  Changed schema file(s):
${schemaFiles.filter((f) => changed.has(f)).map((f) => `    - ${f}`).join("\n")}

  Missing regenerations:
${!lockExists ? "    - artifacts/blade-quill/tina/tina-lock.json (file missing)\n" : ""}${
      !adminAssetsTouched
        ? "    - artifacts/blade-quill/public/admin/ (index.html + assets)\n"
        : ""
    }
  A stale admin breaks /admin in production. When collections/fields change,
  tina-lock.json must be regenerated too (Tina Cloud indexes the lock).

  Fix (from repo root, with artifacts/blade-quill/.env symlinked):
    cd artifacts/blade-quill
    pnpm run build:deploy
    git restore public/admin/.gitignore
    git add tina/__generated__/ tina/tina-lock.json public/admin/
`);
    failed = true;
  } else if (!lockTouched) {
    console.log(
      "✓ Tina admin regenerated (tina-lock.json unchanged — OK for cmsCallback/UI-only config edits)"
    );
  }
}

if (failed) {
  process.exit(1);
}

console.log("✓ Tina admin guardrails passed");
