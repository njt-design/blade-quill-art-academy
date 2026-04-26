import { useLocation } from "wouter";
import { ArrowRight, Play, BookOpen, ShoppingBag, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useListProducts, useListTutorials, useListGallery } from "@workspace/api-client-react";
import { FALLBACK_GALLERY, FALLBACK_TUTORIALS, FALLBACK_PRODUCTS } from "@/lib/fallback-data";
import { useTina, tinaField } from "tinacms/react";
import homeData from "../../content/home.json";
const TINA_DATA_HOMEDATA = { home: homeData };

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
      latestSection {
        heading
        viewAllLabel
      }
      featuredSection {
        heading
        subheading
        viewAllLabel
      }
      artistBanner {
        badge
        heading
        bio
        ctaLabel
        portraitImage
      }
      tutorialsSection {
        heading
        subheading
        browseAllLabel
      }
      bookPromo {
        heading
        description
        ctaLabel
        ctaLink
      }
    }
  }
`;

export default function Home() {
  const [, setLocation] = useLocation();
  const { data: products } = useListProducts();
  const { data: tutorials } = useListTutorials({ featured: true });
  const { data: gallery } = useListGallery();

  const featuredProducts = (Array.isArray(products) && products.length > 0 ? products : FALLBACK_PRODUCTS).filter((p) => p.featured).slice(0, 3);
  const featuredTutorials = (Array.isArray(tutorials) && tutorials.length > 0 ? tutorials : FALLBACK_TUTORIALS.filter((t) => t.featured)).slice(0, 3);
  const galleryItems = (Array.isArray(gallery) && gallery.length > 0 ? gallery : FALLBACK_GALLERY).slice(0, 6);

  const { data } = useTina({
    query: homeQuery,
    variables: { relativePath: "home.json" },
    data: TINA_DATA_HOMEDATA,
  });

  const content = data.home;

  return (
    <div className="min-h-screen">

      {/* Intro strip */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl text-center">
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-display mb-6"
            data-tina-field={tinaField(content?.hero, "heading")}
          >
            {content?.hero?.heading?.split("\n").map((line: string, i: number) => (
              <span key={i}>{line}{i === 0 && <br />}</span>
            ))}
          </h1>
          <p
            className="text-lg md:text-xl font-sans text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed"
            data-tina-field={tinaField(content?.hero, "subheading")}
          >
            {content?.hero?.subheading}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={() => setLocation("/shop")}
              className="bg-orange hover:bg-amber text-white px-8 cta-bold"
              data-tina-field={tinaField(content?.hero, "ctaPrimary")}
            >
              {content?.hero?.ctaPrimary || "Explore the Shop"}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setLocation("/tutorials")}
              className="px-8"
              data-tina-field={tinaField(content?.hero, "ctaSecondary")}
            >
              <Play className="w-4 h-4 mr-2" />
              {content?.hero?.ctaSecondary || "Watch Tutorials"}
            </Button>
          </div>
        </div>
      </section>

      {/* Latest work — thumbnail grid (Oatmeal pattern) */}
      <section className="pb-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-baseline justify-between mb-8">
            <h2
              className="text-2xl font-heading"
              data-tina-field={tinaField(content?.latestSection, "heading")}
            >
              {content?.latestSection?.heading || "Latest"}
            </h2>
            <button
              onClick={() => setLocation("/gallery")}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              data-tina-field={tinaField(content?.latestSection, "viewAllLabel")}
            >
              {content?.latestSection?.viewAllLabel || "View all"} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {galleryItems.length > 0
              ? galleryItems.map((item) => (
                  <div
                    key={item.id}
                    className="thumb-card cursor-pointer group"
                    onClick={() => setLocation("/gallery")}
                  >
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    <div className="px-2 py-2">
                      <p className="text-xs font-medium truncate">{item.title}</p>
                    </div>
                  </div>
                ))
              : Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="aspect-square bg-muted rounded-lg animate-pulse" />
                ))}
          </div>
        </div>
      </section>

      {/* Featured products (3-up) */}
      <section className="py-16 bg-secondary/40">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-baseline justify-between mb-8">
            <div>
              <h2
                className="text-2xl font-heading mb-1"
                data-tina-field={tinaField(content?.featuredSection, "heading")}
              >
                {content?.featuredSection?.heading}
              </h2>
              <p
                className="text-sm font-sans text-muted-foreground"
                data-tina-field={tinaField(content?.featuredSection, "subheading")}
              >
                {content?.featuredSection?.subheading}
              </p>
            </div>
            <button
              onClick={() => setLocation("/shop")}
              className="hidden md:flex text-sm text-muted-foreground hover:text-foreground transition-colors items-center gap-1"
              data-tina-field={tinaField(content?.featuredSection, "viewAllLabel")}
            >
              {content?.featuredSection?.viewAllLabel || "View All"} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredProducts.length > 0
              ? featuredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="gumroad-card cursor-pointer group"
                    onClick={() => setLocation(`/shop/${product.id}`)}
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <h3 className="font-normal text-foreground group-hover:text-violet transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                        <span className="text-orange font-bold whitespace-nowrap">
                          ${product.price.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                    </div>
                  </div>
                ))
              : Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-muted rounded-lg animate-pulse aspect-[4/3]" />
                ))}
          </div>
        </div>
      </section>

      {/* Tutorials teaser (Proko-style 3-up cards) */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-baseline justify-between mb-8">
            <div>
              <BookOpen className="w-5 h-5 text-muted-foreground mb-2" />
              <h2
                className="text-2xl font-heading mb-1"
                data-tina-field={tinaField(content?.tutorialsSection, "heading")}
              >
                {content?.tutorialsSection?.heading}
              </h2>
              <p
                className="text-sm font-sans text-muted-foreground"
                data-tina-field={tinaField(content?.tutorialsSection, "subheading")}
              >
                {content?.tutorialsSection?.subheading}
              </p>
            </div>
            <button
              onClick={() => setLocation("/tutorials")}
              className="hidden md:flex text-sm text-muted-foreground hover:text-foreground transition-colors items-center gap-1"
              data-tina-field={tinaField(content?.tutorialsSection, "browseAllLabel")}
            >
              {content?.tutorialsSection?.browseAllLabel || "Browse All"} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredTutorials.length > 0
              ? featuredTutorials.map((tutorial) => (
                  <div key={tutorial.id} className="gumroad-card group">
                    <div className="aspect-video bg-muted">
                      <iframe
                        src={`https://www.youtube.com/embed/${tutorial.youtubeId}`}
                        title={tutorial.title}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                    <div className="p-4">
                      {tutorial.topic && (
                        <span className="text-xs uppercase tracking-wider text-muted-foreground mb-1 block">
                          {tutorial.topic}
                        </span>
                      )}
                      <h3 className="font-normal leading-snug line-clamp-2 group-hover:text-violet transition-colors">
                        {tutorial.title}
                      </h3>
                    </div>
                  </div>
                ))
              : (
                <p className="col-span-3 text-center py-12 text-muted-foreground">
                  No featured tutorials available yet.
                </p>
              )}
          </div>
        </div>
      </section>

      {/* Artist banner */}
      {content?.artistBanner && (
        <section className="py-16 bg-secondary/40">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row items-center gap-10 max-w-4xl mx-auto">
              <div className="w-40 h-40 md:w-48 md:h-48 shrink-0 rounded-full overflow-hidden border-2 border-border">
                {content.artistBanner.portraitImage ? (
                  <img
                    src={content.artistBanner.portraitImage}
                    alt={content.artistBanner.heading || "Artist portrait"}
                    className="w-full h-full object-cover"
                    data-tina-field={tinaField(content?.artistBanner, "portraitImage")}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <User className="w-12 h-12 text-muted-foreground/30" />
                  </div>
                )}
              </div>
              <div className="text-center md:text-left">
                {content.artistBanner.badge && (
                  <span
                    className="inline-block text-xs uppercase tracking-widest font-bold text-violet bg-violet/10 px-3 py-1 rounded-full mb-3"
                    data-tina-field={tinaField(content?.artistBanner, "badge")}
                  >
                    {content.artistBanner.badge}
                  </span>
                )}
                <h2
                  className="text-2xl md:text-3xl font-heading mb-3"
                  data-tina-field={tinaField(content?.artistBanner, "heading")}
                >
                  {content.artistBanner.heading}
                </h2>
                <p
                  className="font-sans text-muted-foreground leading-relaxed mb-5 max-w-lg"
                  data-tina-field={tinaField(content?.artistBanner, "bio")}
                >
                  {content.artistBanner.bio}
                </p>
                <Button
                  variant="outline"
                  onClick={() => setLocation("/about")}
                  data-tina-field={tinaField(content?.artistBanner, "ctaLabel")}
                >
                  {content.artistBanner.ctaLabel || "Read My Story"} <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Book promo CTA band */}
      {content?.bookPromo && (
        <section className="py-12 bg-foreground text-background">
          <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <ShoppingBag className="w-8 h-8 shrink-0 opacity-60" />
              <div>
                <h2
                  className="text-xl md:text-2xl font-heading"
                  data-tina-field={tinaField(content?.bookPromo, "heading")}
                >
                  {content.bookPromo.heading}
                </h2>
                <p
                  className="text-sm font-sans opacity-70"
                  data-tina-field={tinaField(content?.bookPromo, "description")}
                >
                  {content.bookPromo.description}
                </p>
              </div>
            </div>
            <Button
              size="lg"
              onClick={() => setLocation(content.bookPromo.ctaLink || "/shop")}
              className="bg-orange hover:bg-amber text-white shrink-0 cta-bold"
              data-tina-field={tinaField(content?.bookPromo, "ctaLabel")}
            >
              {content.bookPromo.ctaLabel || "Order Now"} <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}
