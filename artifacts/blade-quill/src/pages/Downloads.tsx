import { Download as DownloadIcon, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useListDownloads } from "@workspace/api-client-react";
import { useTina, tinaField } from "tinacms/react";
import downloadsData from "../../content/downloads.json";
const TINA_DATA_DOWNLOADSDATA = { downloads: downloadsData };

const downloadsQuery = `
  query downloads($relativePath: String!) {
    downloads(relativePath: $relativePath) {
      pageTitle
      pageDescription
      items {
        id
        title
        description
        fileType
        fileUrl
        thumbnailUrl
      }
    }
  }
`;

export default function Downloads() {
  const { data: downloads, isLoading } = useListDownloads();

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
          <p
            className="text-muted-foreground"
            data-tina-field={tinaField(content, "pageDescription")}
          >
            {content?.pageDescription}
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-muted rounded-lg h-64" />
            ))}
          </div>
        ) : downloads && downloads.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {downloads.map((item) => (
              <div key={item.id} className="thumb-card flex flex-col group">
                {item.thumbnailUrl ? (
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="aspect-[4/3] flex items-center justify-center bg-secondary/50">
                    <FileText className="w-12 h-12 text-muted-foreground/20" />
                  </div>
                )}
                <div className="p-4 flex flex-col flex-grow">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-1">
                    {item.fileType}
                  </span>
                  <h3 className="font-medium text-sm mb-1 group-hover:text-violet transition-colors line-clamp-2">
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
                    className="w-full mt-auto text-xs"
                    onClick={() => window.open(item.fileUrl, "_blank")}
                  >
                    <DownloadIcon className="w-3.5 h-3.5 mr-1.5" /> Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-border rounded-lg">
            <h3 className="text-xl font-display text-muted-foreground">Free resources coming soon!</h3>
          </div>
        )}
      </div>
    </div>
  );
}
