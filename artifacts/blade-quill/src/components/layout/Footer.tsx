import { useState } from "react";
import { Link } from "wouter";
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
    if (!open) { setPassword(""); setError(""); }
  };

  return (
    <>
      <footer className="border-t border-border mt-20">
        <div className="container mx-auto px-4 md:px-6 py-10">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">

            <div className="max-w-sm">
              <div className="flex items-center gap-2 mb-3">
                <Feather className="w-4 h-4 text-foreground" />
                <span className="font-display font-bold text-sm tracking-widest uppercase text-foreground">
                  Blade &amp; Quill
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Digital art tutorials, resources, and original artwork by Corinne. Creator of Lheeloo &amp; Luna.
              </p>
            </div>

            <div className="flex gap-12 text-sm">
              <div>
                <h4 className="font-semibold text-foreground mb-3">Pages</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li><Link href="/shop" className="hover:text-foreground transition-colors">Shop</Link></li>
                  <li><Link href="/gallery" className="hover:text-foreground transition-colors">Gallery</Link></li>
                  <li><Link href="/tutorials" className="hover:text-foreground transition-colors">Tutorials</Link></li>
                  <li><Link href="/downloads" className="hover:text-foreground transition-colors">Downloads</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-3">Connect</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>
                    <a href="https://www.youtube.com/c/BladeQuillartacademy" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors">
                      <Youtube className="w-3.5 h-3.5" /> YouTube
                    </a>
                  </li>
                  <li>
                    <a href="https://ko-fi.com/bladeandquill" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors">
                      <Coffee className="w-3.5 h-3.5" /> Ko-fi
                    </a>
                  </li>
                  <li>
                    <Link href="/contact" className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors">
                      <Mail className="w-3.5 h-3.5" /> Contact
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-6 flex items-center justify-between text-xs text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Blade &amp; Quill Art Academy</p>
            <button
              onClick={() => setAdminOpen(true)}
              className="text-muted-foreground/30 hover:text-muted-foreground/60 transition-colors"
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
            <DialogDescription>Enter the admin password to access the content editor.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAdminSubmit} className="space-y-4 mt-2">
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              autoFocus
              className={error ? "border-destructive" : ""}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div className="flex gap-3">
              <Button type="submit" className="flex-1">Enter</Button>
              <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>Cancel</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
