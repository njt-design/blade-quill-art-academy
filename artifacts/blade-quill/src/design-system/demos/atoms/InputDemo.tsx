import { Input } from "@/components/ui/input";

export default function InputDemo() {
  return (
    <div className="space-y-3 max-w-sm">
      <Input placeholder="Default input" />
      <Input type="email" placeholder="Email input" />
      <Input disabled placeholder="Disabled" />
    </div>
  );
}
