import { useState, useEffect, useCallback } from "react";

const THEME = {
  bg: "hsl(155, 45%, 6%)",
  bgCard: "hsl(155, 30%, 11%)",
  bgSection: "hsl(155, 35%, 8%)",
  bgBanner: "hsl(155, 40%, 9%)",
  fg: "hsl(38, 70%, 90%)",
  fgMuted: "hsl(38, 30%, 65%)",
  primary: "#e04f7b",
  primaryLight: "hsl(339, 68%, 75%)",
  border: "hsl(155, 25%, 18%)",
  accent: "hsl(155, 60%, 35%)",
};

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
      style={{
        padding: "12px 28px",
        borderRadius: "6px",
        fontFamily: "'Cinzel', serif",
        fontSize: "14px",
        letterSpacing: "0.08em",
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.2s",
        border: outline ? `2px solid ${THEME.primary}` : "none",
        background: outline ? "transparent" : `linear-gradient(135deg, ${THEME.primary}, hsl(339, 60%, 45%))`,
        color: outline ? THEME.primary : "#fff",
        boxShadow: outline ? "none" : `0 4px 20px ${THEME.primary}44`,
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
    <div style={{ position: "relative", borderRadius: "16px", overflow: "hidden", border: `1px solid ${THEME.border}`, boxShadow: `0 0 40px ${THEME.accent}33` }}>
      <div style={{ aspectRatio: "4/3", position: "relative", background: "#000" }}>
        <img
          src={galleryItems[current].src}
          alt={galleryItems[current].title}
          style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.85 }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "24px" }}>
          <p style={{ color: THEME.fg, fontFamily: "'Cinzel', serif", fontSize: "18px", margin: 0 }}>{galleryItems[current].title}</p>
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 56, left: "50%", transform: "translateX(-50%)", display: "flex", gap: "8px" }}>
        {galleryItems.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            style={{
              width: i === current ? "20px" : "8px",
              height: "8px",
              borderRadius: "4px",
              background: i === current ? THEME.primary : "rgba(255,255,255,0.4)",
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

export default function MidnightForestHome() {
  return (
    <div style={{ background: THEME.bg, color: THEME.fg, fontFamily: "'DM Sans', sans-serif", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        a { color: inherit; text-decoration: none; }
      `}</style>

      {/* Nav */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: `${THEME.bg}ee`, backdropFilter: "blur(12px)", borderBottom: `1px solid ${THEME.border}`, padding: "0 48px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontFamily: "'Cinzel', serif", fontSize: "20px", fontWeight: 700, color: THEME.primary, letterSpacing: "0.05em" }}>Blade & Quill</span>
        <div style={{ display: "flex", gap: "32px", fontSize: "14px", color: THEME.fgMuted }}>
          {["Shop", "Tutorials", "Gallery", "About"].map(l => (
            <span key={l} style={{ cursor: "pointer", letterSpacing: "0.05em" }}>{l}</span>
          ))}
        </div>
        <Btn>Explore the Shop</Btn>
      </nav>

      {/* Hero */}
      <section style={{ position: "relative", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <img src={`${BLADE_QUILL_BASE}/images/hero-bg.png`} alt="hero" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.35 }} />
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at center, hsl(155, 50%, 12%) 0%, ${THEME.bg} 70%)` }} />
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at center, ${THEME.accent}22 0%, transparent 60%)` }} />

        <div style={{ position: "relative", zIndex: 10, textAlign: "center", maxWidth: "800px", padding: "0 32px" }}>
          <h1 style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "clamp(3rem, 8vw, 7rem)",
            fontWeight: 700,
            letterSpacing: "0.05em",
            lineHeight: 1.1,
            marginBottom: "24px",
            background: `linear-gradient(135deg, ${THEME.fg} 0%, ${THEME.primary} 60%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Unleash Your<br />Digital Canvas
          </h1>
          <p style={{ fontSize: "clamp(1rem, 2vw, 1.25rem)", color: THEME.fgMuted, marginBottom: "40px", lineHeight: 1.7, fontWeight: 300 }}>
            Master Krita and digital painting with Corinne. Discover tutorials, exclusive guides, and original artwork.
          </p>
          <div style={{ display: "flex", gap: "20px", justifyContent: "center", flexWrap: "wrap" }}>
            <Btn>Explore the Shop</Btn>
            <Btn outline>▶ Watch Tutorials</Btn>
          </div>
        </div>
      </section>

      {/* Book Banner */}
      <section style={{ padding: "48px", background: `${THEME.bgBanner}`, borderTop: `1px solid ${THEME.border}`, borderBottom: `1px solid ${THEME.border}` }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "32px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "12px", background: `${THEME.primary}22`, border: `1px solid ${THEME.primary}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", flexShrink: 0 }}>
              📚
            </div>
            <div>
              <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "clamp(1rem, 2.5vw, 1.5rem)", fontWeight: 600 }}>
                <span style={{ color: THEME.primary }}>Lheeloo & Luna</span> — The Cartoon Book Is Live!
              </h2>
              <p style={{ color: THEME.fgMuted, marginTop: "6px", fontSize: "15px" }}>Corinne's debut illustrated book. Order your copy today and bring the magic home.</p>
            </div>
          </div>
          <Btn>Order Your Book →</Btn>
        </div>
      </section>

      {/* Gallery */}
      <section style={{ padding: "96px 48px", background: THEME.bg }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", alignItems: "center" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 14px", borderRadius: "999px", background: `${THEME.primary}18`, border: `1px solid ${THEME.primary}33`, fontSize: "13px", color: THEME.primary, marginBottom: "24px" }}>
              🖌 Original Artwork
            </div>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 600, marginBottom: "20px", background: `linear-gradient(135deg, ${THEME.fg}, ${THEME.primary})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Art from Corinne's Studio
            </h2>
            <p style={{ color: THEME.fgMuted, fontSize: "17px", lineHeight: 1.7, marginBottom: "32px" }}>
              Browse a curated selection of original digital artworks — from fantastical characters to whimsical scenes. Each piece crafted with Krita.
            </p>
            <Btn outline>View Full Gallery →</Btn>
          </div>
          <Carousel />
        </div>
      </section>

      {/* Products */}
      <section style={{ padding: "96px 48px", background: THEME.bgSection }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "48px", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "clamp(2rem, 4vw, 2.5rem)", fontWeight: 600, marginBottom: "12px", background: `linear-gradient(135deg, ${THEME.fg}, ${THEME.primary})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Latest Releases</h2>
              <p style={{ color: THEME.fgMuted, fontSize: "16px" }}>Books, guides, and curriculum to elevate your art.</p>
            </div>
            <span style={{ color: THEME.primary, cursor: "pointer", fontSize: "14px", fontFamily: "'Cinzel', serif", letterSpacing: "0.05em" }}>View All →</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "32px" }}>
            {products.map((p) => (
              <div key={p.id} style={{ background: THEME.bgCard, borderRadius: "16px", overflow: "hidden", border: `1px solid ${THEME.border}`, cursor: "pointer", transition: "transform 0.3s" }}>
                <div style={{ aspectRatio: "4/3", overflow: "hidden" }}>
                  <img src={p.src} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ padding: "24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: "16px", fontWeight: 600, color: THEME.fg }}>{p.title}</h3>
                    <span style={{ color: THEME.primary, fontWeight: 700, fontSize: "16px" }}>${p.price.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section style={{ padding: "96px 48px", background: THEME.bgBanner, borderTop: `1px solid ${THEME.border}`, borderBottom: `1px solid ${THEME.border}` }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", inset: 0, background: `${THEME.primary}20`, borderRadius: "20px", filter: "blur(40px)", zIndex: 0 }} />
            <img src={`${BLADE_QUILL_BASE}/images/about-portrait.png`} alt="Corinne" style={{ borderRadius: "16px", width: "100%", objectFit: "cover", position: "relative", zIndex: 1, border: `1px solid ${THEME.border}` }} />
          </div>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 14px", borderRadius: "999px", background: `${THEME.primary}18`, border: `1px solid ${THEME.primary}33`, fontSize: "13px", color: THEME.primary, marginBottom: "24px" }}>
              🖌 Meet the Artist
            </div>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 600, marginBottom: "20px", background: `linear-gradient(135deg, ${THEME.fg}, ${THEME.primary})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Hi, I'm Corinne.
            </h2>
            <p style={{ color: THEME.fgMuted, fontSize: "17px", lineHeight: 1.8, marginBottom: "32px" }}>
              I'm an author, illustrator, and digital art educator. As the creator of Lheeloo & Luna, I love bringing whimsical cartoon characters to life. My passion is helping fellow artists master tools like Krita so they can focus on their creativity, not the technical hurdles.
            </p>
            <Btn outline>Read My Story</Btn>
          </div>
        </div>
      </section>

      {/* Tutorials */}
      <section style={{ padding: "96px 48px", background: THEME.bg }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <div style={{ fontSize: "40px", marginBottom: "20px" }}>📖</div>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "clamp(2rem, 4vw, 2.5rem)", fontWeight: 600, marginBottom: "16px", background: `linear-gradient(135deg, ${THEME.fg}, ${THEME.primary})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Learn With Me</h2>
            <p style={{ color: THEME.fgMuted, fontSize: "17px" }}>Join over 12K subscribers learning digital art tips, Krita shortcuts, and painting techniques.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "32px" }}>
            {tutorials.map((t) => (
              <div key={t.id} style={{ background: THEME.bgCard, borderRadius: "16px", overflow: "hidden", border: `1px solid ${THEME.border}` }}>
                <div style={{ aspectRatio: "16/9", position: "relative" }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${t.ytId}`}
                    title={t.title}
                    style={{ width: "100%", height: "100%", border: 0, position: "absolute", inset: 0 }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div style={{ padding: "20px" }}>
                  <h3 style={{ fontSize: "15px", fontWeight: 500, lineHeight: 1.5, color: THEME.fg }}>{t.title}</h3>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "48px" }}>
            <Btn>Browse All Tutorials</Btn>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: "48px", background: THEME.bgSection, borderTop: `1px solid ${THEME.border}`, textAlign: "center", color: THEME.fgMuted, fontSize: "14px" }}>
        <p style={{ fontFamily: "'Cinzel', serif", fontSize: "18px", color: THEME.primary, marginBottom: "12px" }}>Blade & Quill</p>
        <p>© 2026 Corinne. All rights reserved.</p>
      </footer>
    </div>
  );
}
