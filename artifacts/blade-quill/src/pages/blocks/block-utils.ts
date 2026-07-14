/** Loose shape for a Tina block coming from JSON / GraphQL. */
export type Block = Record<string, unknown> & {
  __typename?: string;
  _template?: string;
};

export function isExternalLink(link?: string): boolean {
  return Boolean(link && /^https?:\/\//i.test(link));
}

/** Navigate to a link — external URLs open a new tab, relative paths use the router. */
export function followLink(
  setLocation: (to: string) => void,
  link?: string,
  fallback = "/"
) {
  const target = link || fallback;
  if (isExternalLink(target)) {
    window.open(target, "_blank", "noopener,noreferrer");
  } else {
    setLocation(target);
  }
}
