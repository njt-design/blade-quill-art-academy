import { AspectRatio } from "@/components/ui/aspect-ratio";

export default function AspectRatioDemo() {
  return (
    <div className="max-w-xs">
      <AspectRatio ratio={16 / 9}>
        <div className="w-full h-full rounded-md bg-muted flex items-center justify-center text-sm text-muted-foreground">
          16:9
        </div>
      </AspectRatio>
    </div>
  );
}
