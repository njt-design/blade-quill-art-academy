import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { tinaField } from "tinacms/react";
import { Marquee } from "./Marquee";
import { useScrollScale } from "./useScrollScale";

export type HomeHeroContent = {
  heading?: string | null;
  subheading?: string | null;
  ctaPrimary?: string | null;
  ctaSecondary?: string | null;
  backgroundImage?: string | null;
};

type Props = {
  hero?: HomeHeroContent | null;
  onNavigate: (path: string) => void;
};

const ROLES = ["Author.", "Illustrator.", "Educator.", "Krita Artist."];
const MARQUEE_LABELS = ["Author", "Illustrator", "Educator", "Krita Artist"];
const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/c/BladeQuillartacademy";
const headingEase = [0.22, 1, 0.36, 1] as const;

export function HomeHero({ hero, onNavigate }: Props) {
  const reduced = useReducedMotion();
  const { ref: panelRef, scale, opacity, reduced: scrollReduced } =
    useScrollScale({ mode: "exit" });

  const lines = (hero?.heading ?? "Welcome to\nBlade & Quill")
    .split("\n")
    .filter((line) => line.length > 0);

  const wordsPerLine = lines.map((line) => line.split(" "));
  let runningIndex = 0;
  const lineWords = wordsPerLine.map((words) =>
    words.map((word) => ({ word, index: runningIndex++ })),
  );
  const totalWords = runningIndex;

  const strokeDelay = totalWords * 0.07 + 0.2;
  const subheadingDelay = strokeDelay + 0.6;
  const rolesDelay = subheadingDelay + 0.4;
  const ctasDelay = subheadingDelay + 0.25;

  const [roleIdx, setRoleIdx] = useState(0);
  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => {
      setRoleIdx((i) => (i + 1) % ROLES.length);
    }, 2400);
    return () => window.clearInterval(id);
  }, [reduced]);

  return (
    <section className="relative overflow-hidden home-section !pb-0">
      <motion.div
        ref={panelRef}
        style={
          scrollReduced ? undefined : { scale, opacity }
        }
        className="container mx-auto px-4 md:px-6 max-w-5xl"
      >
        <div className="home-panel p-8 md:p-12 lg:p-16 text-center md:text-left">
          <motion.div
            className="mb-6 flex items-center justify-center md:justify-start gap-3"
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <span className="h-px w-8 bg-orange" />
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-orange">
              Blade &amp; Quill Art Academy
            </span>
          </motion.div>

          <h1
            className="font-display text-5xl md:text-7xl lg:text-8xl leading-[1.02] tracking-tight mb-8"
            data-tina-field={tinaField(hero, "heading")}
          >
            {lineWords.map((words, lineIdx) => (
              <span key={lineIdx} className="block">
                {words.map(({ word, index }, wordIdx) => {
                  const isLastLine = lineIdx === lineWords.length - 1;
                  return (
                    <span
                      key={`${lineIdx}-${index}`}
                      className="inline-block overflow-hidden align-bottom pr-[0.22em] last:pr-0 relative"
                    >
                      <motion.span
                        className="inline-block"
                        initial={reduced ? false : { y: "110%" }}
                        animate={{ y: 0 }}
                        transition={{
                          duration: 0.9,
                          delay: 0.15 + index * 0.07,
                          ease: headingEase,
                        }}
                      >
                        {word}
                      </motion.span>
                      {isLastLine && wordIdx === words.length - 1 && (
                        <svg
                          viewBox="0 0 220 16"
                          fill="none"
                          aria-hidden
                          className="text-orange absolute left-0 -bottom-2 md:-bottom-3 w-full h-2 md:h-3"
                          preserveAspectRatio="none"
                        >
                          <motion.path
                            d="M2 9 C 40 2, 80 14, 120 7 C 160 1, 200 13, 218 6"
                            stroke="currentColor"
                            strokeWidth="4"
                            strokeLinecap="round"
                            initial={reduced ? false : { pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{
                              duration: 1.2,
                              delay: strokeDelay,
                              ease: "easeOut",
                            }}
                          />
                        </svg>
                      )}
                    </span>
                  );
                })}
              </span>
            ))}
          </h1>

          <motion.p
            className="font-subheading text-lg md:text-xl text-muted-foreground reading-width mb-3 leading-relaxed mx-auto md:mx-0"
            data-tina-field={tinaField(hero, "subheading")}
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: subheadingDelay, ease: "easeOut" }}
          >
            {hero?.subheading}
          </motion.p>

          <motion.div
            className="mb-12 flex items-baseline justify-center md:justify-start gap-2 font-subheading text-lg md:text-xl"
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: rolesDelay, ease: "easeOut" }}
          >
            <span className="text-muted-foreground">Made by an</span>
            <span className="relative inline-flex h-7 md:h-8 overflow-hidden align-baseline">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={roleIdx}
                  className="text-foreground font-medium whitespace-nowrap"
                  initial={reduced ? false : { y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={reduced ? { opacity: 0 } : { y: "-100%", opacity: 0 }}
                  transition={{ duration: 0.5, ease: headingEase }}
                >
                  {ROLES[roleIdx]}
                </motion.span>
              </AnimatePresence>
            </span>
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center md:justify-start gap-4"
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: ctasDelay, ease: "easeOut" }}
          >
            <Button
              size="lg"
              onClick={() => onNavigate("/shop")}
              className="rounded-full bg-orange hover:bg-amber text-white px-8 cta-bold"
              data-tina-field={tinaField(hero, "ctaPrimary")}
            >
              {hero?.ctaPrimary || "Explore the Shop"}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => window.open(YOUTUBE_CHANNEL_URL, "_blank", "noopener,noreferrer")}
              className="rounded-full px-8"
              data-tina-field={tinaField(hero, "ctaSecondary")}
            >
              <Play className="w-4 h-4 mr-2" />
              {hero?.ctaSecondary || "Watch Tutorials"}
            </Button>
          </motion.div>
        </div>
      </motion.div>

      <Marquee
        className="mt-10 md:mt-14 bg-card border-y border-border/40 py-3 font-subheading text-sm text-orange"
        speed="slow"
      >
        {MARQUEE_LABELS.map((label) => (
          <span key={label} className="whitespace-nowrap">
            {label} <span className="text-muted-foreground">·</span>
          </span>
        ))}
      </Marquee>
    </section>
  );
}
