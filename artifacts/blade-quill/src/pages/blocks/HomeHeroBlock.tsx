import { useLocation } from "wouter";
import { tinaField } from "tinacms/react";
import { Btn } from "@/components/site/Btn";
import { Reveal } from "@/components/site/Reveal";
import { RichText } from "@/components/site/RichText";
import { WordReveal } from "@/components/site/WordReveal";
import { type Block, followLink, isExternalLink } from "./block-utils";
import { SectionHeading, bodyTextStyle, sectionAlignStyle } from "./text-style";

const MARQUEE_COLORS = [
  "var(--maroon)",
  "var(--gold-deep)",
  "var(--taupe)",
  "var(--gold)",
];

/** Transparent Figma cutouts (not gallery JPGs — those have opaque boxes that clip neighbors). */
const HERO_STEAMPUNK_CAT = "/images/hero/steampunk-cat.webp";
const HERO_BABY_DRAGON = "/images/hero/baby-dragon.webp";
const HERO_CHILD_AND_BEAR = "/images/hero/child-and-bear.webp";

function DownloadIcon() {
  return (
    <svg width="14" height="16" viewBox="0 0 14 16" fill="none" aria-hidden>
      <path
        d="M7 1v9M3.5 7.5 7 11l3.5-3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M1 14.5h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

interface Props {
  block: Block;
}

export default function HomeHeroBlock({ block }: Props) {
  const [, setLocation] = useLocation();

  const heading =
    ((block.heading as string) || "Author, illustrator, and digital art educator.").trim();
  const marqueeItems = (block.marqueeItems as string[] | undefined)?.filter(Boolean) ?? [];
  const secondaryLink = block.ctaSecondaryLink as string | undefined;
  const primaryLink = block.ctaPrimaryLink as string | undefined;

  return (
    <section className="relative overflow-hidden">
      {/* Match navbar: max-w-[1440px] + px-6/md:px-8 (logo → cart). */}
      <div className="mx-auto max-w-[1440px] px-6 md:px-8 pt-6 pb-0 md:pt-8 md:pb-8 lg:pt-12 lg:pb-12">
        <div
          className={[
            "relative overflow-hidden",
            /* Mobile: open on page paper. md+: taupe rounded stage (Figma tablet/desktop). */
            "min-h-[680px] md:min-h-[720px] lg:min-h-[860px]",
            "md:rounded-2xl lg:rounded-[32px] md:bg-[var(--taupe)]",
          ].join(" ")}
        >
          {/* Character stage — transparent cutouts so limbs can overlap cleanly. */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            {/* Steampunk Cat — back layer, right side */}
            <img
              src={HERO_STEAMPUNK_CAT}
              alt=""
              className={[
                "absolute z-[1] h-auto max-w-none object-contain",
                "right-[-6%] bottom-[-4%] w-[70%]",
                "md:right-[-2%] md:bottom-[-8%] md:w-[58%]",
                "lg:right-[-1%] lg:bottom-[-10%] lg:w-[48%]",
                "rotate-[-0.3deg] md:rotate-[2deg]",
              ].join(" ")}
            />
            {/* Baby Dragon — mid/front, lower center */}
            <img
              src={HERO_BABY_DRAGON}
              alt=""
              className={[
                "absolute z-[2] h-auto max-w-none object-contain",
                "left-[-4%] bottom-[-2%] w-[58%]",
                "md:left-[26%] md:bottom-[-4%] md:w-[38%]",
                "lg:left-[46%] lg:bottom-[-6%] lg:w-[30%]",
              ].join(" ")}
            />
            {/* Child & Bear — front, tablet/desktop only */}
            <img
              src={HERO_CHILD_AND_BEAR}
              alt=""
              className={[
                "absolute z-[3] hidden h-auto max-w-none object-contain md:block",
                "md:left-[6%] md:bottom-[-6%] md:w-[24%]",
                "lg:left-[32%] lg:bottom-[-8%] lg:w-[20%]",
                "-rotate-4",
              ].join(" ")}
            />
          </div>

          {/* Copy + CTAs — mobile pins CTAs to the stage bottom over the art */}
          <div
            className={[
              "relative z-10 flex h-full min-h-[680px] flex-col md:min-h-[720px] lg:min-h-[860px]",
              "px-1 pt-2 pb-6",
              "md:px-10 md:pt-12 md:pb-10 md:max-w-[520px]",
              "lg:px-16 lg:pt-20 lg:pb-16 lg:max-w-[640px]",
            ].join(" ")}
            style={sectionAlignStyle(block)}
          >
            {block.eyebrow ? (
              <Reveal>
                <div
                  className="mb-5 hidden font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-white md:block lg:mb-7"
                  data-tina-field={tinaField(block, "eyebrow")}
                >
                  {block.eyebrow as string}
                </div>
              </Reveal>
            ) : null}

            <SectionHeading
              block={block}
              defaultTag="h1"
              baseSize="clamp(36px, 5.5vw, 88px)"
              className="mb-5 text-[var(--ink)] md:mb-7 md:text-white lg:mb-11"
              style={{
                lineHeight: 1.1,
                letterSpacing: "-0.025em",
                fontFamily: "var(--f-serif)",
              }}
            >
              <WordReveal text={heading} />
            </SectionHeading>

            {block.subheading ? (
              <Reveal>
                <div
                  className="mb-8 max-w-[540px] text-lg leading-[1.45] text-[var(--ink-soft)] md:mb-10 md:text-white md:text-[19px] lg:mb-0 lg:text-[28px] lg:leading-[1.15]"
                  style={bodyTextStyle(block)}
                  data-tina-field={tinaField(block, "subheading")}
                >
                  <RichText value={block.subheading} />
                </div>
              </Reveal>
            ) : null}

            <div className="flex-1 min-h-[220px] md:min-h-[80px] lg:min-h-[120px]" aria-hidden />

            <Reveal>
              <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row md:items-center md:gap-3 lg:gap-4">
                {block.ctaSecondary ? (
                  isExternalLink(secondaryLink) ? (
                    <Btn
                      kind="outline"
                      size="lg"
                      iconRight={<DownloadIcon />}
                      href={secondaryLink}
                      external
                      className={[
                        "w-full md:w-auto",
                        "border-[var(--maroon)] text-[var(--maroon)] bg-[#ebe1d7] hover:bg-[var(--maroon)] hover:text-[var(--paper)]",
                        "md:border-white md:bg-transparent md:text-white md:hover:bg-white md:hover:text-[var(--taupe)]",
                      ].join(" ")}
                    >
                      <span data-tina-field={tinaField(block, "ctaSecondary")}>
                        {block.ctaSecondary as string}
                      </span>
                    </Btn>
                  ) : (
                    <Btn
                      kind="outline"
                      size="lg"
                      iconRight={<DownloadIcon />}
                      className={[
                        "w-full md:w-auto",
                        "border-[var(--maroon)] text-[var(--maroon)] bg-[#ebe1d7] hover:bg-[var(--maroon)] hover:text-[var(--paper)]",
                        "md:border-white md:bg-transparent md:text-white md:hover:bg-white md:hover:text-[var(--taupe)]",
                      ].join(" ")}
                      onClick={() => followLink(setLocation, secondaryLink, "/downloads")}
                    >
                      <span data-tina-field={tinaField(block, "ctaSecondary")}>
                        {block.ctaSecondary as string}
                      </span>
                    </Btn>
                  )
                ) : null}

                {block.ctaPrimary ? (
                  isExternalLink(primaryLink) ? (
                    <Btn
                      kind="primary"
                      size="lg"
                      iconRight="→"
                      href={primaryLink}
                      external
                      className="w-full md:w-auto"
                    >
                      <span data-tina-field={tinaField(block, "ctaPrimary")}>
                        {block.ctaPrimary as string}
                      </span>
                    </Btn>
                  ) : (
                    <Btn
                      kind="primary"
                      size="lg"
                      iconRight="→"
                      className="w-full md:w-auto"
                      onClick={() => followLink(setLocation, primaryLink, "/shop")}
                    >
                      <span data-tina-field={tinaField(block, "ctaPrimary")}>
                        {block.ctaPrimary as string}
                      </span>
                    </Btn>
                  )
                ) : null}
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      {marqueeItems.length > 0 && (
        <div
          className="relative overflow-hidden py-5"
          style={{
            borderTop: "1px solid rgba(46,34,34,0.08)",
            borderBottom: "1px solid rgba(46,34,34,0.08)",
            background: "rgba(246,239,224,0.5)",
          }}
          data-tina-field={tinaField(block, "marqueeItems")}
        >
          <div
            className="flex w-max gap-12 whitespace-nowrap"
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
