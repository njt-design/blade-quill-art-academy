import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";

export default function CarouselDemo() {
  return (
    <Carousel className="max-w-xs mx-auto">
      <CarouselContent>
        {[1, 2, 3, 4].map((n) => (
          <CarouselItem key={n}>
            <div className="flex h-32 items-center justify-center rounded-md border border-border bg-muted">
              <span className="text-2xl font-medium">{n}</span>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
