import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Feather, Youtube, Coffee, Mail } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Footer() {
  const [adminOpen, setAdminOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [, navigate] = useLocation();

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "B&Q2024") {
      setAdminOpen(false);
      setPassword("");
      setError("");
      window.location.href = `${import.meta.env.BASE_URL}admin/index.html`;
    } else {
      setError("Incorrect password. Please try again.");
    }
  };

  const handleOpenChange = (open: boolean) => {
    setAdminOpen(open);
    if (!open) {
      setPassword("");
      setError("");
    }
  };

  return (
    <>
      <footer className="bg-background border-t border-border mt-24">
        <div className="container mx-auto px-4 md:px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <Feather className="w-6 h-6 text-primary" />
                <span className="font-display font-bold text-xl tracking-widest uppercase text-foreground">
                  Blade & Quill
                </span>
              </div>
              <p className="text-muted-foreground leading-relaxed max-w-md">
                Master the art of digital painting with Corinne. Creator of Lheeloo & Luna, author, illustrator, and your guide to unlocking creativity in Krita.
              </p>
            </div>

            <div>
              <h4 className="font-display text-lg text-primary mb-6">Quick Links</h4>
              <ul className="space-y-3">
                <li><Link href="/shop" className="text-muted-foreground hover:text-primary transition-colors">Shop</Link></li>
                <li><Link href="/gallery" className="text-muted-foreground hover:text-primary transition-colors">Gallery</Link></li>
                <li><Link href="/tutorials" className="text-muted-foreground hover:text-primary transition-colors">Tutorials</Link></li>
                <li><Link href="/downloads" className="text-muted-foreground hover:text-primary transition-colors">Free Resources</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-display text-lg text-primary mb-6">Connect</h4>
              <div className="flex flex-col gap-4">
                <a href="https://www.youtube.com/c/BladeQuillartacademy" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                  <Youtube className="w-5 h-5" />
                  <span>YouTube Channel</span>
                </a>
                <a href="https://ko-fi.com/bladeandquill" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                  <Coffee className="w-5 h-5" />
                  <span>Support on Ko-fi</span>
                </a>
                <Link href="/contact" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                  <Mail className="w-5 h-5" />
                  <span>Contact Me</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-border/50 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Blade & Quill Art Academy. All rights reserved.</p>
            <button
              onClick={() => setAdminOpen(true)}
              className="mt-4 md:mt-0 text-muted-foreground/30 hover:text-muted-foreground/60 transition-colors text-xs"
              aria-label="Admin login"
            >
              Admin
            </button>
          </div>
        </div>
      </footer>

      <Dialog open={adminOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Admin Access</DialogTitle>
            <DialogDescription>
              Enter the admin password to access the content editor.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAdminSubmit} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                autoFocus
                className={error ? "border-destructive" : ""}
              />
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </div>
            <div className="flex gap-3">
              <Button type="submit" className="flex-1">
                Enter
              </Button>
              <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
