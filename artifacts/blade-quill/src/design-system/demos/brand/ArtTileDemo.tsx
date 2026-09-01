import { ArtTile } from "@/components/site/ArtTile";

export default function ArtTileDemo() {
  return (
    <div className="flex flex-wrap items-end gap-4">
      <ArtTile
        src="/images/squarespace/digital-paintings/chibi-dragon.png"
        alt="Chibi dragon"
        label="with image"
        width={160}
        height={160}
      />
      <ArtTile palette="warm" label="warm" width={120} height={120} />
      <ArtTile palette="twilight" label="twilight" width={120} height={120} />
      <ArtTile palette="paper" label="paper" width={120} height={120} />
      <ArtTile palette="ink" label="ink" width={120} height={120} rotate={-3} />
    </div>
  );
}
