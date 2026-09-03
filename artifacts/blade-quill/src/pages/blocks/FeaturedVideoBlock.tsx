import { tinaField } from "tinacms/react";
import { Btn } from "@/components/site/Btn";
import { Reveal } from "@/components/site/Reveal";
import { RichText } from "@/components/site/RichText";
import { FALLBACK_TUTORIALS } from "@/lib/fallback-data";
import {
  extractYoutubeId,
  formatPublishedAgo,
  useLatestVideo,
  YOUTUBE_CHANNEL_URL,
} from "@/lib/latest-video";
import { type Block } from "./block-utils";
import { SectionHeading, bodyTextStyle, sectionAlignStyle } from "./text-style";

interface Props {
  block: Block;
}

/**
 * "Newest video" feature — embeds the latest Blade & Quill YouTube upload
 * (written to /latest-video.json at build time) on a dark ink panel.
 * Corinne can pin a specific video with the optional YouTube URL override;
 * when the file is missing, the first featured tutorial keeps the section
 * alive.
 */
export default function FeaturedVideoBlock({ block }: Props) {
  const latest = useLatestVideo();

  const overrideUrl = (block.youtubeUrl as string | undefined)?.trim() || "";
  const overrideId = overrideUrl ? extractYoutubeId(overrideUrl) : null;
  const fallback = FALLBACK_TUTORIALS.find((t) => t.featured) ??
    FALLBACK_TUTORIALS[0];

  const videoId = overrideId ?? latest?.videoId ?? fallback.youtubeId;
  const videoTitle = overrideId
    ? null
    : (latest?.title ?? fallback.title ?? null);
  const videoMeta = overrideId || !latest ? null : formatPublishedAgo(latest);
  const channelUrl = latest?.channelUrl ?? YOUTUBE_CHANNEL_URL;

  return (
    <section
      className="py-24 lg:py-28 relative overflow-hidden"
      style={{ background: "var(--ink)", color: "var(--paper)" }}
    >
      <div className="bq-container relative">
        <div className="grid lg:grid-cols-[1fr_1.15fr] gap-12 lg:gap-16 items-center">
          <div style={sectionAlignStyle(block)}>
            {block.eyebrow ? (
              <Reveal>
                <div
                  className="eyebrow-grad-gold mb-4"
                  data-tina-field={tinaField(block, "eyebrow")}
                >
                  {block.eyebrow as string}
                </div>
              </Reveal>
            ) : null}
            {block.heading ? (
              <Reveal>
                <SectionHeading
                  block={block}
                  defaultTag="h2"
                  baseSize="clamp(34px, 4.5vw, 54px)"
                  className="mb-6"
                  style={{ lineHeight: 1.08, color: "var(--paper)" }}
                >
                  {block.heading as string}
                </SectionHeading>
              </Reveal>
            ) : null}
            {block.description ? (
              <Reveal>
                <div
                  className="mb-7 max-w-[480px]"
                  style={{
                    fontSize: 17,
                    lineHeight: 1.7,
                    color: "var(--paper-3)",
                    ...bodyTextStyle(block),
                  }}
                  data-tina-field={tinaField(block, "description")}
                >
                  <RichText value={block.description} />
                </div>
              </Reveal>
            ) : null}
            {videoTitle ? (
              <Reveal>
                <div
                  className="mb-8"
                  style={{
                    fontFamily: "var(--f-mono)",
                    fontSize: 11,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "var(--ink-faint)",
                  }}
                >
                  <span style={{ color: "var(--gold)" }}>Now showing</span>
                  {" · "}
                  {videoTitle}
                  {videoMeta ? ` · ${videoMeta}` : ""}
                </div>
              </Reveal>
            ) : null}
            {block.buttonLabel ? (
              <Reveal>
                <Btn
                  kind="light"
                  size="lg"
                  iconRight="↗"
                  href={channelUrl}
                  external
                >
                  <span data-tina-field={tinaField(block, "buttonLabel")}>
                    {block.buttonLabel as string}
                  </span>
                </Btn>
              </Reveal>
            ) : null}
          </div>

          <Reveal>
            <div className="relative">
              <div
                className="absolute -top-3.5 left-6 z-10 px-3 py-1.5 rounded-full"
                style={{
                  background: "var(--g-warm)",
                  color: "var(--ink)",
                  fontFamily: "var(--f-mono)",
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                }}
              >
                Newest video
              </div>
              <div
                className="aspect-video overflow-hidden"
                style={{
                  borderRadius: "var(--r-lg)",
                  border: "1px solid rgba(223,210,204,0.14)",
                  boxShadow: "0 24px 64px rgba(0,0,0,0.35)",
                }}
                data-tina-field={tinaField(block, "youtubeUrl")}
              >
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${videoId}`}
                  title={videoTitle ?? (block.heading as string) ?? "Newest video"}
                  className="w-full h-full border-0"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
