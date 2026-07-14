import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { tinaField } from "tinacms/react";
import { RichText } from "@/components/site/RichText";

interface Props {
  block: Record<string, unknown>;
}

export default function HeroBlock({ block }: Props) {
  const [, setLocation] = useLocation();

  return (
    <section
      className="py-20 md:py-28 bg-cover bg-center relative"
      style={block.backgroundImage ? { backgroundImage: `url(${block.backgroundImage})` } : undefined}
    >
      {block.backgroundImage && (
        <div className="absolute inset-0 bg-background/80" />
      )}
      <div className="container mx-auto px-4 md:px-6 max-w-3xl text-center relative z-10">
        {block.heading && (
          <h2
            className="text-3xl md:text-5xl font-heading mb-4"
            data-tina-field={tinaField(block, "heading")}
          >
            {block.heading as string}
          </h2>
        )}
        {block.subheading && (
          <div
            className="text-lg font-sans text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed"
            data-tina-field={tinaField(block, "subheading")}
          >
            <RichText value={block.subheading} />
          </div>
        )}
        {block.ctaLabel && (
          <Button
            size="lg"
            onClick={() => setLocation((block.ctaLink as string) || "/")}
            className="bg-maroon hover:bg-maroon-deep text-white px-8 cta-bold"
            data-tina-field={tinaField(block, "ctaLabel")}
          >
            {block.ctaLabel as string} <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </section>
  );
}
