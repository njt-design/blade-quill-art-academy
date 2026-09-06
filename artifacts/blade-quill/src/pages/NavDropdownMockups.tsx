import { useState } from "react";
import { Link } from "wouter";
import { ChevronDown, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { InkUnderline } from "@/components/site/InkUnderline";
import { QuillMark } from "@/components/site/QuillMark";

type MockChild = {
  label: string;
  note?: string;
};

const SHOP_ITEMS: MockChild[] = [
  { label: "Books", note: "Signed paperbacks" },
  { label: "Ebooks", note: "Instant download" },
  { label: "Downloads", note: "Guides & coloring pages" },
  { label: "Gallery", note: "Artwork from the studio" },
];

const NAV_ITEMS = ["Shop", "Education", "Blog", "About", "Contact"] as const;

type VariantId = "current" | "ruled" | "ink" | "studio";

function MockWordmark() {
  return (
    <div className="flex items-center gap-3 shrink-0">
      <span
        className="grid place-items-center rounded-[10px]"
        style={{ width: 38, height: 38, background: "var(--g-cta)" }}
      >
        <QuillMark size={20} color="var(--paper)" />
      </span>
      <span
        className="text-[19px] tracking-[0.01em]"
        style={{ fontFamily: "var(--f-serif)" }}
      >
        Blade <span style={{ color: "var(--ink-faint)" }}>&amp;</span> Quill
      </span>
    </div>
  );
}

function MockNavBar({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="relative z-20 px-6 md:px-8 border-b"
      style={{
        background: "rgba(223,210,204,0.92)",
        backdropFilter: "blur(20px)",
        borderColor: "rgba(46,34,34,0.08)",
      }}
    >
      <div className="mx-auto max-w-[1440px] flex items-center justify-between h-[72px]">
        <MockWordmark />
        <div className="hidden md:flex items-center gap-8">{children}</div>
        <div className="grid place-items-center w-11 h-11 rounded-full text-foreground/80">
          <ShoppingCart className="w-[18px] h-[18px]" strokeWidth={1.8} />
        </div>
      </div>
    </div>
  );
}

function NavLabel({
  label,
  open,
  hasMenu,
}: {
  label: string;
  open?: boolean;
  hasMenu?: boolean;
}) {
  return (
    <span
      className={cn(
        "relative font-sans text-sm py-2 inline-flex items-center gap-1",
        open ? "text-foreground" : "text-foreground/75"
      )}
    >
      {label}
      {hasMenu ? (
        <ChevronDown
          className={cn(
            "w-3.5 h-3.5 transition-transform duration-200",
            open && "rotate-180"
          )}
          strokeWidth={1.8}
        />
      ) : null}
      {open ? (
        <span className="absolute inset-x-0 -bottom-1">
          <InkUnderline color="var(--maroon)" style={{ height: 6 }} />
        </span>
      ) : null}
    </span>
  );
}

function PanelWrap({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3">
      <div className={className} style={style}>
        {children}
      </div>
    </div>
  );
}

/** A — Current frosted paper card */
function CurrentPanel({ items }: { items: MockChild[] }) {
  return (
    <PanelWrap
      className="min-w-[190px] rounded-xl border py-2"
      style={{
        borderColor: "rgba(46,34,34,0.1)",
        background: "rgba(238,229,224,0.97)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 12px 32px rgba(46,34,34,0.14)",
      }}
    >
      {items.map((item, i) => (
        <a
          key={item.label}
          href="#shop"
          className={cn(
            "block px-4 py-2 font-sans text-sm whitespace-nowrap",
            i === 0 ? "text-foreground" : "text-foreground/75 hover:text-foreground"
          )}
        >
          {item.label}
        </a>
      ))}
    </PanelWrap>
  );
}

/** B — Ruled paper list with ink underline hover */
function RuledPanel({ items }: { items: MockChild[] }) {
  const [hover, setHover] = useState(0);
  return (
    <PanelWrap
      className="min-w-[220px] rounded-[10px] px-4 py-4"
      style={{
        background: "var(--paper)",
        boxShadow: "var(--sh-lg)",
        border: "1px solid rgba(46,34,34,0.08)",
      }}
    >
      <div className="eyebrow mb-3">Shop</div>
      {items.map((item, i) => (
        <a
          key={item.label}
          href="#shop"
          onMouseEnter={() => setHover(i)}
          className="relative block py-2.5 font-sans text-[15px]"
          style={{
            color: hover === i ? "var(--ink)" : "var(--ink-soft)",
            borderBottom:
              i === items.length - 1 ? "none" : "1px dashed rgba(46,34,34,0.12)",
          }}
        >
          {item.label}
          {hover === i ? (
            <span className="absolute inset-x-0 bottom-0">
              <InkUnderline color="var(--maroon)" style={{ height: 5 }} />
            </span>
          ) : null}
        </a>
      ))}
    </PanelWrap>
  );
}

/** C — Dark ink panel, gold accents */
function InkPanel({ items }: { items: MockChild[] }) {
  const [hover, setHover] = useState(0);
  return (
    <PanelWrap
      className="min-w-[230px] rounded-[14px] px-5 py-5"
      style={{
        background: "var(--ink)",
        color: "var(--paper)",
        boxShadow: "0 16px 40px rgba(46,34,34,0.28)",
      }}
    >
      <div className="eyebrow-grad-gold mb-3">From the studio</div>
      {items.map((item, i) => (
        <a
          key={item.label}
          href="#shop"
          onMouseEnter={() => setHover(i)}
          className="block py-2 font-sans text-[15px] transition-colors"
          style={{
            color: hover === i ? "var(--gold)" : "var(--paper)",
            opacity: hover === i ? 1 : 0.78,
          }}
        >
          {item.label}
        </a>
      ))}
      <div
        className="mt-3 pt-3"
        style={{ borderTop: "1px solid rgba(223,210,204,0.14)" }}
      >
        <a
          href="#shop"
          className="inline-flex items-center gap-1.5 font-sans text-sm"
          style={{ color: "var(--gold)" }}
        >
          View the shop <span aria-hidden>→</span>
        </a>
      </div>
    </PanelWrap>
  );
}

/** D — Editorial studio card with cover + notes */
function StudioPanel({ items }: { items: MockChild[] }) {
  const [hover, setHover] = useState(0);
  return (
    <PanelWrap
      className="w-[420px] rounded-[18px] p-5"
      style={{
        background: "var(--paper)",
        boxShadow: "var(--sh-lg)",
        border: "1px solid rgba(46,34,34,0.08)",
      }}
    >
      <div className="flex gap-5">
        <div
          className="shrink-0 overflow-hidden"
          style={{
            width: 92,
            height: 128,
            borderRadius: 10,
            boxShadow: "var(--sh-md)",
            background: "var(--paper-2)",
          }}
        >
          <img
            src="/images/puzzle-book-front.png"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="eyebrow-grad mb-3">Shop</div>
          {items.map((item, i) => (
            <a
              key={item.label}
              href="#shop"
              onMouseEnter={() => setHover(i)}
              className="block py-1.5"
            >
              <div
                className="font-sans text-[15px] leading-tight"
                style={{
                  color: hover === i ? "var(--maroon)" : "var(--ink)",
                  fontWeight: hover === i ? 600 : 500,
                }}
              >
                {item.label}
              </div>
              {item.note ? (
                <div
                  className="text-[12px] mt-0.5"
                  style={{
                    fontFamily: "var(--f-sans)",
                    color: "var(--ink-mute)",
                  }}
                >
                  {item.note}
                </div>
              ) : null}
            </a>
          ))}
        </div>
      </div>
      <div
        className="mt-4 pt-3 flex justify-end"
        style={{ borderTop: "1px dashed rgba(46,34,34,0.12)" }}
      >
        <a
          href="#shop"
          className="eyebrow"
          style={{ color: "var(--maroon)" }}
        >
          View the shop →
        </a>
      </div>
    </PanelWrap>
  );
}

function VariantNav({
  variant,
  items,
}: {
  variant: VariantId;
  items: MockChild[];
}) {
  return (
    <MockNavBar>
      {NAV_ITEMS.map((label) => {
        const isShop = label === "Shop";
        return (
          <div key={label} className="relative">
            <NavLabel label={label} open={isShop} hasMenu={isShop} />
            {isShop
              ? variant === "current"
                ? <CurrentPanel items={items} />
                : variant === "ruled"
                  ? <RuledPanel items={items} />
                  : variant === "ink"
                    ? <InkPanel items={items} />
                    : <StudioPanel items={items} />
              : null}
          </div>
        );
      })}
    </MockNavBar>
  );
}

const VARIANTS: Array<{
  id: VariantId;
  letter: string;
  name: string;
  pitch: string;
  minHeight: number;
}> = [
  {
    id: "current",
    letter: "A",
    name: "Current paper card",
    pitch:
      "What we ship today — frosted blush panel, simple labels, centered under the parent. Quiet and fast.",
    minHeight: 280,
  },
  {
    id: "ruled",
    letter: "B",
    name: "Ruled studio list",
    pitch:
      "Solid paper (no blur), dashed rules like the product details card, and the hand-drawn ink underline on hover.",
    minHeight: 340,
  },
  {
    id: "ink",
    letter: "C",
    name: "Ink panel",
    pitch:
      "Same dark surface as the newest-lesson block. Gold eyebrow and a View the shop footer — more contrast, still in-palette.",
    minHeight: 360,
  },
  {
    id: "studio",
    letter: "D",
    name: "Studio editorial",
    pitch:
      "Wider card with a book cover, short notes, and a dashed footer. Best if Shop grows past four links.",
    minHeight: 380,
  },
];

export default function NavDropdownMockups() {
  return (
    <div className="page min-h-screen pb-24" style={{ background: "var(--paper)" }}>
      <div className="bq-container pt-8 pb-10 max-w-[800px]">
        <Link
          href="/"
          className="eyebrow inline-block mb-6"
          style={{ color: "var(--maroon)" }}
        >
          ← Back to site
        </Link>
        <div className="eyebrow-grad mb-3">Review only</div>
        <h1
          className="mb-4"
          style={{
            fontFamily: "var(--f-serif)",
            fontSize: "clamp(36px, 5vw, 52px)",
            lineHeight: 1.08,
          }}
        >
          Navigation dropdowns
        </h1>
        <p style={{ color: "var(--ink-mute)", fontSize: 17, lineHeight: 1.7 }}>
          Four Shop menus in the live brand. Shop is held open so you can
          compare. Hover the links inside each panel. Nothing here is wired
          to the real navbar yet.
        </p>
      </div>

      {VARIANTS.map((v) => (
        <section key={v.id} className="mb-6">
          <div className="bq-container max-w-[800px] pb-4">
            <div className="flex items-baseline gap-3 mb-2">
              <span className="eyebrow-grad">{v.letter}</span>
              <h2
                style={{
                  fontFamily: "var(--f-serif)",
                  fontSize: 28,
                  lineHeight: 1.15,
                }}
              >
                {v.name}
              </h2>
            </div>
            <p
              className="max-w-[560px]"
              style={{ color: "var(--ink-mute)", fontSize: 15, lineHeight: 1.65 }}
            >
              {v.pitch}
            </p>
          </div>
          <div style={{ minHeight: v.minHeight }}>
            <VariantNav variant={v.id} items={SHOP_ITEMS} />
          </div>
        </section>
      ))}
    </div>
  );
}
