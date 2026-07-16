/**
 * Smoke test: runs the real navigation query against the local Tina GraphQL
 * API and prints the resolved menu, verifying schema + content + link
 * resolution agree.
 *
 * Requires `tinacms dev` running on port 4001.
 */
import { navigationQuery, resolveNavLinks, resolveNavColumns } from "../src/lib/navigation-queries.ts";

const API = "http://localhost:4001/graphql";

const res = await fetch(API, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({
    query: navigationQuery,
    variables: { relativePath: "main.json" },
  }),
});
const json = await res.json();

if (json.errors?.length || !json.data?.navigation) {
  console.error("✗ navigation query failed");
  for (const err of json.errors ?? []) console.error(`  - ${err.message}`);
  process.exit(1);
}

const nav = json.data.navigation;

console.log("✓ navigation query OK — header menu:");
const fmt = (l) => `${l.label} → ${l.href}${l.external ? " (external)" : ""}`;
for (const link of resolveNavLinks(nav.items)) {
  console.log(`  ${fmt(link)}`);
  for (const child of link.children) console.log(`    ${fmt(child)}`);
}

console.log("✓ footer columns:");
for (const col of resolveNavColumns(nav.footerColumns)) {
  console.log(`  [${col.heading}] ${col.links.map(fmt).join(" | ")}`);
}
