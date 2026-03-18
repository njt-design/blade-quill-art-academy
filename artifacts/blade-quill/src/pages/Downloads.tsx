import { Download as DownloadIcon, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useListDownloads } from "@workspace/api-client-react";

export default function Downloads() {
  const { data: downloads, isLoading } = useListDownloads();

  return (
    <div className="min-h-screen pt-24 pb-24">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="text-center max-w-3xl mx-auto mb-16 mt-8">
          <h1 className="text-5xl font-display mb-6">Free Resources</h1>
          <p className="text-lg text-muted-foreground">
            Coloring pages, quick reference guides, and free assets for the creative community.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse bg-secondary/50 h-64" />
            ))}
          </div>
        ) : downloads && downloads.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {downloads.map((item) => (
              <Card key={item.id} className="flex flex-col h-full group hover:border-primary/50 transition-colors">
                {item.thumbnailUrl ? (
                  <div className="aspect-[4/3] overflow-hidden bg-muted">
                    <img 
                      src={item.thumbnailUrl} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  </div>
                ) : (
                  <div className="aspect-[4/3] flex items-center justify-center bg-secondary/50">
                    <FileText className="w-16 h-16 text-muted-foreground/30" />
                  </div>
                )}
                
                <CardContent className="p-5 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] uppercase tracking-widest font-bold bg-primary/20 text-primary px-2 py-0.5 rounded border border-primary/20">
                      {item.fileType}
                    </span>
                  </div>
                  <h3 className="text-lg font-display text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-grow">
                      {item.description}
                    </p>
                  )}
                  <Button 
                    variant="secondary" 
                    className="w-full mt-auto"
                    onClick={() => window.open(item.fileUrl, "_blank")}
                  >
                    <DownloadIcon className="w-4 h-4 mr-2" /> Download
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 glass-panel rounded-2xl">
            <h3 className="text-2xl font-display text-muted-foreground">More free resources coming soon!</h3>
          </div>
        )}

      </div>
    </div>
  );
}
