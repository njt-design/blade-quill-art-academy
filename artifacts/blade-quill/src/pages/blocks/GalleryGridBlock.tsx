import { useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { tinaField } from "tinacms/react";
import { useListGallery, type GalleryItem } from "@workspace/api-client-react";
import { asArray } from "@/lib/api-helpers";
import { FALLBACK_GALLERY } from "@/lib/fallback-data";
import { type Block } from "./block-utils";
import { SectionHeading } from "./text-style";

function Lightbox({ item, onClose }: { item: GalleryItem; onClose: () => void }) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  // Portal to body so `position: fixed` is viewport-relative. Ancestors with
  // `.page` keep a CSS transform from the page-entrance animation, which would
  // otherwise make the overlay cover the full document and center mid-page.
  return createPortal(
    <div
      className="fixed inset-0 z-[1001] flex items-start justify-center overflow-y-auto bg-black/80 px-4 pt-16 pb-8 cursor-pointer sm:pt-20"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
    >
      <button
        className="fixed top-3 right-3 w-11 h-11 grid place-items-center text-white/70 hover:text-white transition-colors z-10"
        onClick={onClose}
        aria-label="Close"
      >
        <X className="w-7 h-7" />
      </button>
      <div
        className="relative w-full max-w-4xl cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={item.imageUrl}
          alt={item.title}
          className="mx-auto max-w-full max-h-[75vh] object-contain rounded-lg"
        />
        <div className="mt-3 text-center">
          <h3 className="text-white font-normal">{item.title}</h3>
          {item.description && (
            <p className="text-white/60 text-sm mt-1">{item.description}</p>
          )}
        </div>
      </div>
    </div>,
    document.body,
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
      {!loaded && <div className="aspect-[3/4] bg-muted animate-pulse" />}
      {(item.title || item.description) && (
        <div className="hover-overlay">
          <h3 className="text-white font-normal text-sm">{item.title}</h3>
          {item.description && (
            <p className="text-white/70 text-xs mt-0.5">{item.description}</p>
          )}
        </div>
      )}
    </div>
  );
}

interface Props {
  block: Block;
}

export default function GalleryGridBlock({ block }: Props) {
  const { data: galleryItems, isLoading } = useListGallery(undefined, {
    query: { enabled: import.meta.env.PROD },
  });
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  const items = asArray<GalleryItem>(galleryItems, FALLBACK_GALLERY);
  const closeLightbox = useCallback(() => setLightboxItem(null), []);

  return (
    <section className="py-6">
      <div className="container mx-auto px-4 md:px-6">
        {isLoading ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-muted rounded-lg aspect-[3/4] break-inside-avoid"
              />
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
            <SectionHeading
              block={block}
              field="emptyHeading"
              defaultTag="h3"
              baseSize="clamp(20px, 2vw, 20px)"
              className="font-sans text-muted-foreground mb-2"
            >
              {(block.emptyHeading as string) || "Gallery is empty"}
            </SectionHeading>
            <p
              className="text-sm text-muted-foreground"
              data-tina-field={tinaField(block, "emptyDescription")}
            >
              {(block.emptyDescription as string) ||
                "Check back soon — new artwork is added regularly."}
            </p>
          </div>
        )}
      </div>

      {lightboxItem && <Lightbox item={lightboxItem} onClose={closeLightbox} />}
    </section>
  );
}
