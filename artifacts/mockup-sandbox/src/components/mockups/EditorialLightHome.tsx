import { useState, useEffect, useCallback, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  useParallaxValue,
  useScrolledPast,
  staggerContainer,
  fadeUp,
  fadeScale,
  EDITORIAL_SPRING,
} from "../../hooks/useScrollSection";

const THEME = {
  ink: "#43434e",
  inkMuted: "rgba(67, 67, 78, 0.68)",
  canvas: "#fafafa",
  surface: "#ffffff",
  border: "rgba(151, 171, 196, 0.45)",
  borderStrong: "#97abc4",
  primary: "#be6065",
  primaryPop: "#ff914d",
  apricot: "#ffbd59",
  peach: "#f1c5b6",
  dustyRose: "#d9c6cd",
  accentPurple: "#8c52ff",
  accentSky: "#90e0f9",
  ctaGradient: "linear-gradient(135deg, #ff914d 0%, #be6065 55%, #8c52ff 130%)",
  outlinePurple: "#8c52ff",
  footerBg: "#43434e",
  footerFg: "rgba(217, 217, 217, 0.92)",
  shadow: "0 8px 32px rgba(67, 67, 78, 0.08)",
  shadowPop: "0 12px 36px rgba(255, 145, 77, 0.35), 0 4px 14px rgba(140, 82, 255, 0.12)",
};

const fontHeading = "'Fraunces', Georgia, serif";
const fontBody = "'Plus Jakarta Sans', system-ui, sans-serif";

const BLADE_QUILL_BASE = "";

const galleryItems = [
  { id: 1, title: "Steampunk Cat", src: "https://images.squarespace-cdn.com/content/v1/5d4c7ff6cba600000192c59b/1693251365287-G6KLJ7VG6WFGL29L2UVP/Steampunk+cat+August+2023.jpg" },
  { id: 2, title: "Baby Dragon", src: "https://images.squarespace-cdn.com/content/v1/5d4c7ff6cba600000192c59b/1654432538976-2JJ0576R8S128MKNC3R6/Baby+dragon+with+signature+and+text.jpg" },
  { id: 3, title: "Chibi Geisha", src: "https://images.squarespace-cdn.com/content/v1/5d4c7ff6cba600000192c59b/1654432548904-HPLDAUFZ93UUC7U40C1T/Chibi+Geisha+with+signature+and+text.jpg" },
];

const products = [
  { id: 1, title: "Lheeloo & Luna Cartoon Book", price: 24.99, src: "https://images.squarespace-cdn.com/content/v1/5d4c7ff6cba600000192c59b/b23e74de-dc37-4929-877b-ad77351f2844/THE+BOOK+IS+LIVE+%281%29.png" },
  { id: 2, title: "Krita Quick Start Guide", price: 19.99, src: "https://images.squarespace-cdn.com/content/v1/5d4c7ff6cba600000192c59b/1ece7ddd-670a-4cd3-922a-826e5cc59f6f/new+image+for+gumroad+%281280+x+720+px%29.png" },
  { id: 3, title: "Krita Keyboard Shortcuts Booklet", price: 9.99, src: "https://images.squarespace-cdn.com/content/v1/5d4c7ff6cba600000192c59b/d14d7a10-7b62-45ee-a21b-426af152221b/Pin+leading+to+my+shortcut+booklet.jpg" },
];

const tutorials = [
  { id: 1, title: "Learn Different Ways to Remove Backgrounds in Krita", ytId: "63_gp_rFtOc" },
  { id: 2, title: "Turn Any Photograph into a Pencil Sketch Using Krita", ytId: "lgj0WPlwMGI" },
  { id: 3, title: "Fix Your Pen Pressure (FOR GOOD) in 5 Easy Steps", ytId: "Oe2xkeU_mV0" },
];

