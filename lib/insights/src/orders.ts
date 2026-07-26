import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { InsightsOrder } from "./types";

let supabaseSingleton: SupabaseClient | null = null;

function getSupabase(): SupabaseClient {
  const url = process.env.SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) {
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set");
  }
  if (!supabaseSingleton) {
    supabaseSingleton = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return supabaseSingleton;
}

export async function fetchOrderInsights(
  startIso: string,
  endIso: string
): Promise<{ stripeSales: number; recentOrders: InsightsOrder[]; warning?: string }> {
  if (
    !process.env.SUPABASE_URL?.trim() ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  ) {
    return {
      stripeSales: 0,
      recentOrders: [],
      warning: "Supabase is not configured; Stripe sales unavailable.",
    };
  }

  const supabase = getSupabase();

  const { count, error: countError } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("status", "paid")
    .gte("created_at", startIso)
    .lte("created_at", endIso);

  if (countError) {
    return {
      stripeSales: 0,
      recentOrders: [],
      warning: `Orders query failed: ${countError.message}`,
    };
  }

  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, product_name, product_slug, customer_email, status, created_at"
    )
    .gte("created_at", startIso)
    .lte("created_at", endIso)
    .order("created_at", { ascending: false })
    .limit(25);

  if (error) {
    return {
      stripeSales: count ?? 0,
      recentOrders: [],
      warning: `Recent orders query failed: ${error.message}`,
    };
  }

  const recentOrders: InsightsOrder[] = (data ?? []).map(
    (row: Record<string, unknown>) => ({
      id: row.id as number,
      productName: (row.product_name as string | null) ?? null,
      productSlug: (row.product_slug as string | null) ?? null,
      customerEmail: (row.customer_email as string | null) ?? null,
      status: String(row.status ?? "pending"),
      createdAt: String(row.created_at),
    })
  );

  return {
    stripeSales: count ?? 0,
    recentOrders,
  };
}
