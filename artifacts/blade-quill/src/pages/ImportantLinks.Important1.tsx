/**
 * Saved design snapshot: "Important1".
 *
 * Preserves the original Important Links layout (full-width featured release on
 * top, then a two-column row of Reviews + Ko-fi). Kept for reference/restore.
 * Not wired to a route by default.
 */
import { useEffect } from "react";
import { Link } from "wouter";
import { ArrowUpRight, Heart } from "lucide-react";
import { SiInstagram, SiKofi, SiYoutube } from "react-icons/si";
import { FaAmazon } from "react-icons/fa";
import { useTina, tinaField } from "tinacms/react";
import importantLinksData from "../../content/important-links.json";
import { Btn } from "@/components/site/Btn";
import { RichText } from "@/components/site/RichText";
import { QuillMark } from "@/components/site/QuillMark";
import { Reveal } from "@/components/site/Reveal";
import { Marquee } from "@/components/home/Marquee";

const TINA_DATA = { importantLinks: importantLinksData };

const MARQUEE_ANNOUNCEMENT = "New website coming in July of 2026";

const AMAZON_BOOK_URL = "https://www.amazon.com/dp/1733168451";
const YOUTUBE_URL = "https://www.youtube.com/c/BladeQuillartacademy";
const INSTAGRAM_URL = "https://www.instagram.com/bladequillartacademy/";
const KOFI_URL = "https://ko-fi.com/bladeandquill";

const importantLinksQuery = `
  query importantLinks($relativePath: String!) {
    importantLinks(relativePath: $relativePath) {
      ... on Document { _sys { filename basename hasReferences breadcrumbs path relativePath extension } id }
      __typename
      pageTitle
      featuredRelease {
        eyebrow
        title
        description
        coverImage
        backCoverImage
        ctaLabel
        ctaHref
      }
      reviewsSection {
        heading
        intro
        thankYou
        ctaHeading
      }
      reviewLinks {
        label
        href
        region
      }
      kofiSection {
        heading
        body
        ctaLabel
        href
      }
    }
  }
`;

type ReviewLink = {
  label?: string | null;
  href?: string | null;
  region?: string | null;
};

