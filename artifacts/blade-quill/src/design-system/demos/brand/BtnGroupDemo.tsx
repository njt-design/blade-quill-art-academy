import { Btn } from "@/components/site/Btn";
import { BtnGroup } from "@/components/site/BtnGroup";

/**
 * The ordering rule, live: children are written PRIMARY FIRST, but the
 * group renders the primary on the right at sm+ and on top when stacked.
 * Resize the preview to see the stack flip.
 */
export default function BtnGroupDemo() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs text-muted-foreground mb-2 font-mono">
          align="start" (default) — heroes, feature blocks
        </p>
        <BtnGroup>
          <Btn kind="primary" iconRight="→">
            Get the book
          </Btn>
          <Btn kind="outline">Browse the shop</Btn>
        </BtnGroup>
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-2 font-mono">
          align="center" — centered CTA sections
        </p>
        <BtnGroup align="center">
          <Btn kind="primary" iconRight="→">
            Start a class
          </Btn>
          <Btn kind="outline">See the syllabus</Btn>
          <Btn kind="ghost">Learn more</Btn>
        </BtnGroup>
      </div>
    </div>
  );
}
