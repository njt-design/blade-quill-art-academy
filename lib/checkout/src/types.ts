export type ProductCategory = "physical" | "digital" | "curriculum" | "bundle";

/** Categories whose buyers get download links after payment. */
export const DOWNLOADABLE_CATEGORIES: ReadonlySet<string> = new Set([
  "digital",
  "curriculum",
  "bundle",
]);

/**
 * One deliverable file on a product. `path` is either an object path inside
 * the private downloads bucket (e.g. `krita-bundle/brushes.zip`), or a
 * legacy absolute/`/files/…` URL.
 */
export interface DownloadFile {
  label: string;
  path: string;
}

export interface CheckoutProduct {
  productId: number;
  slug: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  imageUrl: string | null;
  gumroadUrl: string | null;
  /** Legacy single download; superseded by `files` when that is non-empty. */
  downloadUrl: string | null;
  files: DownloadFile[];
  inStock: boolean;
}

export interface CreateCheckoutResult {
  url: string;
  sessionId: string;
}

export interface OrderDownloadLink {
  label: string;
  url: string;
}

export interface OrderSuccessResult {
  productName: string;
  productCategory: string;
  gumroadUrl: string | null;
  /** Single-file convenience: set when exactly one file is available. */
  downloadUrl: string | null;
  /** One entry per file, in product order. Empty for physical products. */
  downloads: OrderDownloadLink[];
  /** Zip of every file; only set when there is more than one file. */
  downloadAllUrl: string | null;
  email: string | null;
}

export type CheckoutErrorCode =
  | "invalid_request"
  | "product_not_found"
  | "out_of_stock"
  | "not_configured"
  | "payment_unconfirmed"
  | "order_not_found"
  | "invalid_session"
  | "download_invalid"
  | "download_unpaid"
  | "download_expired"
  | "download_missing"
  | "upload_failed"
  | "internal";

export class CheckoutError extends Error {
  constructor(
    public readonly code: CheckoutErrorCode,
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = "CheckoutError";
  }
}
