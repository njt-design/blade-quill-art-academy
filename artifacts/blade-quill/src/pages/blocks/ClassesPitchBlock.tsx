import { useLocation } from "wouter";
import { tinaField } from "tinacms/react";
import { ArtTile, type ArtTilePalette } from "@/components/site/ArtTile";
import { Btn } from "@/components/site/Btn";
import { Reveal } from "@/components/site/Reveal";
import { RichText } from "@/components/site/RichText";
import { type Block, followLink } from "./block-utils";

const MODULE_TILES: Array<{ p: ArtTilePalette; l: string }> = [
  { p: "warm", l: "M1 · LINES" },
  { p: "rose", l: "M2 · COLOR" },
  { p: "warm", l: "M3 · LIGHT" },
  { p: "violet", l: "M4 · CHARACTER" },
  { p: "twilight", l: "M5 · STUDIO" },
  { p: "moss", l: "M6 · FINAL" },
];

interface Props {
  block: Block;
}

export default function ClassesPitchBlock({ block }: Props) {
  const [, setLocation] = useLocation();
  const bullets = (block.bullets as string[] | undefined) ?? [];
  const metaTags = block.metaTags as string | undefined;

  return (
    <section className="py-24 lg:py-28 relative">
      <div className="bq-container">
        <div className="text-center mb-14">
          {block.eyebrow ? (
            <Reveal>
              <div className="eyebrow-grad mb-4" data-tina-field={tinaField(block, "eyebrow")}>
                {block.eyebrow as string}
              </div>
            </Reveal>
          ) : null}
          <Reveal>
            <h2
              style={{ fontSize: "clamp(38px, 5vw, 60px)" }}
              data-tina-field={tinaField(block, "heading")}
            >
              {(block.heading as string) || "Step inside the classroom."}
            </h2>
          </Reveal>
        </div>

        <Reveal>
          <div
            className="grid grid-cols-1 lg:grid-cols-2 max-w-[1080px] mx-auto relative overflow-hidden"
            style={{
              background: "var(--paper)",
              borderRadius: 6,
              boxShadow:
                "0 30px 80px rgba(46,34,34,0.16), 0 4px 12px rgba(46,34,34,0.08)",
            }}
          >
            <div
              aria-hidden
              className="hidden lg:block pointer-events-none"
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: "50%",
                width: 24,
                transform: "translateX(-50%)",
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(46,34,34,0.12) 45%, rgba(46,34,34,0.18) 50%, rgba(46,34,34,0.12) 55%, transparent 100%)",
                zIndex: 2,
              }}
            />

            <div
              className="p-6 sm:p-10 lg:p-12 lg:pr-10"
              style={{ borderRight: "1px solid rgba(46,34,34,0.05)" }}
            >
              <div className="eyebrow mb-3.5">WHAT YOU'LL MAKE</div>
              <div
                className="mb-7"
                style={{ fontSize: 28, lineHeight: 1.2 }}
                data-tina-field={tinaField(block, "subheading")}
              >
                <RichText value={block.subheading} />
              </div>
              <div className="flex flex-col gap-5">
                {bullets.map((bullet, n) => (
                  <div
                    key={`${bullet}-${n}`}
                    className="flex gap-5 items-start"
                    data-tina-field={tinaField(block, "bullets", n)}
                  >
                    <div
                      style={{
                        fontFamily: "var(--f-mono)",
                        fontSize: 11,
                        letterSpacing: "0.12em",
                        color: "var(--maroon)",
                        fontWeight: 600,
                        paddingTop: 3,
                      }}
                    >
                      {String(n + 1).padStart(2, "0")}
                    </div>
                    <div style={{ fontSize: 15, color: "var(--ink)", lineHeight: 1.5 }}>
                      {bullet}
                    </div>
                  </div>
                ))}
              </div>
              {metaTags && (
                <div
                  className="mt-9 pt-6 flex flex-wrap gap-4"
                  style={{
                    borderTop: "1px solid rgba(46,34,34,0.08)",
                    fontFamily: "var(--f-mono)",
                    fontSize: 11,
                    color: "var(--ink-mute)",
                    letterSpacing: "0.08em",
                  }}
                  data-tina-field={tinaField(block, "metaTags")}
                >
                  {metaTags
                    .split("·")
                    .map((t) => t.trim().toUpperCase())
                    .filter(Boolean)
                    .map((t, i, arr) => (
                      <span key={`${t}-${i}`}>
                        {t}
                        {i < arr.length - 1 && <span className="ml-4">·</span>}
                      </span>
                    ))}
                </div>
              )}
            </div>

            <div className="p-6 sm:p-10 lg:p-12 lg:pl-10">
              <div className="eyebrow mb-3.5">SIX MODULES</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-7">
                {MODULE_TILES.map((m) => (
                  <ArtTile key={m.l} palette={m.p} width="100%" height={80} label={m.l} />
                ))}
              </div>
              {block.ctaLabel ? (
                <Btn
                  kind="primary"
                  size="lg"
                  iconRight="→"
                  onClick={() =>
                    followLink(setLocation, block.ctaLink as string | undefined, "/shop")
                  }
                  className="w-full"
                >
                  <span data-tina-field={tinaField(block, "ctaLabel")}>
                    {block.ctaLabel as string}
                  </span>
                </Btn>
              ) : null}
              {block.secondaryLabel ? (
                <Btn
                  kind="ghost"
                  size="md"
                  iconRight="→"
                  className="w-full mt-2.5"
                  onClick={() =>
                    followLink(setLocation, block.secondaryLink as string | undefined, "/about")
                  }
                >
                  <span data-tina-field={tinaField(block, "secondaryLabel")}>
                    {block.secondaryLabel as string}
                  </span>
                </Btn>
              ) : null}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
