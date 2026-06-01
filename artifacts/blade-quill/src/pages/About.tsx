import { useLocation } from "wouter";
import { useTina, tinaField } from "tinacms/react";
import aboutData from "../../content/about.json";

import {
  ArtTile,
  type ArtTilePalette,
} from "@/components/site/ArtTile";
import { Btn } from "@/components/site/Btn";
import { Polaroid } from "@/components/site/Polaroid";
import { Reveal } from "@/components/site/Reveal";
import { RichText } from "@/components/site/RichText";
import { WordReveal } from "@/components/site/WordReveal";

const TINA_DATA_ABOUTDATA = { about: aboutData };
const YOUTUBE_CHANNEL_URL =
  "https://www.youtube.com/c/BladeQuillartacademy";

const aboutQuery = `
  query about($relativePath: String!) {
    about(relativePath: $relativePath) {
      ... on Document { _sys { filename basename hasReferences breadcrumbs path relativePath extension } id }
      __typename
      pageTitle
      portraitImage
      leadText
      paragraph1
      paragraph2
      skill1Label
      skill2Label
      skill3Label
      ctaPrimary
      ctaPrimaryLink
      ctaSecondary
      ctaSecondaryLink
    }
  }
`;

interface SidebarLabelProps {
  number: string;
  label: string;
}

function SidebarLabel({ number, label }: SidebarLabelProps) {
  return (
    <div
      className="eyebrow lg:sticky lg:top-28 pt-3"
      style={{ color: "var(--ink-mute)" }}
    >
      <span
        style={{
          color: "var(--orange)",
          fontFamily: "var(--f-mono)",
        }}
      >
        {number}
      </span>
      <br />
      {label}
    </div>
  );
}

const TIMELINE_EVENTS: Array<{
  year: string;
  label: string;
  sub: string;
  palette: ArtTilePalette;
}> = [
  {
    year: "2018",
    label: "Started the YouTube channel",
    sub: "First Krita lesson uploaded from a small apartment.",
    palette: "warm",
  },
  {
    year: "2020",
    label: "Published Lheeloo & Luna, Vol. I",
    sub: "A small press run that quickly sold out.",
    palette: "rose",
  },
  {
    year: "2022",
    label: "Crossed 50K subscribers",
    sub: "And took a deep breath about the future of all this.",
    palette: "warm",
  },
  {
    year: "2024",
    label: "Launched Krita Academy classes",
    sub: "A real, live cohort with critique sessions and homework.",
    palette: "violet",
  },
  {
    year: "2026",
    label: "Working on the next book",
    sub: "Vol. II — two years in the making.",
    palette: "twilight",
  },
];

const WHAT_I_MAKE: Array<{
  tag: string;
  title: string;
  body: string;
  cta: string;
  href: string;
  external?: boolean;
  palette: ArtTilePalette;
}> = [
  {
    tag: "BOOKS",
    title: "Illustrated stories",
    body: "Lheeloo & Luna, plus more on the desk. Signed copies ship from the studio.",
    cta: "Browse books",
    href: "/shop",
    palette: "warm",
  },
  {
    tag: "CLASSES",
    title: "Krita Academy",
    body: "Structured digital art training designed for artists who want to master Krita.",
    cta: "See the curriculum",
    href: "/shop",
    palette: "violet",
  },
  {
    tag: "VIDEOS",
    title: "YouTube channel",
    body: "Free Krita lessons, every other week. 100K+ artists watching.",
    cta: "Watch on YouTube",
    href: YOUTUBE_CHANNEL_URL,
    external: true,
    palette: "twilight",
  },
];

