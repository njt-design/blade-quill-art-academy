import { useLocation } from "wouter";
import { tinaField } from "tinacms/react";
import { ArtTile } from "@/components/site/ArtTile";
import { Btn } from "@/components/site/Btn";
import { BtnGroup } from "@/components/site/BtnGroup";
import { Polaroid } from "@/components/site/Polaroid";
import { Reveal } from "@/components/site/Reveal";
import { RichText } from "@/components/site/RichText";
import { WordReveal } from "@/components/site/WordReveal";
import { type Block, followLink, isExternalLink } from "./block-utils";
import { SectionHeading, bodyTextStyle, sectionAlignStyle } from "./text-style";

interface Props {
  block: Block;
}

export default function AboutHeroBlock({ block }: Props) {
  const [, setLocation] = useLocation();

  const headingLines = ((block.heading as string) || "About")
    .split("\n")
    .filter(Boolean);
  const metaLine = block.metaLine as string | undefined;
  const portraitSrc =
    (block.portraitImage as string) ||
    `${import.meta.env.BASE_URL}images/about-portrait.png`;
  const secondaryLink = block.ctaSecondaryLink as string | undefined;
  // Accent polaroids only render when the CMS provides an image —
  // "leave blank to hide" (no gradient/default fallbacks).
  const deskSrc = block.deskImage as string | undefined;
  const deskCaption = (block.deskCaption as string | undefined) || "from the desk";
  const screenSrc = block.screenImage as string | undefined;
  const screenCaption = (block.screenCaption as string | undefined) || "krita screen";
  const accentCount = (deskSrc ? 1 : 0) + (screenSrc ? 1 : 0);

  const portraitCaption = block.portraitCaption ? (
    <div
      className="mt-3 text-center"
      style={{
        fontFamily: "var(--f-serif)",
        fontSize: 14,
        fontStyle: "italic",
        color: "var(--ink-mute)",
      }}
      data-tina-field={tinaField(block, "portraitCaption")}
    >
      {block.portraitCaption as string}
    </div>
  ) : null;

  return (
    <section className="py-14 lg:py-20 relative overflow-hidden">
      <div className="bq-container">
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-14 items-center">
          <div style={sectionAlignStyle(block)}>
            {block.eyebrow ? (
              <Reveal>
                <div className="eyebrow-grad mb-5" data-tina-field={tinaField(block, "eyebrow")}>
                  {block.eyebrow as string}
                </div>
              </Reveal>
            ) : null}
            <SectionHeading
              block={block}
              defaultTag="h1"
              baseSize="clamp(36px, 6.5vw, 84px)"
              className="mb-7"
              style={{ lineHeight: 1.05 }}
            >
              {headingLines.map((line, i) => (
                <span key={`${line}-${i}`}>
                  {i > 0 && <br />}
                  {i === 1 ? (
                    <span className="grad-text">
                      <WordReveal text={line} />
                    </span>
                  ) : (
                    <WordReveal text={line} />
                  )}
                </span>
              ))}
            </SectionHeading>
            {block.leadText ? (
              <Reveal>
                <div
                  className="mb-8 max-w-[480px]"
                  style={{ fontSize: 17, color: "var(--ink-soft)", lineHeight: 1.7, ...bodyTextStyle(block) }}
                  data-tina-field={tinaField(block, "leadText")}
                >
                  <RichText value={block.leadText} />
                </div>
              </Reveal>
            ) : null}
            <Reveal>
              <BtnGroup className="mb-7">
                {block.ctaPrimary ? (
                  <Btn
                    kind="primary"
                    size="lg"
                    iconRight="→"
                    onClick={() =>
                      followLink(setLocation, block.ctaPrimaryLink as string | undefined, "/contact")
                    }
                  >
                    <span data-tina-field={tinaField(block, "ctaPrimary")}>
                      {block.ctaPrimary as string}
                    </span>
                  </Btn>
                ) : null}
                {block.ctaSecondary ? (
                  isExternalLink(secondaryLink) ? (
                    <Btn kind="outline" size="lg" href={secondaryLink} external iconRight="↗">
                      <span data-tina-field={tinaField(block, "ctaSecondary")}>
                        {block.ctaSecondary as string}
                      </span>
                    </Btn>
                  ) : (
                    <Btn
                      kind="outline"
                      size="lg"
                      onClick={() => followLink(setLocation, secondaryLink, "/shop")}
                    >
                      <span data-tina-field={tinaField(block, "ctaSecondary")}>
                        {block.ctaSecondary as string}
                      </span>
                    </Btn>
                  )
                ) : null}
              </BtnGroup>
            </Reveal>
            {metaLine ? (
              <Reveal>
                <div
                  className="flex flex-wrap gap-5"
                  style={{
                    fontFamily: "var(--f-mono)",
                    fontSize: 11,
                    color: "var(--ink-mute)",
                    letterSpacing: "0.08em",
                  }}
                  data-tina-field={tinaField(block, "metaLine")}
                >
                  {metaLine
                    .split("·")
                    .map((t) => t.trim())
                    .filter(Boolean)
                    .map((t, i, arr) => (
                      <span key={`${t}-${i}`} className="flex gap-5">
                        <span>{t.toUpperCase()}</span>
                        {i < arr.length - 1 && <span>·</span>}
                      </span>
                    ))}
                </div>
              </Reveal>
            ) : null}
          </div>

          <Reveal>
            {/* Mobile / tablet: single centered portrait, fluid width. */}
            <div
              className="lg:hidden flex justify-center"
              data-tina-field={tinaField(block, "portraitImage")}
            >
              <Polaroid style={{ width: "min(100%, 320px)" }}>
                <ArtTile
                  palette="warm"
                  src={portraitSrc}
                  alt="Corinne in the studio"
                  width="100%"
                  height="auto"
                  radius={2}
                  fit="contain"
                />
                {portraitCaption}
              </Polaroid>
            </div>

            {/* Desktop: layered collage when accent photos exist; otherwise
                the portrait polaroid alone fills the column. */}
            {accentCount === 0 ? (
              /* Solo portrait: the frame shrink-wraps the image (fit-content),
                 and a viewport-based cap keeps it from towering over the
                 hero text. No fixed tile height — no letterbox bars. */
              <div
                className="hidden lg:flex justify-center"
                data-tina-field={tinaField(block, "portraitImage")}
              >
                <Polaroid
                  hoverLift
                  style={{ width: "fit-content", maxWidth: "100%" }}
                >
                  <img
                    src={portraitSrc}
                    alt="Corinne in the studio"
                    style={{
                      display: "block",
                      width: "auto",
                      height: "auto",
                      maxWidth: "100%",
                      maxHeight: "min(56vh, 500px)",
                      borderRadius: 2,
                    }}
                  />
                  {portraitCaption}
                </Polaroid>
              </div>
            ) : (
              <div className="relative hidden lg:block" style={{ minHeight: 520 }}>
                <div
                  data-tina-field={tinaField(block, "portraitImage")}
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 30,
                    zIndex: 3,
                    width: accentCount === 2 ? 280 : 330,
                  }}
                >
                  <Polaroid hoverLift>
                    <ArtTile
                      palette="warm"
                      src={portraitSrc}
                      alt="Corinne in the studio"
                      width="100%"
                      height="auto"
                      radius={2}
                      fit="contain"
                    />
                    {portraitCaption}
                  </Polaroid>
                </div>
                {deskSrc ? (
                  <div
                    data-tina-field={tinaField(block, "deskImage")}
                    style={{
                      position: "absolute",
                      top: screenSrc ? 80 : 150,
                      left: 0,
                      zIndex: 2,
                      width: screenSrc ? 220 : 250,
                    }}
                  >
                    <Polaroid hoverLift>
                      <ArtTile
                        palette="violet"
                        width="100%"
                        height="auto"
                        src={deskSrc}
                        alt={deskCaption}
                        label={deskCaption}
                        radius={2}
                        fit="contain"
                      />
                    </Polaroid>
                    <div
                      className="sr-only"
                      data-tina-field={tinaField(block, "deskCaption")}
                    >
                      {deskCaption}
                    </div>
                  </div>
                ) : null}
                {screenSrc ? (
                  <div
                    data-tina-field={tinaField(block, "screenImage")}
                    style={
                      deskSrc
                        ? {
                            position: "absolute",
                            bottom: 0,
                            right: 60,
                            zIndex: 1,
                            width: 200,
                          }
                        : {
                            position: "absolute",
                            top: 150,
                            left: 0,
                            zIndex: 2,
                            width: 250,
                          }
                    }
                  >
                    <Polaroid hoverLift>
                      <ArtTile
                        palette="rose"
                        width="100%"
                        height="auto"
                        src={screenSrc}
                        alt={screenCaption}
                        label={screenCaption}
                        radius={2}
                        fit="contain"
                      />
                    </Polaroid>
                    <div
                      className="sr-only"
                      data-tina-field={tinaField(block, "screenCaption")}
                    >
                      {screenCaption}
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
