import { lazy, Suspense, type ReactNode } from "react";
import { Link, useRoute } from "wouter";
import NotFound from "@/pages/not-found";

const EditorialLightHome = lazy(
  () => import("@mockups/EditorialLightHome.tsx"),
);
const ElectricStudioHome = lazy(
  () => import("@mockups/ElectricStudioHome.tsx"),
);

/**
 * Full-page homepage mockups from `artifacts/mockup-sandbox` (same dev server as the main site).
 * Routes: /preview/editorial-light, /preview/electric-studio
 */
export default function MockupHomePreview() {
  const [, params] = useRoute("/preview/:slug");
  const slug = params?.slug ?? "";

  let body: ReactNode = null;
  if (slug === "editorial-light") {
    body = <EditorialLightHome />;
  } else if (slug === "electric-studio") {
    body = <ElectricStudioHome />;
  } else {
    return <NotFound />;
  }

  return (
    <div className="relative min-h-screen">
      <div className="fixed top-3 left-3 z-[10000] pointer-events-none">
        <Link
          href="/"
          className="pointer-events-auto inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-secondary transition-colors"
        >
          ← Back to site
        </Link>
      </div>
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center text-muted-foreground">
            Loading preview…
          </div>
        }
      >
        {body}
      </Suspense>
    </div>
  );
}
