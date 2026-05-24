import { ScrollArea } from "@/components/ui/scroll-area";

export default function ScrollAreaDemo() {
  return (
    <ScrollArea className="h-48 w-64 rounded-md border border-border p-4">
      {Array.from({ length: 20 }, (_, i) => (
        <p key={i} className="text-sm py-1 border-b border-border/50">
          Item {i + 1}
        </p>
      ))}
    </ScrollArea>
  );
}
