import { Separator } from "@/components/ui/separator";

export default function SeparatorDemo() {
  return (
    <div className="space-y-2 max-w-sm">
      <p className="text-sm">Above separator</p>
      <Separator />
      <p className="text-sm">Below separator</p>
    </div>
  );
}
