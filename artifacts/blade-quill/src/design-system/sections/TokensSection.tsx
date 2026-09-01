import { Section } from "../components/Section";
import { TokenSwatch } from "../components/TokenSwatch";

/**
 * Full mirror of the design tokens in `src/index.css` (the site's single
 * source of truth — Tailwind v4 `@theme`, no tailwind.config).
 */

const BRAND_COLORS = [
  { name: "maroon", value: "#9A5151", role: "primary / CTA" },
  { name: "maroon-deep", value: "#7E3E3E", role: "CTA hover, destructive" },
  { name: "gold", value: "#D9B783", role: "accent only" },
  { name: "gold-deep", value: "#C29E63", role: "accent hover" },
  { name: "brown", value: "#714B4B", role: "deep surfaces, dark panels" },
  { name: "brown-deep", value: "#5A3B3B", role: "deeper brown" },
  { name: "taupe", value: "#776562", role: "muted text, secondary UI" },
  { name: "charcoal", value: "#2E2222", role: "near-black ink" },
];

const INK_SCALE = [
  { name: "ink", value: "#2E2222", role: "foreground text" },
  { name: "ink-soft", value: "#4A3838", role: "secondary text" },
  { name: "ink-mute", value: "#776562", role: "muted text (= taupe)" },
  { name: "ink-faint", value: "#9C8B87", role: "faintest text" },
];

const PAPER_SCALE = [
  { name: "paper", value: "#DFD2CC", role: "page background (blush)" },
  { name: "paper-2", value: "#D6C6BF", role: "secondary surface" },
  { name: "paper-3", value: "#CCB9B1", role: "muted surface" },
  { name: "paper-deep", value: "#BFA89E", role: "borders" },
];

const SEMANTIC_COLORS = [
  { name: "background", className: "bg-background", light: "blush #DFD2CC", dark: "deep ink" },
  { name: "foreground", className: "bg-foreground", light: "ink #2E2222", dark: "blush" },
  { name: "primary", className: "bg-primary", light: "maroon #9A5151", dark: "lifted maroon" },
  { name: "accent", className: "bg-accent", light: "gold #D9B783", dark: "gold" },
  { name: "card", className: "bg-card", light: "blush (same as bg)", dark: "lighter ink" },
  { name: "secondary", className: "bg-secondary", light: "blush-2 #D6C6BF", dark: "ink step" },
  { name: "muted", className: "bg-muted", light: "blush-3 #CCB9B1", dark: "ink step" },
  { name: "destructive", className: "bg-destructive", light: "maroon-deep #7E3E3E", dark: "lifted" },
  { name: "border", className: "bg-border", light: "blush-deep #BFA89E", dark: "ink step" },
  { name: "ring", className: "bg-ring", light: "maroon", dark: "lifted maroon" },
];

const GRADIENTS = [
  { name: "--g-warm", desc: "gold → gold-deep (accents, gold eyebrows)" },
  { name: "--g-twilight", desc: "brown → taupe" },
  { name: "--g-dawn", desc: "maroon → brown (gradient headings via .grad-text)" },
  { name: "--g-cta", desc: "maroon → maroon-deep (primary buttons)" },
  { name: "--g-cta-hover", desc: "reversed CTA sweep on hover" },
  { name: "--g-paper", desc: "blush → blush-2 (page-turn overlay)" },
  { name: "--g-ink", desc: "ink → ink-soft (dark panels)" },
];

const RADII = [
  { name: "--r-sm", px: 4 },
  { name: "--r-md", px: 10 },
  { name: "--r-lg", px: 18 },
  { name: "--r-xl", px: 28 },
];

const SHADOWS = [
  { name: "--sh-sm", desc: "small lift" },
  { name: "--sh-md", desc: "cards" },
  { name: "--sh-lg", desc: "hover lift" },
  { name: "--sh-paper", desc: "resting paper surfaces" },
];

