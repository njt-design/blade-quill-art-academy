import { type ReactNode, useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
  sidebar: ReactNode;
}

export function DesignSystemLayout({ children, sidebar }: Props) {
  const [dark, setDark] = useState(() =>
    typeof document !== "undefined"
      ? document.documentElement.classList.contains("dark")
      : false,
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-sm px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Site
          </Link>
          <h2 className="text-base font-medium">Design System</h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setDark((d) => !d)}
          aria-label="Toggle dark mode"
        >
          {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>
      </header>
      <div className="container mx-auto px-4 md:px-6 py-10 flex gap-10">
        {sidebar}
        <main className="flex-1 min-w-0 space-y-20">{children}</main>
      </div>
    </div>
  );
}
