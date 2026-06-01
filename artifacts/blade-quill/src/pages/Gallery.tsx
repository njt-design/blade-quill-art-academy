import { useState, useCallback } from "react";
import { X } from "lucide-react";
import { useListGallery, type GalleryItem } from "@workspace/api-client-react";
import { asArray } from "@/lib/api-helpers";
import { FALLBACK_GALLERY } from "@/lib/fallback-data";
import { useTina, tinaField } from "tinacms/react";
import { RichText } from "@/components/site/RichText";
import galleryData from "../../content/gallery.json";
const TINA_DATA_GALLERYDATA = { gallery: galleryData };

const galleryQuery = `
  query gallery($relativePath: String!) {
    gallery(relativePath: $relativePath) {
      ... on Document { _sys { filename basename hasReferences breadcrumbs path relativePath extension } id }
      __typename
      pageTitle
      pageDescription
      emptyHeading
      emptyDescription
    }
  }
`;

function Lightbox({ item, onClose }: { item: GalleryItem; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 cursor-pointer"
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-10"
        onClick={onClose}
        aria-label="Close"
      >
        <X className="w-8 h-8" />
      </button>
      <div
        className="relative max-w-4xl max-h-[90vh] cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={item.imageUrl}
          alt={item.title}
          className="max-w-full max-h-[85vh] object-contain rounded-lg"
        />
        <div className="mt-3 text-center">
          <h3 className="text-white font-normal">{item.title}</h3>
          {item.description && (
            <p className="text-white/60 text-sm mt-1">{item.description}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function GalleryImage({ item, onClick }: { item: GalleryItem; onClick: () => void }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className="break-inside-avoid group rounded-lg overflow-hidden border border-border/50 relative cursor-pointer gumroad-card"
      onClick={onClick}
    >
      <img
        src={item.imageUrl}
        alt={item.title}
        className={`w-full h-auto transition-opacity duration-400 ${loaded ? "opacity-100" : "opacity-0"}`}
        loading="lazy"
        onLoad={() => setLoaded(true)}
      />
      {!loaded && (
        <div className="aspect-[3/4] bg-muted animate-pulse" />
      )}
      <div className="hover-overlay">
        <h3 className="text-white font-normal text-sm">{item.title}</h3>
        {item.description && (
          <p className="text-white/70 text-xs mt-0.5">{item.description}</p>
        )}
      </div>
    </div>
  );
}

export default function Gallery() {
  const { data: galleryItems, isLoading } = useListGallery(undefined, {
    query: { enabled: import.meta.env.PROD },
  });
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  const { data } = useTina({
    query: galleryQuery,
    variables: { relativePath: "gallery.json" },
    data: TINA_DATA_GALLERYDATA,
  });

  const content = data.gallery;

  const items = asArray<GalleryItem>(galleryItems, FALLBACK_GALLERY);

  const closeLightbox = useCallback(() => setLightboxItem(null), []);

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
          <div
            className="text-base text-muted-foreground"
            data-tina-field={tinaField(content, "pageDescription")}
          >
            <RichText value={content?.pageDescription} />
          </div>
        </div>

        {isLoading ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-muted rounded-lg aspect-[3/4] break-inside-avoid" />
            ))}
          </div>
        ) : items.length > 0 ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {items.map((item) => (
              <GalleryImage
                key={item.id}
                item={item}
                onClick={() => setLightboxItem(item)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-border rounded-lg">
            <h3
              className="text-xl font-sans text-muted-foreground mb-2"
              data-tina-field={tinaField(content, "emptyHeading")}
            >
              {content?.emptyHeading || "Gallery is empty"}
            </h3>
            <p
              className="text-sm text-muted-foreground"
              data-tina-field={tinaField(content, "emptyDescription")}
            >
              {content?.emptyDescription || "Check back soon — new artwork is added regularly."}
            </p>
          </div>
        )}
      </div>

      {lightboxItem && <Lightbox item={lightboxItem} onClose={closeLightbox} />}
    </div>
  );
}
