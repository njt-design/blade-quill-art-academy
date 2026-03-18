import { Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useListTutorials } from "@workspace/api-client-react";

export default function Tutorials() {
  const { data: tutorials, isLoading } = useListTutorials();

  return (
    <div className="min-h-screen pt-24 pb-24">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 mt-8 gap-6">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-display mb-6">Video Tutorials</h1>
            <p className="text-lg text-muted-foreground">
              Learn digital painting techniques, Krita shortcuts, and professional workflows.
            </p>
          </div>
          <Button onClick={() => window.open("https://www.youtube.com/c/BladeQuillartacademy", "_blank")} className="gap-2 bg-[#FF0000] text-white hover:bg-[#CC0000]">
            <Youtube className="w-5 h-5" /> Subscribe on YouTube
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse bg-secondary/50 rounded-2xl aspect-video" />
            ))}
          </div>
        ) : tutorials && tutorials.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {tutorials.map((tutorial) => (
              <div key={tutorial.id} className="glass-panel rounded-2xl overflow-hidden group">
                <div className="aspect-video relative bg-black">
                  <iframe 
                    src={`https://www.youtube.com/embed/${tutorial.youtubeId}`}
                    title={tutorial.title}
                    className="absolute inset-0 w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-display text-foreground group-hover:text-primary transition-colors mb-2">
                    {tutorial.title}
                  </h3>
                  {tutorial.description && (
                    <p className="text-muted-foreground text-sm line-clamp-2">{tutorial.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 glass-panel rounded-2xl">
            <h3 className="text-2xl font-display text-muted-foreground">No tutorials found</h3>
          </div>
        )}

      </div>
    </div>
  );
}
