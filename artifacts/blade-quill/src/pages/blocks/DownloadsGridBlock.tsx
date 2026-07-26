import { Download as DownloadIcon, FileText } from "lucide-react";
import { tinaField } from "tinacms/react";
import { Button } from "@/components/ui/button";
import { useListDownloads, type Download } from "@workspace/api-client-react";
import { asArray } from "@/lib/api-helpers";
import { FALLBACK_DOWNLOADS } from "@/lib/fallback-data";
import { type Block } from "./block-utils";

interface Props {
  block: Block;
}

export default function DownloadsGridBlock({ block }: Props) {
  const { data: downloadsRaw, isLoading } = useListDownloads();
  const downloads = asArray<Download>(downloadsRaw, FALLBACK_DOWNLOADS);

  return (
    <section className="py-6">
      <div className="container mx-auto px-4 md:px-6">
        {isLoading ? (
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
                  <Button
                    variant="outline"
                    size="sm"
                    className="dl-btn text-xs"
                    onClick={() => window.open(item.fileUrl, "_blank")}
                  >
                    <DownloadIcon className="w-3.5 h-3.5 mr-1.5" /> Free Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-border rounded-lg">
            <h3
              className="text-xl font-sans text-muted-foreground mb-2"
              data-tina-field={tinaField(block, "emptyHeading")}
            >
              {(block.emptyHeading as string) || "Free resources coming soon!"}
            </h3>
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
