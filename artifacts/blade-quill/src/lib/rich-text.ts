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

const BLANK_LINE_BLOCKS = new Set(["p", "h1", "h2", "h3", "h4", "h5", "h6"]);

function isBlankInline(nodes: RichTextNode[] | undefined): boolean {
  if (!nodes?.length) return true;
  return nodes.every(
    (node) =>
      (node.type === undefined || node.type === "text") &&
      typeof node.text === "string" &&
      node.text.trim() === "",
  );
}

function preserveBlankLinesInNodes(nodes: RichTextNode[]): RichTextNode[] {
  return nodes.map((node) => {
    if (node.type === "code_block") return node;
    if (BLANK_LINE_BLOCKS.has(node.type ?? "") && isBlankInline(node.children)) {
      return { ...node, children: [{ type: "break" }] };
    }
    if (node.children?.length) {
      return { ...node, children: preserveBlankLinesInNodes(node.children) };
    }
    return node;
  });
}

/**
 * Editors add breathing room by pressing Enter twice, which Tina stores as an
 * empty paragraph (`{ type: "p", children: [{ text: "" }] }`). TinaMarkdown
 * renders that as a literal `<p></p>` — zero height, margins collapsed into
 * its neighbours — so the gap silently disappears on the public site.
 *
 * This swaps blank paragraphs/headings for `<p><br /></p>` so a blank line
 * in the CMS is a blank line on the page. Non-rich-text values pass through.
 */
export function preserveBlankLines<T>(value: T): T {
  if (!isRichText(value) || !value.children?.length) return value;
  return { ...value, children: preserveBlankLinesInNodes(value.children) } as T;
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
