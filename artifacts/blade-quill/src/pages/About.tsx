import { Brush, Palette, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function About() {
  const [, setLocation] = useLocation();

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
            />
          </div>

          <div className="w-full lg:w-1/2">
            <h1 className="text-5xl font-display text-primary mb-8">About Corinne</h1>
            
            <div className="prose prose-invert prose-lg max-w-none text-muted-foreground">
              <p className="lead text-xl text-foreground font-light mb-6">
                I am an author, illustrator, and digital art educator with a passion for bringing characters to life.
              </p>
              
              <p className="mb-6">
                Through Blade & Quill Art Academy, my mission is to demystify digital art software. I know firsthand how intimidating tools like Krita can feel when you just want to paint. That's why I create tutorials, guides, and curriculums designed to help you focus on your creativity, rather than fighting the interface.
              </p>

              <p className="mb-8">
                I'm also the creator of the whimsical cartoon universe of Lheeloo & Luna. When I'm not recording videos or writing quick-start guides, I'm usually lost in my own canvas, experimenting with new brushes and techniques.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 border-y border-border/50 py-8">
              <div className="text-center">
                <Brush className="w-8 h-8 text-primary mx-auto mb-3" />
                <h4 className="font-display font-semibold text-foreground">Illustration</h4>
              </div>
              <div className="text-center border-l sm:border-x border-border/50 border-t sm:border-t-0 pt-6 sm:pt-0 mt-6 sm:mt-0">
                <Monitor className="w-8 h-8 text-primary mx-auto mb-3" />
                <h4 className="font-display font-semibold text-foreground">Digital Education</h4>
              </div>
              <div className="text-center border-t sm:border-t-0 pt-6 sm:pt-0 mt-6 sm:mt-0">
                <Palette className="w-8 h-8 text-primary mx-auto mb-3" />
                <h4 className="font-display font-semibold text-foreground">Character Design</h4>
              </div>
            </div>

            <div className="flex gap-4">
              <Button onClick={() => setLocation("/contact")}>Get in Touch</Button>
              <Button variant="outline" onClick={() => setLocation("/gallery")}>View Gallery</Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
