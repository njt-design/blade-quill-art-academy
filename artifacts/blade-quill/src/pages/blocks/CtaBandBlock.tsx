import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { tinaField } from "tinacms/react";

interface Props {
  block: Record<string, unknown>;
}

export default function CtaBandBlock({ block }: Props) {
  const [, setLocation] = useLocation();
  const isDark = block.variant === "dark";

  return (
    <section className={`py-12 ${isDark ? "bg-foreground text-background" : "bg-secondary/40"}`}>
      <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          {block.heading && (
            <h2
              className="text-xl md:text-2xl font-display mb-1"
              data-tina-field={tinaField(block, "heading")}
            >
              {block.heading as string}
            </h2>
          )}
          {block.description && (
            <p
              className={`text-sm ${isDark ? "opacity-70" : "text-muted-foreground"}`}
              data-tina-field={tinaField(block, "description")}
            >
              {block.description as string}
            </p>
          )}
        </div>
        {block.ctaLabel && (
          <Button
            size="lg"
            onClick={() => setLocation((block.ctaLink as string) || "/")}
            className="bg-orange hover:bg-amber text-white shrink-0 cta-bold"
            data-tina-field={tinaField(block, "ctaLabel")}
          >
            {block.ctaLabel as string} <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </section>
  );
}
