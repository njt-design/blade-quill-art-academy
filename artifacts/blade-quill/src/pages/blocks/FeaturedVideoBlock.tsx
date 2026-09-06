import { useState } from "react";
import { tinaField } from "tinacms/react";
import { Btn } from "@/components/site/Btn";
import { Reveal } from "@/components/site/Reveal";
import { RichText } from "@/components/site/RichText";
import { youtubeThumb, youtubeThumbMaxres } from "@/lib/artwork";
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

const VIDEO_FRAME = { width: 1280, height: 720 } as const;

/**
 * "Newest video" feature — shows the latest Blade & Quill YouTube upload
 * (written to /latest-video.json at build time) on a dark ink panel.
 * The still is YouTube’s 1280×720 maxres thumbnail; click to play the embed.
 * Corinne can pin a specific video with the optional YouTube URL override;
 * when the file is missing, the first featured tutorial keeps the section
 * alive.
 */
export default function FeaturedVideoBlock({ block }: Props) {
  const latest = useLatestVideo();
  const [playing, setPlaying] = useState(false);
  const [thumbFailed, setThumbFailed] = useState(false);

  const overrideUrl = (block.youtubeUrl as string | undefined)?.trim() || "";
  const overrideId = overrideUrl ? extractYoutubeId(overrideUrl) : null;
  const fallback = FALLBACK_TUTORIALS.find((t) => t.featured) ??
    FALLBACK_TUTORIALS[0];

  const videoId = overrideId ?? latest?.videoId ?? fallback.youtubeId;
  const showingLatest = !overrideId || overrideId === latest?.videoId;
  const videoTitle = showingLatest
    ? (latest?.title ?? (overrideId ? null : fallback.title) ?? null)
    : null;
  const videoMeta = showingLatest && latest ? formatPublishedAgo(latest) : null;
  const channelUrl = latest?.channelUrl ?? YOUTUBE_CHANNEL_URL;
  const title = videoTitle ?? (block.heading as string) ?? "Newest video";
  const thumbSrc = thumbFailed
    ? youtubeThumb(videoId)
    : (showingLatest && latest?.thumbnailUrl
        ? latest.thumbnailUrl
        : youtubeThumbMaxres(videoId));

  return (
    <section
      className="py-24 lg:py-28 relative overflow-hidden"
      style={{ background: "var(--ink)", color: "var(--paper)" }}
    >
      <div className="bq-container relative">
        <div
          className="mb-12 lg:mb-14 max-w-[640px]"
          style={sectionAlignStyle(block)}
        >
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
      </div>

      <Reveal>
        <div
          className="relative mx-auto w-full px-5 sm:px-8 lg:px-12"
          style={{ maxWidth: VIDEO_FRAME.width + 96 }}
        >
          <div className="relative mx-auto w-full" style={{ maxWidth: VIDEO_FRAME.width }}>
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
              className="overflow-hidden"
              style={{
                width: "100%",
                aspectRatio: `${VIDEO_FRAME.width} / ${VIDEO_FRAME.height}`,
                maxHeight: VIDEO_FRAME.height,
                borderRadius: "var(--r-lg)",
                border: "1px solid rgba(223,210,204,0.14)",
                boxShadow: "0 24px 64px rgba(0,0,0,0.35)",
              }}
              data-tina-field={tinaField(block, "youtubeUrl")}
            >
              {playing ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
                  title={title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setPlaying(true)}
                  className="video-card group relative block h-full w-full cursor-pointer border-0 bg-transparent p-0 text-left"
                  aria-label={`Play ${title}`}
                >
                  <img
                    src={thumbSrc}
                    alt=""
                    width={VIDEO_FRAME.width}
                    height={VIDEO_FRAME.height}
                    className="h-full w-full object-cover"
                    onError={() => setThumbFailed(true)}
                  />
                  <div
                    className="play-btn"
                    aria-hidden
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%,-50%)",
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      background: "rgba(223,210,204,0.95)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
                      transition: "transform .25s var(--e-back), background .25s ease",
                    }}
                  >
                    <div
                      style={{
                        width: 0,
                        height: 0,
                        borderLeft: "22px solid var(--ink)",
                        borderTop: "14px solid transparent",
                        borderBottom: "14px solid transparent",
                        marginLeft: 6,
                      }}
                    />
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
