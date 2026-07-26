export type ProductCategory = "physical" | "digital" | "curriculum";

export interface CheckoutProduct {
  productId: number;
  slug: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  imageUrl: string | null;
  gumroadUrl: string | null;
  downloadUrl: string | null;
  inStock: boolean;
}

export interface CreateCheckoutResult {
  url: string;
  sessionId: string;
}

export interface OrderSuccessResult {
  productName: string;
  productCategory: string;
  gumroadUrl: string | null;
  downloadUrl: string | null;
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
