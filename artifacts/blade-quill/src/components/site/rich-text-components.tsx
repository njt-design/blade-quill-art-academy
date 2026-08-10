import { ArrowUpRight } from "lucide-react";
import type { Components } from "tinacms/dist/rich-text";
import { cn } from "@/lib/utils";

const linkClassName =
  "underline decoration-maroon/60 underline-offset-2 hover:text-maroon transition-colors";

type AnchorProps = {
  url?: string;
  children?: React.ReactNode;
  className?: string;
};

type ContentLinkProps = {
  url?: string;
  text?: string;
  openInNewTab?: boolean;
  children?: React.ReactNode;
};

/** Shared TinaMarkdown components for site + blog rich text. */
export const richTextComponents: Components<{
  ContentLink: ContentLinkProps;
}> = {
  p: (props) => <p {...props} />,
  break: () => <br />,
  a: (props) => (
    <a
      href={props?.url || "#"}
      className={cn(linkClassName, (props as AnchorProps | undefined)?.className)}
    >
      {props?.children}
    </a>
  ),
  ContentLink: (props) => {
    const href = props?.url?.trim() || "#";
    const label = props?.text?.trim() || props?.children;
    if (!label) return null;

    if (props?.openInNewTab === true) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(linkClassName, "inline-flex items-baseline gap-0.5")}
        >
          <span>{label}</span>
          <ArrowUpRight
            className="inline-block h-[0.95em] w-[0.95em] shrink-0 translate-y-[0.05em]"
            aria-hidden
          />
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      );
    }

    return (
      <a href={href} className={linkClassName}>
        {label}
      </a>
    );
  },
  ul: (props) => (
    <ul
      {...props}
      className={cn(
        "list-disc list-inside space-y-1",
        (props as { className?: string }).className,
      )}
    />
  ),
  ol: (props) => (
    <ol
      {...props}
      className={cn(
        "list-decimal list-inside space-y-1",
        (props as { className?: string }).className,
      )}
    />
  ),
};
