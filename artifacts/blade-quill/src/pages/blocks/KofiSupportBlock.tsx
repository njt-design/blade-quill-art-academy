import { ArrowUpRight, Heart } from "lucide-react";
import { SiKofi } from "react-icons/si";
import { tinaField } from "tinacms/react";
import { Btn } from "@/components/site/Btn";
import { Reveal } from "@/components/site/Reveal";
import { RichText } from "@/components/site/RichText";
import { type Block } from "./block-utils";
import { SectionHeading, bodyTextStyle, sectionAlignStyle } from "./text-style";

const DEFAULT_KOFI_URL = "https://ko-fi.com/bladeandquill";

interface Props {
  block: Block;
}

export default function KofiSupportBlock({ block }: Props) {
  return (
    <div className="px-6 md:px-8 py-6">
      <div className="mx-auto max-w-5xl">
        <Reveal className="w-full">
          <section
            className="home-panel p-6 md:p-8 text-center bg-secondary/50 w-full"
            aria-labelledby="kofi-heading"
            style={sectionAlignStyle(block)}
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brown/10 text-brown mb-3 mx-auto">
              <SiKofi className="w-6 h-6" aria-hidden />
            </div>
            <SectionHeading
              block={block}
              id="kofi-heading"
              defaultTag="h2"
              baseSize="clamp(20px, 2.5vw, 24px)"
              className="font-sans font-medium text-foreground mb-3 leading-tight"
            >
              {block.heading as string}
            </SectionHeading>
            <div style={bodyTextStyle(block)} data-tina-field={tinaField(block, "body")}>
              <RichText
                value={block.body}
                className="font-sans text-sm md:text-base text-muted-foreground reading-width mx-auto mb-5 leading-relaxed"
              />
            </div>
            {block.ctaLabel ? (
              <div data-tina-field={tinaField(block, "ctaLabel")}>
                <Btn
                  href={(block.href as string) ?? DEFAULT_KOFI_URL}
                  external
                  kind="outline"
                  size="lg"
                  iconLeft={<Heart className="w-4 h-4 text-maroon" />}
                  iconRight={<ArrowUpRight className="w-4 h-4" />}
                >
                  {block.ctaLabel as string}
                </Btn>
              </div>
            ) : null}
          </section>
        </Reveal>
      </div>
    </div>
  );
}
