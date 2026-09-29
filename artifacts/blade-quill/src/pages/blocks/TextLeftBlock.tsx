import TextBlock from "./TextBlock";

interface Props {
  block: Record<string, unknown>;
}

/** Text Section (Left) — same fields as Text Section, column and text pre-aligned left. */
export default function TextLeftBlock({ block }: Props) {
  return <TextBlock block={block} align="left" />;
}
