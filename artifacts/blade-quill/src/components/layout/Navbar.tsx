import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ShoppingCart, Feather } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/gallery", label: "Gallery" },
  { href: "/tutorials", label: "Tutorials" },
  { href: "/downloads", label: "Free Downloads" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [location, setLocation] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { totalItems } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b border-transparent",
        isScrolled ? "bg-background/90 backdrop-blur-md border-border/50 shadow-lg py-3" : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group min-w-0">
            <Feather className="w-7 h-7 sm:w-8 sm:h-8 text-primary group-hover:text-primary/80 transition-colors shrink-0" />
            <span className="font-display font-bold text-lg sm:text-2xl tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 whitespace-nowrap">
              Blade & Quill
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm uppercase tracking-wider font-medium transition-colors hover:text-primary",
                  location === link.href ? "text-primary" : "text-foreground/80"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Cart Icon */}
          <div className="hidden lg:flex items-center gap-4">
            <button
              onClick={() => setLocation("/cart")}
              className="relative p-2 text-foreground/80 hover:text-primary transition-colors"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Toggle + Cart */}
          <div className="lg:hidden flex items-center gap-3">
            <button
              onClick={() => setLocation("/cart")}
              className="relative p-2 text-foreground/80 hover:text-primary transition-colors"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            <button
              className="p-2 text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
            >
              {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <div
        className={cn(
          "lg:hidden absolute top-full left-0 w-full bg-background/95 backdrop-blur-xl border-b border-border/50 transition-all duration-300 overflow-hidden",
          isMobileOpen ? "max-h-[500px] py-4" : "max-h-0 py-0 border-transparent"
        )}
      >
        <div className="flex flex-col gap-4 px-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileOpen(false)}
              className={cn(
                "text-lg font-display transition-colors hover:text-primary block py-2 border-b border-border/30",
                location === link.href ? "text-primary" : "text-foreground/80"
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
