import { useState } from "react";
import { WordReveal } from "@/components/site/WordReveal";
import { Button } from "@/components/ui/button";

export default function WordRevealDemo() {
  const [key, setKey] = useState(0);
  return (
    <div className="space-y-4">
      <h1 className="text-3xl md:text-4xl">
        <WordReveal key={key} text="Words rise one by one" />
      </h1>
      <Button variant="outline" size="sm" onClick={() => setKey((k) => k + 1)}>
        Replay
      </Button>
    </div>
  );
}
