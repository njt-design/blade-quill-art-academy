import { useLocation } from "wouter";
import { tinaField } from "tinacms/react";
import { Btn } from "@/components/site/Btn";
import { Reveal } from "@/components/site/Reveal";
import { RichText } from "@/components/site/RichText";
import { WordReveal } from "@/components/site/WordReveal";
import { type Block, followLink } from "./block-utils";
import { overlayOpacity, splitHeading } from "./image-showcase-utils";

interface Props {
  block: Block;
}

const HEIGHT_MAP: Record<string, string> = {
  short: "45vh",
  medium: "60vh",
  tall: "80vh",
};

export default function HeroFullBleedBlock({ block }: Props) {
  const [, setLocation] = useLocation();
  const headingLines = splitHeading((block.heading as string) || "Full Bleed");
  const centered = (block.textAlign as string) !== "left";
  const minHeight = HEIGHT_MAP[(block.minHeight as string) || "tall"] || "80vh";
  const bgImage = block.backgroundImage as string | undefined;

  return (
    <section
      className="relative overflow-hidden flex items-end"
      style={{
        minHeight,
        background: bgImage
          ? `url(${bgImage}) center/cover no-repeat`
          : "linear-gradient(135deg, var(--taupe) 0%, var(--maroon) 100%)",
      }}
      data-tina-field={tinaField(block, "backgroundImage")}
    >
      <div
        className="absolute inset-0"
        style={{ background: `rgba(46,34,34,${overlayOpacity(block.overlay as string)})` }}
      />
      <div
        className={`relative z-10 w-full py-16 lg:py-24 ${centered ? "text-center" : ""}`}
      >
        <div className={`bq-container ${centered ? "max-w-3xl mx-auto" : ""}`}>
          <h1
            className="mb-6"
            style={{
              fontSize: "clamp(36px, 6vw, 80px)",
              lineHeight: 1.05,
              color: "var(--paper)",
            }}
            data-tina-field={tinaField(block, "heading")}
          >
            {headingLines.map((line, i) => (
              <span key={`${line}-${i}`}>
                {i > 0 && <br />}
                {i === 1 ? (
                  <span style={{ color: "var(--gold)" }}>
                    <WordReveal text={line} />
                  </span>
                ) : (
                  <WordReveal text={line} />
                )}
              </span>
            ))}
          </h1>
          {block.subheading ? (
            <Reveal>
              <div
                className={`mb-8 ${centered ? "mx-auto max-w-xl" : "max-w-lg"}`}
                style={{ fontSize: 18, color: "rgba(251,246,236,0.85)", lineHeight: 1.65 }}
                data-tina-field={tinaField(block, "subheading")}
              >
                <RichText value={block.subheading} />
              </div>
            </Reveal>
          ) : null}
          {block.ctaLabel ? (
            <Reveal>
              <Btn
                kind="primary"
                size="lg"
                iconRight="→"
                onClick={() => followLink(setLocation, block.ctaLink as string | undefined, "/")}
              >
                <span data-tina-field={tinaField(block, "ctaLabel")}>
                  {block.ctaLabel as string}
                </span>
              </Btn>
            </Reveal>
          ) : null}
        </div>
      </div>
    </section>
  );
}
