import "./load-env.js";
import { createClient } from "@supabase/supabase-js";
import {
  CheckoutError,
  createCheckoutSession,
  findTinaProductById,
} from "@workspace/checkout";

async function main() {
  const product = await findTinaProductById(2, "https://example.com");
  if (!product) {
    console.error("Tina product lookup failed for productId=2");
    process.exit(1);
  }
  const bySlug = await findTinaProductById(
    2,
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
      inStock: product.inStock,
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
      productId: 2,
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
