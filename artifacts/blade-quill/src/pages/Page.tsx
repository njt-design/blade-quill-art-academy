import { useEffect, useMemo } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import { useLiveTina } from "@/hooks/use-live-tina";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CmsStatusPill } from "@/components/site/CmsStatusPill";
import { QuillMark } from "@/components/site/QuillMark";
import {
  getPageData,
  isCorePageSlug,
  landingPageQuery,
  landingPageTypename,
  normalizeSlug,
  sitePageQuery,
} from "@/lib/page-content";
import { BlockRenderer } from "./blocks/BlockRenderer";
import { type Block } from "./blocks/block-utils";

interface PageProps {
  /** File name of the page in content/pages (without .json). */
  slug: string;
  /**
   * "none"  → render blocks only (route already lives inside MainLayout)
   * "auto"  → wrap in Navbar/Footer or the standalone shell based on the
   *           page's own layout field (used for /p/:slug and standalone routes)
   */
  chrome?: "none" | "auto";
}

/** Minimal shell for standalone pages: logo header + copyright footer. */
function StandaloneShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="important-links-page min-h-screen bg-background flex flex-col">
      <header className="px-6 md:px-8 py-4 border-b border-border/85">
        <div className="mx-auto max-w-5xl flex justify-center">
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <span
              className="grid place-items-center rounded-[10px] bg-[image:var(--g-cta)]"
              style={{ width: 38, height: 38 }}
            >
              <QuillMark size={20} color="var(--paper)" />
            </span>
            <span className="font-display text-[19px] tracking-[0.01em] text-foreground">
              Blade <span className="text-muted-foreground">&amp;</span> Quill
            </span>
          </Link>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="px-6 md:px-8 py-6 border-t border-border/85">
        <p className="text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Blade &amp; Quill Art Academy
        </p>
      </footer>
    </div>
  );
}

/** Full site chrome for standard pages rendered outside MainLayout. */
function StandardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen page">
      <Navbar />
      <main className="flex-grow pt-[72px]">{children}</main>
      <Footer />
    </div>
  );
}

export default function Page({ slug: rawSlug, chrome = "none" }: PageProps) {
  const [, setLocation] = useLocation();
  const slug = normalizeSlug(rawSlug);
  const isCore = isCorePageSlug(slug);

  const staticData = getPageData(slug);
  const seed = staticData
    ? {
        ...staticData,
        __typename: isCore
          ? ("Page" as const)
          : landingPageTypename(staticData._template as string | undefined),
      }
    : {};

  const { data, freshness } = useLiveTina({
    query: isCore ? sitePageQuery : landingPageQuery,
    variables: { relativePath: `${slug}.json` },
    data: isCore ? { page: seed } : { landingPage: seed },
  });

  const page = (isCore
    ? (data as Record<string, unknown>).page
    : (data as Record<string, unknown>).landingPage) as
    | (Record<string, unknown> & { title?: string; layout?: string; blocks?: Block[] })
    | null;

  useEffect(() => {
    if (page?.title) {
      document.title = `${page.title} — Blade & Quill`;
    }
  }, [page?.title]);

  if (!page || !page.title) {
    const notFound = (
      <div className="min-h-screen py-10">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl text-center py-20">
          <h1 className="text-2xl font-display mb-4">Page not found</h1>
          <Button variant="outline" onClick={() => setLocation("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </Button>
        </div>
      </div>
    );
    return chrome === "auto" ? <StandardShell>{notFound}</StandardShell> : notFound;
  }

  const blocks = (page.blocks as Block[] | null | undefined) ?? [];
  const content = (
    <div className="page min-h-screen">
      <CmsStatusPill freshness={freshness} />
      {blocks.map((block, i) => (
        <BlockRenderer key={i} block={block} />
      ))}
    </div>
  );

  if (chrome === "none") return content;
  return page.layout === "standalone" ? (
    <StandaloneShell>{content}</StandaloneShell>
  ) : (
    <StandardShell>{content}</StandardShell>
  );
}
