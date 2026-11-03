import { useEffect, useMemo, useState } from "react";
import { tinaField } from "tinacms/react";
import { Reveal } from "@/components/site/Reveal";
import { rearrangeParamValue, type GridReorderConfig } from "@/lib/grid-reorder";
import { isInTinaEditor } from "@/lib/tina-live";
import { useCanRearrange } from "@/hooks/use-can-rearrange";
import { type Block } from "./block-utils";
import GridReorderMode, {
  RearrangeButton,
  openRearrangePage,
} from "./GridReorderMode";
import { captionStyle, type ShowcaseImage } from "./image-showcase-utils";
import { usePageDoc, useBlockIndex } from "./page-doc-context";
import { SectionHeading, sectionAlignStyle } from "./text-style";

interface Props {
  block: Block;
}

/** True for an Image Masonry section in a page document's `blocks`. */
function isImageMasonryBlock(
  candidate: unknown
): candidate is Record<string, unknown> {
  if (!candidate || typeof candidate !== "object") return false;
  const block = candidate as Record<string, unknown>;
  return (
    block._template === "imageMasonry" ||
    (typeof block.__typename === "string" &&
      block.__typename.endsWith("BlocksImageMasonry"))
  );
}

/**
 * Masonry wall of CMS images, laid out with CSS columns. Admins get the same
 * "jiggly" drag-to-reorder mode as the Gallery/Downloads grids — the reorder
 * view mirrors the masonry columns, so an image drops exactly where it will
 * appear to visitors. Reordering targets this block instance by its index in
 * the page document, so several masonry sections on one page stay independent.
 */
export default function ImageMasonryBlock({ block }: Props) {
  const rawImages = useMemo(
    () => ((block.images as ShowcaseImage[]) ?? []).filter((img) => img?.src),
    [block.images]
  );

  // Reordering saves through Tina's updatePage mutation, which this block
  // only knows how to do for core "page" documents (landingPage docs are
  // template-based and save differently). Elsewhere the button is hidden and
  // the Tina sidebar list remains the way to reorder.
  const pageDoc = usePageDoc();
  const blockIndex = useBlockIndex();
  const reorderConfig: GridReorderConfig | null =
    pageDoc && pageDoc.collection === "page" && blockIndex !== null
      ? {
          relativePath: pageDoc.relativePath,
          listField: "images",
          isGridBlock: isImageMasonryBlock,
          blockIndex,
        }
      : null;
  const rearrangeTarget = `m${blockIndex ?? 0}`;

  const canReorder = useCanRearrange();
  const inEditor = isInTinaEditor();
  const [reordering, setReordering] = useState(false);
  // Order saved this session — shown until live content catches up.
  const [savedOrder, setSavedOrder] = useState<ShowcaseImage[] | null>(null);

  // Arriving with ?rearrange=m<index> (from the editor button) jumps straight
  // into this block's reorder mode; a bare ?rearrange targets the first one.
  const paramValue = rearrangeParamValue();
  const autoEntered =
    Boolean(reorderConfig) &&
    canReorder &&
    rawImages.length > 1 &&
    (paramValue === rearrangeTarget || (paramValue === "" && blockIndex === 0));
  useEffect(() => {
    if (autoEntered) setReordering(true);
    // Mount-only: entering once is enough; Cancel must stay cancelled.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const images = useMemo(() => {
    if (!savedOrder || savedOrder.length !== rawImages.length)
      return rawImages;
    // Only trust the session override while it's the same set of images.
    const current = new Set(rawImages.map((img) => img.src));
    return savedOrder.every((img) => current.has(img.src))
      ? savedOrder
      : rawImages;
  }, [rawImages, savedOrder]);

  const showReorderButton =
    Boolean(reorderConfig) &&
    (canReorder || inEditor) &&
    !reordering &&
    rawImages.length > 1;

  return (
    <section className="py-16 lg:py-24" style={sectionAlignStyle(block)}>
      <div className="bq-container">
        {block.heading ? (
          <Reveal>
            <SectionHeading
              block={block}
              defaultTag="h2"
              baseSize="clamp(26px, 3.5vw, 38px)"
              className="mb-10"
              style={{ lineHeight: 1.2 }}
            >
              {block.heading as string}
            </SectionHeading>
          </Reveal>
        ) : null}
        {showReorderButton && (
          <RearrangeButton
            label="Rearrange images"
            external={inEditor}
            onClick={() =>
              inEditor ? openRearrangePage(rearrangeTarget) : setReordering(true)
            }
          />
        )}
        {reordering && reorderConfig ? (
          <GridReorderMode
            config={reorderConfig}
            variant="masonry"
            tileFor={(raw, index) => {
              const img = raw as ShowcaseImage;
              return {
                title:
                  img.caption || img.alt || `Image ${index + 1}`,
                imageUrl: img.src || null,
              };
            }}
            onCancel={() => setReordering(false)}
            onSaved={(orderedRaw) => {
              setSavedOrder(
                (orderedRaw as ShowcaseImage[]).filter((img) => img?.src)
              );
              setReordering(false);
            }}
          />
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {images.map((img, i) => (
              <Reveal key={`${img.src}-${i}`}>
                <figure
                  className="break-inside-avoid group"
                  data-tina-field={
                    savedOrder ? undefined : tinaField(block, "images", i)
                  }
                >
                  <div
                    className="overflow-hidden rounded-lg"
                    style={{ boxShadow: "0 6px 20px rgba(46,34,34,0.12)" }}
                  >
                    <img
                      src={img.src}
                      alt={img.alt || img.caption || "Artwork"}
                      className="w-full h-auto"
                      loading="lazy"
                    />
                  </div>
                  {img.caption ? (
                    <figcaption className="mt-2 px-1" style={captionStyle}>
                      {img.caption}
                    </figcaption>
                  ) : null}
                </figure>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
