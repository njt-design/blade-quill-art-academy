import { Download as DownloadIcon, FileText } from "lucide-react";
import { tinaField } from "tinacms/react";
import { buttonVariants } from "@/components/ui/button";
import { useListDownloads, type Download } from "@workspace/api-client-react";
import { asArray } from "@/lib/api-helpers";
import { useLiveDownloads } from "@/hooks/use-live-content";
import { FALLBACK_DOWNLOADS } from "@/lib/fallback-data";
import { resolveDownloadItems } from "@/lib/downloads";
import { type Block } from "./block-utils";
import { SectionHeading } from "./text-style";

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

export default function DownloadsGridBlock({ block }: Props) {
  const catalog = useLiveDownloads();
  const hasCatalog = catalog.length > 0;
  const { data: downloadsRaw, isLoading } = useListDownloads();
  const downloads = resolveDownloadItems(
    asArray<Download>(downloadsRaw),
    FALLBACK_DOWNLOADS,
    catalog
  );
  const showLoading = !hasCatalog && isLoading;

  return (
    <section className="py-6">
      <div className="container mx-auto px-4 md:px-6">
        {showLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-muted rounded-xl h-72" />
            ))}
          </div>
        ) : downloads.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {downloads.map((item) => (
              <div key={item.id} className="gumroad-card flex flex-col group">
                {item.thumbnailUrl ? (
                  <div className="aspect-[4/3] img-fit-wrap relative bg-secondary/30">
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      className="img-fit"
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
        ) : (
          <div className="text-center py-20 border border-dashed border-border rounded-lg">
            <SectionHeading
              block={block}
              field="emptyHeading"
              defaultTag="h3"
              baseSize="clamp(20px, 2vw, 20px)"
              className="font-sans text-muted-foreground mb-2"
            >
              {(block.emptyHeading as string) || "Free resources coming soon!"}
            </SectionHeading>
            <p
              className="text-sm text-muted-foreground"
              data-tina-field={tinaField(block, "emptyDescription")}
            >
              {(block.emptyDescription as string) ||
                "Coloring pages, guides, and more on the way."}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
