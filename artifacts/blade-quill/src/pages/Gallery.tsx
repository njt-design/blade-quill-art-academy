import { useListGallery } from "@workspace/api-client-react";
import { useTina, tinaField } from "tinacms/react";
import galleryData from "../../content/gallery.json";
const TINA_DATA_GALLERYDATA = { gallery: galleryData };

const galleryQuery = `
  query gallery($relativePath: String!) {
    gallery(relativePath: $relativePath) {
      pageTitle
      pageDescription
      items {
        id
        title
        description
        imageUrl
      }
    }
  }
`;

export default function Gallery() {
  const { data: galleryItems, isLoading } = useListGallery();

  const { data } = useTina({
    query: galleryQuery,
    variables: { relativePath: "gallery.json" },
    data: TINA_DATA_GALLERYDATA,
  });

  const content = data.gallery;

  return (
    <div className="min-h-screen py-10">
      <div className="container mx-auto px-4 md:px-6">

        <div className="max-w-2xl mb-10">
          <h1
            className="text-3xl md:text-4xl font-display mb-3"
            data-tina-field={tinaField(content, "pageTitle")}
          >
            {content?.pageTitle}
          </h1>
          <p
            className="text-muted-foreground"
            data-tina-field={tinaField(content, "pageDescription")}
          >
            {content?.pageDescription}
          </p>
        </div>

        {isLoading ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-muted rounded-lg aspect-[3/4] break-inside-avoid" />
            ))}
          </div>
        ) : galleryItems && galleryItems.length > 0 ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {galleryItems.map((item) => (
              <div key={item.id} className="break-inside-avoid group rounded-lg overflow-hidden border border-border/50 relative">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-auto"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <h3 className="text-white font-medium text-sm">{item.title}</h3>
                  {item.description && (
                    <p className="text-white/70 text-xs mt-0.5">{item.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-border rounded-lg">
            <h3 className="text-xl font-display text-muted-foreground">Gallery is empty</h3>
          </div>
        )}
      </div>
    </div>
  );
}
