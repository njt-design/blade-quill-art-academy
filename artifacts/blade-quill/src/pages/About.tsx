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
      ctaSecondary
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
    <div className="min-h-screen pt-24 pb-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          <div className="w-full lg:w-1/2 relative">
            <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full opacity-50"></div>
            <img 
              src={`${import.meta.env.BASE_URL}images/about-portrait.png`}
              alt="Corinne working"
              className="w-full max-w-md mx-auto rounded-3xl shadow-2xl border-2 border-white/5 relative z-10"
              data-tina-field={tinaField(content, "portraitImage")}
            />
          </div>

          <div className="w-full lg:w-1/2">
            <h1
              className="text-5xl font-display text-primary mb-8"
              data-tina-field={tinaField(content, "pageTitle")}
            >
              {content?.pageTitle}
            </h1>
            
            <div className="prose prose-invert prose-lg max-w-none text-muted-foreground">
              <p
                className="lead text-xl text-foreground font-light mb-6"
                data-tina-field={tinaField(content, "leadText")}
              >
                {content?.leadText}
              </p>
              
              <p
                className="mb-6"
                data-tina-field={tinaField(content, "paragraph1")}
              >
                {content?.paragraph1}
              </p>

              <p
                className="mb-8"
                data-tina-field={tinaField(content, "paragraph2")}
              >
                {content?.paragraph2}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 border-y border-border/50 py-8">
              <div className="text-center">
                <Brush className="w-8 h-8 text-primary mx-auto mb-3" />
                <h4
                  className="font-display font-semibold text-foreground"
                  data-tina-field={tinaField(content, "skill1Label")}
                >
                  {content?.skill1Label}
                </h4>
              </div>
              <div className="text-center border-l sm:border-x border-border/50 border-t sm:border-t-0 pt-6 sm:pt-0 mt-6 sm:mt-0">
                <Monitor className="w-8 h-8 text-primary mx-auto mb-3" />
                <h4
                  className="font-display font-semibold text-foreground"
                  data-tina-field={tinaField(content, "skill2Label")}
                >
                  {content?.skill2Label}
                </h4>
              </div>
              <div className="text-center border-t sm:border-t-0 pt-6 sm:pt-0 mt-6 sm:mt-0">
                <Palette className="w-8 h-8 text-primary mx-auto mb-3" />
                <h4
                  className="font-display font-semibold text-foreground"
                  data-tina-field={tinaField(content, "skill3Label")}
                >
                  {content?.skill3Label}
                </h4>
              </div>
            </div>

            <div className="flex gap-4">
              <Button onClick={() => setLocation("/contact")}>
                {content?.ctaPrimary || "Get in Touch"}
              </Button>
              <Button variant="outline" onClick={() => setLocation("/gallery")}>
                {content?.ctaSecondary || "View Gallery"}
              </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
