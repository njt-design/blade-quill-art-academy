import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ShoppingCart, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import { useLiveNavigation } from "@/hooks/use-live-navigation";
import { type ResolvedNavLink } from "@/lib/navigation-content";
import { InkUnderline } from "@/components/site/InkUnderline";
import { QuillMark } from "@/components/site/QuillMark";
import { maybeTrackAmazonClick } from "@/lib/analytics";
import { isHiddenPath } from "@/lib/hidden-pages";

/**
 * Sticky navigation pinned to the top.
 *  - Slides out of view while scrolling down, reappears immediately on any
 *    upward scroll (always visible near the top or with the menu open).
 *  - Backdrop blur + faint border kick in once `scrollY > 30`.
 *  - Active link shows a hand-drawn `InkUnderline` SVG; inactive links grow
 *    a maroon underline on hover.
 *
 * Menu items come from the CMS Navigation document
 * (content/navigation/main.json) so the client can reorder, nest, and
 * add/remove links in Tina. Items with children render a one-level dropdown.
 */

function isLinkActive(location: string, link: ResolvedNavLink): boolean {
  return (
    location === link.href || link.children.some((c) => location === c.href)
  );
}

/** Renders a nav destination as a wouter Link or external anchor. */
function NavAnchor({
  link,
  className,
  style,
  onClick,
  children,
}: {
  link: ResolvedNavLink;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  if (link.external) {
    return (
      <a
        href={link.href ?? "#"}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        style={style}
        onClick={() => {
          maybeTrackAmazonClick(link.href, "navbar");
          onClick?.();
        }}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={link.href ?? "/"} className={className} style={style} onClick={onClick}>
      {children}
    </Link>
  );
}

function DesktopNavItem({ link }: { link: ResolvedNavLink }) {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const hasChildren = link.children.length > 0;
  const active = isLinkActive(location, link);

  // Close the dropdown after navigating.
  useEffect(() => setOpen(false), [location]);

  const labelClasses = cn(
    "relative font-sans text-sm py-2 inline-flex items-center gap-1",
    "transition-colors duration-200",
    active ? "text-foreground" : "text-foreground/75 hover:text-foreground",
    // Hover underline: a maroon line that draws in from the left. Active
    // links already carry the hand-drawn InkUnderline, so skip them.
    !active &&
      "after:absolute after:inset-x-0 after:bottom-0.5 after:h-[2px] after:rounded-full after:bg-[var(--maroon)] after:origin-left after:scale-x-0 after:opacity-0 after:transition-[scale,opacity] after:duration-300 after:[transition-timing-function:var(--e-out)] hover:after:scale-x-100 hover:after:opacity-100"
  );

  const underline = active ? (
    <span className="absolute inset-x-0 -bottom-1">
      <InkUnderline color="var(--maroon)" style={{ height: 6 }} />
    </span>
  ) : null;

  if (!hasChildren) {
    return (
      <NavAnchor link={link} className={labelClasses}>
        {link.label}
        {underline}
      </NavAnchor>
    );
  }

  const chevron = (
    <ChevronDown
      className={cn(
        "w-3.5 h-3.5 transition-transform duration-200",
        open && "rotate-180"
      )}
      strokeWidth={1.8}
    />
  );

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {link.href ? (
        <NavAnchor link={link} className={labelClasses}>
          {link.label}
          {chevron}
          {underline}
        </NavAnchor>
      ) : (
        <button
          type="button"
          className={labelClasses}
          aria-expanded={open}
          aria-haspopup="menu"
          onClick={() => setOpen((v) => !v)}
        >
          {link.label}
          {chevron}
          {underline}
        </button>
      )}

      <div
        className={cn(
          "absolute left-1/2 -translate-x-1/2 top-full pt-3 transition-all duration-200",
          open
            ? "visible opacity-100 translate-y-0"
            : "invisible opacity-0 -translate-y-1"
        )}
        style={{ transitionTimingFunction: "var(--e-out)" }}
      >
        <div
          role="menu"
          className="min-w-[220px] rounded-[14px] px-5 py-5"
          style={{
            background: "var(--ink)",
            boxShadow: "0 16px 40px rgba(46,34,34,0.28)",
          }}
        >
          <div className="eyebrow-grad-gold mb-3">{link.label}</div>
          {link.children.map((child) => {
            const childActive = location === child.href;
            return (
              <NavAnchor
                key={child.label + (child.href ?? "")}
                link={child}
                className={cn(
                  "block py-2 font-sans text-[15px] whitespace-nowrap transition-opacity duration-200",
                  childActive
                    ? "opacity-100 font-semibold"
                    : "opacity-[0.78] hover:opacity-100"
                )}
                style={{ color: "var(--paper)" }}
              >
                {child.label}
              </NavAnchor>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function Navbar() {
  const [location, setLocation] = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastYRef = useRef(0);
  const { totalItems } = useCart();
  const { items: navLinks } = useLiveNavigation();

  useEffect(() => {
    // Start visible even if the page loads already scrolled (e.g. refresh
    // with scroll restoration); only actual scrolling hides the nav.
    lastYRef.current = window.scrollY;
    setScrolled(window.scrollY > 30);

    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 30);
      // Hide while scrolling down (past the navbar's own height), show
      // immediately on any upward scroll.
      if (y <= 72 || y < lastYRef.current) {
        setHidden(false);
      } else if (y > lastYRef.current) {
        setHidden(true);
      }
      lastYRef.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMobile = () => setIsMobileOpen(false);

  return (
    <nav
      className={cn(
        "fixed inset-x-0 top-0 z-50",
        "transition-[transform,backdrop-filter,background,border-color] duration-300",
        // Slide away while scrolling down; never while the menu is open.
        hidden && !isMobileOpen ? "-translate-y-full" : "translate-y-0",
        // Solid backdrop whenever scrolled OR the mobile menu is open,
        // so menu links never sit on top of page content unreadably.
        scrolled || isMobileOpen
          ? "bg-[rgba(223,210,204,0.92)] backdrop-blur-xl border-b border-[rgba(46,34,34,0.08)]"
          : "bg-transparent border-b border-transparent"
      )}
      style={{ transitionTimingFunction: "var(--e-out)" }}
    >
      <div className="bq-container flex items-center justify-between h-[72px]">
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <span
            className="grid place-items-center rounded-[10px]"
            style={{
              width: 38,
              height: 38,
              background: "var(--g-cta)",
            }}
          >
            <QuillMark size={32} />
          </span>
          <span
            className="text-[19px] tracking-[0.01em]"
            style={{ fontFamily: "var(--f-serif)" }}
          >
            Blade <span style={{ color: "var(--ink-faint)" }}>&amp;</span>{" "}
            Quill
          </span>
        </Link>

        <div className="flex items-center gap-2 lg:gap-6">
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <DesktopNavItem key={link.label + (link.href ?? "")} link={link} />
            ))}
          </div>

          {!isHiddenPath("/cart") && (
            <button
              id="cart-icon"
              type="button"
              onClick={() => setLocation("/cart")}
              aria-label="Cart"
              className="relative grid place-items-center w-11 h-11 rounded-full text-foreground/80 hover:text-foreground transition-colors lg:-mr-3"
            >
              <ShoppingCart className="w-[18px] h-[18px]" strokeWidth={1.8} />
              {totalItems > 0 && (
                <span
                  className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full text-[10px] font-bold grid place-items-center"
                  style={{
                    background: "var(--maroon)",
                    color: "var(--paper)",
                    fontFamily: "var(--f-mono)",
                  }}
                >
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </button>
          )}
          <button
            type="button"
            aria-label="Menu"
            className="lg:hidden grid place-items-center w-11 h-11 -mr-3 rounded-full text-foreground/80 hover:text-foreground transition-colors"
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
            ? "max-h-[70vh] overflow-y-auto pb-4 pt-1 border-t border-[rgba(46,34,34,0.08)]"
            : "max-h-0 pb-0 pt-0 border-t border-transparent"
        )}
        style={{ transitionTimingFunction: "var(--e-out)" }}
      >
        <div className="bq-container flex flex-col">
          {navLinks.map((link) => {
            const key = link.label + (link.href ?? "");
            const parentClasses = cn(
              "py-3 text-base",
              location === link.href ? "text-foreground" : "text-foreground/70"
            );
            return (
              <div key={key} className="flex flex-col">
                {link.href ? (
                  <NavAnchor link={link} className={parentClasses} onClick={closeMobile}>
                    {link.label}
                  </NavAnchor>
                ) : (
                  <span className={cn(parentClasses, "text-foreground/50")}>
                    {link.label}
                  </span>
                )}
                {link.children.map((child) => (
                  <NavAnchor
                    key={child.label + (child.href ?? "")}
                    link={child}
                    onClick={closeMobile}
                    className={cn(
                      "py-2.5 pl-5 text-[15px]",
                      location === child.href
                        ? "text-foreground"
                        : "text-foreground/60"
                    )}
                  >
                    {child.label}
                  </NavAnchor>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
