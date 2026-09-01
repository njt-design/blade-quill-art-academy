import { useState } from "react";
import { DesignSystemLayout } from "@/design-system/components/DesignSystemLayout";
import { StickyNav } from "@/design-system/components/StickyNav";
import { ViewToggle } from "@/design-system/components/ViewToggle";
import { EntriesSection } from "@/design-system/sections/EntriesSection";
import { TokensSection } from "@/design-system/sections/TokensSection";
import { MediaGuideSection } from "@/design-system/sections/MediaGuideSection";
import { getViewSections, type ViewMode } from "@/design-system/views";
import { registry } from "@/design-system/registry";

export default function DesignSystem() {
  // Default is the client-friendly size view; ?view=page|atomic overrides.
  const [view, setView] = useState<ViewMode>(() => {
    if (typeof window === "undefined") return "size";
    const param = new URLSearchParams(window.location.search).get("view");
    return param === "page" || param === "atomic" || param === "size"
      ? param
      : "size";
  });
  const sections = getViewSections(view, registry);

  return (
    <DesignSystemLayout
      sidebar={
        <StickyNav sections={sections} view={view} onViewChange={setView} />
      }
    >
      {/* Sidebar is desktop-only; keep the toggle reachable on mobile. */}
      <div className="lg:hidden">
        <ViewToggle view={view} onChange={setView} />
      </div>
      {sections.map((section) => (
        <EntriesSection
          key={section.id}
          id={section.id}
          title={section.title}
          intro={section.intro}
          entries={section.entries}
        />
      ))}
      <TokensSection />
      <MediaGuideSection />
    </DesignSystemLayout>
  );
}
