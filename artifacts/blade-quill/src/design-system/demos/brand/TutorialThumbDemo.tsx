import { TutorialThumb } from "@/components/site/TutorialThumb";

export default function TutorialThumbDemo() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl video-card">
      <TutorialThumb
        title="Painting light in Krita"
        duration="14:22"
        palette="twilight"
      />
      <TutorialThumb
        title="Chibi character basics"
        duration="08:07"
        src="/images/squarespace/digital-paintings/chibi-dragon.png"
      />
    </div>
  );
}
