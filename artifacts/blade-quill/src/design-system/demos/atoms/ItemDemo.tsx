import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";

export default function ItemDemo() {
  return (
    <Item variant="outline" className="max-w-md">
      <ItemMedia variant="icon">
        <BookOpen className="w-4 h-4" />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Lheeloo &amp; Luna</ItemTitle>
        <ItemDescription>Picture book · 144 pages</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button size="sm" variant="outline">
          View
        </Button>
      </ItemActions>
    </Item>
  );
}
