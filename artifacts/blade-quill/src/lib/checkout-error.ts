/**
 * Human-readable message for a failed POST /api/checkout.
 *
 * The API client throws an ApiError whose `data` is the server's JSON body
 * (`{ error: string }`). We duck-type rather than import the class so this
 * works for any thrown value, including network failures.
 */
const FALLBACK =
  "Please try again in a moment. If it keeps happening, contact us and we'll sort it out.";

export function checkoutErrorMessage(err: unknown): string {
  if (err && typeof err === "object") {
    const data = (err as { data?: unknown }).data;
    if (data && typeof data === "object") {
      const message = (data as { error?: unknown }).error;
      if (typeof message === "string" && message.trim()) {
        return `${message.trim().replace(/\.$/, "")}. ${FALLBACK}`;
      }
    }
    const status = (err as { status?: unknown }).status;
    if (typeof status === "number" && status >= 500) {
      return `Our checkout service returned an error (${status}). ${FALLBACK}`;
    }
  }
  if (err instanceof TypeError) {
    return `We couldn't reach the checkout service. Check your connection and try again.`;
  }
  return FALLBACK;
}