function Btn({ children, outline, style }: { children: React.ReactNode; outline?: boolean; style?: React.CSSProperties }) {
  return (
    <button
      type="button"
      style={{
        padding: "14px 28px",
        borderRadius: "8px",
        fontFamily: fontBody,
        fontSize: "14px",
        letterSpacing: "0.05em",
        fontWeight: 600,
        cursor: "pointer",
        transition: "transform 0.15s, box-shadow 0.2s, filter 0.2s",
        border: outline ? `2px solid ${THEME.outlinePurple}` : "none",
        background: outline ? "rgba(140, 82, 255, 0.06)" : THEME.ctaGradient,
        color: outline ? THEME.outlinePurple : "#fff",
        boxShadow: outline ? "none" : THEME.shadowPop,
        textShadow: outline ? "none" : "0 1px 0 rgba(0,0,0,0.08)",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function Carousel() {
  const [current, setCurrent] = useState(0);
  const next = useCallback(() => setCurrent((c) => (c + 1) % galleryItems.length), []);
  useEffect(() => {
    const t = setInterval(next, 4000);
    return () => clearInterval(t);
  }, [next]);

  return (
    <div
      style={{
        position: "relative",
        borderRadius: "16px",
        overflow: "hidden",
        border: `2px solid ${THEME.primaryPop}33`,
        boxShadow: `${THEME.shadow}, 0 0 0 1px ${THEME.accentSky}55`,
        background: THEME.surface,
      }}
    >
      <div style={{ aspectRatio: "4/3", position: "relative", background: THEME.ink }}>
        <img
          src={galleryItems[current].src}
          alt={galleryItems[current].title}
          style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.92 }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(67,67,78,0.85) 0%, transparent 55%)" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "24px" }}>
          <p style={{ color: "#fff", fontFamily: fontHeading, fontSize: "20px", fontWeight: 600, margin: 0, fontOpticalSizing: "auto" }}>
            {galleryItems[current].title}
          </p>
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 56, left: "50%", transform: "translateX(-50%)", display: "flex", gap: "8px" }}>
        {galleryItems.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrent(i)}
            style={{
              width: i === current ? "22px" : "8px",
              height: "8px",
              borderRadius: "4px",
              background: i === current ? THEME.primaryPop : "rgba(255,255,255,0.45)",
              border: "none",
              cursor: "pointer",
              transition: "all 0.3s",
              padding: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function EditorialLightHome() {
  const reduced = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const scrolled = useScrolledPast(60);

  const heroBgY = useParallaxValue(heroRef, [0, 40], { spring: EDITORIAL_SPRING });
  const heroBgScale = useParallaxValue(heroRef, [1, 1.06], { spring: EDITORIAL_SPRING });
  const heroRotateX = useParallaxValue(heroRef, [4, 0], { spring: EDITORIAL_SPRING });
  const heroZ = useParallaxValue(heroRef, [-20, 0], { spring: EDITORIAL_SPRING });

  const aboutPortraitY = useParallaxValue(aboutRef, [0, -18], {
    offset: ["start end", "end start"],
    spring: EDITORIAL_SPRING,
  });
  const aboutTextY = useParallaxValue(aboutRef, [0, 10], {
    offset: ["start end", "end start"],
    spring: EDITORIAL_SPRING,
  });

  return (
    <div
      style={{
        background: THEME.canvas,
        color: THEME.ink,
        fontFamily: fontBody,
        minHeight: "100vh",
        lineHeight: 1.5,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        a { color: inherit; text-decoration: none; }
      `}</style>

      {/* === Nav with scroll-density === */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: THEME.surface,
          borderBottom: `1px solid ${THEME.border}`,
          padding: "0 clamp(24px, 4vw, 48px)",
          minHeight: scrolled ? "56px" : "72px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "24px",
          flexWrap: "wrap",
          boxShadow: scrolled
            ? "0 4px 24px rgba(67, 67, 78, 0.12)"
            : `0 1px 0 rgba(255,255,255,0.95) inset, 0 4px 20px ${THEME.accentSky}55`,
          transition: "min-height 0.3s ease, box-shadow 0.3s ease",
        }}
      >
        <span
          style={{
            fontFamily: fontHeading,
            fontSize: "22px",
            fontWeight: 700,
            background: `linear-gradient(90deg, ${THEME.ink} 0%, ${THEME.accentPurple} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-0.02em",
          }}
        >
          Blade & Quill
        </span>
        <div
          style={{
            display: "flex",
            gap: "clamp(16px, 3vw, 32px)",
            fontSize: "14px",
            fontWeight: 500,
            color: THEME.inkMuted,
            letterSpacing: "0.05em",
          }}
        >
          {["Shop", "Tutorials", "Gallery", "About"].map((l) => (
            <span key={l} style={{ cursor: "pointer" }}>
              {l}
            </span>
          ))}
        </div>
        <Btn>Explore the Shop</Btn>
      </nav>

      {/* === Hero with 3D parallax depth === */}
      <motion.section
        ref={heroRef}
        style={{
          position: "relative",
          padding: "clamp(64px, 12vw, 120px) 48px 80px",
          overflow: "hidden",
          perspective: reduced ? undefined : "1200px",
        }}
      >
        <motion.img
          src={`${BLADE_QUILL_BASE}/images/hero-bg.png`}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.14,
            y: reduced ? 0 : heroBgY,
            scale: reduced ? 1 : heroBgScale,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(180deg, ${THEME.canvas}ee 0%, rgba(144, 224, 249, 0.12) 40%, ${THEME.canvas} 100%)`,
          }}
        />
        <motion.div
          style={{
            position: "relative",
            zIndex: 2,
            maxWidth: "820px",
            margin: "0 auto",
            textAlign: "center",
            rotateX: reduced ? 0 : heroRotateX,
            z: reduced ? 0 : heroZ,
          }}
        >
          <h1
            style={{
              fontFamily: fontHeading,
              fontSize: "clamp(2.5rem, 6vw, 4.25rem)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.08,
              marginBottom: "24px",
              fontOpticalSizing: "auto",
            }}
          >
            <span style={{ color: THEME.ink }}>Unleash Your</span>
            <br />
            <span
              style={{
                background: `linear-gradient(135deg, ${THEME.primaryPop} 0%, ${THEME.accentPurple} 50%, ${THEME.primary} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Digital Canvas
            </span>
          </h1>
          <p
            style={{
              fontSize: "clamp(1.05rem, 2vw, 1.2rem)",
              color: THEME.inkMuted,
              marginBottom: "40px",
              lineHeight: 1.75,
              fontWeight: 400,
              maxWidth: "560px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Master Krita and digital painting with Corinne. Discover tutorials, exclusive guides, and original artwork.
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Btn>Explore the Shop</Btn>
            <Btn outline>Watch Tutorials</Btn>
          </div>
        </motion.div>
      </motion.section>

      {/* === Book promo with 3D settle === */}
      <section style={{ padding: "0 48px 64px", perspective: reduced ? undefined : "900px" }}>
        <motion.div
          initial={reduced ? false : { rotateX: 6, z: -16, opacity: 0 }}
          whileInView={{ rotateX: 0, z: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            background: THEME.surface,
            borderRadius: "16px",
            border: `2px solid ${THEME.accentSky}99`,
            boxShadow: `${THEME.shadowPop}, 0 0 40px ${THEME.peach}66`,
            padding: "32px clamp(24px, 4vw, 40px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "32px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "12px",
                background: `linear-gradient(135deg, ${THEME.apricot} 0%, ${THEME.primaryPop} 55%, ${THEME.primary} 100%)`,
                border: `2px solid ${THEME.primaryPop}88`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "26px",
                flexShrink: 0,
                boxShadow: `0 0 20px ${THEME.apricot}88`,
              }}
            >
              📚
            </div>
            <div>
              <h2
                style={{
                  fontFamily: fontHeading,
                  fontSize: "clamp(1.1rem, 2.2vw, 1.45rem)",
                  fontWeight: 600,
                  color: THEME.ink,
                }}
              >
                <span style={{ color: THEME.accentPurple }}>Lheeloo & Luna</span> — The Cartoon Book Is Live!
              </h2>
              <p style={{ color: THEME.inkMuted, marginTop: "8px", fontSize: "15px" }}>
                Corinne&apos;s debut illustrated book. Order your copy today and bring the magic home.
              </p>
            </div>
          </div>
          <Btn>Order Your Book →</Btn>
        </motion.div>
      </section>

      {/* === Gallery with staggered reveal === */}
      <section style={{ padding: "80px 48px", background: THEME.canvas }}>
        <motion.div
          variants={staggerContainer(0.08)}
          initial={reduced ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "56px",
            alignItems: "center",
          }}
        >
          <motion.div variants={fadeUp()}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 14px",
                borderRadius: "999px",
                background: `linear-gradient(135deg, ${THEME.dustyRose}66, rgba(140, 82, 255, 0.15))`,
                border: `2px solid ${THEME.accentPurple}55`,
                fontSize: "12px",
                fontWeight: 600,
                color: THEME.accentPurple,
                letterSpacing: "0.06em",
                textTransform: "uppercase" as const,
                marginBottom: "20px",
              }}
            >
              Original Artwork
            </div>
            <h2
              style={{
                fontFamily: fontHeading,
                fontSize: "clamp(2rem, 4vw, 2.75rem)",
                fontWeight: 600,
                marginBottom: "16px",
                color: THEME.ink,
                letterSpacing: "-0.02em",
              }}
            >
              Art from Corinne&apos;s Studio
            </h2>
            <p style={{ color: THEME.inkMuted, fontSize: "17px", lineHeight: 1.75, marginBottom: "28px" }}>
              Browse a curated selection of original digital artworks — from fantastical characters to whimsical scenes. Each piece crafted with Krita.
            </p>
            <Btn outline>View Full Gallery →</Btn>
          </motion.div>
          <motion.div variants={fadeUp()}>
            <Carousel />
          </motion.div>
        </motion.div>
      </section>

      {/* === Products with cascade === */}
      <section style={{ padding: "80px 48px", background: THEME.surface, borderTop: `1px solid ${THEME.border}` }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: "40px",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <div>
              <h2
                style={{
                  fontFamily: fontHeading,
                  fontSize: "clamp(1.75rem, 3vw, 2.35rem)",
                  fontWeight: 600,
                  marginBottom: "8px",
                  background: `linear-gradient(90deg, ${THEME.ink}, ${THEME.primaryPop})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Latest Releases
              </h2>
              <p style={{ color: THEME.inkMuted, fontSize: "16px" }}>Books, guides, and curriculum to elevate your art.</p>
            </div>
            <span
              style={{
                color: THEME.accentPurple,
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 700,
                letterSpacing: "0.05em",
              }}
            >
              View All →
            </span>
          </div>
          <motion.div
            variants={staggerContainer(0.06)}
            initial={reduced ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "28px" }}
          >
            {products.map((p) => (
              <motion.div
                key={p.id}
                variants={fadeScale()}
                style={{
                  background: THEME.surface,
                  borderRadius: "14px",
                  overflow: "hidden",
                  border: `2px solid ${THEME.borderStrong}88`,
                  boxShadow: `0 0 0 1px ${THEME.accentSky}44, ${THEME.shadow}`,
                  cursor: "pointer",
                }}
              >
                <div style={{ aspectRatio: "4/3", overflow: "hidden" }}>
                  <img src={p.src} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ padding: "20px 22px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                    <h3 style={{ fontFamily: fontHeading, fontSize: "17px", fontWeight: 600, color: THEME.ink }}>{p.title}</h3>
                    <span style={{ color: THEME.primaryPop, fontWeight: 800, fontSize: "17px", flexShrink: 0 }}>${p.price.toFixed(2)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* === About with parallax split === */}
      <section ref={aboutRef} style={{ padding: "80px 48px", background: THEME.canvas }}>
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "48px",
            alignItems: "center",
          }}
        >
          <motion.div style={{ position: "relative", y: reduced ? 0 : aboutPortraitY }}>
            <div
              style={{
                position: "absolute",
                inset: "-10px",
                background: `linear-gradient(135deg, ${THEME.primaryPop}55, ${THEME.accentPurple}44, ${THEME.accentSky}50)`,
                borderRadius: "20px",
                filter: "blur(28px)",
                zIndex: 0,
              }}
            />
            <div
              style={{
                position: "relative",
                zIndex: 1,
                width: "100%",
                aspectRatio: "4 / 5",
                borderRadius: "16px",
                overflow: "hidden",
                border: `1px solid ${THEME.border}`,
                boxShadow: THEME.shadow,
              }}
            >
              <img
                src={`${BLADE_QUILL_BASE}/images/about-portrait.png`}
                alt="Corinne"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "28% center",
                  display: "block",
                }}
              />
            </div>
          </motion.div>
          <motion.div style={{ y: reduced ? 0 : aboutTextY }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 14px",
                borderRadius: "999px",
                background: `linear-gradient(135deg, ${THEME.peach}99, rgba(255, 145, 77, 0.2))`,
                border: `2px solid ${THEME.primaryPop}66`,
                fontSize: "12px",
                fontWeight: 600,
                color: THEME.primary,
                letterSpacing: "0.06em",
                textTransform: "uppercase" as const,
                marginBottom: "16px",
              }}
            >
              Meet the Artist
            </div>
            <h2
              style={{
                fontFamily: fontHeading,
                fontSize: "clamp(2rem, 4vw, 2.75rem)",
                fontWeight: 600,
                marginBottom: "16px",
                color: THEME.ink,
              }}
            >
              Hi, I&apos;m Corinne.
            </h2>
            <p style={{ color: THEME.inkMuted, fontSize: "17px", lineHeight: 1.8, marginBottom: "28px" }}>
              I&apos;m an author, illustrator, and digital art educator. As the creator of Lheeloo & Luna, I love bringing whimsical cartoon characters to life. My passion is helping fellow artists master tools like Krita so they can focus on their creativity, not the technical hurdles.
            </p>
            <Btn outline>Read My Story</Btn>
          </motion.div>
        </div>
      </section>

      {/* Tutorials */}
      <section style={{ padding: "80px 48px", background: THEME.surface, borderTop: `1px solid ${THEME.border}` }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <div style={{ fontSize: "36px", marginBottom: "16px" }} aria-hidden>📖</div>
            <h2
              style={{
                fontFamily: fontHeading,
                fontSize: "clamp(1.75rem, 3vw, 2.35rem)",
                fontWeight: 600,
                marginBottom: "12px",
                color: THEME.ink,
              }}
            >
              Learn With Me
            </h2>
            <p style={{ color: THEME.inkMuted, fontSize: "17px", maxWidth: "520px", margin: "0 auto" }}>
              Join over 12K subscribers learning digital art tips, Krita shortcuts, and painting techniques.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "28px" }}>
            {tutorials.map((t) => (
              <div
                key={t.id}
                style={{
                  background: THEME.surface,
                  borderRadius: "14px",
                  overflow: "hidden",
                  border: `2px solid ${THEME.borderStrong}88`,
                  boxShadow: `0 0 0 1px ${THEME.accentPurple}22, ${THEME.shadow}`,
                }}
              >
                <div style={{ aspectRatio: "16/9", position: "relative" }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${t.ytId}`}
                    title={t.title}
                    style={{ width: "100%", height: "100%", border: 0, position: "absolute", inset: 0 }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div style={{ padding: "18px 20px" }}>
                  <h3 style={{ fontSize: "15px", fontWeight: 600, lineHeight: 1.5, color: THEME.ink }}>{t.title}</h3>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <Btn>Browse All Tutorials</Btn>
          </div>
        </div>
      </section>

      <footer
        style={{
          padding: "48px 32px",
          background: THEME.footerBg,
          textAlign: "center",
          color: THEME.footerFg,
          fontSize: "14px",
        }}
      >
        <p style={{ fontFamily: fontHeading, fontSize: "20px", fontWeight: 600, color: THEME.surface, marginBottom: "10px" }}>Blade & Quill</p>
        <p style={{ opacity: 0.9 }}>© 2026 Corinne. All rights reserved.</p>
      </footer>
    </div>
  );
}
