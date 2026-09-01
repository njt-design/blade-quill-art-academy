import { DesignSystemLayout } from "@/design-system/components/DesignSystemLayout";
import { StickyNav } from "@/design-system/components/StickyNav";
import { EntriesSection } from "@/design-system/sections/EntriesSection";
import { TokensSection } from "@/design-system/sections/TokensSection";
import { MediaGuideSection } from "@/design-system/sections/MediaGuideSection";
import { registry, getEntries } from "@/design-system/registry";

export default function DesignSystem() {
  const blocks = getEntries("block");
  const brand = getEntries("brand");
  const molecules = getEntries("molecule");
  const atoms = getEntries("atom");

  return (
    <DesignSystemLayout sidebar={<StickyNav entries={registry} />}>
      <EntriesSection
        id="blocks"
        title="Page Blocks"
        intro="Every section available under “Add Section” in the Tina editor — all 39, rendered exactly as they appear on the live site. Each one lists its admin specs: image sizes, character limits, and where it's used."
        entries={blocks}
      />
      <EntriesSection
        id="brand"
        title="Brand Components"
        intro="Site chrome and the reusable brand pieces that give Blade & Quill its look — buttons, art frames, polaroids, and motion accents."
        entries={brand}
      />
      <EntriesSection id="molecules" title="Molecules" entries={molecules} />
      <EntriesSection id="atoms" title="Atoms" entries={atoms} />
      <TokensSection />
      <MediaGuideSection />
    </DesignSystemLayout>
  );
}
