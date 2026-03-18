import { useState, useMemo } from "react";
import { Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useListTutorials } from "@workspace/api-client-react";

export default function Tutorials() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const { data: tutorials, isLoading } = useListTutorials();

  const topics = useMemo(() => {
    if (!tutorials) return [];
    const seen = new Set<string>();
    for (const t of tutorials) {
      if (t.topic) seen.add(t.topic);
    }
    return Array.from(seen).sort();
  }, [tutorials]);

  const filtered = useMemo(() => {
    if (!tutorials) return [];
    if (!selectedTopic) return tutorials;
    return tutorials.filter((t) => t.topic === selectedTopic);
  }, [tutorials, selectedTopic]);

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
          <Button
            onClick={() => window.open("https://www.youtube.com/c/BladeQuillartacademy", "_blank")}
            className="gap-2 bg-[#FF0000] text-white hover:bg-[#CC0000]"
          >
            <Youtube className="w-5 h-5" /> Subscribe on YouTube
          </Button>
        </div>

        {topics.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-10">
            <button
              onClick={() => setSelectedTopic(null)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all border ${
                selectedTopic === null
                  ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                  : "border-white/10 text-muted-foreground hover:border-primary/40 hover:text-primary"
              }`}
            >
              All Topics
            </button>
            {topics.map((topic) => (
              <button
                key={topic}
                onClick={() => setSelectedTopic(topic === selectedTopic ? null : topic)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all border ${
                  selectedTopic === topic
                    ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                    : "border-white/10 text-muted-foreground hover:border-primary/40 hover:text-primary"
                }`}
              >
                {topic}
              </button>
            ))}
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse bg-secondary/50 rounded-2xl aspect-video" />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filtered.map((tutorial) => (
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
                  {tutorial.topic && (
                    <span className="text-xs uppercase tracking-widest text-primary/50 font-medium mb-1 block">
                      {tutorial.topic}
                    </span>
                  )}
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
            <h3 className="text-2xl font-display text-muted-foreground">
              {selectedTopic ? `No tutorials found for "${selectedTopic}"` : "No tutorials found"}
            </h3>
          </div>
        )}

      </div>
    </div>
  );
}
