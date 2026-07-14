/**
 * Smoke test: runs the real page queries against the local Tina GraphQL API
 * for every page in content/pages, verifying schema + content agree.
 *
 * Requires `tinacms dev` running on port 4001.
 */
import { readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  sitePageQuery,
  landingPageQuery,
  isCorePageSlug,
} from "../src/lib/page-queries.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const API = "http://localhost:4001/graphql";

const slugs = readdirSync(join(root, "content/pages"))
  .filter((f) => f.endsWith(".json"))
  .map((f) => f.replace(/\.json$/, ""));

let failed = false;
for (const slug of slugs) {
  const isCore = isCorePageSlug(slug);
  const res = await fetch(API, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      query: isCore ? sitePageQuery : landingPageQuery,
      variables: { relativePath: `${slug}.json` },
    }),
  });
  const json = await res.json();
  const doc = json.data?.page ?? json.data?.landingPage;
  if (json.errors?.length || !doc) {
    failed = true;
    console.error(`✗ ${slug} (${isCore ? "page" : "landingPage"})`);
    for (const err of json.errors ?? []) console.error(`  - ${err.message}`);
  } else {
    const blocks = (doc.blocks ?? []).map((b) => b.__typename).join(", ");
    console.log(`✓ ${slug} [${doc.__typename}] title="${doc.title}" layout=${doc.layout}`);
    console.log(`    blocks: ${blocks || "(none)"}`);
  }
}

process.exit(failed ? 1 : 0);
