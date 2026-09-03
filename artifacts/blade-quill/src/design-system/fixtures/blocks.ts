import type { Block } from "@/pages/blocks/block-utils";

/**
 * Demo fixtures for every page block — one per Tina template, keyed by
 * template name. Content mirrors each template's `defaultItem` in
 * `tina/blocks.ts`; images are real on-palette site assets so demos look
 * exactly like the live site (no off-brand placeholders).
 */

/** Build a Slate rich-text value from a plain sentence (matches Tina's shape). */
const rt = (text: string) => ({
  type: "root",
  children: [{ type: "p", children: [{ type: "text", text }] }],
});

/** Real artwork shipped with the site (Tina media root: public/images). */
const ART = {
  chibiDragon: "/images/squarespace/digital-paintings/chibi-dragon.png",
  chibiElephant: "/images/squarespace/digital-paintings/chibi-elephant.png",
  chibiGiraffe: "/images/squarespace/digital-paintings/chibi-giraffe.png",
  chibiSea: "/images/squarespace/digital-paintings/chibi-of-the-sea.jpg",
  geisha: "/images/squarespace/digital-paintings/geisha.jpg",
  gnome: "/images/squarespace/digital-paintings/gnome.jpg",
  japaneseGirl: "/images/squarespace/digital-paintings/japanese-girl.jpg",
  dragon: "/images/squarespace/digital-paintings/dragon.jpg",
  dragonBaby: "/images/squarespace/digital-paintings/dragon-baby.jpg",
  dragonEgg:
    "/images/squarespace/digital-paintings/fantasy-creature-guarding-dragon-egg.jpg",
  childAndBear: "/images/squarespace/digital-paintings/child-and-bear.jpg",
  portrait: "/images/about-portrait.png",
  bookFront: "/images/puzzle-book-front.png",
  bookBack: "/images/puzzle-book-back.png",
  heroBg: "/images/hero-bg.png",
};

