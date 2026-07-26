import crypto from "node:crypto";
import { getSupabase } from "./clients";
import type { CheckoutProduct } from "./types";

export interface OrderRow {
  id: number;
  stripe_session_id: string;
  product_id: number;
  product_name: string | null;
  product_category: string | null;
  product_slug: string | null;
  gumroad_url: string | null;
  download_url: string | null;
  customer_email: string | null;
  status: string;
  download_token: string | null;
  download_token_expires_at: string | null;
}

function generateDownloadToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

function getTokenExpiry(): string {
  const expiry = new Date();
  expiry.setHours(expiry.getHours() + 48);
  return expiry.toISOString();
}

export async function insertPendingOrder(
  sessionId: string,
  product: CheckoutProduct
): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase.from("orders").insert({
    stripe_session_id: sessionId,
    product_id: product.productId,
    product_name: product.name,
    product_category: product.category,
    product_slug: product.slug,
    gumroad_url: product.gumroadUrl,
    download_url: product.downloadUrl,
    status: "pending",
  });
  if (error) throw error;
}

export async function getOrderBySessionId(
  sessionId: string
): Promise<OrderRow | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("stripe_session_id", sessionId)
    .maybeSingle();
  if (error) throw error;
  return (data as OrderRow | null) ?? null;
}

export async function getOrderByDownloadToken(
  token: string
): Promise<OrderRow | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("download_token", token)
    .maybeSingle();
  if (error) throw error;
  return (data as OrderRow | null) ?? null;
}

export async function fulfillOrder(
  sessionId: string,
  customerEmail: string | null
): Promise<OrderRow | null> {
  const order = await getOrderBySessionId(sessionId);
  if (!order) return null;
  if (order.status === "paid") {
    if (customerEmail && !order.customer_email) {
      const supabase = getSupabase();
      await supabase
        .from("orders")
        .update({ customer_email: customerEmail })
        .eq("stripe_session_id", sessionId);
      return { ...order, customer_email: customerEmail };
    }
    return order;
  }

  const updates: Record<string, unknown> = {
    status: "paid",
    ...(customerEmail ? { customer_email: customerEmail } : {}),
  };

  const category = order.product_category;
  const downloadUrl = order.download_url;
  if (
    (category === "digital" || category === "curriculum") &&
    downloadUrl
  ) {
    updates.download_token = generateDownloadToken();
    updates.download_token_expires_at = getTokenExpiry();
  }

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("orders")
    .update(updates)
    .eq("stripe_session_id", sessionId)
    .select("*")
    .single();
  if (error) throw error;
  return data as OrderRow;
}
