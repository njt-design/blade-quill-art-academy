import type { ReactNode } from "react";
import { SiInstagram, SiKofi, SiPinterest, SiYoutube } from "react-icons/si";
import { FaAmazon } from "react-icons/fa";
import { tinaField } from "tinacms/react";
import { Reveal } from "@/components/site/Reveal";
import { RichText } from "@/components/site/RichText";
import { maybeTrackAmazonClick } from "@/lib/analytics";
import { type Block } from "./block-utils";

const PLATFORM_ICONS: Record<string, ReactNode> = {
  youtube: <SiYoutube className="w-5 h-5" />,
  instagram: <SiInstagram className="w-5 h-5" />,
  pinterest: <SiPinterest className="w-5 h-5" />,
  amazon: <FaAmazon className="w-5 h-5" />,
  kofi: <SiKofi className="w-5 h-5" />,
};

const PLATFORM_NAMES: Record<string, string> = {
  youtube: "YouTube",
  instagram: "Instagram",
  pinterest: "Pinterest",
  amazon: "Amazon",
  kofi: "Ko-fi",
};

interface SocialLink {
  platform?: string;
  url?: string;
  label?: string;
}

interface Props {
  block: Block;
}

/** Bare icon row (link-in-bio pages). */
function IconRow({ block, links }: { block: Block; links: SocialLink[] }) {
  return (
    <div className="mx-auto max-w-5xl flex items-center justify-center gap-2">
      {links.map((link, i) => {
        if (!link?.url) return null;
        return (
          <a
            key={`${link.platform}-${i}`}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label || link.platform}
            className="w-11 h-11 grid place-items-center rounded-full text-muted-foreground hover:text-foreground transition-colors"
            data-tina-field={tinaField(block, "links", i)}
            onClick={() =>
              maybeTrackAmazonClick(link.url, "social_links_icons")
            }
          >
            {PLATFORM_ICONS[link.platform ?? ""] ?? <SiYoutube className="w-5 h-5" />}
          </a>
        );
      })}
    </div>
  );
}

/** Panel treatment (same pattern as the Ko-fi support block) with labeled links. */
function Panel({ block, links }: { block: Block; links: SocialLink[] }) {
  return (
    <div className="mx-auto max-w-5xl">
      <Reveal className="w-full">
        <section
          className="home-panel p-6 md:p-8 text-center bg-secondary/50 w-full"
          aria-labelledby="social-links-heading"
        >
          <h2
            id="social-links-heading"
            className="font-sans font-medium text-xl md:text-2xl text-foreground mb-3 leading-tight"
            data-tina-field={tinaField(block, "heading")}
          >
            {block.heading as string}
          </h2>
          {block.body ? (
            <div data-tina-field={tinaField(block, "body")}>
              <RichText
                value={block.body}
                className="font-sans text-sm md:text-base text-muted-foreground reading-width mx-auto mb-5 leading-relaxed"
              />
            </div>
          ) : null}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {links.map((link, i) => {
              if (!link?.url) return null;
              const name =
                link.label || PLATFORM_NAMES[link.platform ?? ""] || "Follow";
              return (
                <a
                  key={`${link.platform}-${i}`}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 rounded-full border border-border bg-card px-5 py-2.5 text-sm text-foreground hover:bg-foreground hover:text-[var(--paper)] hover:-translate-y-0.5 hover:shadow-md transition-[transform,background,color,box-shadow] duration-200"
                  data-tina-field={tinaField(block, "links", i)}
                  onClick={() =>
                    maybeTrackAmazonClick(link.url, "social_links_panel")
                  }
                >
                  {PLATFORM_ICONS[link.platform ?? ""] ?? (
                    <SiYoutube className="w-5 h-5" />
                  )}
                  <span>{name}</span>
                </a>
              );
            })}
          </div>
        </section>
      </Reveal>
    </div>
  );
}

export default function SocialLinksBlock({ block }: Props) {
  const links = (block.links as SocialLink[] | undefined) ?? [];
  const visible = links.some((l) => l?.url);
  if (!visible) return null;

  return (
    <div className="px-6 md:px-8 py-6">
      {block.heading ? (
        <Panel block={block} links={links} />
      ) : (
        <IconRow block={block} links={links} />
      )}
    </div>
  );
}
