import { useState, useMemo } from "react";
import { Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useListTutorials, type Tutorial } from "@workspace/api-client-react";
import { asArray } from "@/lib/api-helpers";
import { FALLBACK_TUTORIALS } from "@/lib/fallback-data";
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
      emptyHeading
      emptyDescription
    }
  }
`;

export default function Tutorials() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const { data: tutorialsRaw, isLoading } = useListTutorials();
  const tutorials = asArray<Tutorial>(tutorialsRaw, FALLBACK_TUTORIALS);

  const { data } = useTina({
    query: tutorialsQuery,
    variables: { relativePath: "tutorials.json" },
    data: TINA_DATA_TUTORIALSDATA,
  });

  const content = data.tutorials;

  const topicCounts = useMemo(() => {
    if (!tutorials) return new Map<string, number>();
    const counts = new Map<string, number>();
    for (const t of tutorials) {
      if (t.topic) counts.set(t.topic, (counts.get(t.topic) || 0) + 1);
    }
    return counts;
  }, [tutorials]);

  const topics = useMemo(() => {
    return Array.from(topicCounts.keys()).sort();
  }, [topicCounts]);

  const totalCount = tutorials?.length ?? 0;

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
            className="gap-2 bg-[#FF0000] text-white hover:bg-[#CC0000] shrink-0 w-full md:w-auto cta-bold"
            data-tina-field={tinaField(content, "youtubeUrl")}
          >
            <Youtube className="w-4 h-4" />
            <span data-tina-field={tinaField(content, "subscribeLabel")}>
              {content?.subscribeLabel || "Subscribe"}
            </span>
          </Button>
        </div>

        {/* Gumroad-style topic tag pills with counts */}
        {topics.length > 0 && (
          <div className="flex flex-nowrap overflow-x-auto scrollbar-hide gap-2 mb-8 pb-1">
            <button
              onClick={() => setSelectedTopic(null)}
              className={`tag-pill ${selectedTopic === null ? "tag-pill-active" : "tag-pill-inactive"}`}
            >
              All
              <span className="text-xs opacity-60">{totalCount}</span>
            </button>
            {topics.map((topic) => (
              <button
                key={topic}
                onClick={() => setSelectedTopic(topic === selectedTopic ? null : topic)}
                className={`tag-pill ${selectedTopic === topic ? "tag-pill-active" : "tag-pill-inactive"}`}
              >
                {topic}
                <span className="text-xs opacity-60">{topicCounts.get(topic)}</span>
              </button>
            ))}
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-muted rounded-xl aspect-video" />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((tutorial) => (
              <div key={tutorial.id} className="gumroad-card group cursor-pointer">
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
                    <span className="inline-block text-[10px] uppercase tracking-widest font-bold text-violet bg-violet/10 px-2 py-0.5 rounded mb-2">
                      {tutorial.topic}
                    </span>
                  )}
                  <h3 className="font-medium leading-snug line-clamp-2 group-hover:text-violet transition-colors">
                    {tutorial.title}
                  </h3>
                  {tutorial.description && (
                    <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2">{tutorial.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-border rounded-lg">
            <h3
              className="text-xl font-display text-muted-foreground mb-2"
              data-tina-field={tinaField(content, "emptyHeading")}
            >
              {selectedTopic ? `No tutorials for "${selectedTopic}"` : (content?.emptyHeading || "No tutorials found")}
            </h3>
            <p
              className="text-sm text-muted-foreground"
              data-tina-field={tinaField(content, "emptyDescription")}
            >
              {content?.emptyDescription || "Visit the"}{" "}
              <a href={content?.youtubeUrl || "https://www.youtube.com/c/BladeQuillartacademy"} target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">YouTube channel</a> for the latest videos.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