export const BLOCK_FIXTURES: Record<string, Block> = {
  // ── Heroes & headers ────────────────────────────────────────────
  homeHero: {
    eyebrow: "✦ HELLO FROM THE STUDIO ✦",
    heading: "I write books and teach\ndigital painting.",
    subheading: rt(
      "Free tutorials, illustrated books, and a community that grows together."
    ),
    ctaPrimary: "Explore the Shop",
    ctaPrimaryLink: "/shop",
    ctaSecondary: "Watch Tutorials",
    ctaSecondaryLink: "https://www.youtube.com/c/BladeQuillartacademy",
    metaLine: "EST. 2018 · NANTES, FR",
    marqueeItems: ["Author", "Illustrator", "Krita educator"],
  },
  aboutHero: {
    eyebrow: "ABOUT · A STUDIO VISIT",
    heading: "I'm Corinne —\nand I draw\nfor a living.",
    leadText: rt("A short introduction sentence about the studio."),
    ctaPrimary: "Get in Touch",
    ctaPrimaryLink: "/contact",
    ctaSecondary: "Visit the Shop",
    ctaSecondaryLink: "/shop",
    metaLine: "NANTES, FRANCE · EST. 2018",
    portraitImage: ART.portrait,
    portraitCaption: "in the studio",
    deskImage: ART.gnome,
    deskCaption: "from the desk",
    screenImage: ART.chibiDragon,
    screenCaption: "krita screen",
  },
  hero: {
    heading: "A big welcoming headline",
    subheading: rt("A short sentence that supports the headline."),
    backgroundImage: ART.heroBg,
    ctaLabel: "Learn More",
    ctaLink: "/",
  },
  heroSplitImage: {
    eyebrow: "Featured Work",
    heading: "Showcase your\nbest piece",
    subheading: rt(
      "Pair a bold headline with one large image — great for book launches, class promos, or portfolio highlights."
    ),
    featuredImage: ART.geisha,
    imageAlt: "Geisha digital painting",
    imageCaption: "digital painting, 2024",
    imagePosition: "right",
    ctaPrimary: "Learn More",
    ctaPrimaryLink: "/contact",
  },
  heroFullBleed: {
    backgroundImage: ART.dragonEgg,
    heading: "A cinematic\nfull-width moment",
    subheading: rt("Edge-to-edge artwork with text overlay."),
    overlay: "medium",
    textAlign: "center",
    minHeight: "short",
    ctaLabel: "Explore",
    ctaLink: "/gallery",
  },
  heroFloatingImages: {
    eyebrow: "Portfolio",
    heading: "Art that floats\noff the page",
    subheading: rt("Scatter up to six images around the headline."),
    images: [
      { src: ART.chibiDragon, alt: "Chibi dragon", caption: "chibi dragon" },
      { src: ART.geisha, alt: "Geisha painting", caption: "geisha" },
      { src: ART.gnome, alt: "Gnome painting", caption: "gnome" },
      { src: ART.chibiSea, alt: "Chibi of the sea", caption: "of the sea" },
    ],
    ctaPrimary: "View Gallery",
    ctaPrimaryLink: "/gallery",
  },
  heroImageGrid: {
    eyebrow: "Gallery",
    heading: "A mosaic\nof your work",
    layout: "trio",
    images: [
      { src: ART.dragon, alt: "Dragon painting" },
      { src: ART.japaneseGirl, alt: "Japanese girl painting" },
      { src: ART.childAndBear, alt: "Child and bear painting" },
    ],
  },
  pageHeader: {
    heading: "Page Title",
    description: rt("A short introduction for this page."),
  },

  // ── Content ─────────────────────────────────────────────────────
  text: {
    heading: "About Our Approach",
    body: rt(
      "Write anything here — paragraphs, lists, links, and inline images. Links are added via Embed → Link and can open in a new tab."
    ),
  },
  story: {
    number: "01",
    label: "STORY",
    heading: "The story behind\nall of this.",
    paragraph1: rt("First paragraph of the story."),
    quote: rt("A pull-quote shown in the dark panel."),
    paragraph2: rt("Second paragraph of the story."),
    sideImage: ART.gnome,
    sideCaption: "my window in winter",
  },
  timeline: {
    number: "02",
    label: "TIMELINE",
    events: [
      {
        year: "2018",
        title: "It all started",
        description: "How things began.",
        image: ART.dragonBaby,
      },
      {
        year: "2026",
        title: "Today",
        description: "Where things are now.",
        image: ART.dragon,
      },
    ],
  },
  statsRow: {
    stats: [
      { value: "100K+", label: "YouTube subscribers" },
      { value: "1.5M", label: "video views" },
      { value: "65", label: "countries reached" },
      { value: "2", label: "illustrated books" },
    ],
  },
  featureGrid: {
    heading: "What's included",
    items: [
      {
        icon: "Palette",
        title: "Premium Brushes",
        description: rt("Hand-crafted digital brushes for Krita."),
      },
      {
        icon: "Video",
        title: "Video Tutorials",
        description: rt("Step-by-step lessons for every skill level."),
      },
      {
        icon: "Download",
        title: "Free Resources",
        description: rt("Downloadable reference sheets and guides."),
      },
    ],
  },
  cardRow: {
    number: "03",
    label: "WHAT I MAKE",
    cards: [
      {
        tag: "BOOKS",
        title: "Illustrated books",
        body: "Picture books written and illustrated in the studio.",
        image: ART.childAndBear,
        ctaLabel: "Browse books",
        link: "/shop",
      },
      {
        tag: "TUTORIALS",
        title: "Krita lessons",
        body: "Free digital painting tutorials on YouTube.",
        image: ART.chibiGiraffe,
        ctaLabel: "Watch now",
        link: "https://www.youtube.com/c/BladeQuillartacademy",
      },
      {
        tag: "ART",
        title: "Digital paintings",
        body: "Original artwork, from chibis to full scenes.",
        image: ART.geisha,
        ctaLabel: "See the gallery",
        link: "/gallery",
      },
    ],
  },
  pillars: {
    eyebrow: "THREE THREADS",
    heading: "Where would you like to start?",
    items: [
      {
        tag: "NEW BOOK",
        title: "The latest release",
        sub: "A picture book from the studio",
        cta: "Read more",
        badge: "NEW",
        link: "/shop",
        image: ART.childAndBear,
      },
      {
        tag: "LEARN",
        title: "Free tutorials",
        sub: "Krita lessons on YouTube",
        cta: "Watch now",
        badge: "OPEN",
        link: "https://www.youtube.com/c/BladeQuillartacademy",
        image: ART.chibiElephant,
      },
      {
        tag: "GALLERY",
        title: "The art wall",
        sub: "Digital paintings and sketches",
        cta: "Take a look",
        badge: "ART",
        link: "/gallery",
        image: ART.dragon,
      },
    ],
  },
  imageGallery: {
    heading: "Student Gallery",
    images: [
      { src: ART.chibiDragon, alt: "Chibi dragon", caption: "Chibi character study" },
      { src: ART.chibiElephant, alt: "Chibi elephant", caption: "Ink illustration" },
      { src: ART.chibiGiraffe, alt: "Chibi giraffe", caption: "Digital painting" },
    ],
  },
  imageSpotlight: {
    eyebrow: "Featured",
    heading: "One piece,\nfront and center",
    image: ART.japaneseGirl,
    alt: "Japanese girl digital painting",
    caption: "A single large image with room to breathe.",
    aspect: "landscape",
  },
  imageSideBySide: {
    heading: "Compare or contrast",
    leftImage: { src: ART.geisha, alt: "Geisha painting", caption: "before" },
    rightImage: {
      src: ART.japaneseGirl,
      alt: "Japanese girl painting",
      caption: "after",
    },
    style: "polaroid",
  },
  imageMasonry: {
    heading: "A wall of work",
    images: [
      { src: ART.dragon, alt: "Dragon painting" },
      { src: ART.chibiSea, alt: "Chibi of the sea" },
      { src: ART.gnome, alt: "Gnome painting" },
      { src: ART.dragonEgg, alt: "Creature guarding a dragon egg" },
      { src: ART.chibiGiraffe, alt: "Chibi giraffe" },
    ],
  },
  videoEmbed: {
    heading: "Featured Tutorial",
    youtubeUrl: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
  },

  // ── Commerce & media ────────────────────────────────────────────
  featuredBook: {
    eyebrow: "FEATURED RELEASE",
    heading: "The new book.",
    description: rt("A short description of the featured book."),
    stats: [
      { value: "$25", label: "SIGNED COPY" },
      { value: "$14", label: "EBOOK" },
      { value: "144", label: "FULL-COLOR PAGES" },
    ],
    ctaLabel: "Order Now",
    ctaLink: "/shop",
    secondaryLabel: "Browse the shop",
    secondaryLink: "/shop",
  },
  featuredRelease: {
    eyebrow: "New Featured Release",
    title: "Puzzle Book",
    description: rt("A short description of the release."),
    coverImage: ART.bookFront,
    backCoverImage: ART.bookBack,
    ctaLabel: "Get the Book",
    ctaHref: "/shop",
  },
  productStrip: {
    eyebrow: "FROM THE SHOP",
    heading: "Books, brushes, and guides.",
    viewAllLabel: "All products",
    viewAllLink: "/shop",
  },
  shopCatalog: {
    heading: "The studio shop.",
    highlightText: "studio",
    description: rt("Books, digital guides, and curriculum."),
    showFeaturedBanner: true,
    emptyHeading: "No products found",
    emptyDescription: "Check back later for new releases.",
  },
  galleryGrid: {
    emptyHeading: "Gallery is empty",
    emptyDescription: "Check back soon — new artwork is added regularly.",
  },
  downloadsGrid: {
    emptyHeading: "Free resources coming soon!",
    emptyDescription: "Coloring pages, guides, and more on the way.",
  },
  featuredVideo: {
    eyebrow: "JUST PUBLISHED",
    heading: "Watch the newest lesson.",
    description: rt(
      "The latest Blade & Quill YouTube video, featured here automatically the moment it goes live."
    ),
    youtubeUrl: "",
    buttonLabel: "Subscribe on YouTube",
  },
  galleryPreview: {
    eyebrow: "THE GALLERY",
    heading: "Artwork from the studio",
    description: rt(
      "Chibi-style cartoons and illustrations, all painted in Krita. Click any piece to enlarge it."
    ),
    maxItems: 6,
    viewAllLabel: "Browse the full gallery",
    viewAllLink: "/gallery",
  },
  downloadsPreview: {
    eyebrow: "FREE DOWNLOADS",
    heading: "Free guides & coloring pages",
    description: rt(
      "Printable coloring pages and free Krita guides — free for private use."
    ),
    maxItems: 4,
    viewAllLabel: "Browse all downloads",
    viewAllLink: "/downloads",
  },
  tutorialsStrip: {
    eyebrow: "FREE LESSONS ON YOUTUBE",
    headingPrefix: "Join ",
    headingHighlight: "100,000+ artists",
    headingSuffix: "learning with me.",
    buttonLabel: "Subscribe on YouTube",
    youtubeUrl: "https://www.youtube.com/c/BladeQuillartacademy",
    stats: [
      { value: "100K+", label: "subscribers" },
      { value: "1.5M", label: "total views" },
      { value: "65", label: "countries" },
      { value: "bi-weekly", label: "new videos" },
    ],
  },
  classesPitch: {
    eyebrow: "Now Enrolling",
    heading: "Step inside the classroom.",
    subheading: rt("Structured digital art training."),
    bullets: ["First benefit", "Second benefit", "Third benefit"],
    metaTags: "Self-paced · Krita 5.2 · All skill levels",
    ctaLabel: "Reserve Your Spot",
    ctaLink: "/shop",
    secondaryLabel: "About Corinne",
    secondaryLink: "/about",
  },
  blogFeed: {
    heading: "Recent writing.",
    showNewsletter: true,
    newsletter: {
      eyebrow: "STUDIO NEWSLETTER",
      heading: "Stay in the Loop",
      subheading: rt("Get art tips and announcements in your inbox."),
      placeholderText: "you@example.com",
      ctaLabel: "Subscribe",
      privacyNote: "No spam. Unsubscribe anytime.",
    },
  },

  // ── CTAs & forms ────────────────────────────────────────────────
  ctaBand: {
    heading: "Ready to start creating?",
    description: rt("Join hundreds of artists in the Blade & Quill community."),
    ctaLabel: "Get Started",
    ctaLink: "/shop",
    variant: "light",
  },
  bigCta: {
    eyebrow: "SAY HI",
    heading: "A big closing\nstatement.",
    highlightText: "closing",
    primaryLabel: "Get in Touch",
    primaryLink: "/contact",
  },
  newsletterSignup: {
    eyebrow: "STUDIO NEWSLETTER",
    heading: "Stay in the Loop",
    subheading: rt(
      "Get art tips, new tutorials, and announcements in your inbox."
    ),
    placeholderText: "you@example.com",
    ctaLabel: "Subscribe",
    privacyNote: "No spam. Unsubscribe anytime.",
  },
  contactInfo: {
    email: "hello@example.com",
    location: "Nantes, France",
  },
  contactForm: {
    submitLabel: "Send Message",
  },
  dummyBookRequest: {
    heading: "Request the 30-page PDF",
    description: rt(
      "Fill in your details and the complete 30-page PDF unlocks instantly."
    ),
    pdfUrl: "/files/lheeloo-and-luna-bath-time-episode-thursday-dummy-book.pdf",
    submitLabel: "Request the 30-page PDF",
    successHeading: "Thank you — the PDF is ready",
    successNote:
      "Your request has been sent. In the meantime, the full 30-page PDF is available below.",
    downloadLabel: "Download the 30-page PDF",
  },
  kofiSupport: {
    heading: "Support the Studio",
    body: rt(
      "If you enjoy the tutorials and books, consider buying a coffee on Ko-fi."
    ),
    ctaLabel: "Support on Ko-fi",
    href: "https://ko-fi.com/bladeandquill",
  },
  reviewLinks: {
    heading: "Leave your reviews here",
    intro: rt(
      "Reviews mean the world and truly help others discover the book."
    ),
    thankYou: "Thank you so much for your support!",
    ctaHeading: "Review the book by clicking the button for your country!",
    links: [
      { label: "Review on Amazon.com", href: "https://amazon.com", region: "US" },
      { label: "Review on Amazon.fr", href: "https://amazon.fr", region: "FR" },
    ],
  },

  // ── Standalone extras ───────────────────────────────────────────
  marquee: {
    highlightText: "Big news",
    text: " — something exciting is coming soon",
  },
  socialLinks: {
    heading: "Find me elsewhere",
    body: rt("Tutorials, sketches, and studio updates."),
    links: [
      {
        platform: "youtube",
        url: "https://www.youtube.com/c/BladeQuillartacademy",
        label: "YouTube",
      },
      {
        platform: "instagram",
        url: "https://www.instagram.com/bladequillartacademy/",
        label: "Instagram",
      },
      { platform: "kofi", url: "https://ko-fi.com/bladeandquill", label: "Ko-fi" },
    ],
  },
};

/** Dark variant of the CTA band (shown alongside light in its demo). */
export const ctaBandDarkFixture: Block = {
  heading: "Limited time offer",
  description: rt("50% off all digital brush packs this weekend."),
  ctaLabel: "Shop Now",
  ctaLink: "/shop",
  variant: "dark",
};
