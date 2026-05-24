import { Slider } from "@/components/ui/slider";

export default function SliderDemo() {
  return (
    <div className="max-w-sm">
      <Slider defaultValue={[50]} max={100} step={1} />
    </div>
  );
}