const EASES = [
  { name: "--e-out", value: "cubic-bezier(0.16, 1, 0.3, 1)", use: "default ease-out (reveals, hovers)" },
  { name: "--e-out-q", value: "cubic-bezier(0.25, 1, 0.5, 1)", use: "quicker ease-out" },
  { name: "--e-in-out", value: "cubic-bezier(0.65, 0, 0.35, 1)", use: "page turn, tile zoom" },
  { name: "--e-back", value: "cubic-bezier(0.34, 1.56, 0.64, 1)", use: "playful overshoot (play button)" },
];

const TIMINGS = [
  { name: "--t-fast", value: "180ms" },
  { name: "--t-med", value: "340ms" },
  { name: "--t-slow", value: "600ms" },
];

function SubHeading({ children }: { children: string }) {
  return <h3 className="text-lg mb-4">{children}</h3>;
}

export function TokensSection() {
  return (
    <Section id="tokens" title="Tokens">
      <p className="text-muted-foreground reading-width -mt-2">
        Everything below lives in <code className="font-mono text-sm">src/index.css</code> —
        the single source of truth (Tailwind v4, no tailwind.config). Legacy
        color names (orange, amber, rose, violet, moss) still resolve but are
        repointed at this palette; new work should use the names shown here.
      </p>

      {/* Brand palette */}
      <div>
        <SubHeading>Brand Palette (2026 rebrand)</SubHeading>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {BRAND_COLORS.map((c) => (
            <div key={c.name}>
              <TokenSwatch name={c.name} value={c.value} />
              <p className="text-xs text-muted-foreground mt-1 ml-[52px]">{c.role}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Ink & paper scales */}
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <SubHeading>Ink Scale (text)</SubHeading>
          <div className="space-y-3">
            {INK_SCALE.map((c) => (
              <div key={c.name}>
                <TokenSwatch name={c.name} value={c.value} />
                <p className="text-xs text-muted-foreground mt-1 ml-[52px]">{c.role}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <SubHeading>Paper Scale (surfaces)</SubHeading>
          <div className="space-y-3">
            {PAPER_SCALE.map((c) => (
              <div key={c.name}>
                <TokenSwatch name={c.name} value={c.value} />
                <p className="text-xs text-muted-foreground mt-1 ml-[52px]">{c.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Semantic tokens */}
      <div>
        <SubHeading>Semantic Tokens (light / dark)</SubHeading>
        <p className="text-sm text-muted-foreground mb-4">
          shadcn names re-pointed at the blush/ink palette. Swatches follow the
          page theme — use the moon toggle in the header to preview dark mode.
        </p>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="py-2 font-medium">Token</th>
              <th className="py-2 font-medium">Light</th>
              <th className="py-2 font-medium">Dark</th>
            </tr>
          </thead>
          <tbody>
            {SEMANTIC_COLORS.map((c) => (
              <tr key={c.name} className="border-b border-border/50">
                <td className="py-2 pr-3">
                  <span className="inline-flex items-center gap-2">
                    <span className={`w-6 h-6 rounded border border-border shrink-0 inline-block ${c.className}`} />
                    <span className="font-mono text-xs">{c.name}</span>
                  </span>
                </td>
                <td className="py-2 pr-3 text-muted-foreground">{c.light}</td>
                <td className="py-2 text-muted-foreground">{c.dark}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Gradients */}
      <div>
        <SubHeading>Signature Gradients</SubHeading>
        <p className="text-sm text-muted-foreground mb-4">
          Subtle, in-palette only — the visual language is flat and minimal (no
          glows, no glassmorphism; navbar excepted).
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {GRADIENTS.map((g) => (
            <div key={g.name}>
              <div
                className="h-14 rounded-md border border-border"
                style={{ background: `var(${g.name})` }}
              />
              <p className="font-mono text-xs mt-2">{g.name}</p>
              <p className="text-xs text-muted-foreground">{g.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Typography */}
      <div>
        <SubHeading>Typography</SubHeading>
        <div className="space-y-6">
          <div>
            <p className="text-xs text-muted-foreground mb-1 font-mono">
              font-display (Young Serif) — h1 / page titles only
            </p>
            <h1 className="text-3xl md:text-4xl">
              The quick brown fox jumps over the lazy dog
            </h1>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1 font-mono">
              font-heading (Quicksand) — h2–h6
            </p>
            <h2 className="text-2xl md:text-3xl">
              The quick brown fox jumps over the lazy dog
            </h2>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1 font-mono">
              body — Quicksand 500, 18px / 1.6 line-height
            </p>
            <p className="text-base font-sans reading-width">
              The quick brown fox jumps over the lazy dog. Pack my box with five
              dozen liquor jugs. How vexingly quick daft zebras jump.
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1 font-mono">
              font-subheading — subtitles / secondary lines
            </p>
            <p className="font-subheading text-lg text-muted-foreground">
              The quick brown fox jumps over the lazy dog
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2 font-mono">
              .eyebrow / .eyebrow-grad / .eyebrow-grad-gold — JetBrains Mono micro-labels
            </p>
            <div className="flex flex-wrap items-center gap-6">
              <span className="eyebrow">Plain eyebrow</span>
              <span className="eyebrow-grad">Gradient eyebrow</span>
              <span
                className="eyebrow-grad-gold px-3 py-1.5 rounded"
                style={{ background: "var(--g-ink)" }}
              >
                Gold on dark
              </span>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1 font-mono">
              .grad-text / .grad-text-warm — gradient display text
            </p>
            <p className="text-2xl">
              <span className="grad-text">Dawn gradient</span>{" "}
              <span className="grad-text-warm">and warm gradient</span>
            </p>
          </div>
        </div>
      </div>

      {/* Radii */}
      <div>
        <SubHeading>Border Radii</SubHeading>
        <div className="flex flex-wrap items-end gap-6">
          {RADII.map((r) => (
            <div key={r.name} className="text-center">
              <div
                className="w-20 h-20 bg-secondary border border-border"
                style={{ borderRadius: r.px }}
              />
              <p className="font-mono text-xs mt-2">{r.name}</p>
              <p className="text-xs text-muted-foreground">{r.px}px</p>
            </div>
          ))}
          <div className="text-center">
            <div className="w-20 h-20 bg-secondary border border-border rounded-full" />
            <p className="font-mono text-xs mt-2">pill</p>
            <p className="text-xs text-muted-foreground">buttons, tags</p>
          </div>
        </div>
      </div>

      {/* Shadows */}
      <div>
        <SubHeading>Shadows</SubHeading>
        <p className="text-sm text-muted-foreground mb-4">
          Flat and minimal — brown-tinted (rgba from ink #2E2222), never a glow.
        </p>
        <div className="flex flex-wrap gap-8">
          {SHADOWS.map((s) => (
            <div key={s.name} className="text-center">
              <div
                className="w-28 h-20 rounded-lg bg-card border border-border/40"
                style={{ boxShadow: `var(${s.name})` }}
              />
              <p className="font-mono text-xs mt-3">{s.name}</p>
              <p className="text-xs text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Motion */}
      <div>
        <SubHeading>Motion</SubHeading>
        <div className="grid md:grid-cols-2 gap-8">
          <table className="text-sm w-full text-left">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="py-2 font-medium">Ease</th>
                <th className="py-2 font-medium">Use</th>
              </tr>
            </thead>
            <tbody>
              {EASES.map((e) => (
                <tr key={e.name} className="border-b border-border/50">
                  <td className="py-2 pr-3 font-mono text-xs whitespace-nowrap align-top">
                    {e.name}
                  </td>
                  <td className="py-2 text-muted-foreground">{e.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            <table className="text-sm w-full text-left">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="py-2 font-medium">Timing</th>
                  <th className="py-2 font-medium">Value</th>
                </tr>
              </thead>
              <tbody>
                {TIMINGS.map((t) => (
                  <tr key={t.name} className="border-b border-border/50">
                    <td className="py-2 pr-3 font-mono text-xs">{t.name}</td>
                    <td className="py-2 text-muted-foreground">{t.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-sm text-muted-foreground mt-4">
              Motion vocabulary: <code className="font-mono text-xs">.page</code> (route
              entrance), <code className="font-mono text-xs">.reveal</code> /{" "}
              <code className="font-mono text-xs">.reveal-stagger</code> (scroll
              reveals), <code className="font-mono text-xs">.drift</code> (floating
              tiles), <code className="font-mono text-xs">.link-ink</code> (link
              underline draws in). Everything resets under
              prefers-reduced-motion.
            </p>
          </div>
        </div>
      </div>

      {/* Containers */}
      <div>
        <SubHeading>Containers</SubHeading>
        <div className="space-y-4">
          <div className="border border-dashed border-border rounded p-3">
            <p className="font-mono text-xs mb-1">.bq-container — max 1280px</p>
            <p className="text-sm text-muted-foreground">
              Standard section container. Padding 20px → 32px (≥640px) → 48px (≥1100px).
            </p>
          </div>
          <div className="border border-dashed border-border rounded p-3">
            <p className="font-mono text-xs mb-1">.bq-container-wide — max 1440px</p>
            <p className="text-sm text-muted-foreground">Footer and extra-wide bands.</p>
          </div>
          <div className="border border-dashed border-border rounded p-3 reading-width">
            <p className="font-mono text-xs mb-1">.reading-width — max 65ch</p>
            <p className="text-sm text-muted-foreground">
              Long-form text column, capped for comfortable reading.
            </p>
          </div>
        </div>
      </div>

      {/* Current utilities */}
      <div>
        <SubHeading>Utility Classes (current vocabulary)</SubHeading>
        <div className="space-y-6">
          <div>
            <p className="text-xs text-muted-foreground mb-2 font-mono">
              .card-peel — page-corner peel on hover
            </p>
            <div className="card-peel bg-card border border-border rounded-lg p-6 max-w-sm">
              <p className="font-medium">Hover this card</p>
              <p className="text-sm text-muted-foreground">
                The bottom-right corner peels like a page.
              </p>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2 font-mono">
              .link-ink — underline draws in from the left
            </p>
            <a href="#tokens" className="link-ink font-medium">
              Hover this link
            </a>
          </div>
        </div>
      </div>

      {/* Legacy utilities */}
      <div>
        <SubHeading>Legacy Utilities (being retired)</SubHeading>
        <p className="text-sm text-muted-foreground mb-4">
          Still used by older components; don't use in new work. Prefer the
          current vocabulary above (.card-peel, .eyebrow, var(--g-cta), …).
        </p>
        <div className="space-y-6">
          <div>
            <p className="text-xs text-muted-foreground mb-2 font-mono">.gumroad-card</p>
            <div className="gumroad-card p-6 max-w-sm">
              <p className="font-medium">Product Card</p>
              <p className="text-sm text-muted-foreground">Hover to see lift</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2 font-mono">.thumb-card</p>
            <div className="thumb-card p-4 max-w-xs">
              <p className="text-sm">Thumbnail card — lighter lift</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2 font-mono">.tag-pill states</p>
            <div className="flex flex-wrap gap-2">
              <span className="tag-pill tag-pill-active">Active</span>
              <span className="tag-pill tag-pill-inactive">Inactive</span>
              <span className="tag-pill tag-pill-inactive">Another</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2 font-mono">.price-badge</p>
            <span className="price-badge">$24.99</span>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2 font-mono">.cta-bold</p>
            <button className="cta-bold bg-primary text-primary-foreground px-6 py-2 rounded-md">
              Call to Action
            </button>
          </div>
        </div>
      </div>
    </Section>
  );
}
