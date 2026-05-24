import { Progress } from "@/components/ui/progress";

export default function ProgressDemo() {
  return (
    <div className="space-y-3 max-w-sm">
      <Progress value={33} />
      <Progress value={66} />
      <Progress value={100} />
    </div>
  );
}
