import { useState, useEffect, useCallback } from "react";

const THEME = {
  bg: "hsl(35, 55%, 93%)",
  bgCard: "hsl(40, 50%, 97%)",
  bgSection: "hsl(35, 40%, 89%)",
  bgBanner: "hsl(38, 45%, 90%)",
  fg: "hsl(35, 60%, 8%)",
  fgMuted: "hsl(35, 25%, 40%)",
  primary: "#c24b2a",
  primaryLight: "hsl(14, 63%, 60%)",
  accent: "#7d9b76",
  border: "hsl(35, 30%, 80%)",
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

function Btn({ children, outline, secondary, style }: { children: React.ReactNode; outline?: boolean; secondary?: boolean; style?: React.CSSProperties }) {
  return (
    <button
      style={{
        padding: "12px 28px",
        borderRadius: "4px",
        fontFamily: "'Cinzel', serif",
        fontSize: "13px",
        letterSpacing: "0.1em",
        fontWeight: 500,
        cursor: "pointer",
        transition: "all 0.2s",
        border: outline ? `1.5px solid ${THEME.primary}` : secondary ? `1.5px solid ${THEME.accent}` : "none",
        background: outline ? "transparent" : secondary ? `${THEME.accent}18` : THEME.primary,
        color: outline ? THEME.primary : secondary ? THEME.accent : "#fff",
        boxShadow: outline || secondary ? "none" : "0 2px 8px rgba(194, 75, 42, 0.25)",
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
    <div style={{ position: "relative", borderRadius: "12px", overflow: "hidden", border: `1px solid ${THEME.border}`, boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
      <div style={{ aspectRatio: "4/3", position: "relative" }}>
        <img src={galleryItems[current].src} alt={galleryItems[current].title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "24px" }}>
          <p style={{ color: "#fff", fontFamily: "'Cinzel', serif", fontSize: "17px", margin: 0 }}>{galleryItems[current].title}</p>
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 52, left: "50%", transform: "translateX(-50%)", display: "flex", gap: "8px" }}>
        {galleryItems.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            style={{
              width: i === current ? "20px" : "8px", height: "8px", borderRadius: "4px",
              background: i === current ? THEME.primary : "rgba(255,255,255,0.6)",
              border: "none", cursor: "pointer", transition: "all 0.3s", padding: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function AgedParchmentHome() {
  return (
    <div style={{ background: THEME.bg, color: THEME.fg, fontFamily: "'DM Sans', sans-serif", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      {/* Nav */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: `${THEME.bg}f0`, backdropFilter: "blur(12px)", borderBottom: `1px solid ${THEME.border}`, padding: "0 48px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
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
        <img src={`${BLADE_QUILL_BASE}/images/hero-bg.png`} alt="hero" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.15, filter: "sepia(60%)" }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to bottom, ${THEME.bg}cc 0%, ${THEME.bg} 100%)` }} />

        <div style={{ position: "relative", zIndex: 10, textAlign: "center", maxWidth: "800px", padding: "0 32px" }}>
          <div style={{ display: "inline-block", padding: "6px 16px", border: `1px solid ${THEME.border}`, borderRadius: "4px", fontSize: "12px", letterSpacing: "0.15em", color: THEME.fgMuted, marginBottom: "32px", textTransform: "uppercase" }}>
            Digital Art Education
          </div>
          <h1 style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "clamp(2.5rem, 7vw, 6rem)",
            fontWeight: 600,
            letterSpacing: "0.04em",
            lineHeight: 1.1,
            marginBottom: "28px",
            color: THEME.fg,
          }}>
            Unleash Your<br />Digital Canvas
          </h1>
          <p style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)", color: THEME.fgMuted, marginBottom: "44px", lineHeight: 1.8, fontWeight: 300, maxWidth: "600px", margin: "0 auto 44px" }}>
            Master Krita and digital painting with Corinne. Discover tutorials, exclusive guides, and original artwork.
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Btn>Explore the Shop</Btn>
            <Btn outline>▶ Watch Tutorials</Btn>
          </div>
        </div>
      </section>

      {/* Book Banner */}
      <section style={{ padding: "40px 48px", background: THEME.bgBanner, borderTop: `1px solid ${THEME.border}`, borderBottom: `1px solid ${THEME.border}` }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "32px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <div style={{ width: "56px", height: "56px", borderRadius: "8px", background: `${THEME.primary}18`, border: `1px solid ${THEME.primary}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", flexShrink: 0 }}>
              📚
            </div>
            <div>
              <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "clamp(1rem, 2.5vw, 1.4rem)", fontWeight: 600, color: THEME.fg }}>
                <span style={{ color: THEME.primary }}>Lheeloo & Luna</span> — The Cartoon Book Is Live!
              </h2>
              <p style={{ color: THEME.fgMuted, marginTop: "6px", fontSize: "14px" }}>Corinne's debut illustrated book. Order your copy today and bring the magic home.</p>
            </div>
          </div>
          <Btn>Order Your Book →</Btn>
        </div>
      </section>

      {/* Gallery */}
      <section style={{ padding: "96px 48px", background: THEME.bg }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", alignItems: "center" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "5px 14px", borderRadius: "4px", background: `${THEME.accent}20`, border: `1px solid ${THEME.accent}40`, fontSize: "12px", color: THEME.accent, marginBottom: "24px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              🖌 Original Artwork
            </div>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 600, marginBottom: "20px", color: THEME.fg }}>
              Art from Corinne's Studio
            </h2>
            <p style={{ color: THEME.fgMuted, fontSize: "16px", lineHeight: 1.8, marginBottom: "32px" }}>
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
              <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", fontWeight: 600, marginBottom: "12px", color: THEME.fg }}>Latest Releases</h2>
              <p style={{ color: THEME.fgMuted, fontSize: "15px" }}>Books, guides, and curriculum to elevate your art.</p>
            </div>
            <span style={{ color: THEME.primary, cursor: "pointer", fontSize: "13px", fontFamily: "'Cinzel', serif", letterSpacing: "0.08em" }}>View All →</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "28px" }}>
            {products.map((p) => (
              <div key={p.id} style={{ background: THEME.bgCard, borderRadius: "8px", overflow: "hidden", border: `1px solid ${THEME.border}`, cursor: "pointer", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                <div style={{ aspectRatio: "4/3", overflow: "hidden" }}>
                  <img src={p.src} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ padding: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: "15px", fontWeight: 600, color: THEME.fg, lineHeight: 1.4 }}>{p.title}</h3>
                    <span style={{ color: THEME.primary, fontWeight: 700, fontSize: "15px", flexShrink: 0, marginLeft: "8px" }}>${p.price.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section style={{ padding: "96px 48px", background: THEME.bg, borderTop: `1px solid ${THEME.border}`, borderBottom: `1px solid ${THEME.border}` }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", alignItems: "center" }}>
          <div>
            <img src={`${BLADE_QUILL_BASE}/images/about-portrait.png`} alt="Corinne" style={{ borderRadius: "8px", width: "100%", objectFit: "cover", border: `1px solid ${THEME.border}`, boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }} />
          </div>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "5px 14px", borderRadius: "4px", background: `${THEME.accent}20`, border: `1px solid ${THEME.accent}40`, fontSize: "12px", color: THEME.accent, marginBottom: "24px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              🖌 Meet the Artist
            </div>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 600, marginBottom: "20px", color: THEME.fg }}>
              Hi, I'm Corinne.
            </h2>
            <p style={{ color: THEME.fgMuted, fontSize: "16px", lineHeight: 1.9, marginBottom: "32px" }}>
              I'm an author, illustrator, and digital art educator. As the creator of Lheeloo & Luna, I love bringing whimsical cartoon characters to life. My passion is helping fellow artists master tools like Krita so they can focus on their creativity, not the technical hurdles.
            </p>
            <Btn secondary>Read My Story</Btn>
          </div>
        </div>
      </section>

      {/* Tutorials */}
      <section style={{ padding: "96px 48px", background: THEME.bgSection }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <div style={{ fontSize: "36px", marginBottom: "20px" }}>📖</div>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", fontWeight: 600, marginBottom: "16px", color: THEME.fg }}>Learn With Me</h2>
            <p style={{ color: THEME.fgMuted, fontSize: "16px" }}>Join over 12K subscribers learning digital art tips, Krita shortcuts, and painting techniques.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "28px" }}>
            {tutorials.map((t) => (
              <div key={t.id} style={{ background: THEME.bgCard, borderRadius: "8px", overflow: "hidden", border: `1px solid ${THEME.border}`, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                <div style={{ aspectRatio: "16/9", position: "relative" }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${t.ytId}`}
                    title={t.title}
                    style={{ width: "100%", height: "100%", border: 0, position: "absolute", inset: 0 }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div style={{ padding: "18px" }}>
                  <h3 style={{ fontSize: "14px", fontWeight: 500, lineHeight: 1.5, color: THEME.fg }}>{t.title}</h3>
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
      <footer style={{ padding: "40px 48px", background: THEME.bgBanner, borderTop: `1px solid ${THEME.border}`, textAlign: "center", color: THEME.fgMuted, fontSize: "14px" }}>
        <p style={{ fontFamily: "'Cinzel', serif", fontSize: "17px", color: THEME.primary, marginBottom: "10px" }}>Blade & Quill</p>
        <p>© 2026 Corinne. All rights reserved.</p>
      </footer>
    </div>
  );
}
