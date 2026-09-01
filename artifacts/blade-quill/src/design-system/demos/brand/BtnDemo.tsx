import { ArrowRight } from "lucide-react";
import { Btn } from "@/components/site/Btn";

export default function BtnDemo() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Btn kind="primary">Primary</Btn>
        <Btn kind="outline">Outline</Btn>
        <Btn kind="ghost">Ghost</Btn>
        <span className="inline-flex rounded-lg bg-[var(--brown)] p-2">
          <Btn kind="light">Light (on dark)</Btn>
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Btn size="sm">Small</Btn>
        <Btn size="md">Medium</Btn>
        <Btn size="lg">Large</Btn>
        <Btn iconRight={<ArrowRight className="w-4 h-4" />}>With arrow</Btn>
      </div>
    </div>
  );
}
