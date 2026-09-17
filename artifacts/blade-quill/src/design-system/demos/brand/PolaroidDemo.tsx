import { Polaroid } from "@/components/site/Polaroid";

export default function PolaroidDemo() {
  return (
    <div className="flex flex-wrap gap-10 py-4">
      <Polaroid caption="in the studio" hoverLift>
        <img
          src="/images/squarespace/digital-paintings/gnome.jpg"
          alt="Gnome painting"
          className="block w-[180px] h-auto"
        />
      </Polaroid>
      <Polaroid>
        <img
          src="/images/squarespace/digital-paintings/geisha.jpg"
          alt="Geisha painting"
          className="block w-[180px] h-auto"
        />
      </Polaroid>
    </div>
  );
}
