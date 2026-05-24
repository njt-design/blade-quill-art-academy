import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ShoppingCart, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import { InkUnderline } from "@/components/site/InkUnderline";
import { QuillMark } from "@/components/site/QuillMark";

/**
 * Sticky reveal navigation.
 *  - Hides on scroll DOWN past 200px.
 *  - Re-appears on any upward scroll.
 *  - Backdrop blur + faint border kick in once `scrollY > 30`.
 *  - Active link shows a hand-drawn `InkUnderline` SVG.
 *
 * Routes match our existing site (Shop, Gallery, Downloads, Blog, About,
 * Contact). Prototype's `/classes` doesn't map to a route here, so we
 * keep our actual nav.
 */
const NAV_LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/gallery", label: "Gallery" },
  { href: "/downloads", label: "Downloads" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [location, setLocation] = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastYRef = useRef(0);
  const { totalItems } = useCart();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 30);
      // Don't hide while the mobile menu is open — user is interacting.
      if (isMobileOpen) {
        lastYRef.current = y;
        return;
      }
      if (y > 200 && y > lastYRef.current + 6) setHidden(true);
      else if (y < lastYRef.current - 4) setHidden(false);
      lastYRef.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isMobileOpen]);

  return (
    <nav
      className={cn(
        "fixed inset-x-0 top-0 z-50 px-6 md:px-8",
        "transition-[transform,backdrop-filter,background,border-color] duration-300",
        hidden ? "-translate-y-full" : "translate-y-0",
        scrolled
          ? "bg-[rgba(251,246,236,0.85)] backdrop-blur-xl border-b border-[rgba(31,26,20,0.06)]"
          : "bg-transparent border-b border-transparent"
      )}
      style={{ transitionTimingFunction: "var(--e-out)" }}
    >
      <div className="mx-auto max-w-[1440px] flex items-center justify-between h-[72px]">
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <span
            className="grid place-items-center rounded-[10px]"
            style={{
              width: 38,
              height: 38,
              background: "var(--g-cta)",
              boxShadow: "0 4px 12px rgba(229, 89, 52, 0.32)",
            }}
          >
            <QuillMark size={20} color="var(--paper)" />
          </span>
          <span
            className="text-[19px] tracking-[0.01em]"
            style={{ fontFamily: "var(--f-serif)" }}
          >
            Blade <span style={{ color: "var(--ink-faint)" }}>&amp;</span>{" "}
            Quill
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => {
            const active = location === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative font-sans text-sm py-2",
                  active
                    ? "text-foreground"
                    : "text-foreground/75 hover:text-foreground"
                )}
              >
                {link.label}
                {active && (
                  <span className="absolute inset-x-0 -bottom-1">
                    <InkUnderline
                      color="var(--orange)"
                      style={{ height: 6 }}
                    />
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Search"
            className="hidden md:grid place-items-center w-11 h-11 rounded-full text-foreground/80 hover:text-foreground transition-colors"
          >
            <Search className="w-[18px] h-[18px]" strokeWidth={1.8} />
          </button>
          <button
            id="cart-icon"
            type="button"
            onClick={() => setLocation("/cart")}
            aria-label="Cart"
            className="relative grid place-items-center w-11 h-11 rounded-full text-foreground/80 hover:text-foreground transition-colors"
          >
            <ShoppingCart className="w-[18px] h-[18px]" strokeWidth={1.8} />
            {totalItems > 0 && (
              <span
                className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full text-[10px] font-bold grid place-items-center"
                style={{
                  background: "var(--orange)",
                  color: "var(--paper)",
                  fontFamily: "var(--f-mono)",
                }}
              >
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </button>
          <button
            type="button"
            aria-label="Menu"
            className="lg:hidden grid place-items-center w-11 h-11 rounded-full text-foreground/80 hover:text-foreground transition-colors"
            onClick={() => setIsMobileOpen((v) => !v)}
          >
            {isMobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "lg:hidden overflow-hidden transition-all duration-300",
          isMobileOpen
            ? "max-h-[480px] pb-4 pt-1 border-t border-[rgba(31,26,20,0.08)]"
            : "max-h-0 pb-0 pt-0 border-t border-transparent"
        )}
        style={{ transitionTimingFunction: "var(--e-out)" }}
      >
        <div className="flex flex-col">
          {NAV_LINKS.map((link) => {
            const active = location === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  "py-3 text-base",
                  active ? "text-foreground" : "text-foreground/70"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
