/**
 * Load repo-root env files before any script that needs Supabase / Stripe.
 * Import this first (before @workspace/db) so process.env is populated.
 */
import { config } from "dotenv";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

for (const name of [".env", ".env.local"] as const) {
  const envPath = path.join(repoRoot, name);
  if (existsSync(envPath)) {
    config({ path: envPath, override: name === ".env.local" });
  }
}
