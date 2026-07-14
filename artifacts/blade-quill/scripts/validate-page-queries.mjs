/**
 * Validates the generated page queries (src/lib/page-queries.ts) against the
 * Tina-generated GraphQL schema. Run after `tinacms build`:
 *
 *   pnpm exec tsx scripts/validate-page-queries.mjs
 */
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { sitePageQuery, landingPageQuery } from "../src/lib/page-queries.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// graphql is a transitive dependency (via @tinacms/cli) — resolve it from there.
const require = createRequire(import.meta.url);
const { buildSchema, parse, validate } = require(
  require.resolve("graphql", {
    paths: [dirname(require.resolve("@tinacms/cli/package.json"))],
  })
);
const schema = buildSchema(readFileSync(join(root, "tina/__generated__/schema.gql"), "utf8"));

let failed = false;
for (const [name, query] of [
  ["sitePageQuery", sitePageQuery],
  ["landingPageQuery", landingPageQuery],
]) {
  const errors = validate(schema, parse(query));
  if (errors.length > 0) {
    failed = true;
    console.error(`✗ ${name}:`);
    for (const err of errors) console.error(`  - ${err.message}`);
  } else {
    console.log(`✓ ${name} is valid against the Tina schema`);
  }
}

process.exit(failed ? 1 : 0);