export default function About() {
  const [, setLocation] = useLocation();
  const { data } = useTina({
    query: aboutQuery,
    variables: { relativePath: "about.json" },
    data: TINA_DATA_ABOUTDATA,
  });
  const content = data.about;
  const portraitSrc =
    content?.portraitImage ||
    `${import.meta.env.BASE_URL}images/about-portrait.png`;

  return (
    <div className="page pt-12 pb-24">
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="py-14 lg:py-20 relative overflow-hidden">
        <div className="bq-container">
          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-14 items-center">
            <div>
              <Reveal>
                <div className="eyebrow-grad mb-5">
                  ABOUT · A STUDIO VISIT
                </div>
              </Reveal>
              <h1
                className="mb-7"
                style={{
                  fontSize: "clamp(48px, 6.5vw, 84px)",
                  lineHeight: 1.02,
                }}
                data-tina-field={tinaField(content, "pageTitle")}
              >
                <WordReveal text="I'm Corinne —" />
                <br />
                <span className="grad-text">
                  <WordReveal text="and I draw" />
                </span>
                <br />
                <WordReveal text="for a living." />
              </h1>
              <Reveal>
                <div
                  className="mb-8 max-w-[480px]"
                  style={{
                    fontSize: 17,
                    color: "var(--ink-soft)",
                    lineHeight: 1.7,
                  }}
                  data-tina-field={tinaField(content, "leadText")}
                >
                  <RichText value={content?.leadText} />
                </div>
              </Reveal>
              <Reveal>
                <div className="flex flex-wrap gap-3 mb-7">
                  <Btn
                    kind="primary"
                    size="lg"
                    iconRight="→"
                    onClick={() =>
                      setLocation(content?.ctaPrimaryLink || "/contact")
                    }
                  >
                    <span
                      data-tina-field={tinaField(content, "ctaPrimary")}
                    >
                      {content?.ctaPrimary || "Email me"}
                    </span>
                  </Btn>
                  <Btn
                    kind="outline"
                    size="lg"
                    onClick={() =>
                      setLocation(content?.ctaSecondaryLink || "/shop")
                    }
                  >
                    <span
                      data-tina-field={tinaField(content, "ctaSecondary")}
                    >
                      {content?.ctaSecondary || "My books"}
                    </span>
                  </Btn>
                </div>
              </Reveal>
              <Reveal>
                <div
                  className="flex flex-wrap gap-5"
                  style={{
                    fontFamily: "var(--f-mono)",
                    fontSize: 11,
                    color: "var(--ink-mute)",
                    letterSpacing: "0.08em",
                  }}
                >
                  <span>NANTES, FRANCE</span>
                  <span>·</span>
                  <span>EST. 2018</span>
                </div>
              </Reveal>
            </div>

            <Reveal>
              <div
                className="relative"
                style={{ minHeight: 520 }}
                data-tina-field={tinaField(content, "portraitImage")}
              >
                <Polaroid
                  rotate={4}
                  washiColor="var(--orange)"
                  hoverStraighten
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 30,
                    zIndex: 3,
                    width: 280,
                  }}
                >
                  <ArtTile
                    palette="warm"
                    src={portraitSrc}
                    alt="Corinne in the studio"
                    width="100%"
                    height={320}
                    radius={2}
                  />
                  <div
                    className="mt-3 text-center"
                    style={{
                      fontFamily: "var(--f-serif)",
                      fontSize: 14,
                      fontStyle: "italic",
                      color: "var(--ink-mute)",
                    }}
                  >
                    in the studio
                  </div>
                </Polaroid>
                <Polaroid
                  rotate={-6}
                  washiColor="var(--violet)"
                  hoverStraighten
                  style={{
                    position: "absolute",
                    top: 80,
                    left: 0,
                    zIndex: 2,
                    width: 220,
                  }}
                >
                  <ArtTile
                    palette="violet"
                    width="100%"
                    height={240}
                    label="at the desk"
                    radius={2}
                  />
                </Polaroid>
                <Polaroid
                  rotate={5}
                  washiColor="var(--amber)"
                  hoverStraighten
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 60,
                    zIndex: 1,
                    width: 200,
                  }}
                >
                  <ArtTile
                    palette="rose"
                    width="100%"
                    height={200}
                    label="krita screen"
                    radius={2}
                  />
                </Polaroid>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────── */}
      <section
        className="py-16 lg:py-20"
        style={{ background: "var(--paper-2)" }}
      >
        <div className="bq-container">
          <Reveal>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-7">
              {(
                [
                  ["100K+", "YouTube subscribers", "orange"],
                  ["1.5M", "video views", "amber"],
                  ["65", "countries reached", "rose"],
                  ["2", "illustrated books", "violet"],
                ] as const
              ).map(([v, l, c], i) => (
                <div
                  key={l}
                  className="lg:pl-8"
                  style={{
                    borderLeft:
                      i > 0
                        ? "1px solid rgba(31,26,20,0.1)"
                        : "none",
                  }}
                >
                  <div
                    className="mb-2.5"
                    style={{
                      fontFamily: "var(--f-serif)",
                      fontSize: "clamp(40px, 5vw, 64px)",
                      lineHeight: 1,
                      color: `var(--${c})`,
                    }}
                  >
                    {v}
                  </div>
                  <div className="eyebrow">{l}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── STORY ────────────────────────────────────────────── */}
      <section className="py-20 lg:py-28">
        <div className="bq-container">
          <div className="grid lg:grid-cols-[180px_1fr_240px] gap-10 lg:gap-14 items-start">
            <SidebarLabel number="01" label="STORY" />
            <div className="max-w-[640px]">
              <Reveal>
                <h2
                  className="mb-7"
                  style={{
                    fontSize: "clamp(32px, 4vw, 44px)",
                    lineHeight: 1.2,
                  }}
                >
                  How a French kid with a sketchbook
                  <br />
                  ended up teaching Krita on the internet.
                </h2>
              </Reveal>
              <Reveal>
                <div
                  className="mb-6"
                  style={{
                    fontSize: 16,
                    color: "var(--ink-soft)",
                    lineHeight: 1.8,
                  }}
                  data-tina-field={tinaField(content, "paragraph1")}
                >
                  <RichText value={content?.paragraph1} />
                </div>
              </Reveal>
              <Reveal>
                <div
                  className="relative mb-8 p-8 pl-10"
                  style={{
                    background: "var(--g-ink)",
                    color: "var(--paper)",
                    borderRadius: 18,
                  }}
                >
                  <span
                    aria-hidden
                    className="absolute"
                    style={{
                      top: -10,
                      left: 32,
                      fontFamily: "var(--f-serif)",
                      fontSize: 90,
                      lineHeight: 1,
                      color: "var(--orange)",
                    }}
                  >
                    "
                  </span>
                  <div
                    style={{
                      fontFamily: "var(--f-serif)",
                      fontSize: 22,
                      lineHeight: 1.45,
                      fontStyle: "italic",
                      color: "var(--paper)",
                    }}
                  >
                    <RichText value={content?.leadText} />
                  </div>
                </div>
              </Reveal>
              <Reveal>
                <div
                  style={{
                    fontSize: 16,
                    color: "var(--ink-soft)",
                    lineHeight: 1.8,
                  }}
                  data-tina-field={tinaField(content, "paragraph2")}
                >
                  <RichText value={content?.paragraph2} />
                </div>
              </Reveal>
            </div>

            <div className="hidden lg:block lg:sticky lg:top-28">
              <Polaroid
                rotate={3}
                washiColor="var(--rose)"
                hoverStraighten
              >
                <ArtTile
                  palette="moss"
                  width="100%"
                  height={240}
                  label="the studio"
                  radius={2}
                />
                <div
                  className="mt-3 text-center"
                  style={{
                    fontFamily: "var(--f-serif)",
                    fontSize: 13,
                    fontStyle: "italic",
                    color: "var(--ink-mute)",
                  }}
                >
                  my window in winter
                </div>
              </Polaroid>
            </div>
          </div>
        </div>
      </section>

      {/* ── TIMELINE ─────────────────────────────────────────── */}
      <section
        className="py-20 lg:py-28 relative"
        style={{ background: "var(--paper-2)" }}
      >
        <div className="bq-container">
          <div className="grid lg:grid-cols-[180px_1fr] gap-10 lg:gap-14">
            <SidebarLabel number="02" label="TIMELINE" />
            <div className="relative">
              <span
                aria-hidden
                className="absolute"
                style={{
                  top: 24,
                  bottom: 24,
                  left: 11,
                  width: 2,
                  background:
                    "linear-gradient(180deg, var(--orange) 0%, var(--rose) 50%, var(--violet) 100%)",
                }}
              />
              <Reveal stagger>
                {TIMELINE_EVENTS.map((e) => (
                  <div
                    key={e.year}
                    className="relative grid lg:grid-cols-[1fr_200px] gap-6 lg:gap-8 items-start"
                    style={{
                      paddingLeft: 56,
                      paddingBottom: 44,
                    }}
                  >
                    <span
                      aria-hidden
                      className="absolute block rounded-full"
                      style={{
                        left: 0,
                        top: 6,
                        width: 24,
                        height: 24,
                        background: "var(--paper)",
                        border: "3px solid var(--orange)",
                        boxShadow: "0 0 0 4px var(--paper-2)",
                      }}
                    />
                    <div>
                      <div
                        className="mb-2"
                        style={{
                          fontFamily: "var(--f-mono)",
                          fontSize: 12,
                          color: "var(--orange)",
                          letterSpacing: "0.12em",
                        }}
                      >
                        {e.year}
                      </div>
                      <h3
                        className="mb-2"
                        style={{ fontSize: 26, lineHeight: 1.2 }}
                      >
                        {e.label}
                      </h3>
                      <p
                        style={{
                          color: "var(--ink-mute)",
                          fontSize: 14,
                          lineHeight: 1.6,
                        }}
                      >
                        {e.sub}
                      </p>
                    </div>
                    <ArtTile
                      palette={e.palette}
                      width="100%"
                      height={120}
                      label={e.year}
                    />
                  </div>
                ))}
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT I MAKE ──────────────────────────────────────── */}
      <section className="py-20 lg:py-28">
        <div className="bq-container">
          <div className="grid lg:grid-cols-[180px_1fr] gap-10 lg:gap-14">
            <SidebarLabel number="03" label="WHAT I MAKE" />
            <Reveal stagger>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {WHAT_I_MAKE.map((l, i) => {
                  const inner = (
                    <>
                      <ArtTile
                        palette={l.palette}
                        width="100%"
                        height={140}
                        label={l.tag.toLowerCase()}
                        style={{ marginBottom: 22 }}
                      />
                      <div className="eyebrow-grad mb-3">{l.tag}</div>
                      <h3
                        className="mb-2.5"
                        style={{ fontSize: 24, lineHeight: 1.2 }}
                      >
                        {[
                          content?.skill1Label,
                          content?.skill2Label,
                          content?.skill3Label,
                        ][i] || l.title}
                      </h3>
                      <p
                        className="mb-5"
                        style={{
                          color: "var(--ink-soft)",
                          fontSize: 14,
                          lineHeight: 1.6,
                        }}
                      >
                        {l.body}
                      </p>
                      <span
                        className="link-ink"
                        style={{
                          fontFamily: "var(--f-mono)",
                          fontSize: 12,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          fontWeight: 600,
                        }}
                      >
                        {l.cta} →
                      </span>
                    </>
                  );
                  const sharedStyle: React.CSSProperties = {
                    background: "var(--paper-2)",
                    borderRadius: 20,
                    padding: 28,
                    transition:
                      "transform .35s var(--e-out), box-shadow .35s var(--e-out)",
                    display: "block",
                    color: "inherit",
                    textDecoration: "none",
                  };
                  return l.external ? (
                    <a
                      key={l.tag}
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="lane-card"
                      style={sharedStyle}
                    >
                      {inner}
                    </a>
                  ) : (
                    <button
                      key={l.tag}
                      type="button"
                      onClick={() => setLocation(l.href)}
                      className="lane-card text-left cursor-pointer border-0"
                      style={sharedStyle}
                    >
                      {inner}
                    </button>
                  );
                })}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── CONTACT CTA ──────────────────────────────────────── */}
      <section className="py-24 lg:py-28 relative overflow-hidden text-center">
        <div
          aria-hidden
          className="absolute pointer-events-none"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: 700,
            height: 700,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(229,89,52,0.12), transparent 70%)",
          }}
        />
        <div className="bq-container relative">
          <Reveal>
            <div className="eyebrow-grad mb-5">SAY HI</div>
          </Reveal>
          <Reveal>
            <h2
              className="mb-7"
              style={{
                fontSize: "clamp(42px, 6vw, 72px)",
                lineHeight: 1.05,
              }}
            >
              For press, collabs, or
              <br />
              just a <span className="grad-text">hello</span>.
            </h2>
          </Reveal>
          <Reveal>
            <div className="flex flex-wrap justify-center gap-3">
              <Btn
                kind="primary"
                size="lg"
                iconRight="→"
                onClick={() => setLocation("/contact")}
              >
                Email Corinne
              </Btn>
              <Btn
                kind="outline"
                size="lg"
                href={YOUTUBE_CHANNEL_URL}
                external
                iconRight="↗"
              >
                Watch on YouTube
              </Btn>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
