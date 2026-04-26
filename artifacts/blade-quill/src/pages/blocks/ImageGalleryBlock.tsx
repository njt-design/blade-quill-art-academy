import { tinaField } from "tinacms/react";

interface GalleryImage {
  src?: string;
  alt?: string;
  caption?: string;
}

interface Props {
  block: Record<string, unknown>;
}

export default function ImageGalleryBlock({ block }: Props) {
  const images = (block.images as GalleryImage[]) ?? [];

  return (
    <section className="py-12">
      <div className="container mx-auto px-4 md:px-6">
        {block.heading && (
          <h2
            className="text-2xl md:text-3xl font-heading mb-8"
            data-tina-field={tinaField(block, "heading")}
          >
            {block.heading as string}
          </h2>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((img, i) => (
            <div key={i} className="gumroad-card overflow-hidden group">
              {img.src && (
                <div className="aspect-square overflow-hidden">
                  <img
                    src={img.src}
                    alt={img.alt || ""}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              {img.caption && (
                <p className="p-3 text-sm text-muted-foreground">{img.caption}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
