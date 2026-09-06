import "./load-env.js";
import { createClient } from "@supabase/supabase-js";
import { createRequire } from "node:module";

// @workspace/checkout has no "type": "module", so tsx transpiles it to CJS and
// Node >=25 cannot statically detect its named exports from an ESM import.
// Load it via require() interop instead; types still come from the package.
const { CheckoutError, createCheckoutSession, findTinaProductById } =
  createRequire(import.meta.url)(
    "@workspace/checkout"
  ) as typeof import("@workspace/checkout");

// Usage: pnpm --filter @workspace/scripts run test:checkout [productId]
// (or TEST_PRODUCT_ID=… ). Defaults to 3 — the Krita guide (2) was retired.
const PRODUCT_ID = Number(process.argv[2] ?? process.env.TEST_PRODUCT_ID ?? 3);

async function main() {
  const product = await findTinaProductById(PRODUCT_ID, "https://example.com");
  if (!product) {
    console.error(`Tina product lookup failed for productId=${PRODUCT_ID}`);
    process.exit(1);
  }
  const bySlug = await findTinaProductById(
    PRODUCT_ID,
    "https://example.com",
    product.slug
  );
  if (!bySlug || bySlug.productId !== product.productId) {
    console.error("Tina slug-path lookup failed for", product.slug);
    process.exit(1);
  }
  console.log(
    "TINA_OK",
    JSON.stringify({
      productId: product.productId,
      slug: product.slug,
      price: product.price,
      category: product.category,
      inStock: product.inStock,
      files: product.files.length,
      pathLookup: "ok",
    })
  );

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );

  const probeId = `schema_probe_${Date.now()}`;
  const { error } = await supabase.from("orders").insert({
    stripe_session_id: probeId,
    product_id: product.productId,
    product_name: product.name,
    product_category: product.category,
    product_slug: product.slug,
    gumroad_url: product.gumroadUrl,
    download_url: product.downloadUrl,
    status: "pending",
  });
  if (error) {
    console.error("SCHEMA_ERROR", error.message);
    console.error(
      "Apply lib/db/sql/schema.sql in the Supabase SQL editor, then re-run."
    );
    process.exit(2);
  }
  await supabase.from("orders").delete().eq("stripe_session_id", probeId);
  console.log("SCHEMA_OK");

  // Bundles need orders.download_files (jsonb). Probe it separately so a
  // missing column is reported as a migration to run, not a hard failure.
  const filesProbeId = `${probeId}_files`;
  const filesProbe = await supabase.from("orders").insert({
    stripe_session_id: filesProbeId,
    product_id: product.productId,
    product_name: product.name,
    product_category: product.category,
    product_slug: product.slug,
    download_files: [{ label: "probe", path: "probe/probe.pdf" }],
    status: "pending",
  });
  if (filesProbe.error) {
    console.error(
      "SCHEMA_MIGRATION_NEEDED download_files:",
      filesProbe.error.message,
      "\n  Run in Supabase SQL Editor: alter table orders add column if not exists download_files jsonb;"
    );
  } else {
    await supabase.from("orders").delete().eq("stripe_session_id", filesProbeId);
    console.log("SCHEMA_FILES_OK");
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY ?? "";
  if (
    !stripeKey ||
    stripeKey.endsWith("...") ||
    stripeKey === "sk_test_..." ||
    stripeKey.length < 20
  ) {
    console.log(
      "STRIPE_SKIPPED (set a real STRIPE_SECRET_KEY in .env to create a session)"
    );
    return;
  }

  try {
    const result = await createCheckoutSession({
      productId: PRODUCT_ID,
      quantity: 1,
      productSlug: product.slug,
      baseUrl: "http://localhost:5000",
    });
    console.log(
      "STRIPE_OK",
      JSON.stringify({
        sessionId: result.sessionId,
        urlPrefix: result.url.slice(0, 48),
      })
    );
  } catch (err) {
    if (err instanceof CheckoutError) {
      console.error("CHECKOUT_ERROR", err.status, err.code, err.message);
    } else {
      console.error(err);
    }
    process.exit(1);
  }
}

main();
