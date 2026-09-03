import { useState, useCallback, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, Download, X } from "lucide-react";
import { tinaField } from "tinacms/react";
import { useLiveGallery } from "@/hooks/use-live-content";
import { FALLBACK_GALLERY } from "@/lib/fallback-data";
import {
  fileNameFromUrl,
  hasDownloadFile,
  resolveGalleryArtworks,
  type GalleryArtwork,
} from "@/lib/gallery";
import { type Block } from "./block-utils";
import { SectionHeading } from "./text-style";

export function GalleryLightbox({
  items,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  items: GalleryArtwork[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const item = items[index];
  const showNav = items.length > 1;
  const downloadFile = item?.downloadFile;
  const canDownload = hasDownloadFile(downloadFile);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, onPrev, onNext]);

  if (!item) return null;

  // Portal to body so `position: fixed` is viewport-relative. Ancestors with
  // `.page` keep a CSS transform from the page-entrance animation, which would
  // otherwise make the overlay cover the full document and center mid-page.
  return createPortal(
    <div
      className="fixed inset-0 z-[1001] flex items-start justify-center overflow-y-auto bg-black/80 px-4 pt-16 pb-8 cursor-pointer sm:px-16 sm:pt-20"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
    >
      <button
        type="button"
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
        <div className="relative flex items-center justify-center">
          {showNav && (
            <button
              type="button"
              className="absolute left-1 top-1/2 z-10 -translate-y-1/2 w-11 h-11 grid place-items-center rounded-full bg-black/45 text-white/85 hover:text-white hover:bg-black/65 transition-colors sm:-left-14"
              onClick={onPrev}
              aria-label="Previous image"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>
          )}
          <img
            src={item.imageUrl}
            alt={item.title}
            className="mx-auto max-w-full max-h-[75vh] object-contain rounded-lg"
          />
          {showNav && (
            <button
              type="button"
              className="absolute right-1 top-1/2 z-10 -translate-y-1/2 w-11 h-11 grid place-items-center rounded-full bg-black/45 text-white/85 hover:text-white hover:bg-black/65 transition-colors sm:-right-14"
              onClick={onNext}
              aria-label="Next image"
            >
              <ChevronRight className="w-7 h-7" />
            </button>
          )}
        </div>
        <div className="mt-3 text-center">
          <h3 className="text-white font-normal">{item.title}</h3>
          {item.description && (
            <p className="text-white/60 text-sm mt-1">{item.description}</p>
          )}
          {canDownload && (
            <a
              href={downloadFile}
              download={fileNameFromUrl(downloadFile)}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white hover:bg-white/25 transition-colors"
            >
              <Download className="w-4 h-4" aria-hidden />
              Download this file
            </a>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}

function GalleryImage({
  item,
  onClick,
}: {
  item: GalleryArtwork;
  onClick: () => void;
}) {
  const [loaded, setLoaded] = useState(false);
  const canDownload = hasDownloadFile(item.downloadFile);

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
      {canDownload && (
        <span
          className="absolute top-2 right-2 z-[1] w-7 h-7 rounded-full bg-black/40 text-white/90 grid place-items-center pointer-events-none"
          title="Download available"
          aria-hidden
        >
          <Download className="w-3.5 h-3.5" />
        </span>
      )}
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
  const catalog = useLiveGallery();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const items = useMemo(
    () => resolveGalleryArtworks(undefined, FALLBACK_GALLERY, catalog),
    [catalog],
  );

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const goPrev = useCallback(() => {
    setLightboxIndex((current) =>
      current === null || items.length === 0
        ? current
        : (current - 1 + items.length) % items.length,
    );
  }, [items.length]);
  const goNext = useCallback(() => {
    setLightboxIndex((current) =>
      current === null || items.length === 0
        ? current
        : (current + 1) % items.length,
    );
  }, [items.length]);

  return (
    <section className="py-6">
      <div className="container mx-auto px-4 md:px-6">
        {items.length > 0 ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {items.map((item, index) => (
              <GalleryImage
                key={item.id}
                item={item}
                onClick={() => setLightboxIndex(index)}
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

      {lightboxIndex !== null && (
        <GalleryLightbox
          items={items}
          index={lightboxIndex}
          onClose={closeLightbox}
          onPrev={goPrev}
          onNext={goNext}
        />
      )}
    </section>
  );
}
