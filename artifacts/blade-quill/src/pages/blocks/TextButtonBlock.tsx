import { useLocation } from "wouter";
import { tinaField } from "tinacms/react";
import { Btn } from "@/components/site/Btn";
import { RichText } from "@/components/site/RichText";
import { type Block, followLink, isExternalLink } from "./block-utils";

interface Props {
  block: Block;
}

/** Button-only mode: where the lone button sits (`buttonAlign` field). */
const BUTTON_ONLY_ALIGN: Record<string, string> = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
};

export default function TextButtonBlock({ block }: Props) {
  const [, setLocation] = useLocation();
  const isCentered = block.layout === "centered";
  // "Show Text" defaults on; older blocks saved before the toggle existed have
  // it undefined. Empty text also collapses to button-only so nothing gaps.
  const showText = block.showText !== false && Boolean(block.body);
  const style = (block.buttonStyle as string) || "primary";
  const kind: "primary" | "outline" | "ghost" =
    style === "outline" ? "outline" : style === "link" ? "ghost" : "primary";
  const link = block.buttonLink as string | undefined;
  const external = isExternalLink(link);
  const icon = external ? "↗" : style === "outline" ? undefined : "→";

  // Button-only is a light element meant to be dropped anywhere on the page,
  // so it takes less vertical room than the text + button pairing.
  const layoutClass = !showText
    ? `flex-row ${BUTTON_ONLY_ALIGN[(block.buttonAlign as string) ?? ""] ?? "justify-center"}`
    : isCentered
      ? "flex-col items-center text-center"
      : "flex-col md:flex-row items-center justify-between";

  return (
    <section className={showText ? "py-12" : "py-6"}>
      <div className={`container mx-auto px-4 md:px-6 flex gap-6 ${layoutClass}`}>
        {showText ? (
          <div
            className="prose prose-neutral max-w-2xl"
            data-tina-field={tinaField(block, "body")}
          >
            <RichText value={block.body} />
          </div>
        ) : null}
        {block.buttonLabel ? (
          external ? (
            <Btn
              kind={kind}
              size="lg"
              href={link}
              external
              iconRight={icon}
              className="shrink-0"
            >
              <span data-tina-field={tinaField(block, "buttonLabel")}>
                {block.buttonLabel as string}
              </span>
            </Btn>
          ) : (
            <Btn
              kind={kind}
              size="lg"
              iconRight={icon}
              className="shrink-0"
              onClick={() => followLink(setLocation, link, "/")}
            >
              <span data-tina-field={tinaField(block, "buttonLabel")}>
                {block.buttonLabel as string}
              </span>
            </Btn>
          )
        ) : null}
      </div>
    </section>
  );
}
