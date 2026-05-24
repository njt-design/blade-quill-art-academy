import { Kbd } from "@/components/ui/kbd";

export default function KbdDemo() {
  return (
    <div className="flex gap-2 items-center text-sm">
      <span>Press</span>
      <Kbd>Ctrl</Kbd>
      <span>+</span>
      <Kbd>K</Kbd>
      <span>to search</span>
    </div>
  );
}
