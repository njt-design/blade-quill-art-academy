import CtaBandBlock from "@/pages/blocks/CtaBandBlock";
import { ctaBandBlockLight, ctaBandBlockDark } from "@/design-system/fixtures/blocks";

export default function CtaBandBlockDemo() {
  return (
    <div className="space-y-4">
      <CtaBandBlock block={ctaBandBlockLight} />
      <CtaBandBlock block={ctaBandBlockDark} />
    </div>
  );
}
