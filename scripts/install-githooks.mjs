#!/usr/bin/env node
/**
 * Point git at repo-local .githooks (Tina admin guardrails on commit).
 * No-op outside a git checkout.
 */
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
if (!existsSync(join(root, ".git"))) process.exit(0);
if (!existsSync(join(root, ".githooks/pre-commit"))) process.exit(0);

try {
  execSync("git config core.hooksPath .githooks", { cwd: root, stdio: "ignore" });
} catch {
  // Non-fatal in CI / restricted environments.
}
