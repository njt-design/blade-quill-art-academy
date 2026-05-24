import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";

export default function HoverCardDemo() {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link">@blade_quill</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-64">
        <p className="text-sm">Art education brand — tutorials, downloads, and original artwork.</p>
      </HoverCardContent>
    </HoverCard>
  );
}
