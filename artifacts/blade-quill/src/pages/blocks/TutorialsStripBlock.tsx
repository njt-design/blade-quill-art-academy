import { useMemo } from "react";
import { tinaField } from "tinacms/react";
import { cn } from "@/lib/utils";
import { useListTutorials } from "@workspace/api-client-react";
import { FALLBACK_TUTORIALS } from "@/lib/fallback-data";
import { type ArtTilePalette } from "@/components/site/ArtTile";
import { Btn } from "@/components/site/Btn";
import { Reveal } from "@/components/site/Reveal";
import { TutorialThumb } from "@/components/site/TutorialThumb";
import { type Block } from "./block-utils";

const STAT_COLORS = ["gold", "paper", "gold-deep", "paper-3"];

interface StatItem {
  value?: string;
  label?: string;
}

interface Props {
  block: Block;
}

export default function TutorialsStripBlock({ block }: Props) {
  const { data: tutorials } = useListTutorials(
    { featured: true },
    { query: { enabled: import.meta.env.PROD } }
  );

  const featuredTutorials = useMemo(() => {
    const list =
      Array.isArray(tutorials) && tutorials.length > 0
        ? tutorials
        : FALLBACK_TUTORIALS.filter((t) => t.featured);
    return list.slice(0, 4);
  }, [tutorials]);

  const stats = ((block.stats as StatItem[] | undefined) ?? []).filter(
    (s) => s.value || s.label
  );
  const youtubeUrl =
    (block.youtubeUrl as string) || "https://www.youtube.com/c/BladeQuillartacademy";

  return (
    <section
      className="py-24 lg:py-28 relative overflow-hidden"
      style={{ background: "var(--ink)", color: "var(--paper)" }}
    >
      <div className="bq-container relative">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-14">
          <div>
            {block.eyebrow ? (
              <Reveal>
                <div className="eyebrow-grad-gold mb-4" data-tina-field={tinaField(block, "eyebrow")}>
                  {block.eyebrow as string}
                </div>
              </Reveal>
            ) : null}
            <Reveal>
              <h2
                style={{
                  fontSize: "clamp(40px, 5.5vw, 64px)",
                  lineHeight: 1.05,
                  color: "var(--paper)",
                }}
                data-tina-field={tinaField(block, "headingHighlight")}
              >
                {(block.headingPrefix as string) ?? ""}
                {block.headingHighlight ? (
                  <span className="grad-text-warm">{block.headingHighlight as string}</span>
                ) : null}
                {block.headingSuffix ? (
                  <>
                    <br />
                    {block.headingSuffix as string}
                  </>
                ) : null}
              </h2>
            </Reveal>
          </div>
          {block.buttonLabel ? (
            <Reveal>
              <Btn kind="light" size="lg" iconRight="↗" href={youtubeUrl} external>
                <span data-tina-field={tinaField(block, "buttonLabel")}>
                  {block.buttonLabel as string}
                </span>
              </Btn>
            </Reveal>
          ) : null}
        </div>

        <Reveal stagger>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredTutorials.map((v, i) => {
              const palette: ArtTilePalette = (
                ["twilight", "warm", "violet", "rose"] as ArtTilePalette[]
              )[i % 4];
              const url = `https://www.youtube.com/watch?v=${v.youtubeId}`;
              return (
                <a
                  key={v.id}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="video-card group block cursor-pointer"
                >
                  <TutorialThumb
                    palette={palette}
                    youtubeId={v.youtubeId}
                    duration={i % 2 === 0 ? "18:42" : "14:08"}
                    width="100%"
                    height={210}
                  />
                  <div className="mt-3.5">
                    <div
                      className="font-semibold"
                      style={{ fontSize: 14, color: "var(--paper)", lineHeight: 1.4 }}
                    >
                      {v.title}
                    </div>
                    <div
                      className="mt-1.5"
                      style={{
                        fontFamily: "var(--f-mono)",
                        fontSize: 11,
                        color: "var(--ink-faint)",
                        letterSpacing: "0.04em",
                      }}
                    >
                      BLADE &amp; QUILL · YOUTUBE
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </Reveal>

        {stats.length > 0 && (
          <Reveal>
            <div
              className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-5 p-6 sm:px-10 sm:py-9"
              style={{
                background: "rgba(223,210,204,0.04)",
                border: "1px solid rgba(223,210,204,0.08)",
                borderRadius: 18,
              }}
              data-tina-field={tinaField(block, "stats")}
            >
              {stats.map((stat, i) => (
                <div
                  key={`${stat.label}-${i}`}
                  className={cn(
                    // Divider only when the item isn't first in its row:
                    // 2-col grid on mobile, 4-col from lg up.
                    i % 2 === 1 && "pl-4 sm:pl-6 border-l border-[rgba(223,210,204,0.1)]",
                    i % 2 === 0 && i > 0 && "lg:pl-6 lg:border-l lg:border-[rgba(223,210,204,0.1)]"
                  )}
                >
                  <div
                    className="mb-2"
                    style={{
                      fontFamily: "var(--f-serif)",
                      fontSize: "clamp(28px, 3.5vw, 44px)",
                      lineHeight: 1,
                      color: `var(--${STAT_COLORS[i % STAT_COLORS.length]})`,
                    }}
                  >
                    {stat.value}
                  </div>
                  <div className="eyebrow" style={{ color: "var(--ink-faint)" }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
