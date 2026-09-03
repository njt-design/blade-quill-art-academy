import { useLocation } from "wouter";
import { Download as DownloadIcon, FileText } from "lucide-react";
import { tinaField } from "tinacms/react";
import { buttonVariants } from "@/components/ui/button";
import { Btn } from "@/components/site/Btn";
import { Reveal } from "@/components/site/Reveal";
import { RichText } from "@/components/site/RichText";
import { useListDownloads, type Download } from "@workspace/api-client-react";
import { asArray } from "@/lib/api-helpers";
import { FALLBACK_DOWNLOADS } from "@/lib/fallback-data";
import { type Block, followLink } from "./block-utils";
import { SectionHeading, bodyTextStyle, sectionAlignStyle } from "./text-style";

interface Props {
  block: Block;
}

/** Prefer a real filename so browsers save JPGs/PNGs instead of opening them. */
function filenameFromUrl(url: string): string {
  try {
    const path = new URL(url, "https://example.invalid").pathname;
    const name = path.split("/").pop();
    return name && name.includes(".") ? decodeURIComponent(name) : "download";
  } catch {
    return "download";
  }
}

/**
 * A taste of the free downloads on landing pages: the first N resources as
 * cards with direct download buttons, plus a "view all" link to the full
 * Downloads page.
 */
export default function DownloadsPreviewBlock({ block }: Props) {
  const [, setLocation] = useLocation();
  const { data: downloadsRaw } = useListDownloads();
  const downloads = asArray<Download>(downloadsRaw, FALLBACK_DOWNLOADS);

  const maxItems =
    typeof block.maxItems === "number" && block.maxItems > 0
      ? block.maxItems
      : 4;
  const items = downloads.slice(0, maxItems);

  return (
    <section
      className="py-20 lg:py-24"
      style={{ background: "var(--paper-2)" }}
    >
      <div className="bq-container">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <div className="max-w-[560px]" style={sectionAlignStyle(block)}>
            {block.eyebrow ? (
              <Reveal>
                <div
                  className="eyebrow-grad mb-4"
                  data-tina-field={tinaField(block, "eyebrow")}
                >
                  {block.eyebrow as string}
                </div>
              </Reveal>
            ) : null}
            {block.heading ? (
              <Reveal>
                <SectionHeading
                  block={block}
                  defaultTag="h2"
                  baseSize="clamp(30px, 4vw, 44px)"
                  style={{ lineHeight: 1.1 }}
                >
                  {block.heading as string}
                </SectionHeading>
              </Reveal>
            ) : null}
            {block.description ? (
              <Reveal>
                <div
                  className="mt-4"
                  style={{
                    fontSize: 16,
                    lineHeight: 1.7,
                    color: "var(--ink-mute)",
                    ...bodyTextStyle(block),
                  }}
                  data-tina-field={tinaField(block, "description")}
                >
                  <RichText value={block.description} />
                </div>
              </Reveal>
            ) : null}
          </div>
          {block.viewAllLabel ? (
            <Reveal>
              <Btn
                kind="outline"
                size="md"
                iconRight="→"
                onClick={() =>
                  followLink(
                    setLocation,
                    block.viewAllLink as string | undefined,
                    "/downloads"
                  )
                }
              >
                <span data-tina-field={tinaField(block, "viewAllLabel")}>
                  {block.viewAllLabel as string}
                </span>
              </Btn>
            </Reveal>
          ) : null}
        </div>

        {items.length > 0 ? (
          <Reveal stagger>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {items.map((item) => (
                <div key={item.id} className="gumroad-card flex flex-col group">
                  {item.thumbnailUrl ? (
                    <div className="aspect-[4/3] img-fit-wrap relative bg-secondary/30">
                      <img
                        src={item.thumbnailUrl}
                        alt={item.title}
                        className="img-fit"
                        loading="lazy"
                      />
                      <span className="absolute top-3 left-3 text-[10px] uppercase tracking-widest font-bold bg-card px-2.5 py-1 rounded-full border border-border">
                        {item.fileType}
                      </span>
                    </div>
                  ) : (
                    <div className="aspect-[4/3] flex items-center justify-center bg-secondary/50 relative">
                      <FileText className="w-12 h-12 text-muted-foreground/20" />
                      <span className="absolute top-3 left-3 text-[10px] uppercase tracking-widest font-bold bg-card/90 px-2.5 py-1 rounded-full border border-border">
                        {item.fileType}
                      </span>
                    </div>
                  )}
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="font-normal text-sm mb-1 group-hover:text-brown transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-3 flex-grow">
                        {item.description}
                      </p>
                    )}
                    <a
                      href={item.fileUrl}
                      download={filenameFromUrl(item.fileUrl)}
                      className={buttonVariants({
                        variant: "outline",
                        size: "sm",
                        className:
                          "dl-btn inline-flex items-center justify-center gap-1.5 text-xs",
                      })}
                    >
                      <DownloadIcon className="h-3.5 w-3.5 shrink-0" aria-hidden />
                      Free Download
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        ) : (
          <div className="text-center py-20 border border-dashed border-border rounded-lg">
            <p className="text-sm text-muted-foreground">
              Coloring pages, guides, and more on the way.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
