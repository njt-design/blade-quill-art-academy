import { BookCover } from "@/components/site/BookCover";

export default function BookCoverDemo() {
  return (
    <div className="flex flex-wrap items-end gap-8 py-2">
      <BookCover
        src="/images/puzzle-book-front.png"
        alt="Puzzle book cover"
        width={150}
        height={210}
      />
      <BookCover
        title="Lheeloo & Luna"
        vol="VOL. 1"
        subtitle="C. HADAWAY"
        badge="NEW"
        palette="rose"
        width={150}
        height={210}
        rotate={2}
      />
      <BookCover
        title="Sketchbook"
        subtitle="C. HADAWAY"
        palette="warm"
        width={150}
        height={210}
      />
    </div>
  );
}
