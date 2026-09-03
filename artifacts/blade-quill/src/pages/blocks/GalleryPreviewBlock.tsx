import { useCallback, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { tinaField } from "tinacms/react";
import { Btn } from "@/components/site/Btn";
import { Reveal } from "@/components/site/Reveal";
import { RichText } from "@/components/site/RichText";
import { useLiveGallery } from "@/hooks/use-live-content";
import { FALLBACK_GALLERY } from "@/lib/fallback-data";
import {
  hasDownloadFile,
  resolveGalleryArtworks,
  type GalleryArtwork,
} from "@/lib/gallery";
import { Download } from "lucide-react";
import { type Block, followLink } from "./block-utils";
import { GalleryLightbox } from "./GalleryGridBlock";
import { SectionHeading, bodyTextStyle, sectionAlignStyle } from "./text-style";

interface Props {
  block: Block;
}

function PreviewTile({
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
      className="group rounded-lg overflow-hidden border border-border/50 relative cursor-pointer gumroad-card"
      onClick={onClick}
    >
      <div className="aspect-square overflow-hidden bg-secondary/30">
        <img
          src={item.imageUrl}
          alt={item.title}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          loading="lazy"
          onLoad={() => setLoaded(true)}
        />
      </div>
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
            <p className="text-white/70 text-xs mt-0.5 line-clamp-2">
              {item.description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * A taste of the gallery on landing pages: the first N artworks in a
 * square-tile grid with the same lightbox as the full Gallery page, plus a
 * "view all" button. Artworks come from the Tina Gallery collection.
 */
export default function GalleryPreviewBlock({ block }: Props) {
  const [, setLocation] = useLocation();
  const catalog = useLiveGallery();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const maxItems =
    typeof block.maxItems === "number" && block.maxItems > 0
      ? block.maxItems
      : 6;

  const items = useMemo(
    () =>
      resolveGalleryArtworks(undefined, FALLBACK_GALLERY, catalog).slice(
        0,
        maxItems
      ),
    [catalog, maxItems]
  );

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const goPrev = useCallback(() => {
    setLightboxIndex((current) =>
      current === null || items.length === 0
        ? current
        : (current - 1 + items.length) % items.length
    );
  }, [items.length]);
  const goNext = useCallback(() => {
    setLightboxIndex((current) =>
      current === null || items.length === 0
        ? current
        : (current + 1) % items.length
    );
  }, [items.length]);

  return (
    <section className="py-20 lg:py-24">
      <div className="bq-container">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <div className="max-w-[560px]" style={sectionAlignStyle(block)}>
            {block.eyebrow ? (
              <Reveal>
                <div
                  className="eyebrow-grad mb-4"
                  data-tina-field={tinaField(block, "eyebrow")}
                >
                  {block.eyebrow as string}
                </div>
              </Reveal>
            ) : null}
            {block.heading ? (
              <Reveal>
                <SectionHeading
                  block={block}
                  defaultTag="h2"
                  baseSize="clamp(30px, 4vw, 44px)"
                  style={{ lineHeight: 1.1 }}
                >
                  {block.heading as string}
                </SectionHeading>
              </Reveal>
            ) : null}
            {block.description ? (
              <Reveal>
                <div
                  className="mt-4"
                  style={{
                    fontSize: 16,
                    lineHeight: 1.7,
                    color: "var(--ink-mute)",
                    ...bodyTextStyle(block),
                  }}
                  data-tina-field={tinaField(block, "description")}
                >
                  <RichText value={block.description} />
                </div>
              </Reveal>
            ) : null}
          </div>
          {block.viewAllLabel ? (
            <Reveal>
              <Btn
                kind="outline"
                size="md"
                iconRight="→"
                onClick={() =>
                  followLink(
                    setLocation,
                    block.viewAllLink as string | undefined,
                    "/gallery"
                  )
                }
              >
                <span data-tina-field={tinaField(block, "viewAllLabel")}>
                  {block.viewAllLabel as string}
                </span>
              </Btn>
            </Reveal>
          ) : null}
        </div>

        {items.length > 0 ? (
          <Reveal stagger>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              {items.map((item, index) => (
                <PreviewTile
                  key={item.id}
                  item={item}
                  onClick={() => setLightboxIndex(index)}
                />
              ))}
            </div>
          </Reveal>
        ) : (
          <div className="text-center py-20 border border-dashed border-border rounded-lg">
            <p className="text-sm text-muted-foreground">
              Check back soon — new artwork is added regularly.
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
