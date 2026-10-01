import { QuillMark } from "@/components/site/QuillMark";

/** The feather mark is white artwork — always show it on a colored tile. */
export default function QuillMarkDemo() {
  return (
    <div className="flex items-center gap-6">
      <span
        className="inline-flex items-center justify-center w-[38px] h-[38px] rounded-[10px]"
        style={{ background: "var(--g-cta)" }}
      >
        <QuillMark size={32} />
      </span>
      <span
        className="inline-flex items-center justify-center w-14 h-14 rounded-[14px]"
        style={{ background: "var(--g-cta)" }}
      >
        <QuillMark size={47} />
      </span>
      <span
        className="inline-flex items-center justify-center w-12 h-12 rounded-xl"
        style={{ background: "var(--maroon)" }}
      >
        <QuillMark size={40} />
      </span>
    </div>
  );
}
