import type { InsightsDayPoint } from "./types";

export interface GaMetrics {
  sessions: number;
  bounceRate: number | null;
  amazonClicks: number;
  dummyBookRequests: number;
  gaPurchaseEvents: number;
  sessionsByDay: InsightsDayPoint[];
  configured: boolean;
  warning?: string;
}

function parseServiceAccount(): object | null {
  const raw = process.env.GA_SERVICE_ACCOUNT_JSON?.trim();
  if (!raw) return null;
  try {
    return JSON.parse(raw) as object;
  } catch {
    // Support base64-encoded JSON for easier Vercel env pasting.
    try {
      return JSON.parse(Buffer.from(raw, "base64").toString("utf8")) as object;
    } catch {
      return null;
    }
  }
}

function metricValue(
  row: { metricValues?: Array<{ value?: string | null }> | null } | undefined,
  index: number
): number {
  const raw = row?.metricValues?.[index]?.value;
  if (raw == null || raw === "") return 0;
  const n = Number(raw);
  return Number.isFinite(n) ? n : 0;
}

export async function fetchGaMetrics(
  startDate: string,
  endDate: string
): Promise<GaMetrics> {
  const propertyId = process.env.GA_PROPERTY_ID?.trim();
  const credentials = parseServiceAccount();

  if (!propertyId || !credentials) {
    return {
      sessions: 0,
      bounceRate: null,
      amazonClicks: 0,
      dummyBookRequests: 0,
      gaPurchaseEvents: 0,
      sessionsByDay: [],
      configured: false,
      warning:
        "GA4 Data API is not configured (set GA_PROPERTY_ID and GA_SERVICE_ACCOUNT_JSON).",
    };
  }

  // Dynamic import: @google-analytics/data is ESM; Vercel functions are CJS.
  const { BetaAnalyticsDataClient } = await import("@google-analytics/data");
  const client = new BetaAnalyticsDataClient({ credentials });
  const property = `properties/${propertyId}`;

  const [summaryRes, eventsRes, dailyRes] = await Promise.all([
    client.runReport({
      property,
      dateRanges: [{ startDate, endDate }],
      metrics: [{ name: "sessions" }, { name: "bounceRate" }],
    }),
    client.runReport({
      property,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: "eventName" }],
      metrics: [{ name: "eventCount" }],
      dimensionFilter: {
        filter: {
          fieldName: "eventName",
          inListFilter: {
            values: ["amazon_click", "dummy_book_request", "purchase"],
          },
        },
      },
    }),
    client.runReport({
      property,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: "date" }],
      metrics: [{ name: "sessions" }],
      orderBys: [{ dimension: { dimensionName: "date" } }],
    }),
  ]);

  const summaryRow = summaryRes[0]?.rows?.[0];
  const sessions = metricValue(summaryRow, 0);
  const bounceRaw = metricValue(summaryRow, 1);
  // GA4 bounceRate is 0–1; expose as a percentage for the UI.
  const bounceRate =
    summaryRow?.metricValues?.[1]?.value != null ? bounceRaw * 100 : null;

  let amazonClicks = 0;
  let dummyBookRequests = 0;
  let gaPurchaseEvents = 0;
  for (const row of eventsRes[0]?.rows ?? []) {
    const name = row.dimensionValues?.[0]?.value ?? "";
    const count = metricValue(row, 0);
    if (name === "amazon_click") amazonClicks = count;
    else if (name === "dummy_book_request") dummyBookRequests = count;
    else if (name === "purchase") gaPurchaseEvents = count;
  }

  const sessionsByDay: InsightsDayPoint[] = (dailyRes[0]?.rows ?? []).map(
    (row) => {
      const raw = row.dimensionValues?.[0]?.value ?? "";
      // GA returns YYYYMMDD
      const date =
        raw.length === 8
          ? `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`
          : raw;
      return { date, sessions: metricValue(row, 0) };
    }
  );

  return {
    sessions,
    bounceRate,
    amazonClicks,
    dummyBookRequests,
    gaPurchaseEvents,
    sessionsByDay,
    configured: true,
  };
}
