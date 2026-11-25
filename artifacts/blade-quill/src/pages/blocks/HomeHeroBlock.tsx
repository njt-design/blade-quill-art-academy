import { useLocation } from "wouter";
import { tinaField } from "tinacms/react";
import { Btn } from "@/components/site/Btn";
import { Reveal } from "@/components/site/Reveal";
import { RichText } from "@/components/site/RichText";
import { WordReveal } from "@/components/site/WordReveal";
import { isHiddenPath } from "@/lib/hidden-pages";
import { type Block, followLink, isExternalLink } from "./block-utils";
import { SectionHeading, bodyTextStyle } from "./text-style";

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

function HeroCtas({
  block,
  secondaryLink,
  primaryLink,
  setLocation,
  variant,
}: {
  block: Block;
  secondaryLink?: string;
  primaryLink?: string;
  setLocation: (to: string) => void;
  variant: "mobile" | "desktop";
}) {
  const desktop = variant === "desktop";
  const btnSize = desktop ? "lg" : "md";
  // Taupe fills the hero on every breakpoint, so the outline CTA is always white.
  const outlineClass = desktop
    ? "border-white bg-transparent text-white hover:bg-white hover:text-[var(--taupe)] h-[60px]"
    : [
        "w-full h-11 min-h-11 max-h-11 px-5 py-0 text-sm",
        "border-white text-white bg-transparent hover:bg-white hover:text-[var(--taupe)]",
        "md:w-auto md:h-auto md:max-h-none md:px-7 md:py-[17px] md:text-[15px]",
      ].join(" ");
  const primaryClass = desktop
    ? "h-[60px]"
    : "w-full h-11 min-h-11 max-h-11 px-5 py-0 text-sm md:w-auto md:h-auto md:max-h-none md:px-7 md:py-[17px] md:text-[15px]";
  const showSecondary = Boolean(block.ctaSecondary) && !isHiddenPath(secondaryLink || "/downloads");
  const showPrimary = Boolean(block.ctaPrimary) && !isHiddenPath(primaryLink || "/shop");

  return (
    <div
      className={
        desktop
          ? "flex items-center gap-4"
          : // DOM order is [secondary, primary]: stacked mobile shows the outline
            // CTA on top (per mockup); the md row keeps the primary on the RIGHT.
            "flex w-full shrink-0 flex-col gap-1.5 md:w-auto md:flex-row md:items-center md:gap-3"
      }
    >
      {showSecondary ? (
        isExternalLink(secondaryLink) ? (
          <Btn
            kind="outline"
            size={btnSize}
            iconRight={<DownloadIcon />}
            href={secondaryLink}
            external
            className={outlineClass}
          >
            <span data-tina-field={tinaField(block, "ctaSecondary")}>
              {block.ctaSecondary as string}
            </span>
          </Btn>
        ) : (
          <Btn
            kind="outline"
            size={btnSize}
            iconRight={<DownloadIcon />}
            className={outlineClass}
            onClick={() => followLink(setLocation, secondaryLink, "/downloads")}
          >
            <span data-tina-field={tinaField(block, "ctaSecondary")}>
              {block.ctaSecondary as string}
            </span>
          </Btn>
        )
      ) : null}

      {showPrimary ? (
        isExternalLink(primaryLink) ? (
          <Btn
            kind="primary"
            size={btnSize}
            iconRight="→"
            href={primaryLink}
            external
            className={primaryClass}
          >
            <span data-tina-field={tinaField(block, "ctaPrimary")}>
              {block.ctaPrimary as string}
            </span>
          </Btn>
        ) : (
          <Btn
            kind="primary"
            size={btnSize}
            iconRight="→"
            className={primaryClass}
            onClick={() => followLink(setLocation, primaryLink, "/shop")}
          >
            <span data-tina-field={tinaField(block, "ctaPrimary")}>
              {block.ctaPrimary as string}
            </span>
          </Btn>
        )
      ) : null}
    </div>
  );
}

interface Props {
  block: Block;
}

/**
 * Desktop stage based on Figma node 185:3261 (#776563), full-bleed.
 * Height hugs the copy/CTAs (no fixed aspect ratio) so buttons never clip.
 */
