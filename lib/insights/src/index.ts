import { assertTinaAuthorized, InsightsAuthError } from "./auth";
import { fetchGaMetrics } from "./ga";
import { fetchOrderInsights } from "./orders";
import type { InsightsRange, InsightsResponse } from "./types";

export type { InsightsRange, InsightsResponse, InsightsOrder, InsightsDayPoint } from "./types";
export { InsightsAuthError, assertTinaAuthorized };

const CACHE_TTL_MS = 5 * 60 * 1000;

interface CacheEntry {
  expiresAt: number;
  value: InsightsResponse;
}

const cache = new Map<string, CacheEntry>();

function formatDateUTC(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function resolveRange(raw: unknown): InsightsRange {
  const n = Number(raw);
  if (n === 7 || n === 28 || n === 90) return n;
  return 28;
}

export async function getInsights(opts: {
  clientId: string | undefined;
  authorization: string | undefined;
  rangeDays?: unknown;
}): Promise<InsightsResponse> {
  await assertTinaAuthorized({
    clientId: opts.clientId,
    authorization: opts.authorization,
  });

  const rangeDays = resolveRange(opts.rangeDays);
  const end = new Date();
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - (rangeDays - 1));

  const startDate = formatDateUTC(start);
  const endDate = formatDateUTC(end);
  const startIso = `${startDate}T00:00:00.000Z`;
  const endIso = `${endDate}T23:59:59.999Z`;

  const cacheKey = `${rangeDays}:${startDate}:${endDate}`;
  const hit = cache.get(cacheKey);
  if (hit && hit.expiresAt > Date.now()) {
    return hit.value;
  }

  const warnings: string[] = [];
  const [ga, orders] = await Promise.all([
    fetchGaMetrics(startDate, endDate),
    fetchOrderInsights(startIso, endIso),
  ]);

  if (ga.warning) warnings.push(ga.warning);
  if (orders.warning) warnings.push(orders.warning);

  const value: InsightsResponse = {
    rangeDays,
    startDate,
    endDate,
    sessions: ga.sessions,
    bounceRate: ga.bounceRate,
    stripeSales: orders.stripeSales,
    amazonClicks: ga.amazonClicks,
    dummyBookRequests: ga.dummyBookRequests,
    gaPurchaseEvents: ga.gaPurchaseEvents,
    sessionsByDay: ga.sessionsByDay,
    recentOrders: orders.recentOrders,
    gaConfigured: ga.configured,
    warnings,
  };

  cache.set(cacheKey, { expiresAt: Date.now() + CACHE_TTL_MS, value });
  return value;
}
