import { useLocation } from "wouter";
import { tinaField } from "tinacms/react";
import { Btn } from "@/components/site/Btn";
import { Reveal } from "@/components/site/Reveal";
import { RichText } from "@/components/site/RichText";
import { WordReveal } from "@/components/site/WordReveal";
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
  onImage,
}: {
  block: Block;
  secondaryLink?: string;
  primaryLink?: string;
  setLocation: (to: string) => void;
  variant: "mobile" | "desktop";
  /** True when a custom background image is behind the CTAs (white outline everywhere). */
  onImage?: boolean;
}) {
  const desktop = variant === "desktop";
  const btnSize = desktop ? "lg" : "md";
  const mobileOutlineColors = onImage
    ? "border-white text-white bg-transparent hover:bg-white hover:text-[var(--taupe)]"
    : "border-[var(--maroon)] text-[var(--maroon)] bg-transparent hover:bg-[var(--maroon)] hover:text-[var(--paper)]";
  const outlineClass = desktop
    ? "border-white bg-transparent text-white hover:bg-white hover:text-[var(--taupe)] h-[60px]"
    : [
        "w-full h-11 min-h-11 max-h-11 px-5 py-0 text-sm",
        mobileOutlineColors,
        "md:w-auto md:h-auto md:max-h-none md:px-7 md:py-[17px] md:text-[15px]",
        "md:border-white md:bg-transparent md:text-white md:hover:bg-white md:hover:text-[var(--taupe)]",
      ].join(" ");
  const primaryClass = desktop
    ? "h-[60px]"
    : "w-full h-11 min-h-11 max-h-11 px-5 py-0 text-sm md:w-auto md:h-auto md:max-h-none md:px-7 md:py-[17px] md:text-[15px]";

  return (
    <div
      className={
        desktop
          ? "flex items-center gap-4"
          : "flex w-full shrink-0 flex-col gap-1.5 md:w-auto md:flex-row md:items-center md:gap-3"
      }
    >
      {block.ctaSecondary ? (
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

      {block.ctaPrimary ? (
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
 * Desktop stage matches Figma node 185:3261 — radius 32, #776563.
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
      <div className="w-full px-12 pt-6 pb-0 md:px-16 md:pt-8 md:pb-8 lg:px-24 lg:pt-16 lg:pb-16">
        <div
          className={[
            "@container/hero relative overflow-hidden",
            "min-h-[680px] md:min-h-[720px] lg:min-h-[min(560px,50cqw)]",
            "md:rounded-2xl lg:rounded-[32px] md:bg-[var(--taupe)]",
            hasCustomBg ? "rounded-2xl bg-[var(--taupe)]" : "",
          ].join(" ")}
        >
          {hasCustomBg ? (
            /* Custom uploaded background — replaces the default illustrations. */
            <div className="absolute inset-0" data-tina-field={tinaField(block, "backgroundImage")}>
              <img
                src={backgroundImage}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
              {/* Scrim keeps the white text readable over any image. */}
              <div aria-hidden className="absolute inset-0 bg-[rgba(46,34,34,0.45)]" />
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
          <div className="relative z-10 flex min-h-[680px] flex-col px-1 pt-2 pb-6 md:min-h-[720px] md:max-w-[520px] md:px-10 md:pt-12 md:pb-12 lg:hidden">
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
              className={`mb-5 md:mb-7 md:text-white ${hasCustomBg ? "text-white" : "text-[var(--ink)]"}`}
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
                  className={`mb-12 max-w-[540px] space-y-4 text-lg leading-[1.45] md:mb-14 md:text-[19px] md:text-white [&_p]:m-0 ${hasCustomBg ? "text-white" : "text-[var(--ink-soft)]"}`}
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
                onImage={hasCustomBg}
              />
            </Reveal>
          </div>

          {/* ── Desktop copy — in-flow so the card height hugs CTAs ── */}
          <div
            className="relative z-10 hidden text-left text-white lg:block"
            style={{
              paddingLeft: "7.59%",
              paddingRight: "48%",
              paddingTop: "8cqw",
              paddingBottom: "5cqw",
            }}
          >
            {block.eyebrow ? (
              <div
                className="font-mono font-bold uppercase text-white"
                style={{
                  fontSize: "0.614cqw",
                  letterSpacing: "0.11cqw",
                  lineHeight: 1.6,
                  marginBottom: "1.0cqw",
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
                fontSize: "4.91cqw",
                lineHeight: 1.1,
                letterSpacing: "-0.123cqw",
                fontWeight: 400,
                marginBottom: "2.455cqw",
              }}
              data-tina-field={tinaField(block, "heading")}
            >
              <WordReveal text={heading} />
            </h1>

            {block.subheading ? (
              <div
                className="text-white [&_p]:m-0 [&_p+p]:mt-[1.56cqw]"
                style={{
                  fontFamily: "var(--f-sans)",
                  fontSize: "1.56cqw",
                  lineHeight: 1.35,
                  fontWeight: 400,
                  marginBottom: "4.5cqw",
                }}
                data-tina-field={tinaField(block, "subheading")}
              >
                <RichText value={block.subheading} />
              </div>
            ) : (
              <div style={{ marginBottom: "4.5cqw" }} aria-hidden />
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
