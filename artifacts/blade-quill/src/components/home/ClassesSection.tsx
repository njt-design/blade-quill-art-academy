import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { tinaField } from "tinacms/react";
import { RichText } from "@/components/site/RichText";
import { SectionReveal, SectionRevealItem, SectionRevealStagger } from "./SectionReveal";
import { StickyTwoColumn } from "./StickyTwoColumn";

export type ClassesSectionContent = {
  eyebrow?: string | null;
  heading?: string | null;
  subheading?: string | null;
  body?: string | null;
  bullets?: (string | null)[] | null;
  ctaLabel?: string | null;
  ctaLink?: string | null;
  metaTags?: string | null;
  image?: string | null;
};

type Props = {
  content?: ClassesSectionContent | null;
  onNavigate: (path: string) => void;
};

const DEFAULT_BULLETS = [
  "Beginner-friendly Krita curriculum",
  "Step-by-step lessons with downloadable resources",
  "Build confidence from sketch to finished painting",
];

export function ClassesSection({ content, onNavigate }: Props) {
  const bullets =
    content?.bullets?.filter((b): b is string => Boolean(b)) ?? DEFAULT_BULLETS;
  const ctaLink = content?.ctaLink || "/classes";
  const imageSrc = content?.image || "/images/about-portrait.png";

  return (
    <SectionReveal className="home-section bg-secondary/40">
      <div className="container mx-auto px-4 md:px-6">
        <div className="home-panel p-6 md:p-10 lg:p-12 max-w-5xl mx-auto">
          <StickyTwoColumn
            leftClassName="order-2 lg:order-1 lg:-mr-4"
            rightClassName="order-1 lg:order-2 text-center lg:text-left"
            left={
              <div className="home-media-mask !m-0 !rounded-3xl group max-w-sm mx-auto lg:mx-0">
                <div className="aspect-[4/5]">
                  <img
                    src={imageSrc}
                    alt=""
                    className="w-full h-full object-cover"
                    data-tina-field={tinaField(content, "image")}
                  />
                </div>
              </div>
            }
            right={
              <>
                <p
                  className="text-xs uppercase tracking-[0.2em] font-semibold text-orange mb-3"
                  data-tina-field={tinaField(content, "eyebrow")}
                >
                  {content?.eyebrow || "Now Enrolling"}
                </p>
                <h2
                  className="text-2xl md:text-3xl lg:text-4xl font-heading mb-3 leading-tight"
                  data-tina-field={tinaField(content, "heading")}
                >
                  {content?.heading || "Enroll in My Krita Education Classes"}
                </h2>
                <div
                  className="font-subheading text-lg text-muted-foreground mb-4"
                  data-tina-field={tinaField(content, "subheading")}
                >
                  <RichText value={content?.subheading} />
                </div>
                {content?.body && (
                  <div
                    className="text-sm text-muted-foreground mb-6 reading-width mx-auto lg:mx-0"
                    data-tina-field={tinaField(content, "body")}
                  >
                    <RichText value={content.body} />
                  </div>
                )}

                <SectionRevealStagger className="space-y-4 mb-8 text-left max-w-md mx-auto lg:mx-0">
                  {bullets.map((bullet, i) => (
                    <SectionRevealItem key={i}>
                      <div className="flex items-start gap-3 text-sm">
                        <Check className="w-4 h-4 text-orange shrink-0 mt-0.5" />
                        <span>{bullet}</span>
                      </div>
                    </SectionRevealItem>
                  ))}
                </SectionRevealStagger>

                <Button
                  size="lg"
                  onClick={() => onNavigate(ctaLink)}
                  className="rounded-full bg-orange hover:bg-amber text-white px-8 cta-bold mb-4"
                  data-tina-field={tinaField(content, "ctaLabel")}
                >
                  {content?.ctaLabel || "Reserve Your Spot"}{" "}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>

                <p
                  className="text-xs text-muted-foreground uppercase tracking-wider"
                  data-tina-field={tinaField(content, "metaTags")}
                >
                  {content?.metaTags || "Self-paced · Krita 5.2 · All skill levels"}
                </p>
              </>
            }
          />
        </div>
      </div>
    </SectionReveal>
  );
}
