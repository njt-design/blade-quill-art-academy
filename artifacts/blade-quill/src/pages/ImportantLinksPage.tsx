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
      kofiSection {
        heading
        body
        ctaLabel
        href
      }
    }
  }
`;

export default function ImportantLinksPage() {
  const { data } = useTina({
    query: importantLinksQuery,
    variables: { relativePath: "important-links.json" },
    data: TINA_DATA,
  });

  const page = data.importantLinks;
  const featured = page.featuredRelease;
  const kofi = page.kofiSection;

  const frontCoverSrc = featured?.coverImage?.trim() || undefined;
  const backCoverSrc = featured?.backCoverImage?.trim() || undefined;

  useEffect(() => {
    if (page.pageTitle) {
      document.title = `${page.pageTitle} — Blade & Quill`;
    }
  }, [page.pageTitle]);

  return (
    <div className="important-links-page min-h-screen bg-background flex flex-col">
      <header className="px-6 md:px-8 py-4 border-b border-border/85">
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
          className="bg-secondary py-2 font-sans text-xs md:text-sm uppercase tracking-[0.18em] text-foreground"
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

      <main className="flex-1 px-6 md:px-8 py-6 md:py-8">
        <div className="mx-auto max-w-5xl flex flex-col gap-6">
          {/* Featured release — two columns (covers | content) */}
          <Reveal className="w-full">
            <section
              className="home-panel p-6 md:p-8 w-full !overflow-visible"
              aria-labelledby="featured-release-heading"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
                <div className="flex flex-col items-center gap-15 pb-15 md:pb-0">
                  <div
                    className="flex flex-row items-center justify-center gap-3 md:gap-5 overflow-visible w-full"
                    data-tina-field={tinaField(featured, "coverImage")}
                  >
                    <div className="w-[46%] max-w-[200px] shrink-0">
                      <img
                        src={frontCoverSrc}
                        alt={`${featured?.title ?? "Book"} front cover`}
                        className="w-full h-auto object-contain rounded shadow-[0_12px_32px_rgba(60,38,18,0.18)]"
                        style={{ transform: "rotate(-2deg)" }}
                      />
                    </div>
                    <div className="w-[46%] max-w-[200px] shrink-0">
                      <img
                        src={backCoverSrc}
                        alt={`${featured?.title ?? "Book"} back cover`}
                        className="w-full h-auto object-contain rounded shadow-[0_12px_32px_rgba(60,38,18,0.18)]"
                        style={{ transform: "rotate(2deg)" }}
                      />
                    </div>
                  </div>
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
                </div>

                <div className="text-center md:text-left">
                  {featured?.eyebrow && (
                    <p
                      className="eyebrow text-orange mb-3"
                      data-tina-field={tinaField(featured, "eyebrow")}
                    >
                      {featured.eyebrow}
                    </p>
                  )}
                  <h2
                    id="featured-release-heading"
                    className="font-display text-2xl md:text-3xl text-foreground mb-3 leading-tight"
                    data-tina-field={tinaField(featured, "title")}
                  >
                    {featured?.title}
                  </h2>
                  {featured?.description && (
                    <div data-tina-field={tinaField(featured, "description")}>
                      <RichText
                        value={featured.description}
                        className="font-sans text-sm md:text-base text-muted-foreground leading-relaxed"
                      />
                    </div>
                  )}
                </div>
              </div>
            </section>
          </Reveal>

          {/* Ko-fi — single column, full width */}
          <Reveal className="w-full">
            <section
              className="home-panel p-6 md:p-8 text-center bg-secondary/50 w-full"
              aria-labelledby="kofi-heading"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-violet/10 text-violet mb-3 mx-auto">
                <SiKofi className="w-6 h-6" aria-hidden />
              </div>
              <h2
                id="kofi-heading"
                className="font-sans font-medium text-xl md:text-2xl text-foreground mb-3 leading-tight"
                data-tina-field={tinaField(kofi, "heading")}
              >
                {kofi?.heading}
              </h2>
              <div data-tina-field={tinaField(kofi, "body")}>
                <RichText
                  value={kofi?.body}
                  className="font-sans text-sm md:text-base text-muted-foreground reading-width mx-auto mb-5 leading-relaxed"
                />
              </div>
              {kofi?.ctaLabel && (
                <div data-tina-field={tinaField(kofi, "ctaLabel")}>
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
      </main>

      <footer className="px-6 md:px-8 py-6 border-t border-border/85">
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
