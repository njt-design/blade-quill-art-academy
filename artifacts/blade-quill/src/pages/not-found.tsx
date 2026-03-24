import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <AlertCircle className="h-10 w-10 text-orange mx-auto mb-4" />
        <h1 className="text-4xl font-display mb-2">404</h1>
        <p className="text-muted-foreground mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button onClick={() => setLocation("/")} className="bg-foreground text-background hover:bg-foreground/90">
          Go Home
        </Button>
      </div>
    </div>
  );
}
