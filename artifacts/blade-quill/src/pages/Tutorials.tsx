import { useState, useMemo } from "react";
import { Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useListTutorials } from "@workspace/api-client-react";
import { useTina, tinaField } from "tinacms/react";
import tutorialsData from "../../content/tutorials.json";
const TINA_DATA_TUTORIALSDATA = { tutorials: tutorialsData };

const tutorialsQuery = `
  query tutorials($relativePath: String!) {
    tutorials(relativePath: $relativePath) {
      pageTitle
      pageDescription
      youtubeUrl
      subscribeLabel
      items {
        id
        title
        description
        youtubeId
        topic
        featured
      }
    }
  }
`;

export default function Tutorials() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const { data: tutorials, isLoading } = useListTutorials();

  const { data } = useTina({
    query: tutorialsQuery,
    variables: { relativePath: "tutorials.json" },
    data: TINA_DATA_TUTORIALSDATA,
  });

  const content = data.tutorials;

  const topics = useMemo(() => {
    if (!tutorials) return [];
    const seen = new Set<string>();
    for (const t of tutorials) { if (t.topic) seen.add(t.topic); }
    return Array.from(seen).sort();
  }, [tutorials]);

  const filtered = useMemo(() => {
    if (!tutorials) return [];
    if (!selectedTopic) return tutorials;
    return tutorials.filter((t) => t.topic === selectedTopic);
  }, [tutorials, selectedTopic]);

  return (
    <div className="min-h-screen py-10">
      <div className="container mx-auto px-4 md:px-6">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div className="max-w-2xl">
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
          <Button
            size="sm"
            onClick={() => window.open(content?.youtubeUrl || "https://www.youtube.com/c/BladeQuillartacademy", "_blank")}
            className="gap-2 bg-[#FF0000] text-white hover:bg-[#CC0000] shrink-0 w-full md:w-auto"
          >
            <Youtube className="w-4 h-4" />
            <span data-tina-field={tinaField(content, "subscribeLabel")}>
              {content?.subscribeLabel || "Subscribe"}
            </span>
          </Button>
        </div>

        {/* Topic chips */}
        {topics.length > 0 && (
          <div className="flex flex-nowrap overflow-x-auto scrollbar-hide gap-2 mb-8 pb-1">
            <button
              onClick={() => setSelectedTopic(null)}
              className={`chip ${selectedTopic === null ? "chip-active" : "chip-inactive"}`}
            >
              All Topics
            </button>
            {topics.map((topic) => (
              <button
                key={topic}
                onClick={() => setSelectedTopic(topic === selectedTopic ? null : topic)}
                className={`chip ${selectedTopic === topic ? "chip-active" : "chip-inactive"}`}
              >
                {topic}
              </button>
            ))}
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-muted rounded-lg aspect-video" />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filtered.map((tutorial) => (
              <div key={tutorial.id} className="thumb-card group">
                <div className="aspect-video bg-muted">
                  <iframe
                    src={`https://www.youtube.com/embed/${tutorial.youtubeId}`}
                    title={tutorial.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="p-4">
                  {tutorial.topic && (
                    <span className="text-xs uppercase tracking-wider text-muted-foreground mb-1 block">
                      {tutorial.topic}
                    </span>
                  )}
                  <h3 className="font-medium leading-snug line-clamp-2 group-hover:text-violet transition-colors">
                    {tutorial.title}
                  </h3>
                  {tutorial.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{tutorial.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-border rounded-lg">
            <h3 className="text-xl font-display text-muted-foreground">
              {selectedTopic ? `No tutorials for "${selectedTopic}"` : "No tutorials found"}
            </h3>
          </div>
        )}
      </div>
    </div>
  );
}
