import { Download as DownloadIcon, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useListDownloads, type Download } from "@workspace/api-client-react";
import { asArray } from "@/lib/api-helpers";
import { FALLBACK_DOWNLOADS } from "@/lib/fallback-data";
import { useTina, tinaField } from "tinacms/react";
import { RichText } from "@/components/site/RichText";
import downloadsData from "../../content/downloads.json";
const TINA_DATA_DOWNLOADSDATA = { downloads: downloadsData };

const downloadsQuery = `
  query downloads($relativePath: String!) {
    downloads(relativePath: $relativePath) {
      ... on Document { _sys { filename basename hasReferences breadcrumbs path relativePath extension } id }
      __typename
      pageTitle
      pageDescription
      emptyHeading
      emptyDescription
    }
  }
`;

export default function Downloads() {
  const { data: downloadsRaw, isLoading } = useListDownloads();
  const downloads = asArray<Download>(downloadsRaw, FALLBACK_DOWNLOADS);

  const { data } = useTina({
    query: downloadsQuery,
    variables: { relativePath: "downloads.json" },
    data: TINA_DATA_DOWNLOADSDATA,
  });

  const content = data.downloads;

  return (
    <div className="min-h-screen py-10">
      <div className="container mx-auto px-4 md:px-6">

        <div className="max-w-2xl mb-10">
          <h1
            className="text-3xl md:text-4xl font-display mb-3"
            data-tina-field={tinaField(content, "pageTitle")}
          >
            {content?.pageTitle}
          </h1>
          <div
            className="text-base text-muted-foreground"
            data-tina-field={tinaField(content, "pageDescription")}
          >
            <RichText value={content?.pageDescription} />
          </div>
        </div>

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
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 text-[10px] uppercase tracking-widest font-bold bg-card/90 backdrop-blur-sm px-2.5 py-1 rounded-full border border-border">
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
                  <h3 className="font-normal text-sm mb-1 group-hover:text-violet transition-colors line-clamp-2">
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
              data-tina-field={tinaField(content, "emptyHeading")}
            >
              {content?.emptyHeading || "Free resources coming soon!"}
            </h3>
            <p
              className="text-sm text-muted-foreground"
              data-tina-field={tinaField(content, "emptyDescription")}
            >
              {content?.emptyDescription || "Coloring pages, guides, and more on the way."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
