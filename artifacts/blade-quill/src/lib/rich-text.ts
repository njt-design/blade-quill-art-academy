export type RichTextValue = {
  type: "root";
  children?: RichTextNode[];
};

type RichTextNode = {
  type?: string;
  name?: string;
  text?: string;
  bold?: boolean;
  italic?: boolean;
  props?: { text?: string; url?: string; openInNewTab?: boolean };
  children?: RichTextNode[];
};

export function isRichText(value: unknown): value is RichTextValue {
  return (
    typeof value === "object" &&
    value !== null &&
    (value as RichTextValue).type === "root"
  );
}

function flattenInline(nodes: RichTextNode[] | undefined): string {
  if (!nodes?.length) return "";
  return nodes
    .map((node) => {
      if (node.type === "text") return node.text ?? "";
      if (node.type === "break") return "\n";
      if (
        (node.type === "mdxJsxTextElement" ||
          node.type === "mdxJsxFlowElement") &&
        node.name === "ContentLink"
      ) {
        return node.props?.text ?? "";
      }
      if (node.children?.length) return flattenInline(node.children);
      return "";
    })
    .join("");
}

/** Extract plain text from a rich-text JSON tree or plain string. */
export function richTextToPlain(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (!isRichText(value)) return String(value);

  const paragraphs = (value.children ?? [])
    .map((block) => flattenInline(block.children ?? [block]).trim())
    .filter(Boolean);

  return paragraphs.join("\n\n");
}
