import { useLocation } from "wouter";
import { tinaField } from "tinacms/react";
import { galleryImageUrl } from "@/lib/artwork";
import { ArtTile } from "@/components/site/ArtTile";
import { Btn } from "@/components/site/Btn";
import { QuillMark } from "@/components/site/QuillMark";
import { Reveal } from "@/components/site/Reveal";
import { RichText } from "@/components/site/RichText";
import { WordReveal } from "@/components/site/WordReveal";
import { type Block, followLink, isExternalLink } from "./block-utils";

const MARQUEE_COLORS = [
  "var(--maroon)",
  "var(--gold-deep)",
  "var(--taupe)",
  "var(--gold)",
];

const HERO_STEAMPUNK_CAT = galleryImageUrl("Steampunk Cat");
const HERO_CHIBI_ELEPHANT = galleryImageUrl("Chibi Elephant");
const HERO_SILA = galleryImageUrl("Sila");
const HERO_CHILD_AND_BEAR = galleryImageUrl("Child and Bear");
const HERO_BABY_DRAGON = galleryImageUrl("Baby Dragon");
const HERO_CHIBI_DRAGON = galleryImageUrl("Chibi Dragon");

interface Props {
  block: Block;
}

export default function HomeHeroBlock({ block }: Props) {
  const [, setLocation] = useLocation();

  const headingLines = ((block.heading as string) || "I write books and teach\ndigital painting.")
    .split("\n")
    .filter(Boolean);
  const marqueeItems = (block.marqueeItems as string[] | undefined)?.filter(Boolean) ?? [];
  const secondaryLink = block.ctaSecondaryLink as string | undefined;

  return (
    <section className="relative overflow-hidden pt-32 pb-20 lg:min-h-[92vh]">
      <div aria-hidden className="absolute inset-0 hidden md:block">
        <ArtTile
          palette="lavender"
          className="art-tile-grain"
          width={170}
          height={220}
          src={HERO_SILA}
          alt="Sila — original character portrait"
          drift
          rotate={-7}
          interactive
          style={{ position: "absolute", top: 120, left: "4%" }}
        />
        <ArtTile
          palette="violet"
          width={140}
          height={180}
          src={HERO_STEAMPUNK_CAT}
          alt="Steampunk Cat"
          drift
          rotate={5}
          interactive
          style={{
            position: "absolute",
            top: 380,
            left: 70,
            animationDelay: "1.2s",
          }}
        />
        <ArtTile
          palette="rose"
          width={120}
          height={160}
          src={HERO_CHILD_AND_BEAR}
          alt="Child and Bear"
          drift
          rotate={-4}
          interactive
          style={{
            position: "absolute",
            top: 640,
            left: "6%",
            animationDelay: "2.4s",
          }}
        />
        <ArtTile
          palette="twilight"
          width={160}
          height={210}
          src={HERO_CHIBI_ELEPHANT}
          alt="Chibi Elephant"
          drift
          rotate={6}
          interactive
          style={{ position: "absolute", top: 100, right: "5%" }}
        />
        <ArtTile
          palette="moss"
          width={140}
          height={180}
          src={HERO_BABY_DRAGON}
          alt="Baby Dragon"
          drift
          rotate={-5}
          interactive
          style={{
            position: "absolute",
            top: 360,
            right: 60,
            animationDelay: "1.8s",
          }}
        />
        <ArtTile
          palette="warm"
          width={130}
          height={170}
          src={HERO_CHIBI_DRAGON}
          alt="Chibi Dragon sketch"
          drift
          rotate={4}
          interactive
          style={{
            position: "absolute",
            top: 620,
            right: "4%",
            animationDelay: "0.6s",
          }}
        />
      </div>

      <div className="bq-container relative max-w-[820px] mx-auto text-center">
        {block.eyebrow ? (
          <Reveal>
            <div
              className="eyebrow-grad inline-block mb-7"
              data-tina-field={tinaField(block, "eyebrow")}
            >
              {block.eyebrow as string}
            </div>
          </Reveal>
        ) : null}

        <h1
          className="mb-7"
          style={{
            fontSize: "clamp(38px, 7vw, 88px)",
            lineHeight: 1.1,
            letterSpacing: "-0.025em",
          }}
          data-tina-field={tinaField(block, "heading")}
        >
          <WordReveal text={headingLines[0] ?? ""} />
          {headingLines.length > 1 && (
            <>
              <br />
              <span className="grad-text">
                <WordReveal text={headingLines.slice(1).join(" ")} />
              </span>
            </>
          )}
        </h1>

        {block.subheading ? (
          <Reveal>
            <div
              className="text-lg max-w-[560px] mx-auto mb-9 leading-[1.55]"
              style={{ color: "var(--ink-soft)" }}
              data-tina-field={tinaField(block, "subheading")}
            >
              <RichText value={block.subheading} />
            </div>
          </Reveal>
        ) : null}

        <Reveal>
          <div className="flex flex-wrap justify-center gap-3.5">
            {block.ctaPrimary ? (
              <Btn
                kind="primary"
                size="lg"
                iconRight="→"
                onClick={() =>
                  followLink(setLocation, block.ctaPrimaryLink as string | undefined, "/shop")
                }
              >
                <span data-tina-field={tinaField(block, "ctaPrimary")}>
                  {block.ctaPrimary as string}
                </span>
              </Btn>
            ) : null}
            {block.ctaSecondary ? (
              isExternalLink(secondaryLink) ? (
                <Btn kind="outline" size="lg" iconRight="↗" href={secondaryLink} external>
                  <span data-tina-field={tinaField(block, "ctaSecondary")}>
                    {block.ctaSecondary as string}
                  </span>
                </Btn>
              ) : (
                <Btn
                  kind="outline"
                  size="lg"
                  iconRight="→"
                  onClick={() => followLink(setLocation, secondaryLink, "/")}
                >
                  <span data-tina-field={tinaField(block, "ctaSecondary")}>
                    {block.ctaSecondary as string}
                  </span>
                </Btn>
              )
            ) : null}
          </div>
        </Reveal>

        {block.metaLine ? (
          <Reveal>
            <div
              className="flex justify-center items-center gap-7 mt-14"
              style={{ color: "var(--ink-mute)" }}
            >
              <QuillMark size={22} />
              <span
                className="self-center"
                style={{
                  fontFamily: "var(--f-mono)",
                  fontSize: 11,
                  letterSpacing: "0.18em",
                }}
                data-tina-field={tinaField(block, "metaLine")}
              >
                {block.metaLine as string}
              </span>
              <QuillMark size={22} style={{ transform: "scaleX(-1)" }} />
            </div>
          </Reveal>
        ) : null}
      </div>

      {marqueeItems.length > 0 && (
        <div
          className="absolute left-0 right-0 bottom-0 overflow-hidden py-5"
          style={{
            borderTop: "1px solid rgba(46,34,34,0.08)",
            borderBottom: "1px solid rgba(46,34,34,0.08)",
            background: "rgba(246,239,224,0.5)",
          }}
          data-tina-field={tinaField(block, "marqueeItems")}
        >
          <div
            className="flex gap-12 whitespace-nowrap w-max"
            style={{
              fontFamily: "var(--f-serif)",
              fontSize: 26,
              color: "var(--ink-soft)",
              animation: "bq-marquee 38s linear infinite",
            }}
          >
            {Array.from({ length: 2 }).map((_, k) => (
              <span key={k} className="flex gap-12">
                {marqueeItems.map((item, i) => (
                  <span key={`${item}-${i}`} className="flex gap-12">
                    <span>{item}</span>
                    <span style={{ color: MARQUEE_COLORS[i % MARQUEE_COLORS.length] }}>✦</span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
