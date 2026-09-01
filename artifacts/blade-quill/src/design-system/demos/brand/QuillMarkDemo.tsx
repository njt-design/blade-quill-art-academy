import { QuillMark } from "@/components/site/QuillMark";

export default function QuillMarkDemo() {
  return (
    <div className="flex items-center gap-6">
      <QuillMark size={20} />
      <QuillMark size={32} color="var(--maroon)" />
      <span
        className="inline-flex items-center justify-center w-12 h-12 rounded-xl"
        style={{ background: "var(--g-cta)", color: "var(--paper)" }}
      >
        <QuillMark size={24} />
      </span>
    </div>
  );
}
