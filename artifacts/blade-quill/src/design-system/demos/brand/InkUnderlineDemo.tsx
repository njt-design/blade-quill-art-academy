import { InkUnderline } from "@/components/site/InkUnderline";

export default function InkUnderlineDemo() {
  return (
    <div className="flex flex-wrap gap-10">
      <span className="inline-block">
        <span className="font-medium">Active nav link</span>
        <InkUnderline />
      </span>
      <span className="inline-block">
        <span className="font-medium">Gold accent</span>
        <InkUnderline color="var(--gold-deep)" />
      </span>
    </div>
  );
}
