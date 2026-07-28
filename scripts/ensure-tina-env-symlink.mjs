#!/usr/bin/env node
/**
 * Tina CLI only reads artifacts/blade-quill/.env (sibling of tina/).
 * Credentials live in the repo-root .env — keep a symlink so builds/dev
 * never run with empty clientId/token (which leaves tina-lock.json stale).
 */
import { existsSync, lstatSync, symlinkSync, unlinkSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const target = join(root, "artifacts/blade-quill/.env");
const source = join(root, ".env");
const relativeSource = relative(dirname(target), source); // ../../.env

if (!existsSync(join(root, "artifacts/blade-quill"))) {
  process.exit(0);
}

if (!existsSync(source)) {
  // Nothing to link yet (fresh clone without secrets).
  process.exit(0);
}

try {
  const existing = lstatSync(target);
  if (existing.isSymbolicLink()) {
    process.exit(0);
  }
  // A real .env file is already there — leave it alone.
  process.exit(0);
} catch {
  // Missing — create the symlink below.
}

try {
  symlinkSync(relativeSource, target);
  console.log(`✓ Linked artifacts/blade-quill/.env → ${relativeSource}`);
} catch (err) {
  console.warn(`Could not create Tina .env symlink: ${err.message}`);
}
