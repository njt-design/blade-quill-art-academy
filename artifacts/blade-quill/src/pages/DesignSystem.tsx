import { DesignSystemLayout } from "@/design-system/components/DesignSystemLayout";
import { StickyNav } from "@/design-system/components/StickyNav";
import { OrganismsSection } from "@/design-system/sections/OrganismsSection";
import { MoleculesSection } from "@/design-system/sections/MoleculesSection";
import { AtomsSection } from "@/design-system/sections/AtomsSection";
import { TokensSection } from "@/design-system/sections/TokensSection";
import { registry, getEntries } from "@/design-system/registry";

export default function DesignSystem() {
  const organisms = getEntries("organism");
  const molecules = getEntries("molecule");
  const atoms = getEntries("atom");

  return (
    <DesignSystemLayout sidebar={<StickyNav entries={registry} />}>
      <OrganismsSection entries={organisms} />
      <MoleculesSection entries={molecules} />
      <AtomsSection entries={atoms} />
      <TokensSection />
    </DesignSystemLayout>
  );
}
