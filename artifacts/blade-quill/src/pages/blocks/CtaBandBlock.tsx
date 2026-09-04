import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { tinaField } from "tinacms/react";
import { RichText } from "@/components/site/RichText";
import { SectionHeading, bodyTextStyle, sectionAlignStyle } from "./text-style";

interface Props {
  block: Record<string, unknown>;
}

export default function CtaBandBlock({ block }: Props) {
  const [, setLocation] = useLocation();
  const isDark = block.variant === "dark";

  return (
    <section className={`py-12 ${isDark ? "bg-foreground text-background" : "bg-secondary/40"}`}>
      <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div style={sectionAlignStyle(block)}>
          {block.heading && (
            <SectionHeading
              block={block}
              defaultTag="h2"
              baseSize="clamp(20px, 2.5vw, 24px)"
              className="font-heading mb-1"
            >
              {block.heading as string}
            </SectionHeading>
          )}
          {block.description && (
            <div
              className={`text-sm font-sans ${isDark ? "opacity-70" : "text-muted-foreground"}`}
              style={bodyTextStyle(block)}
              data-tina-field={tinaField(block, "description")}
            >
              <RichText value={block.description} />
            </div>
          )}
        </div>
        {block.ctaLabel && (
          <Button
            size="lg"
            onClick={() => setLocation((block.ctaLink as string) || "/")}
            className="shrink-0"
            data-tina-field={tinaField(block, "ctaLabel")}
          >
            {block.ctaLabel as string} <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </section>
  );
}
