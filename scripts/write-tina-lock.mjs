#!/usr/bin/env node
/**
 * Assemble tina/tina-lock.json from generated _schema/_lookup/_graphql JSON.
 *
 * @tinacms/cli@2.5+ writes the lock during `tinacms dev`, but `tinacms build
 * --local` (used by build:deploy) does not. Tina Cloud indexes the committed
 * lock — keep it in sync after every schema regen.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const gen = join(root, "artifacts/blade-quill/tina/__generated__");
const out = join(root, "artifacts/blade-quill/tina/tina-lock.json");

for (const name of ["_schema.json", "_lookup.json", "_graphql.json"]) {
  if (!existsSync(join(gen, name))) {
    console.error(`Missing ${name} — run tinacms build first.`);
    process.exit(1);
  }
}

const lock = {
  schema: JSON.parse(readFileSync(join(gen, "_schema.json"), "utf8")),
  lookup: JSON.parse(readFileSync(join(gen, "_lookup.json"), "utf8")),
  graphql: JSON.parse(readFileSync(join(gen, "_graphql.json"), "utf8")),
};

writeFileSync(out, JSON.stringify(lock));
const labels = (lock.schema.collections || [])
  .map((c) => `${c.name} → ${c.label}`)
  .join(", ");
console.log(`✓ Wrote tina/tina-lock.json (${labels})`);
