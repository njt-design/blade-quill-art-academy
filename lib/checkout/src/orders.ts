import crypto from "node:crypto";
import { getSupabase } from "./clients";
import { findTinaProductById } from "./tina-product";
import {
  DOWNLOADABLE_CATEGORIES,
  type CheckoutProduct,
  type DownloadFile,
} from "./types";

export interface OrderRow {
  id: number;
  stripe_session_id: string;
  product_id: number;
  product_name: string | null;
  product_category: string | null;
  product_slug: string | null;
  gumroad_url: string | null;
  /** Legacy single-file snapshot. */
  download_url: string | null;
  /** Snapshot of the product's Download Files at checkout (jsonb). */
  download_files: DownloadFile[] | null;
  customer_email: string | null;
  status: string;
  download_token: string | null;
  download_token_expires_at: string | null;
}

/**
 * Every deliverable file for an order, newest schema first: the
 * `download_files` snapshot, else the legacy single `download_url`.
 */
export function orderFiles(order: Pick<OrderRow, "download_files" | "download_url">): DownloadFile[] {
  if (Array.isArray(order.download_files) && order.download_files.length > 0) {
    return order.download_files
      .filter((f) => f && typeof f.path === "string" && f.path.trim())
      .map((f) => ({
        label: (typeof f.label === "string" && f.label.trim()) || fileLabel(f.path),
        path: f.path.trim(),
      }));
  }
  if (order.download_url?.trim()) {
    const path = order.download_url.trim();
    return [{ label: fileLabel(path), path }];
  }
  return [];
}

function fileLabel(path: string): string {
  const base = path.split("/").pop() ?? path;
  return base.replace(/\.[a-z0-9]{1,5}$/i, "").replace(/[-_]+/g, " ").trim() || base;
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
  const row: Record<string, unknown> = {
    stripe_session_id: sessionId,
    product_id: product.productId,
    product_name: product.name,
    product_category: product.category,
    product_slug: product.slug,
    gumroad_url: product.gumroadUrl,
    download_url: product.downloadUrl,
    status: "pending",
  };
  // Only send the column when there is something to store, so products
  // without a files list keep working even before the jsonb column exists.
  if (product.files.length > 0) {
    row.download_files = product.files;
  }
  const { error } = await supabase.from("orders").insert(row);
  if (!error) return;
  // The `orders.download_files` jsonb column is added by a migration that may
  // not have run yet (PostgREST: PGRST204 "Could not find the '…' column").
  // Don't block the sale: store the row without the snapshot and let
  // `resolveOrderFiles()` re-read the file list from Tina at fulfillment.
  if (isMissingDownloadFilesColumn(error) && "download_files" in row) {
    console.warn(
      "orders.download_files column missing — run `alter table orders add column if not exists download_files jsonb;`. Inserting without snapshot."
    );
    delete row.download_files;
    const retry = await supabase.from("orders").insert(row);
    if (!retry.error) return;
    throw retry.error;
  }
  throw error;
}

function isMissingDownloadFilesColumn(error: { code?: string; message?: string }): boolean {
  return (
    error.code === "PGRST204" ||
    /download_files/i.test(error.message ?? "") && /column/i.test(error.message ?? "")
  );
}

/**
 * Files to deliver for an order. Uses the snapshot on the row when present;
 * otherwise (row written before the `download_files` column existed) re-reads
 * the product's current Download Files from Tina. Falls back to legacy
 * `download_url`.
 */
export async function resolveOrderFiles(order: OrderRow): Promise<DownloadFile[]> {
  const snapshot = orderFiles(order);
  if (snapshot.length > 0) return snapshot;
  if (!DOWNLOADABLE_CATEGORIES.has(order.product_category ?? "")) return [];
  try {
    const product = await findTinaProductById(
      order.product_id,
      "",
      order.product_slug ?? undefined
    );
    return product?.files ?? [];
  } catch (err) {
    console.error("resolveOrderFiles: Tina lookup failed", err);
    return [];
  }
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

  if (
    DOWNLOADABLE_CATEGORIES.has(order.product_category ?? "") &&
    (await resolveOrderFiles(order)).length > 0
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
