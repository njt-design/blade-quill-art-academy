import type { CSSProperties, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { TinaMarkdown, type Components } from "tinacms/dist/rich-text";
import { cn } from "@/lib/utils";
import { isRichText, preserveBlankLines } from "@/lib/rich-text";

const linkClassName =
  "underline decoration-maroon/60 underline-offset-2 hover:text-maroon transition-colors";

/**
 * Hosts that count as "this site". Links to anything else over http(s) open
 * in a new tab automatically, so editors can use the plain toolbar Link
 * button without thinking about target="_blank".
 */
const SITE_HOSTS = [
  "bladeandquillartacademy.com",
  "blade-quill-art-academy.vercel.app",
  "localhost",
];

/** True for off-site http(s) URLs and direct file downloads (PDF etc.). */
export function opensInNewTab(url: string | undefined): boolean {
  if (!url) return false;
  const trimmed = url.trim();
  if (/\.(pdf|zip|epub)(\?|#|$)/i.test(trimmed)) return true;
  if (!/^https?:\/\//i.test(trimmed)) return false;
  try {
    const host = new URL(trimmed).hostname.toLowerCase();
    return !SITE_HOSTS.some((site) => host === site || host.endsWith(`.${site}`));
  } catch {
    return false;
  }
}

type SmartLinkProps = {
  href: string;
  newTab: boolean;
  className?: string;
  children?: ReactNode;
};

/** Anchor that, when `newTab` is set, adds target/rel and the ↗ affordance. */
function SmartLink({ href, newTab, className, children }: SmartLinkProps) {
  if (!newTab) {
    return (
      <a href={href} className={cn(linkClassName, className)}>
        {children}
      </a>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(linkClassName, "inline-flex items-baseline gap-0.5", className)}
    >
      <span>{children}</span>
      <ArrowUpRight
        className="inline-block h-[0.95em] w-[0.95em] shrink-0 translate-y-[0.05em]"
        aria-hidden
      />
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

type AnchorProps = {
  url?: string;
  children?: ReactNode;
  className?: string;
};

type ContentLinkProps = {
  url?: string;
  text?: string;
  openInNewTab?: boolean;
  children?: ReactNode;
};

type AlignedTextProps = {
  align?: string;
  /** Nested rich-text tree (Slate `root`) from the embed's Text field. */
  text?: unknown;
  children?: ReactNode;
};

const ALIGN_CLASS: Record<string, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

type WithChildren = { children?: ReactNode; className?: string };
type HighlightProps = { color?: string; children?: ReactNode };
type TableCellProps = { align?: string; children?: ReactNode };

/**
 * Tina's highlight palette includes a dark red; black text on it is
 * unreadable, so flip to light text when the background is dark.
 */
function highlightStyle(color?: string): CSSProperties | undefined {
  if (!color) return undefined;
  const style: CSSProperties = { backgroundColor: color };
  const hex = color.replace("#", "");
  if (/^[0-9a-f]{6}$/i.test(hex)) {
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    if (luminance < 0.55) style.color = "#FFF8F0";
  }
  return style;
}

const headingClassName = "font-heading text-ink tracking-tight";
/** H5/H6 are repurposed in the editor as smaller serif (Young Serif) styles. */
const serifHeadingClassName = "font-display text-ink tracking-tight font-normal";

/** Shared TinaMarkdown components for site + blog rich text. */
export const richTextComponents: Components<{
  ContentLink: ContentLinkProps;
  AlignedText: AlignedTextProps;
  strikethrough: WithChildren;
  highlight: HighlightProps;
  table: WithChildren;
  tr: WithChildren;
  th: TableCellProps;
  td: TableCellProps;
}> = {
  p: (props) => <p {...props} />,
  break: () => <br />,

  // --- Headings ---
  // H2–H4 are the regular sans (Quicksand) headings; H1 stays reserved for
  // the page title. H5/H6 are offered in the editor as smaller serif
  // (Young Serif) heading styles — same display face as the big page titles,
  // scaled down for use inside body copy.
  h1: (props) => (
    <h2 {...props} className={cn(headingClassName, "mt-8 mb-3 text-3xl leading-tight")} />
  ),
  h2: (props) => (
    <h2 {...props} className={cn(headingClassName, "mt-8 mb-3 text-3xl leading-tight")} />
  ),
  h3: (props) => (
    <h3 {...props} className={cn(headingClassName, "mt-6 mb-2 text-2xl leading-snug")} />
  ),
  h4: (props) => (
    <h4 {...props} className={cn(headingClassName, "mt-5 mb-2 text-xl leading-snug")} />
  ),
  h5: (props) => (
    <h5 {...props} className={cn(serifHeadingClassName, "mt-6 mb-2 text-2xl leading-snug")} />
  ),
  h6: (props) => (
    <h6 {...props} className={cn(serifHeadingClassName, "mt-5 mb-2 text-xl leading-snug")} />
  ),

  // --- Links ---
  a: (props) => {
    const href = props?.url || "#";
    return (
      <SmartLink
        href={href}
        newTab={opensInNewTab(href)}
        className={(props as AnchorProps | undefined)?.className}
      >
        {props?.children}
      </SmartLink>
    );
  },
  ContentLink: (props) => {
    const href = props?.url?.trim() || "#";
    const label = props?.text?.trim() || props?.children;
    if (!label) return null;
    return (
      <SmartLink href={href} newTab={props?.openInNewTab === true}>
        {label}
      </SmartLink>
    );
  },

  // --- Embeds ---
  // "Aligned Text": Tina's editor has no align button, so this embed wraps a
  // nested rich-text tree and aligns the whole chunk. It re-renders with the
  // same component map so headings/links/lists inside look like the rest.
  AlignedText: (props) => {
    const align = ALIGN_CLASS[props?.align ?? ""] ?? "text-left";
    if (!isRichText(props?.text)) return null;
    return (
      <div className={cn("space-y-4", align)}>
        <TinaMarkdown
          content={preserveBlankLines(props.text) as any}
          components={richTextComponents}
        />
      </div>
    );
  },

  // --- Inline marks ---
  strikethrough: (props) => <s className="opacity-75">{props?.children}</s>,
  highlight: (props) => (
    <mark
      className="rounded-[3px] px-[0.15em] py-[0.05em] text-inherit"
      style={highlightStyle(props?.color)}
    >
      {props?.children}
    </mark>
  ),

  // --- Lists ---
  // Tina wraps each list item's content in a block-level `lic` element.
  // `list-outside` + left padding keeps the marker in the gutter so the text
  // sits beside it instead of wrapping underneath (which `list-inside` causes).
  ul: (props) => (
    <ul
      {...props}
      className={cn(
        "list-disc list-outside pl-6 space-y-1",
        (props as { className?: string }).className,
      )}
    />
  ),
  ol: (props) => (
    <ol
      {...props}
      className={cn(
        "list-decimal list-outside pl-6 space-y-1",
        (props as { className?: string }).className,
      )}
    />
  ),

  // --- Block elements ---
  blockquote: (props) => (
    <blockquote
      className="my-6 border-l-4 border-maroon/50 pl-5 italic text-ink-soft [&_p]:mb-0 [&_p+p]:mt-3"
    >
      {props?.children}
    </blockquote>
  ),
  hr: () => (
    <hr className="my-10 mx-auto h-px w-24 border-0 bg-maroon/40" aria-hidden />
  ),
  img: (props) => {
    if (!props?.url) return null;
    return (
      <figure className="my-6">
        <img
          src={props.url}
          alt={props.alt || ""}
          className="w-full rounded-md"
          loading="lazy"
        />
        {props.caption ? (
          <figcaption className="mt-2 text-center text-sm text-ink-mute">
            {props.caption}
          </figcaption>
        ) : null}
      </figure>
    );
  },

  // --- Tables ---
  // Tina renders every row as <tr><td>; the first row is the header by
  // convention, so it gets the tinted, bold treatment via `first:`.
  // Tina's types describe `table` props as { tableRows }, but the runtime
  // renders the rows itself and hands us plain `children`.
  table: (props) => (
    <div className="my-6 -mx-1 overflow-x-auto">
      <table className="w-full min-w-[24rem] border-collapse text-left text-[0.95em] [&_tbody_tr:first-child]:bg-maroon/5 [&_tbody_tr:first-child]:font-semibold [&_tbody_tr:first-child]:text-ink">
        {(props as WithChildren | undefined)?.children}
      </table>
    </div>
  ),
  tr: (props) => (
    <tr className="border-b border-maroon/15 last:border-b-0 align-top">{props?.children}</tr>
  ),
  th: (props) => (
    <th
      className="px-3 py-2 font-semibold"
      style={props?.align ? { textAlign: props.align as CSSProperties["textAlign"] } : undefined}
    >
      {props?.children}
    </th>
  ),
  td: (props) => (
    <td
      className="px-3 py-2 [&_p]:mb-0"
      style={props?.align ? { textAlign: props.align as CSSProperties["textAlign"] } : undefined}
    >
      {props?.children}
    </td>
  ),
};
