import { Polaroid } from "@/components/site/Polaroid";

export default function PolaroidDemo() {
  return (
    <div className="flex flex-wrap gap-10 py-4">
      <Polaroid caption="in the studio" rotate={-3} hoverStraighten>
        <img
          src="/images/squarespace/digital-paintings/gnome.jpg"
          alt="Gnome painting"
          className="block w-[180px] h-[180px] object-cover"
        />
      </Polaroid>
      <Polaroid caption="no washi tape" rotate={2} washi={false}>
        <img
          src="/images/squarespace/digital-paintings/geisha.jpg"
          alt="Geisha painting"
          className="block w-[180px] h-[180px] object-cover"
        />
      </Polaroid>
    </div>
  );
}