export default function ImportantLinksImportant1() {
  const { data } = useTina({
    query: importantLinksQuery,
    variables: { relativePath: "important-links.json" },
    data: TINA_DATA,
  });

  const page = data.importantLinks;
  const featured = page.featuredRelease;
  const reviews = page.reviewsSection;
  const kofi = page.kofiSection;
  const reviewLinks = (page.reviewLinks ?? []) as ReviewLink[];

  const frontCoverSrc = featured?.coverImage?.trim() || undefined;
  const backCoverSrc = featured?.backCoverImage?.trim() || undefined;

  useEffect(() => {
    if (page.pageTitle) {
      document.title = `${page.pageTitle} — Blade & Quill`;
    }
  }, [page.pageTitle]);

  return (
    <div className="important-links-page min-h-screen bg-background flex flex-col">
      <header className="px-6 md:px-8 py-6 border-b border-border/85">
        <div className="mx-auto max-w-5xl flex justify-center">
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <span
              className="grid place-items-center rounded-[10px] bg-[image:var(--g-cta)] shadow-[0_4px_12px_rgba(229,89,52,0.32)]"
              style={{ width: 38, height: 38 }}
            >
              <QuillMark size={20} color="var(--paper)" />
            </span>
            <span className="font-display text-[19px] tracking-[0.01em] text-foreground">
              Blade <span className="text-muted-foreground">&amp;</span> Quill
            </span>
          </Link>
        </div>
      </header>

      <div className="border-b border-border/85">
        <p className="sr-only">{MARQUEE_ANNOUNCEMENT}</p>
        <Marquee
          className="bg-secondary py-2.5 font-sans text-xs md:text-sm uppercase tracking-[0.18em] text-foreground"
          speed="slow"
          pauseOnHover={false}
          variant="single"
        >
          <span>
            <span className="text-orange">New website</span>
            <span className="text-muted-foreground"> coming in July of 2026</span>
          </span>
        </Marquee>
      </div>

      <main className="flex-1 px-6 md:px-8 py-10 md:py-14">
        <div className="mx-auto max-w-5xl flex flex-col gap-8 md:gap-10">
          {/* Featured release — full width */}
          <Reveal className="w-full">
            <section
              className="home-panel p-6 md:p-10 text-center w-full !overflow-visible"
              aria-labelledby="featured-release-heading"
            >
              {featured?.eyebrow && (
                <p
                  className="eyebrow text-orange mb-4"
                  data-tina-field={tinaField(featured, "eyebrow")}
                >
                  {featured.eyebrow}
                </p>
              )}

              <div
                className="flex flex-row items-center justify-center gap-4 md:gap-10 mb-8 mx-auto max-w-3xl px-2 py-4 overflow-visible"
                data-tina-field={tinaField(featured, "coverImage")}
              >
                <div className="w-[44%] max-w-[300px] shrink-0">
                  <img
                    src={frontCoverSrc}
                    alt={`${featured?.title ?? "Book"} front cover`}
                    className="w-full h-auto object-contain rounded shadow-[0_12px_32px_rgba(60,38,18,0.18)]"
                    style={{ transform: "rotate(-2deg)" }}
                  />
                </div>
                <div className="w-[44%] max-w-[300px] shrink-0">
                  <img
                    src={backCoverSrc}
                    alt={`${featured?.title ?? "Book"} back cover`}
                    className="w-full h-auto object-contain rounded shadow-[0_12px_32px_rgba(60,38,18,0.18)]"
                    style={{ transform: "rotate(2deg)" }}
                  />
                </div>
              </div>

              <h2
                id="featured-release-heading"
                className="font-display text-2xl md:text-3xl text-foreground mb-3 leading-tight max-w-2xl mx-auto"
                data-tina-field={tinaField(featured, "title")}
              >
                {featured?.title}
              </h2>
              {featured?.description && (
                <div data-tina-field={tinaField(featured, "description")}>
                  <RichText
                    value={featured.description}
                    className="font-sans text-sm md:text-base text-muted-foreground reading-width mx-auto mb-8 leading-relaxed"
                  />
                </div>
              )}
              {featured?.ctaLabel && featured?.ctaHref && (
                <div data-tina-field={tinaField(featured, "ctaLabel")}>
                  <Btn
                    href={featured.ctaHref}
                    external
                    kind="primary"
                    size="lg"
                    iconRight={<ArrowUpRight className="w-4 h-4" />}
                  >
                    {featured.ctaLabel}
                  </Btn>
                </div>
              )}
            </section>
          </Reveal>

          {/* Reviews + Ko-fi — two columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-stretch">
            <Reveal className="h-full">
              <section
                className="home-panel p-6 md:p-8 text-center h-full flex flex-col"
                aria-labelledby="reviews-heading"
              >
                <h2
                  id="reviews-heading"
                  className="font-display text-2xl md:text-3xl text-foreground mb-4 leading-tight"
                  data-tina-field={tinaField(reviews, "heading")}
                >
                  {reviews?.heading}
                </h2>
                <div data-tina-field={tinaField(reviews, "intro")}>
                  <RichText
                    value={reviews?.intro}
                    className="font-sans text-sm md:text-base text-muted-foreground reading-width mx-auto mb-3 leading-relaxed"
                  />
                </div>
                <p
                  className="font-sans text-sm md:text-base italic text-foreground mb-6"
                  data-tina-field={tinaField(reviews, "thankYou")}
                >
                  {reviews?.thankYou}
                </p>

                <p
                  className="font-sans font-medium text-sm md:text-base text-foreground mb-4 italic"
                  data-tina-field={tinaField(reviews, "ctaHeading")}
                >
                  {reviews?.ctaHeading}
                </p>

                <ul className="flex flex-col gap-2 max-w-sm mx-auto w-full list-none p-0 m-0 mt-auto">
                  {reviewLinks.map((link, i) => (
                    <li
                      key={link.region ?? i}
                      data-tina-field={tinaField(page, "reviewLinks")}
                    >
                      <Btn
                        href={link.href ?? "#"}
                        external
                        kind="outline"
                        size="md"
                        className="w-full"
                        iconRight={<ArrowUpRight className="w-3.5 h-3.5" />}
                      >
                        {link.label}
                      </Btn>
                    </li>
                  ))}
                </ul>
              </section>
            </Reveal>

            <Reveal className="h-full">
              <section
                className="home-panel p-6 md:p-8 text-center bg-secondary/50 h-full flex flex-col"
                aria-labelledby="kofi-heading"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-violet/10 text-violet mb-4 mx-auto">
                  <SiKofi className="w-6 h-6" aria-hidden />
                </div>
                <h2
                  id="kofi-heading"
                  className="font-sans font-medium text-xl md:text-2xl text-foreground mb-3 leading-tight"
                  data-tina-field={tinaField(kofi, "heading")}
                >
                  {kofi?.heading}
                </h2>
                <div
                  className="flex-1"
                  data-tina-field={tinaField(kofi, "body")}
                >
                  <RichText
                    value={kofi?.body}
                    className="font-sans text-sm md:text-base text-muted-foreground reading-width mx-auto mb-6 leading-relaxed"
                  />
                </div>
                {kofi?.ctaLabel && (
                  <div className="mt-auto" data-tina-field={tinaField(kofi, "ctaLabel")}>
                    <Btn
                      href={kofi.href ?? KOFI_URL}
                      external
                      kind="outline"
                      size="lg"
                      iconLeft={<Heart className="w-4 h-4 text-rose" />}
                      iconRight={<ArrowUpRight className="w-4 h-4" />}
                    >
                      {kofi.ctaLabel}
                    </Btn>
                  </div>
                )}
              </section>
            </Reveal>
          </div>
        </div>
      </main>

      <footer className="px-6 md:px-8 py-8 border-t border-border/85">
        <div className="mx-auto max-w-5xl flex flex-col items-center gap-4">
          <div className="flex items-center gap-5">
            <a
              href={YOUTUBE_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <SiYoutube className="w-5 h-5" />
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <SiInstagram className="w-5 h-5" />
            </a>
            <a
              href={AMAZON_BOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Lheeloo and Luna on Amazon"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <FaAmazon className="w-5 h-5" />
            </a>
            <a
              href={KOFI_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Ko-fi"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <SiKofi className="w-5 h-5" />
            </a>
          </div>
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Blade &amp; Quill Art Academy
          </p>
        </div>
      </footer>
    </div>
  );
}
