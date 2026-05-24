import { useMemo } from "react";
import { Link, useLocation } from "wouter";
import { useTina, tinaField } from "tinacms/react";
import {
  useListProducts,
  useListTutorials,
} from "@workspace/api-client-react";
import {
  FALLBACK_GALLERY,
  FALLBACK_PRODUCTS,
  FALLBACK_TUTORIALS,
} from "@/lib/fallback-data";
import {
  getCatalogProduct,
  hasCatalogProducts,
  resolveCatalogProducts,
} from "@/lib/products";
import { loadBlogPosts, formatBlogDate } from "@/lib/blog-posts";
import homeData from "../../content/home.json";

import { ArtTile, ArtTilePalette } from "@/components/site/ArtTile";
import { BookCover } from "@/components/site/BookCover";
import { Btn } from "@/components/site/Btn";
import { Polaroid } from "@/components/site/Polaroid";
import { ProductCard } from "@/components/site/ProductCard";
import { QuillMark } from "@/components/site/QuillMark";
import { Reveal } from "@/components/site/Reveal";
import { TutorialThumb } from "@/components/site/TutorialThumb";
import { WordReveal } from "@/components/site/WordReveal";

const TINA_DATA_HOMEDATA = { home: homeData };
const YOUTUBE_CHANNEL_URL =
  "https://www.youtube.com/c/BladeQuillartacademy";

// Tina-driven query — preserves existing schema; no changes here.
const homeQuery = `
  query home($relativePath: String!) {
    home(relativePath: $relativePath) {
      hero {
        heading
        subheading
        ctaPrimary
        ctaSecondary
        backgroundImage
      }
      featuredSection { heading subheading viewAllLabel }
      classesSection {
        eyebrow heading subheading body bullets
        ctaLabel ctaLink metaTags image
      }
      tutorialsSection { heading subheading browseAllLabel }
      blogSection { heading subheading viewAllLabel }
      newsletterSection {
        heading subheading placeholderText ctaLabel privacyNote
      }
      bookPromo { heading description ctaLabel ctaLink }
    }
  }
`;

const PILLAR_PALETTES: ArtTilePalette[] = ["warm", "violet", "twilight"];

function galleryImageUrl(title: string): string | undefined {
  return FALLBACK_GALLERY.find((item) => item.title === title)?.imageUrl;
}

const HERO_STEAMPUNK_CAT = galleryImageUrl("Steampunk Cat");
const HERO_CHIBI_ELEPHANT = galleryImageUrl("Chibi Elephant");

