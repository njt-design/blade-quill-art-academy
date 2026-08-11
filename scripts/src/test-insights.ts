import "./load-env.js";
import { createRequire } from "node:module";

// @workspace/insights has no "type": "module", so tsx transpiles it to CJS and
// Node >=25 cannot statically detect its named exports from an ESM import.
// Load it via require() interop instead; types still come from the package.
const { fetchGaMetrics } = createRequire(import.meta.url)(
  "@workspace/insights"
) as typeof import("@workspace/insights");

interface ServiceAccountShape {
  client_email?: string;
  private_key?: string;
  project_id?: string;
}

function parseServiceAccount(raw: string): ServiceAccountShape | null {
  try {
    return JSON.parse(raw) as ServiceAccountShape;
  } catch {
    try {
      return JSON.parse(
        Buffer.from(raw, "base64").toString("utf8")
      ) as ServiceAccountShape;
    } catch {
      return null;
    }
  }
}

function formatDateUTC(d: Date): string {
  return d.toISOString().slice(0, 10);
}

async function main() {
  const propertyId = process.env.GA_PROPERTY_ID?.trim() ?? "";
  const serviceAccountRaw = process.env.GA_SERVICE_ACCOUNT_JSON?.trim() ?? "";

  if (!propertyId && !serviceAccountRaw) {
    console.log(
      "GA_SKIPPED (set GA_PROPERTY_ID and GA_SERVICE_ACCOUNT_JSON in .env to test the GA4 Data API)"
    );
    return;
  }

  // Validate config before hitting the API so misconfiguration is obvious.
  if (!propertyId) {
    console.error("GA_CONFIG_ERROR GA_PROPERTY_ID is not set.");
    process.exit(1);
  }
  if (!/^\d+$/.test(propertyId)) {
    console.error(
      `GA_CONFIG_ERROR GA_PROPERTY_ID must be the numeric GA4 property ID (Admin → Property settings), not "${propertyId}". The G-… measurement ID belongs in VITE_GA_MEASUREMENT_ID.`
    );
    process.exit(1);
  }
  if (!serviceAccountRaw) {
    console.error("GA_CONFIG_ERROR GA_SERVICE_ACCOUNT_JSON is not set.");
    process.exit(1);
  }
  const serviceAccount = parseServiceAccount(serviceAccountRaw);
  if (!serviceAccount) {
    console.error(
      "GA_CONFIG_ERROR GA_SERVICE_ACCOUNT_JSON is not valid JSON (raw or base64-encoded)."
    );
    process.exit(1);
  }
  if (!serviceAccount.client_email || !serviceAccount.private_key) {
    console.error(
      "GA_CONFIG_ERROR GA_SERVICE_ACCOUNT_JSON parses, but is missing client_email/private_key — download the JSON key for the service account from Google Cloud Console."
    );
    process.exit(1);
  }
  console.log(
    "GA_CONFIG_OK",
    JSON.stringify({
      propertyId,
      serviceAccount: serviceAccount.client_email,
      gcpProject: serviceAccount.project_id ?? null,
    })
  );

  const end = new Date();
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - 27);

  try {
    const metrics = await fetchGaMetrics(
      formatDateUTC(start),
      formatDateUTC(end)
    );
    if (!metrics.configured) {
      // fetchGaMetrics only reports unconfigured when env vars are missing,
      // which the checks above already ruled out — but surface it just in case.
      console.error("GA_ERROR", metrics.warning ?? "GA4 reported unconfigured");
      process.exit(1);
    }
    console.log(
      "GA_OK",
      JSON.stringify({
        rangeDays: 28,
        sessions: metrics.sessions,
        bounceRate: metrics.bounceRate,
        amazonClicks: metrics.amazonClicks,
        dummyBookRequests: metrics.dummyBookRequests,
        gaPurchaseEvents: metrics.gaPurchaseEvents,
        daysWithData: metrics.sessionsByDay.length,
      })
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("GA_ERROR", message);
    if (/PERMISSION_DENIED|403/i.test(message)) {
      console.error(
        "Grant the service account email Viewer access on the GA4 property (GA Admin → Property access management), and enable the Google Analytics Data API in the GCP project."
      );
    } else if (/NOT_FOUND|does not exist/i.test(message)) {
      console.error(
        "Check GA_PROPERTY_ID — it must be the numeric property ID from GA Admin → Property settings."
      );
    }
    process.exit(1);
  }
}

main();
