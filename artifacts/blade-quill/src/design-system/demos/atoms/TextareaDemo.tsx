import { Textarea } from "@/components/ui/textarea";

export default function TextareaDemo() {
  return (
    <div className="space-y-3 max-w-sm">
      <Textarea placeholder="Write something..." />
      <Textarea disabled placeholder="Disabled textarea" />
    </div>
  );
}
