import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Play, BookOpen, Brush, ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useListProducts, useListTutorials, useListGallery } from "@workspace/api-client-react";
import { useState, useEffect, useCallback } from "react";

function ArtworkCarousel() {
  const { data: gallery } = useListGallery();
  const [current, setCurrent] = useState(0);
  const items = gallery ?? [];

  const prev = useCallback(() => setCurrent((c) => (c === 0 ? items.length - 1 : c - 1)), [items.length]);
  const next = useCallback(() => setCurrent((c) => (c === items.length - 1 ? 0 : c + 1)), [items.length]);

  useEffect(() => {
    if (items.length <= 1) return;
    const interval = setInterval(next, 4000);
    return () => clearInterval(interval);
  }, [next, items.length]);

  if (items.length === 0) {
    return (
      <div className="aspect-[4/3] rounded-2xl bg-secondary/50 animate-pulse" />
    );
  }

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-primary/10 border border-white/10 group">
      <div className="aspect-[4/3] relative overflow-hidden bg-black">
        <AnimatePresence mode="wait">
          <motion.img
            key={items[current].id}
            src={items[current].imageUrl}
            alt={items[current].title}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <p className="text-white font-display text-lg drop-shadow">{items[current].title}</p>
          {items[current].description && (
            <p className="text-white/70 text-sm mt-1">{items[current].description}</p>
          )}
        </div>
      </div>

      {items.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-primary/60 transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-primary/60 transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === current ? "bg-primary w-5" : "bg-white/40"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function Home() {
  const [, setLocation] = useLocation();
  const { data: products } = useListProducts();
  const { data: tutorials } = useListTutorials({ featured: true });

  const featuredProducts = products?.slice(0, 3) || [];
  const featuredTutorials = tutorials?.slice(0, 3) || [];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`} 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent to-background/90" />
        </div>

        <div className="container relative z-10 px-4 md:px-6 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-primary mb-6 drop-shadow-2xl">
              Unleash Your<br/>Digital Canvas
            </h1>
            <p className="text-xl md:text-2xl text-foreground/90 mb-10 font-light max-w-2xl mx-auto leading-relaxed">
              Master Krita and digital painting with Corinne. Discover tutorials, exclusive guides, and original artwork.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button size="lg" onClick={() => setLocation("/shop")} className="w-full sm:w-auto text-lg px-10">
                Explore the Shop
              </Button>
              <Button size="lg" variant="outline" onClick={() => setLocation("/tutorials")} className="w-full sm:w-auto text-lg px-10">
                <Play className="w-5 h-5 mr-2" /> Watch Tutorials
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Book Order CTA Banner */}
      <section className="py-12 bg-primary/10 border-y border-primary/20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center shrink-0 border border-primary/30">
                <ShoppingBag className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h2 className="text-xl md:text-3xl font-display text-foreground leading-snug">
                  <span className="text-primary">Lheeloo & Luna</span> — The Cartoon Book Is Live!
                </h2>
                <p className="text-muted-foreground mt-1">
                  Corinne's debut illustrated book. Order your copy today and bring the magic home.
                </p>
              </div>
            </div>
            <Button
              size="lg"
              className="shrink-0 text-lg px-8"
              onClick={() => setLocation("/shop/1")}
            >
              Order Your Book <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Gallery Carousel */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-medium">
                <Brush className="w-4 h-4" /> Original Artwork
              </div>
              <h2 className="text-4xl md:text-5xl font-display">Art from Corinne's Studio</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Browse a curated selection of original digital artworks — from fantastical characters to whimsical scenes. Each piece crafted with Krita.
              </p>
              <Button variant="outline" size="lg" onClick={() => setLocation("/gallery")}>
                View Full Gallery <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
            <ArtworkCarousel />
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-secondary/20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-display mb-4">Latest Releases</h2>
              <p className="text-muted-foreground text-lg">Books, guides, and curriculum to elevate your art.</p>
            </div>
            <Button variant="ghost" onClick={() => setLocation("/shop")} className="hidden md:flex">
              View All <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <Card key={product.id} className="group cursor-pointer hover:-translate-y-2 transition-all duration-300 gold-glow border-border/50" onClick={() => setLocation(`/shop/${product.id}`)}>
                  <div className="aspect-[4/3] overflow-hidden">
                    <img 
                      src={product.imageUrl} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-display text-foreground group-hover:text-primary transition-colors">{product.name}</h3>
                      <span className="text-primary font-bold">${product.price.toFixed(2)}</span>
                    </div>
                    <p className="text-muted-foreground line-clamp-2 text-sm">{product.description}</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              [1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse bg-secondary/50 border-border/20">
                  <div className="aspect-[4/3] bg-muted" />
                  <CardContent className="p-6 space-y-4">
                    <div className="h-6 bg-muted rounded w-2/3" />
                    <div className="h-4 bg-muted rounded w-full" />
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>

      {/* About Corinne Banner */}
      <section className="py-24 relative overflow-hidden bg-secondary/30 border-y border-border/30">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="w-full md:w-1/2">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-3xl" />
                <img 
                  src={`${import.meta.env.BASE_URL}images/about-portrait.png`}
                  alt="Corinne - Blade & Quill"
                  className="rounded-2xl shadow-2xl relative z-10 border border-white/10"
                />
              </div>
            </div>
            <div className="w-full md:w-1/2 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-medium mb-2">
                <Brush className="w-4 h-4" /> Meet the Artist
              </div>
              <h2 className="text-4xl md:text-5xl font-display">Hi, I'm Corinne.</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                I'm an author, illustrator, and digital art educator. As the creator of Lheeloo & Luna, I love bringing whimsical cartoon characters to life. My passion is helping fellow artists master tools like Krita so they can focus on their creativity, not the technical hurdles.
              </p>
              <Button size="lg" variant="secondary" onClick={() => setLocation("/about")} className="mt-4">
                Read My Story
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Tutorials */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <BookOpen className="w-10 h-10 text-primary mx-auto mb-6" />
            <h2 className="text-4xl font-display mb-4">Learn With Me</h2>
            <p className="text-muted-foreground text-lg">Join over 12K subscribers learning digital art tips, Krita shortcuts, and painting techniques.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredTutorials.length > 0 ? (
              featuredTutorials.map((tutorial) => (
                <div key={tutorial.id} className="group rounded-xl overflow-hidden glass-panel">
                  <div className="aspect-video relative">
                    <iframe 
                      src={`https://www.youtube.com/embed/${tutorial.youtubeId}`}
                      title={tutorial.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-medium text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">
                      {tutorial.title}
                    </h3>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-12 text-muted-foreground border border-dashed border-border rounded-xl">
                No featured tutorials available at the moment.
              </div>
            )}
          </div>
          
          <div className="mt-12 text-center">
            <Button onClick={() => setLocation("/tutorials")}>
              Browse All Tutorials
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
