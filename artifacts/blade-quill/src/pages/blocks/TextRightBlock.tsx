import TextBlock from "./TextBlock";

interface Props {
  block: Record<string, unknown>;
}

/** Text Section (Right) — same fields as Text Section, column and text pre-aligned right. */
export default function TextRightBlock({ block }: Props) {
  return <TextBlock block={block} align="right" />;
}
