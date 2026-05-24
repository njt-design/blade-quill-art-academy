import { Label } from "@/components/ui/label";

export default function LabelDemo() {
  return (
    <div className="space-y-2">
      <Label htmlFor="demo-input">Email address</Label>
      <input id="demo-input" className="border border-border rounded px-2 py-1 text-sm" placeholder="you@example.com" />
    </div>
  );
}
