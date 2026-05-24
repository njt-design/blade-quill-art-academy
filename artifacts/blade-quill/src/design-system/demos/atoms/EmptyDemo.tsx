import { Empty, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import { Inbox } from "lucide-react";

export default function EmptyDemo() {
  return (
    <Empty className="border">
      <EmptyMedia>
        <Inbox className="w-10 h-10 text-muted-foreground" />
      </EmptyMedia>
      <EmptyTitle>No items found</EmptyTitle>
      <EmptyDescription>Try adjusting your search or filters.</EmptyDescription>
    </Empty>
  );
}