export default function HomeHeroBlock({ block }: Props) {
  const [, setLocation] = useLocation();

  const heading =
    ((block.heading as string) || "Author, illustrator, and digital art educator").trim();
  const marqueeItems = (block.marqueeItems as string[] | undefined)?.filter(Boolean) ?? [];
  const secondaryLink = block.ctaSecondaryLink as string | undefined;
  const primaryLink = block.ctaPrimaryLink as string | undefined;
  const backgroundImage = ((block.backgroundImage as string) || "").trim();
  const hasCustomBg = backgroundImage.length > 0;

  return (
    <section className="relative overflow-hidden">
      {/* Full-bleed taupe hero at every size, flush under the sticky nav. */}
      <div className="w-full">
        <div
          className={[
            "@container/hero relative overflow-hidden",
            // lg: hero fills the first screen — viewport minus the 72px nav and
            // ~84px marquee — so the marquee sits right at the fold (per Figma).
            // The 56vw ceiling stops narrow-but-tall windows from getting a
            // mostly-empty hero.
            "min-h-[680px] md:min-h-[720px] lg:min-h-[max(520px,min(calc(100svh-156px),56vw))]",
            "lg:flex lg:items-center",
            "bg-[var(--taupe)]",
          ].join(" ")}
        >
          {hasCustomBg ? (
            /*
             * Custom uploaded artwork — replaces the default illustrations.
             * Layer order: taupe card (back) → artwork (middle) → copy (top).
             * The image is NOT stretched to cover the card and there is NO
             * tint over it: it sits on the card like an illustration, anchored
             * bottom-right so the copy on the left stays clear of it. Works
             * best with a transparent PNG/WebP cutout.
             */
            <div
              className={[
                "pointer-events-none absolute flex items-end justify-end",
                "right-0 bottom-0 h-[62%] w-[78%]",
                "md:right-[2%] md:h-[64%] md:w-[46%]",
                // Owns the 52vw → right-bleed band, clear of the 13.5vw+40vw copy.
                "lg:inset-y-0 lg:left-[52vw] lg:right-[max(40px,9vw)] lg:h-auto lg:w-auto",
              ].join(" ")}
              data-tina-field={tinaField(block, "backgroundImage")}
            >
              <img
                src={backgroundImage}
                alt=""
                className="max-h-full max-w-full object-contain object-right-bottom lg:h-[86%] lg:w-auto lg:max-h-none lg:max-w-full"
              />
            </div>
          ) : (
            /* Characters — desktop % from Figma 185:3261 */
            <div aria-hidden className="pointer-events-none absolute inset-0">
              <img
                src={HERO_STEAMPUNK_CAT}
                alt=""
                className={[
                  "absolute z-[1] object-contain",
                  "right-[-6%] bottom-[-4%] h-auto w-[70%]",
                  "md:right-[-2%] md:bottom-[-8%] md:w-[58%]",
                  "lg:right-auto lg:bottom-auto lg:left-[60.7%] lg:top-[2.3%] lg:h-[106.5%] lg:w-[42.5%]",
                  "rotate-[-0.3deg] md:rotate-[2.11deg]",
                ].join(" ")}
              />
              <img
                src={HERO_BABY_DRAGON}
                alt=""
                className={[
                  "absolute z-[2] object-contain",
                  "left-[-4%] bottom-[-2%] h-auto w-[58%]",
                  "md:left-[26%] md:bottom-[-4%] md:w-[38%]",
                  "lg:bottom-auto lg:left-[47.9%] lg:top-[56.2%] lg:h-[47.6%] lg:w-[25.4%]",
                ].join(" ")}
              />
              <img
                src={HERO_CHILD_AND_BEAR}
                alt=""
                className={[
                  "absolute z-[3] hidden object-contain md:block",
                  "md:left-[6%] md:bottom-[-6%] md:h-auto md:w-[24%]",
                  "lg:bottom-auto lg:left-[34.4%] lg:top-[69.1%] lg:h-[39.8%] lg:w-[15.6%]",
                  "-rotate-4",
                ].join(" ")}
              />
            </div>
          )}

          {/* ── Mobile / tablet copy ── */}
          <div
            className={[
              // Same gutters as .bq-container so the copy lines up with the nav logo.
              "relative z-10 flex min-h-[680px] flex-col px-5 pt-8 pb-6 sm:px-8 md:min-h-[720px] md:pt-12 md:pb-12 lg:hidden",
              // Keep tablet copy clear of the bottom-right artwork.
              hasCustomBg ? "md:max-w-[56%]" : "md:max-w-[560px]",
            ].join(" ")}
          >
            {block.eyebrow ? (
              <Reveal>
                <div
                  className="mb-5 hidden font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-white md:mb-6 md:block"
                  data-tina-field={tinaField(block, "eyebrow")}
                >
                  {block.eyebrow as string}
                </div>
              </Reveal>
            ) : null}

            <SectionHeading
              block={block}
              defaultTag="h1"
              baseSize="clamp(36px, 8vw, 56px)"
              className="mb-5 text-white md:mb-7"
              style={{
                lineHeight: 1.1,
                letterSpacing: "-0.025em",
                fontFamily: "var(--f-serif)",
                textAlign: "left",
              }}
            >
              <WordReveal text={heading} />
            </SectionHeading>

            {block.subheading ? (
              <Reveal>
                <div
                  className="mb-12 max-w-[540px] space-y-4 text-lg leading-[1.45] text-white md:mb-14 md:text-[19px] [&_p]:m-0"
                  style={{ ...bodyTextStyle(block), textAlign: "left" }}
                  data-tina-field={tinaField(block, "subheading")}
                >
                  <RichText value={block.subheading} />
                </div>
              </Reveal>
            ) : null}

            <div className="flex-1 min-h-[160px] md:min-h-[48px]" aria-hidden />

            <Reveal>
              <HeroCtas
                block={block}
                secondaryLink={secondaryLink}
                primaryLink={primaryLink}
                setLocation={setLocation}
                variant="mobile"
              />
            </Reveal>
          </div>

          {/* ── Desktop copy — proportional geometry per the Figma comp ──
              The hero scales as one composition: copy starts at ~13.5vw, its
              column is 40vw, and the artwork owns the band from 52vw to the
              right bleed. Everything grows together, so text and art never
              collide at any viewport width. */}
          <div
            className="relative z-10 hidden w-full text-left text-white lg:block"
            style={{
              paddingLeft: "max(40px, 13.5vw)",
              paddingRight: "max(40px, 9vw)",
              paddingTop: "48px",
              paddingBottom: "48px",
            }}
          >
            <div className="max-w-[40vw]">
            {block.eyebrow ? (
              <div
                className="font-mono font-bold uppercase text-white"
                style={{
                  fontSize: "clamp(6px, 0.53vw, 7.6px)",
                  letterSpacing: "0.18em",
                  lineHeight: 1.6,
                  marginBottom: "clamp(8px, 0.86vw, 12.4px)",
                }}
                data-tina-field={tinaField(block, "eyebrow")}
              >
                {block.eyebrow as string}
              </div>
            ) : null}

            <h1
              className="m-0 text-white"
              style={{
                fontFamily: "var(--f-serif)",
                fontSize: "clamp(42px, 4.25vw, 94px)",
                lineHeight: 1.1,
                letterSpacing: "-0.025em",
                fontWeight: 400,
                marginBottom: "clamp(20px, 2.12vw, 44px)",
              }}
              data-tina-field={tinaField(block, "heading")}
            >
              <WordReveal text={heading} />
            </h1>

            {block.subheading ? (
              <div
                className="text-white [&_p]:m-0 [&_p+p]:mt-[clamp(14px,1.35vw,28px)]"
                style={{
                  fontFamily: "var(--f-sans)",
                  fontSize: "clamp(16px, 1.35vw, 30px)",
                  lineHeight: 1.35,
                  fontWeight: 400,
                  marginBottom: "clamp(36px, 3.88vw, 80px)",
                }}
                data-tina-field={tinaField(block, "subheading")}
              >
                <RichText value={block.subheading} />
              </div>
            ) : (
              <div style={{ marginBottom: "clamp(36px, 3.88vw, 80px)" }} aria-hidden />
            )}

            <HeroCtas
              block={block}
              secondaryLink={secondaryLink}
              primaryLink={primaryLink}
              setLocation={setLocation}
              variant="desktop"
            />
            </div>
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
              fontSize: 18,
              color: "var(--ink-soft)",
              animation: "bq-marquee 60s linear infinite",
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
