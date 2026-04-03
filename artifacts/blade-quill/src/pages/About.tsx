import { Brush, Palette, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useTina, tinaField } from "tinacms/react";
import aboutData from "../../content/about.json";
const TINA_DATA_ABOUTDATA = { about: aboutData };

const aboutQuery = `
  query about($relativePath: String!) {
    about(relativePath: $relativePath) {
      pageTitle
      portraitImage
      leadText
      paragraph1
      paragraph2
      skill1Label
      skill2Label
      skill3Label
      ctaPrimary
      ctaPrimaryLink
      ctaSecondary
      ctaSecondaryLink
    }
  }
`;

export default function About() {
  const [, setLocation] = useLocation();

  const { data } = useTina({
    query: aboutQuery,
    variables: { relativePath: "about.json" },
    data: TINA_DATA_ABOUTDATA,
  });

  const content = data.about;

  return (
    <div className="min-h-screen py-10">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <div className="flex flex-col lg:flex-row gap-12 items-start">

          <div className="w-full lg:w-2/5 shrink-0">
            <img
              src={content?.portraitImage || `${import.meta.env.BASE_URL}images/about-portrait.png`}
              alt="Corinne working"
              className="w-full rounded-lg border border-border"
              data-tina-field={tinaField(content, "portraitImage")}
            />
          </div>

          <div className="w-full lg:w-3/5">
            <h1
              className="text-3xl md:text-4xl font-display mb-6"
              data-tina-field={tinaField(content, "pageTitle")}
            >
              {content?.pageTitle}
            </h1>

            <div className="reading-width space-y-4 text-muted-foreground">
              <p
                className="text-lg text-foreground leading-relaxed"
                data-tina-field={tinaField(content, "leadText")}
              >
                {content?.leadText}
              </p>
              <p data-tina-field={tinaField(content, "paragraph1")}>{content?.paragraph1}</p>
              <p data-tina-field={tinaField(content, "paragraph2")}>{content?.paragraph2}</p>
            </div>

            <div className="grid grid-cols-3 gap-4 my-8 py-6 border-y border-border">
              <div className="text-center">
                <Brush className="w-6 h-6 text-orange mx-auto mb-2" />
                <h4
                  className="text-sm font-semibold"
                  data-tina-field={tinaField(content, "skill1Label")}
                >
                  {content?.skill1Label}
                </h4>
              </div>
              <div className="text-center border-x border-border">
                <Monitor className="w-6 h-6 text-violet mx-auto mb-2" />
                <h4
                  className="text-sm font-semibold"
                  data-tina-field={tinaField(content, "skill2Label")}
                >
                  {content?.skill2Label}
                </h4>
              </div>
              <div className="text-center">
                <Palette className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                <h4
                  className="text-sm font-semibold"
                  data-tina-field={tinaField(content, "skill3Label")}
                >
                  {content?.skill3Label}
                </h4>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setLocation(content?.ctaPrimaryLink || "/contact")}
                className="bg-orange hover:bg-amber text-white cta-bold"
                data-tina-field={tinaField(content, "ctaPrimary")}
              >
                {content?.ctaPrimary || "Get in Touch"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setLocation(content?.ctaSecondaryLink || "/gallery")}
                data-tina-field={tinaField(content, "ctaSecondary")}
              >
                {content?.ctaSecondary || "View Gallery"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
