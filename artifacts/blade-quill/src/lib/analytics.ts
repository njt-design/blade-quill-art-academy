/**
 * Google Analytics 4 helpers (gtag).
 *
 * Measurement ID matches Corinne's existing Squarespace property so cutover
 * traffic continues in the same GA4 stream.
 */

declare const __GA_MEASUREMENT_ID__: string;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const DEFAULT_MEASUREMENT_ID = "G-50YS8RZ7HL";

export function getGaMeasurementId(): string {
  const fromDefine =
    typeof __GA_MEASUREMENT_ID__ === "string" ? __GA_MEASUREMENT_ID__.trim() : "";
  return fromDefine || DEFAULT_MEASUREMENT_ID;
}

export function isAmazonUrl(url: string | undefined | null): boolean {
  if (!url) return false;
  try {
    const host = new URL(url, window.location.origin).hostname.toLowerCase();
    return (
      host === "a.co" ||
      host === "amzn.to" ||
      host === "amazon.com" ||
      host.endsWith(".amazon.com") ||
      host.endsWith(".amazon.co.uk") ||
      host.endsWith(".amazon.ca") ||
      host.endsWith(".amazon.com.au") ||
      host.endsWith(".amazon.de") ||
      host.endsWith(".amazon.fr")
    );
  } catch {
    return /amazon\.|amzn\.to|a\.co\//i.test(url);
  }
}

let scriptInjected = false;

/** Load gtag.js once and configure the measurement ID. */
export function initGoogleAnalytics(): void {
  if (typeof window === "undefined") return;
  const id = getGaMeasurementId();
  if (!id || scriptInjected) return;
  scriptInjected = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer!.push(args);
  };
  window.gtag("js", new Date());
  window.gtag("config", id, { send_page_view: false });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(script);
}

export function trackPageView(path: string): void {
  const id = getGaMeasurementId();
  if (!id || typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", "page_view", {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
    send_to: id,
  });
}

export function trackEvent(
  name: string,
  params?: Record<string, string | number | boolean | undefined>
): void {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", name, params);
}

/** Stripe Checkout success — fire once per session_id. */
export function trackPurchase(opts: {
  transactionId: string;
  productName: string;
  productCategory?: string;
}): void {
  const key = `ga_purchase_${opts.transactionId}`;
  try {
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
  } catch {
    // sessionStorage may be unavailable; still fire the event.
  }
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", "purchase", {
    transaction_id: opts.transactionId,
    currency: "USD",
    items: [
      {
        item_name: opts.productName,
        item_category: opts.productCategory || undefined,
      },
    ],
  });
}

export function trackAmazonClick(url: string, placement: string): void {
  trackEvent("amazon_click", {
    link_url: url,
    placement,
  });
}

export function trackDummyBookRequest(): void {
  trackEvent("dummy_book_request");
}

/**
 * If the href is an Amazon URL, record the click. Safe to call from any
 * outbound link handler — no-ops for non-Amazon destinations.
 */
export function maybeTrackAmazonClick(
  url: string | undefined | null,
  placement: string
): void {
  if (!url || !isAmazonUrl(url)) return;
  trackAmazonClick(url, placement);
}
