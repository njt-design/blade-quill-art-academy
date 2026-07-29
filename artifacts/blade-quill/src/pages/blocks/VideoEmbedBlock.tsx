import { tinaField } from "tinacms/react";
import { SectionHeading, sectionAlignStyle } from "./text-style";

interface Props {
  block: Record<string, unknown>;
}

function extractYoutubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match?.[1] ?? null;
}

export default function VideoEmbedBlock({ block }: Props) {
  const videoId = block.youtubeUrl ? extractYoutubeId(block.youtubeUrl as string) : null;

  return (
    <section className="py-12">
      <div
        className="container mx-auto px-4 md:px-6 max-w-4xl"
        style={sectionAlignStyle(block)}
      >
        {block.heading && (
          <SectionHeading
            block={block}
            defaultTag="h2"
            baseSize="clamp(24px, 3vw, 30px)"
            className="font-heading mb-6"
          >
            {block.heading as string}
          </SectionHeading>
        )}
        {videoId ? (
          <div className="aspect-video rounded-lg overflow-hidden gumroad-card">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title={block.heading as string || "Video"}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div
            className="aspect-video bg-muted rounded-lg flex items-center justify-center"
            data-tina-field={tinaField(block, "youtubeUrl")}
          >
            <p className="text-muted-foreground text-sm">Paste a YouTube URL to embed a video.</p>
          </div>
        )}
      </div>
    </section>
  );
}
