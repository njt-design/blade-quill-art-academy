import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function ToastDemo() {
  const { toast } = useToast();
  return (
    <div className="flex flex-wrap gap-3">
      <Button
        variant="outline"
        onClick={() =>
          toast({
            title: "Saved",
            description: "Your changes are live.",
          })
        }
      >
        Show toast
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast({
            variant: "destructive",
            title: "Something went wrong",
            description: "Please try again.",
          })
        }
      >
        Show error toast
      </Button>
    </div>
  );
}
