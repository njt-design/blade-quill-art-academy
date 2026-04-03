/**
 * React Query / fetch may return non-arrays when `/api/*` is misrouted (e.g. Vite SPA
 * HTML) or the server returns an unexpected JSON shape. Always normalize before .map().
 *
 * When `fallback` is provided, it is returned if the primary value is empty or invalid.
 */
export function asArray<T>(value: unknown, fallback?: T[]): T[] {
  if (Array.isArray(value) && value.length > 0) return value;
  return fallback ?? (Array.isArray(value) ? value : []);
}
