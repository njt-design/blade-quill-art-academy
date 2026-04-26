import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ShoppingCart, Feather } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { href: "/gallery", label: "Gallery" },
  { href: "/tutorials", label: "Tutorials" },
  { href: "/downloads", label: "Downloads" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [location, setLocation] = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-14">

          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <Feather className="w-5 h-5 text-foreground group-hover:text-amber transition-colors" />
            <span className="font-display font-normal text-base tracking-widest uppercase text-foreground">
              Blade &amp; Quill
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "font-sans text-base font-light transition-colors hover:text-foreground",
                  location === link.href ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <Button
              size="sm"
              onClick={() => setLocation("/shop")}
              className="bg-orange hover:bg-amber text-white h-8 px-4 cta-bold"
            >
              Shop
            </Button>
            <button
              onClick={() => setLocation("/cart")}
              className="relative p-1.5 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </button>
          </div>

          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setLocation("/cart")}
              className="relative p-1.5 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            <button
              className="p-1.5 text-foreground"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
            >
              {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "lg:hidden border-t border-border bg-card transition-all duration-200 overflow-hidden",
          isMobileOpen ? "max-h-[400px] py-3" : "max-h-0 py-0 border-transparent"
        )}
      >
        <div className="flex flex-col px-4 gap-1">
          <Link
            href="/shop"
            onClick={() => setIsMobileOpen(false)}
            className={cn(
              "py-2 font-sans text-base font-light transition-colors",
              location === "/shop" ? "text-foreground" : "text-muted-foreground"
            )}
          >
            Shop
          </Link>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileOpen(false)}
              className={cn(
                "py-2 font-sans text-base font-light transition-colors",
                location === link.href ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
