import { Section } from "../components/Section";
import { TokenSwatch } from "../components/TokenSwatch";

const SEMANTIC_COLORS = [
  { name: "background", className: "bg-background" },
  { name: "foreground", className: "bg-foreground" },
  { name: "primary", className: "bg-primary" },
  { name: "accent", className: "bg-accent" },
  { name: "card", className: "bg-card" },
  { name: "muted", className: "bg-muted" },
  { name: "destructive", className: "bg-destructive" },
  { name: "border", className: "bg-border" },
  { name: "ring", className: "bg-ring" },
];

const BRAND_COLORS = [
  { name: "charcoal", value: "#43434d" },
  { name: "rose", value: "#b26567" },
  { name: "amber", value: "#f5bf69" },
  { name: "orange", value: "#e07b3a" },
  { name: "violet", value: "#8455f6" },
];

export function TokensSection() {
  return (
    <Section id="tokens" title="Tokens">
      {/* Semantic Colors */}
      <div>
        <h3 className="text-lg mb-4">Semantic Colors</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {SEMANTIC_COLORS.map((c) => (
            <div key={c.name} className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-md border border-border shrink-0 ${c.className}`}
              />
              <p className="text-sm font-medium">{c.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Brand Colors */}
      <div>
        <h3 className="text-lg mb-4">Brand Colors</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {BRAND_COLORS.map((c) => (
            <TokenSwatch key={c.name} name={c.name} value={c.value} />
          ))}
        </div>
      </div>

      {/* Typography */}
      <div>
        <h3 className="text-lg mb-4">Typography</h3>
        <div className="space-y-6">
          <div>
            <p className="text-xs text-muted-foreground mb-1 font-mono">
              font-display (Young Serif) — h1 / page titles
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
              font-sans font-light (Quicksand 300) — body
            </p>
            <p className="text-base font-sans font-light">
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
        </div>
      </div>

      {/* Utility Classes */}
      <div>
        <h3 className="text-lg mb-4">Utility Classes</h3>
        <div className="space-y-6">
          <div>
            <p className="text-xs text-muted-foreground mb-2 font-mono">
              .gumroad-card
            </p>
            <div className="gumroad-card p-6 max-w-sm">
              <p className="font-medium">Product Card</p>
              <p className="text-sm text-muted-foreground">Hover to see lift</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2 font-mono">
              .thumb-card
            </p>
            <div className="thumb-card p-4 max-w-xs">
              <p className="text-sm">Thumbnail card — lighter lift</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2 font-mono">
              .tag-pill states
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="tag-pill tag-pill-active">Active</span>
              <span className="tag-pill tag-pill-inactive">Inactive</span>
              <span className="tag-pill tag-pill-inactive">Another</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2 font-mono">
              .price-badge
            </p>
            <span className="price-badge">$24.99</span>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2 font-mono">
              .cta-bold
            </p>
            <button className="cta-bold bg-primary text-primary-foreground px-6 py-2 rounded-md">
              Call to Action
            </button>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2 font-mono">
              .reading-width
            </p>
            <div className="reading-width border border-dashed border-border p-4">
              <p className="text-sm text-muted-foreground">
                This container is capped at 65ch — ideal for comfortable
                reading.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
