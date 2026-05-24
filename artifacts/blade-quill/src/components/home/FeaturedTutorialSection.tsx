import { ArrowRight, Play } from "lucide-react";
import { motion } from "framer-motion";
import type { Tutorial } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { tinaField } from "tinacms/react";
import { Marquee } from "./Marquee";
import { SectionReveal } from "./SectionReveal";
import { useScrollScale } from "./useScrollScale";

export type FeaturedTutorialSectionContent = {
  heading?: string | null;
  subheading?: string | null;
  browseAllLabel?: string | null;
};

type Props = {
  content?: FeaturedTutorialSectionContent | null;
  tutorial: Tutorial | null;
};

const WATCH_MARQUEE = ["Watch", "Learn", "Create"];
const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/c/BladeQuillartacademy";

export function FeaturedTutorialSection({ content, tutorial }: Props) {
  const { ref: videoRef, scale, opacity, reduced } = useScrollScale({
    mode: "reveal",
  });

  if (!tutorial) {
    return (
      <SectionReveal className="home-section">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <p className="text-muted-foreground">No featured tutorials available yet.</p>
        </div>
      </SectionReveal>
    );
  }

  return (
    <SectionReveal className="home-section">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <Marquee
          className="mb-8 text-xs uppercase tracking-[0.2em] text-muted-foreground"
          speed="fast"
        >
          {WATCH_MARQUEE.map((word) => (
            <span key={word} className="whitespace-nowrap">
              {word} <span className="opacity-50">·</span>
            </span>
          ))}
        </Marquee>

        <div className="text-center mb-12 md:mb-14">
          <Play className="w-5 h-5 text-muted-foreground mx-auto mb-2" />
          <h2
            className="text-2xl md:text-3xl font-heading mb-2"
            data-tina-field={tinaField(content, "heading")}
          >
            {content?.heading || "Featured Video Tutorial"}
          </h2>
          <p
            className="text-sm font-subheading text-muted-foreground max-w-xl mx-auto"
            data-tina-field={tinaField(content, "subheading")}
          >
            {content?.subheading ||
              "Watch a free lesson from Corinne's YouTube channel and start learning Krita today."}
          </p>
        </div>

        <motion.div
          ref={videoRef}
          style={reduced ? undefined : { scale, opacity }}
          className="home-panel overflow-hidden"
        >
          <div className="home-media-mask-flush">
            <div className="aspect-video bg-muted">
              <iframe
                src={`https://www.youtube.com/embed/${tutorial.youtubeId}`}
                title={tutorial.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </motion.div>

        <div className="text-center mt-8">
          {tutorial.topic && (
            <span className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">
              {tutorial.topic}
            </span>
          )}
          <h3 className="text-xl font-heading mb-4 leading-snug">{tutorial.title}</h3>
          {tutorial.description && (
            <p className="text-sm text-muted-foreground reading-width mx-auto mb-6">
              {tutorial.description}
            </p>
          )}
          <Button
            variant="outline"
            size="lg"
            onClick={() => window.open(YOUTUBE_CHANNEL_URL, "_blank", "noopener,noreferrer")}
            className="rounded-full px-8"
            data-tina-field={tinaField(content, "browseAllLabel")}
          >
            {content?.browseAllLabel || "Browse All Tutorials"}{" "}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </SectionReveal>
  );
}
