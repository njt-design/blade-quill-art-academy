import type { ReactNode } from "react";
import { SiInstagram, SiKofi, SiYoutube } from "react-icons/si";
import { FaAmazon } from "react-icons/fa";
import { tinaField } from "tinacms/react";
import { type Block } from "./block-utils";

const PLATFORM_ICONS: Record<string, ReactNode> = {
  youtube: <SiYoutube className="w-5 h-5" />,
  instagram: <SiInstagram className="w-5 h-5" />,
  amazon: <FaAmazon className="w-5 h-5" />,
  kofi: <SiKofi className="w-5 h-5" />,
};

interface SocialLink {
  platform?: string;
  url?: string;
  label?: string;
}

interface Props {
  block: Block;
}

export default function SocialLinksBlock({ block }: Props) {
  const links = (block.links as SocialLink[] | undefined) ?? [];
  const visible = links.some((l) => l?.url);
  if (!visible) return null;

  return (
    <div className="px-6 md:px-8 py-6">
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
            >
              {PLATFORM_ICONS[link.platform ?? ""] ?? <SiYoutube className="w-5 h-5" />}
            </a>
          );
        })}
      </div>
    </div>
  );
}