export default function Home() {
  const [, setLocation] = useLocation();
  const { data: products } = useListProducts(undefined, {
    query: { enabled: !hasCatalogProducts() },
  });
  const { data: tutorials } = useListTutorials(
    { featured: true },
    { query: { enabled: import.meta.env.PROD } }
  );

  const allProducts = useMemo(
    () => resolveCatalogProducts(products, FALLBACK_PRODUCTS),
    [products]
  );

  const featuredBookSlug = useMemo(() => {
    const book =
      allProducts.find((p) => p.category === "physical" && p.featured) ??
      allProducts.find((p) => p.category === "physical");
    return book?.slug ?? "lheeloo-luna-cartoon-book";
  }, [allProducts]);

  const featuredTutorials = useMemo(() => {
    const list =
      Array.isArray(tutorials) && tutorials.length > 0
        ? tutorials
        : FALLBACK_TUTORIALS.filter((t) => t.featured);
    return list.slice(0, 4);
  }, [tutorials]);

  const blogPosts = useMemo(() => loadBlogPosts().slice(0, 3), []);

  const { data } = useTina({
    query: homeQuery,
    variables: { relativePath: "home.json" },
    data: TINA_DATA_HOMEDATA,
  });
  const content = data.home;

  const hero = content?.hero;
  const featured = content?.featuredSection;
  const classes = content?.classesSection;
  const tuts = content?.tutorialsSection;
  const blog = content?.blogSection;
  const newsletter = content?.newsletterSection;
  const bookPromo = content?.bookPromo;
  const featuredProduct = allProducts[0];

  const pillarPreviews = useMemo(() => {
    const book =
      getCatalogProduct(featuredBookSlug) ??
      allProducts.find((p) => p.category === "physical");
    const curriculum =
      getCatalogProduct("digital-art-fundamentals-curriculum") ??
      allProducts.find((p) => p.category === "curriculum");
    const featuredVideo = featuredTutorials[0];
    return {
      bookSrc: book?.imageUrl,
      bookAlt: book?.name ?? "Lheeloo & Luna book cover",
      classesSrc: curriculum?.imageUrl || classes?.image,
      classesAlt: classes?.heading ?? "Krita education course",
      youtubeId: featuredVideo?.youtubeId,
    };
  }, [allProducts, classes?.heading, classes?.image, featuredBookSlug, featuredTutorials]);

  const pillars = useMemo(
    () => [
      {
        tag: "NEW BOOK",
        title: bookPromo?.heading || "The new book",
        sub:
          bookPromo?.description || "Signed copies + digital edition",
        cta: bookPromo?.ctaLabel || "Read more",
        badge: "LATEST",
        palette: PILLAR_PALETTES[0],
        washi: "var(--orange)",
        rotate: -1.2,
        previewSrc: pillarPreviews.bookSrc,
        previewAlt: pillarPreviews.bookAlt,
        onClick: () => setLocation(bookPromo?.ctaLink || "/shop"),
      },
      {
        tag: classes?.eyebrow || "KRITA CLASSES",
        title: classes?.heading || "Step into the classroom",
        sub:
          classes?.subheading || "Structured digital art training",
        cta: classes?.ctaLabel || "Enroll today",
        badge: "OPEN",
        palette: PILLAR_PALETTES[1],
        washi: "var(--violet)",
        rotate: 0.5,
        previewSrc: pillarPreviews.classesSrc,
        previewAlt: pillarPreviews.classesAlt,
        onClick: () => setLocation(classes?.ctaLink || "/shop"),
      },
      {
        tag: "YOUTUBE",
        title: "Join 100,000+ artists",
        sub: "Free Krita tutorials, bi-weekly",
        cta: "Subscribe",
        badge: "100K+",
        palette: PILLAR_PALETTES[2],
        washi: "var(--rose)",
        rotate: 1.2,
        youtubeId: pillarPreviews.youtubeId,
        onClick: () =>
          window.open(YOUTUBE_CHANNEL_URL, "_blank", "noopener,noreferrer"),
      },
    ],
    [bookPromo, classes, pillarPreviews, setLocation]
  );

  return (
    <div className="page">
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-32 pb-20 lg:min-h-[92vh]">
        <div
          aria-hidden
          className="absolute inset-0 hidden md:block"
        >
          <ArtTile
            palette="lavender"
            className="art-tile-grain"
            width={170}
            height={220}
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
            label="study"
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
            label="palette"
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
            label="sketch"
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
          <Reveal>
            <div className="eyebrow-grad inline-block mb-7">
              ✦ HELLO FROM THE STUDIO ✦
            </div>
          </Reveal>

          <h1
            className="mb-7"
            style={{
              fontSize: "clamp(48px, 7vw, 88px)",
              lineHeight: 1.1,
              letterSpacing: "-0.025em",
            }}
            data-tina-field={tinaField(hero, "heading")}
          >
            <WordReveal text={hero?.heading?.split("\n")[0] || "I write books and teach"} />
            <br />
            <span className="grad-text">
              <WordReveal
                text={hero?.heading?.split("\n")[1] || "digital painting."}
              />
            </span>
          </h1>

          <Reveal>
            <p
              className="text-lg max-w-[560px] mx-auto mb-9 leading-[1.55]"
              style={{ color: "var(--ink-soft)" }}
              data-tina-field={tinaField(hero, "subheading")}
            >
              {hero?.subheading}
            </p>
          </Reveal>

          <Reveal>
            <div className="flex flex-wrap justify-center gap-3.5">
              <Btn
                kind="primary"
                size="lg"
                iconRight="→"
                onClick={() => setLocation(bookPromo?.ctaLink || "/shop")}
              >
                <span data-tina-field={tinaField(hero, "ctaPrimary")}>
                  {hero?.ctaPrimary || "Read the new book"}
                </span>
              </Btn>
              <Btn
                kind="outline"
                size="lg"
                iconRight="↗"
                href={YOUTUBE_CHANNEL_URL}
                external
              >
                <span data-tina-field={tinaField(hero, "ctaSecondary")}>
                  {hero?.ctaSecondary || "Watch a lesson"}
                </span>
              </Btn>
            </div>
          </Reveal>

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
              >
                EST. 2018 · NANTES, FR
              </span>
              <QuillMark
                size={22}
                style={{ transform: "scaleX(-1)" }}
              />
            </div>
          </Reveal>
        </div>

        <div
          className="absolute left-0 right-0 bottom-0 overflow-hidden py-5"
          style={{
            borderTop: "1px solid rgba(31,26,20,0.08)",
            borderBottom: "1px solid rgba(31,26,20,0.08)",
            background: "rgba(246,239,224,0.5)",
          }}
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
                <span>Author</span>
                <span style={{ color: "var(--orange)" }}>✦</span>
                <span>Illustrator</span>
                <span style={{ color: "var(--rose)" }}>✦</span>
                <span>Krita educator</span>
                <span style={{ color: "var(--violet)" }}>✦</span>
                <span>Chibi specialist</span>
                <span style={{ color: "var(--amber)" }}>✦</span>
                <span>Storyteller</span>
                <span style={{ color: "var(--orange)" }}>✦</span>
                <span>YouTuber</span>
                <span style={{ color: "var(--rose)" }}>✦</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── PILLARS (three priorities) ──────────────────────── */}
      <section className="py-24 lg:py-28">
        <div className="bq-container">
          <div className="text-center mb-16">
            <Reveal>
              <div className="eyebrow mb-3.5">THREE THREADS</div>
            </Reveal>
            <Reveal>
              <h2 style={{ fontSize: "clamp(34px, 4.5vw, 52px)" }}>
                Where would you like to start?
              </h2>
            </Reveal>
          </div>

          <Reveal stagger>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pillars.map((p) => (
                <button
                  key={p.title}
                  type="button"
                  onClick={p.onClick}
                  className="text-left cursor-pointer focus:outline-none"
                >
                  <Polaroid
                    rotate={p.rotate}
                    washiColor={p.washi}
                    hoverStraighten
                  >
                    <div className="relative">
                      {p.youtubeId ? (
                        <TutorialThumb
                          palette={p.palette}
                          youtubeId={p.youtubeId}
                          width="100%"
                          height={280}
                          style={{ borderRadius: 2 }}
                        />
                      ) : (
                        <ArtTile
                          palette={p.palette}
                          src={p.previewSrc}
                          alt={p.previewAlt}
                          width="100%"
                          height={280}
                          radius={2}
                        />
                      )}
                      <span
                        className="absolute top-3 right-3"
                        style={{
                          background: "var(--ink)",
                          color: "var(--paper)",
                          fontFamily: "var(--f-mono)",
                          fontSize: 10,
                          letterSpacing: "0.12em",
                          padding: "5px 10px",
                          borderRadius: 999,
                        }}
                      >
                        {p.badge}
                      </span>
                    </div>
                    <div className="pt-5 px-1.5 pb-1">
                      <div className="eyebrow-grad mb-2.5">{p.tag}</div>
                      <h3
                        className="mb-2.5"
                        style={{ fontSize: 26, lineHeight: 1.15 }}
                      >
                        {p.title}
                      </h3>
                      <p
                        className="mb-4 text-sm"
                        style={{ color: "var(--ink-mute)" }}
                      >
                        {p.sub}
                      </p>
                      <span
                        className="link-ink"
                        style={{
                          fontFamily: "var(--f-mono)",
                          fontSize: 12,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          fontWeight: 600,
                          color: "var(--ink)",
                        }}
                      >
                        {p.cta} →
                      </span>
                    </div>
                  </Polaroid>
                </button>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FEATURED BOOK ───────────────────────────────────── */}
      <section
        className="relative py-24 lg:py-28 overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, var(--paper) 0%, var(--paper-2) 50%, var(--paper) 100%)",
        }}
      >
        <div
          aria-hidden
          className="absolute pointer-events-none"
          style={{
            top: "-30%",
            right: "-15%",
            width: 700,
            height: 700,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(229,89,52,0.15), transparent 70%)",
          }}
        />
        <div
          aria-hidden
          className="absolute pointer-events-none"
          style={{
            bottom: "-30%",
            left: "-15%",
            width: 700,
            height: 700,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(107,91,168,0.15), transparent 70%)",
          }}
        />

        <div className="bq-container relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <Reveal>
              <div className="relative flex gap-6 justify-center items-center">
                <BookCover
                  title={featuredProduct?.name || "Lheeloo & Luna"}
                  subtitle="CORINNE  HADAWAY"
                  palette="warm"
                  badge="NEW"
                  width={280}
                  height={380}
                  drift
                  src={featuredProduct?.imageUrl}
                  alt={featuredProduct?.name}
                  style={{ zIndex: 2 }}
                />
                <div className="flex flex-col gap-4">
                  <Polaroid rotate={3} washi={false}>
                    <ArtTile
                      palette="rose"
                      width={180}
                      height={130}
                      label="spread"
                      radius={2}
                    />
                  </Polaroid>
                  <Polaroid rotate={-4} washi={false}>
                    <ArtTile
                      palette="violet"
                      width={180}
                      height={130}
                      label="character"
                      radius={2}
                    />
                  </Polaroid>
                </div>
              </div>
            </Reveal>

            <div>
              <Reveal>
                <div className="eyebrow-grad mb-4">FEATURED RELEASE</div>
              </Reveal>
              <Reveal>
                <h2
                  className="mb-5"
                  style={{
                    fontSize: "clamp(38px, 4.5vw, 58px)",
                    lineHeight: 1.05,
                  }}
                  data-tina-field={tinaField(bookPromo, "heading")}
                >
                  {bookPromo?.heading || "The new book."}
                </h2>
              </Reveal>
              <Reveal>
                <p
                  className="mb-7 max-w-[480px]"
                  style={{
                    fontSize: 17,
                    color: "var(--ink-soft)",
                    lineHeight: 1.7,
                  }}
                  data-tina-field={tinaField(bookPromo, "description")}
                >
                  {bookPromo?.description ||
                    "An illustrated story full of personality and beautiful original artwork."}
                </p>
              </Reveal>
              <Reveal>
                <div
                  className="flex flex-wrap gap-9 mb-8 pb-6"
                  style={{
                    borderBottom: "1px solid rgba(31,26,20,0.1)",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--f-serif)",
                        fontSize: 36,
                        color: "var(--orange)",
                      }}
                    >
                      $
                      {featuredProduct?.price?.toFixed(0) ??
                        FALLBACK_PRODUCTS[0].price.toFixed(0)}
                    </div>
                    <div className="eyebrow">SIGNED COPY</div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--f-serif)",
                        fontSize: 36,
                        color: "var(--violet)",
                      }}
                    >
                      $
                      {(FALLBACK_PRODUCTS[1]?.price ?? 14).toFixed(0)}
                    </div>
                    <div className="eyebrow">EBOOK</div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--f-serif)",
                        fontSize: 36,
                        color: "var(--ink)",
                      }}
                    >
                      144
                    </div>
                    <div className="eyebrow">FULL-COLOR PAGES</div>
                  </div>
                </div>
              </Reveal>
              <Reveal>
                <div className="flex flex-wrap gap-3">
                  <Btn
                    kind="primary"
                    size="lg"
                    iconRight="→"
                    onClick={() =>
                      setLocation(
                        bookPromo?.ctaLink || `/shop/${featuredBookSlug}`
                      )
                    }
                  >
                    <span data-tina-field={tinaField(bookPromo, "ctaLabel")}>
                      {bookPromo?.ctaLabel || "Order Now"}
                    </span>
                  </Btn>
                  <Btn
                    kind="outline"
                    size="lg"
                    onClick={() => setLocation("/shop")}
                  >
                    Browse the shop
                  </Btn>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── CLASSES ─────────────────────────────────────────── */}
      <section className="py-24 lg:py-28 relative">
        <div className="bq-container">
          <div className="text-center mb-14">
            <Reveal>
              <div
                className="eyebrow-grad mb-4"
                data-tina-field={tinaField(classes, "eyebrow")}
              >
                {classes?.eyebrow || "ENROLLMENT OPEN"}
              </div>
            </Reveal>
            <Reveal>
              <h2
                style={{ fontSize: "clamp(38px, 5vw, 60px)" }}
                data-tina-field={tinaField(classes, "heading")}
              >
                {classes?.heading || "Step inside the classroom."}
              </h2>
            </Reveal>
          </div>

          <Reveal>
            <div
              className="grid grid-cols-1 lg:grid-cols-2 max-w-[1080px] mx-auto relative overflow-hidden"
              style={{
                background: "var(--paper)",
                borderRadius: 6,
                boxShadow:
                  "0 30px 80px rgba(60,38,18,0.16), 0 4px 12px rgba(60,38,18,0.08)",
              }}
            >
              <div
                aria-hidden
                className="hidden lg:block pointer-events-none"
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: "50%",
                  width: 24,
                  transform: "translateX(-50%)",
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(60,38,18,0.12) 45%, rgba(60,38,18,0.18) 50%, rgba(60,38,18,0.12) 55%, transparent 100%)",
                  zIndex: 2,
                }}
              />

              <div
                className="p-10 lg:p-12 lg:pr-10"
                style={{ borderRight: "1px solid rgba(31,26,20,0.05)" }}
              >
                <div className="eyebrow mb-3.5">WHAT YOU'LL MAKE</div>
                <h3
                  className="mb-7"
                  style={{ fontSize: 28, lineHeight: 1.2 }}
                  data-tina-field={tinaField(classes, "subheading")}
                >
                  {classes?.subheading ||
                    "Structured digital art training designed for artists who want to master Krita."}
                </h3>
                <div className="flex flex-col gap-5">
                  {(classes?.bullets || []).map((bullet, n) => (
                    <div
                      key={`${bullet}-${n}`}
                      className="flex gap-5 items-start"
                      data-tina-field={tinaField(classes, "bullets", n)}
                    >
                      <div
                        style={{
                          fontFamily: "var(--f-mono)",
                          fontSize: 11,
                          letterSpacing: "0.12em",
                          color: "var(--orange)",
                          fontWeight: 600,
                          paddingTop: 3,
                        }}
                      >
                        {String(n + 1).padStart(2, "0")}
                      </div>
                      <div
                        style={{
                          fontSize: 15,
                          color: "var(--ink)",
                          lineHeight: 1.5,
                        }}
                      >
                        {bullet}
                      </div>
                    </div>
                  ))}
                </div>
                {classes?.metaTags && (
                  <div
                    className="mt-9 pt-6 flex flex-wrap gap-4"
                    style={{
                      borderTop: "1px solid rgba(31,26,20,0.08)",
                      fontFamily: "var(--f-mono)",
                      fontSize: 11,
                      color: "var(--ink-mute)",
                      letterSpacing: "0.08em",
                    }}
                    data-tina-field={tinaField(classes, "metaTags")}
                  >
                    {classes.metaTags
                      .split("·")
                      .map((t) => t.trim().toUpperCase())
                      .filter(Boolean)
                      .map((t, i, arr) => (
                        <span key={`${t}-${i}`}>
                          {t}
                          {i < arr.length - 1 && (
                            <span className="ml-4">·</span>
                          )}
                        </span>
                      ))}
                  </div>
                )}
              </div>

              <div className="p-10 lg:p-12 lg:pl-10">
                <div className="eyebrow mb-3.5">SIX MODULES</div>
                <div className="grid grid-cols-3 gap-2.5 mb-7">
                  {[
                    { p: "warm" as ArtTilePalette, l: "M1 · LINES" },
                    { p: "rose" as ArtTilePalette, l: "M2 · COLOR" },
                    { p: "warm" as ArtTilePalette, l: "M3 · LIGHT" },
                    { p: "violet" as ArtTilePalette, l: "M4 · CHARACTER" },
                    { p: "twilight" as ArtTilePalette, l: "M5 · STUDIO" },
                    { p: "moss" as ArtTilePalette, l: "M6 · FINAL" },
                  ].map((m) => (
                    <ArtTile
                      key={m.l}
                      palette={m.p}
                      width="100%"
                      height={80}
                      label={m.l}
                    />
                  ))}
                </div>
                <Btn
                  kind="primary"
                  size="lg"
                  iconRight="→"
                  onClick={() =>
                    setLocation(classes?.ctaLink || "/shop")
                  }
                  className="w-full"
                >
                  <span data-tina-field={tinaField(classes, "ctaLabel")}>
                    {classes?.ctaLabel || "Reserve Your Spot"}
                  </span>
                </Btn>
                <Btn
                  kind="ghost"
                  size="md"
                  iconRight="→"
                  className="w-full mt-2.5"
                  onClick={() => setLocation("/about")}
                >
                  About Corinne
                </Btn>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── YOUTUBE ─────────────────────────────────────────── */}
      <section
        className="py-24 lg:py-28 relative overflow-hidden"
        style={{ background: "var(--ink)", color: "var(--paper)" }}
      >
        <div
          aria-hidden
          className="absolute pointer-events-none"
          style={{
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "60%",
            height: 400,
            background:
              "radial-gradient(ellipse, rgba(216,107,126,0.18) 0%, transparent 60%)",
          }}
        />

        <div className="bq-container relative">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-14">
            <div>
              <Reveal>
                <div className="eyebrow-grad mb-4">
                  FREE LESSONS ON YOUTUBE
                </div>
              </Reveal>
              <Reveal>
                <h2
                  style={{
                    fontSize: "clamp(40px, 5.5vw, 64px)",
                    lineHeight: 1.05,
                    color: "var(--paper)",
                  }}
                  data-tina-field={tinaField(tuts, "heading")}
                >
                  Join{" "}
                  <span className="grad-text-warm">
                    100,000+ artists
                  </span>
                  <br />
                  learning with me.
                </h2>
              </Reveal>
            </div>
            <Reveal>
              <Btn
                kind="light"
                size="lg"
                iconRight="↗"
                href={YOUTUBE_CHANNEL_URL}
                external
              >
                <span data-tina-field={tinaField(tuts, "browseAllLabel")}>
                  {tuts?.browseAllLabel || "Subscribe on YouTube"}
                </span>
              </Btn>
            </Reveal>
          </div>

          <Reveal stagger>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {featuredTutorials.map((v, i) => {
                const palette: ArtTilePalette = (
                  ["twilight", "warm", "violet", "rose"] as ArtTilePalette[]
                )[i % 4];
                const url = `https://www.youtube.com/watch?v=${v.youtubeId}`;
                return (
                  <a
                    key={v.id}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="video-card group block cursor-pointer"
                  >
                    <TutorialThumb
                      palette={palette}
                      youtubeId={v.youtubeId}
                      duration={i % 2 === 0 ? "18:42" : "14:08"}
                      width="100%"
                      height={210}
                    />
                    <div className="mt-3.5">
                      <div
                        className="font-semibold"
                        style={{
                          fontSize: 14,
                          color: "var(--paper)",
                          lineHeight: 1.4,
                        }}
                      >
                        {v.title}
                      </div>
                      <div
                        className="mt-1.5"
                        style={{
                          fontFamily: "var(--f-mono)",
                          fontSize: 11,
                          color: "var(--ink-faint)",
                          letterSpacing: "0.04em",
                        }}
                      >
                        BLADE &amp; QUILL · YOUTUBE
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </Reveal>

          <Reveal>
            <div
              className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-5"
              style={{
                padding: "36px 40px",
                background: "rgba(251,246,236,0.04)",
                border: "1px solid rgba(251,246,236,0.08)",
                borderRadius: 18,
              }}
            >
              {[
                ["100K+", "subscribers", "orange"],
                ["1.5M", "total views", "amber"],
                ["65", "countries", "rose"],
                ["bi-weekly", "new videos", "violet"],
              ].map(([v, l, c], i) => (
                <div
                  key={l}
                  style={{
                    borderLeft:
                      i > 0
                        ? "1px solid rgba(251,246,236,0.1)"
                        : "none",
                    paddingLeft: i > 0 ? 24 : 0,
                  }}
                >
                  <div
                    className="mb-2"
                    style={{
                      fontFamily: "var(--f-serif)",
                      fontSize: "clamp(28px, 3.5vw, 44px)",
                      lineHeight: 1,
                      color: `var(--${c})`,
                    }}
                  >
                    {v}
                  </div>
                  <div
                    className="eyebrow"
                    style={{ color: "var(--ink-faint)" }}
                  >
                    {l}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── SHOP STRIP ──────────────────────────────────────── */}
      <section
        className="py-24 lg:py-28"
        style={{ background: "var(--paper)" }}
      >
        <div className="bq-container">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-9">
            <div>
              <Reveal>
                <div className="eyebrow-grad mb-3.5">FROM THE SHOP</div>
              </Reveal>
              <Reveal>
                <h2
                  style={{ fontSize: "clamp(32px, 4vw, 48px)" }}
                  data-tina-field={tinaField(featured, "heading")}
                >
                  {featured?.heading || "Books, brushes, and guides."}
                </h2>
              </Reveal>
            </div>
            <Reveal>
              <Btn
                kind="ghost"
                iconRight="→"
                onClick={() => setLocation("/shop")}
              >
                <span data-tina-field={tinaField(featured, "viewAllLabel")}>
                  {featured?.viewAllLabel || "All products"}
                </span>
              </Btn>
            </Reveal>
          </div>

          <Reveal stagger>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
              {allProducts.slice(0, 4).map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── BLOG + NEWSLETTER ───────────────────────────────── */}
      <section
        className="py-24 lg:py-28"
        style={{ background: "var(--paper-2)" }}
      >
        <div className="bq-container">
          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-12 lg:gap-14">
            <div>
              <Reveal>
                <h2
                  className="mb-7"
                  style={{ fontSize: "clamp(32px, 4vw, 44px)" }}
                  data-tina-field={tinaField(blog, "heading")}
                >
                  {blog?.heading || "Recent writing."}
                </h2>
              </Reveal>
              <Reveal stagger>
                <div className="flex flex-col">
                  {blogPosts.map((post, i) => {
                    const palette: ArtTilePalette = (
                      ["warm", "rose", "violet"] as ArtTilePalette[]
                    )[i % 3];
                    return (
                      <Link
                        key={post.slug}
                        href={`/blog/${post.slug}`}
                        className="blog-row grid items-center gap-6"
                        style={{
                          gridTemplateColumns: "140px 1fr auto",
                          padding: "22px 0",
                          borderBottom: "1px solid rgba(31,26,20,0.1)",
                        }}
                      >
                        <ArtTile
                          palette={palette}
                          src={post.coverImage}
                          width={140}
                          height={86}
                          alt={post.title}
                        />
                        <div>
                          <div className="eyebrow mb-1.5">
                            {(
                              formatBlogDate(post.publishedAt) || ""
                            ).toUpperCase()}
                          </div>
                          <h3
                            style={{
                              fontSize: 22,
                              lineHeight: 1.3,
                            }}
                          >
                            {post.title}
                          </h3>
                        </div>
                        <span
                          className="blog-arrow"
                          style={{
                            fontFamily: "var(--f-mono)",
                            fontSize: 18,
                            color: "var(--orange)",
                          }}
                        >
                          →
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </Reveal>
            </div>

            <Reveal>
              <div
                className="relative overflow-hidden"
                style={{
                  background: "var(--g-ink)",
                  color: "var(--paper)",
                  padding: "40px 36px",
                  borderRadius: 24,
                  boxShadow: "var(--sh-lg)",
                }}
              >
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    top: -50,
                    right: -50,
                    width: 200,
                    height: 200,
                    background: "var(--g-cta)",
                    borderRadius: "50%",
                    opacity: 0.7,
                    filter: "blur(60px)",
                  }}
                />
                <div className="relative">
                  <div
                    className="eyebrow mb-4"
                    style={{ color: "var(--amber)" }}
                  >
                    STUDIO NEWSLETTER
                  </div>
                  <h3
                    className="mb-3.5"
                    style={{
                      fontSize: 32,
                      lineHeight: 1.1,
                      color: "var(--paper)",
                    }}
                    data-tina-field={tinaField(newsletter, "heading")}
                  >
                    {newsletter?.heading || "Once a month, from my desk."}
                  </h3>
                  <p
                    className="mb-7"
                    style={{
                      fontSize: 14,
                      color: "var(--paper-3)",
                      lineHeight: 1.6,
                    }}
                    data-tina-field={tinaField(newsletter, "subheading")}
                  >
                    {newsletter?.subheading ||
                      "New work, free guides, and class openings. No spam — promise."}
                  </p>
                  <form
                    onSubmit={(e) => e.preventDefault()}
                    className="flex flex-col gap-3"
                  >
                    <input
                      type="email"
                      placeholder={
                        newsletter?.placeholderText || "your@email.com"
                      }
                      data-tina-field={tinaField(
                        newsletter,
                        "placeholderText"
                      )}
                      className="rounded-full outline-none transition-colors"
                      style={{
                        background: "rgba(251,246,236,0.08)",
                        border: "1px solid rgba(251,246,236,0.18)",
                        padding: "14px 20px",
                        color: "var(--paper)",
                        fontFamily: "var(--f-sans)",
                        fontSize: 14,
                      }}
                    />
                    <Btn
                      kind="primary"
                      size="lg"
                      iconRight="→"
                      type="submit"
                    >
                      <span
                        data-tina-field={tinaField(newsletter, "ctaLabel")}
                      >
                        {newsletter?.ctaLabel || "Subscribe"}
                      </span>
                    </Btn>
                  </form>
                  <div
                    className="mt-5"
                    style={{
                      fontFamily: "var(--f-mono)",
                      fontSize: 10,
                      letterSpacing: "0.1em",
                      color: "var(--ink-faint)",
                    }}
                    data-tina-field={tinaField(newsletter, "privacyNote")}
                  >
                    {newsletter?.privacyNote ||
                      "12,000+ ARTISTS READ EVERY MONTH"}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
