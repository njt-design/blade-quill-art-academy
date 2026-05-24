import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { tinaField } from "tinacms/react";
import { Marquee } from "./Marquee";
import { SectionReveal } from "./SectionReveal";

export type NewsletterSectionContent = {
  heading?: string | null;
  subheading?: string | null;
  placeholderText?: string | null;
  ctaLabel?: string | null;
  privacyNote?: string | null;
};

type Props = {
  content?: NewsletterSectionContent | null;
};

const NEWSLETTER_MARQUEE = [
  "Join 2,000+ artists",
  "Free weekly tutorials",
  "No spam",
];

export function NewsletterSection({ content }: Props) {
  const { toast } = useToast();
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast({
      title: "Thanks! We'll be in touch.",
      description: "You're on the list for art tips and class updates.",
    });
    setEmail("");
  };

  return (
    <SectionReveal className="home-section bg-foreground text-background !pt-0">
      <Marquee
        className="border-y border-background/10 py-3 font-subheading text-xs uppercase tracking-[0.2em] text-background/70"
        speed="medium"
      >
        {NEWSLETTER_MARQUEE.map((line) => (
          <span key={line} className="whitespace-nowrap">
            {line} <span className="opacity-50">·</span>
          </span>
        ))}
      </Marquee>

      <div className="container mx-auto px-4 md:px-6 max-w-2xl pt-16 md:pt-20">
        <div className="home-panel border border-background/10 bg-background/5 p-8 md:p-12 text-center">
          <h2
            className="text-2xl md:text-3xl font-heading mb-3"
            data-tina-field={tinaField(content, "heading")}
          >
            {content?.heading || "Stay in the Loop"}
          </h2>
          <p
            className="text-sm font-subheading opacity-80 mb-8 reading-width mx-auto"
            data-tina-field={tinaField(content, "subheading")}
          >
            {content?.subheading ||
              "Get art tips, new tutorials, and class announcements delivered to your inbox."}
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto sm:rounded-full sm:overflow-hidden sm:p-1 sm:bg-background/10 sm:border sm:border-background/10"
          >
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={content?.placeholderText || "you@example.com"}
              className="rounded-full bg-background text-foreground border-border flex-1 h-12"
              data-tina-field={tinaField(content, "placeholderText")}
              aria-label="Email address"
            />
            <Button
              type="submit"
              size="lg"
              className="rounded-full bg-orange hover:bg-amber text-white shrink-0 cta-bold h-12 px-8"
              data-tina-field={tinaField(content, "ctaLabel")}
            >
              {content?.ctaLabel || "Subscribe"}
            </Button>
          </form>

          <p
            className="text-xs opacity-60 mt-4"
            data-tina-field={tinaField(content, "privacyNote")}
          >
            {content?.privacyNote || "No spam. Unsubscribe anytime."}
          </p>
        </div>
      </div>
    </SectionReveal>
  );
}
