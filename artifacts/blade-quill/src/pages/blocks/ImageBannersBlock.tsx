import { useState } from "react";
import { tinaField } from "tinacms/react";
import { ArtTile } from "@/components/site/ArtTile";
import { Reveal } from "@/components/site/Reveal";
import { type Block } from "./block-utils";
import { SectionHeading, sectionAlignStyle } from "./text-style";

interface Props {
  block: Block;
}

interface BannerImage {
  src?: string;
  alt?: string;
}

/* Colors from the approved Figma design (Cb Design → nodes 238:6 / 238:11). */
const CARD_BG = "#EBE1D7";
const ACTIVE_GOLD = "#FFBC57";

/**
 * Wide promo banners inside a soft rounded card. Two layouts:
 * - "stacked": every banner full-width, stacked vertically.
 * - "gallery": one large featured banner with a clickable thumbnail strip
 *   below — the active thumbnail gets a gold border.
 */
export default function ImageBannersBlock({ block }: Props) {
  const images = ((block.images as BannerImage[] | undefined) ?? []).filter(
    (img) => img?.src
  );
  const layout = (block.layout as string) || "stacked";
  const [selected, setSelected] = useState(0);
  const activeIndex = Math.min(selected, Math.max(images.length - 1, 0));

  const banner = (img: BannerImage, key: number) => (
    <img
      key={key}
      src={img.src}
      alt={img.alt || "Promotional banner"}
      loading="lazy"
      className="block w-full h-auto"
      style={{ borderRadius: 8 }}
    />
  );

  return (
    <section className="py-16 lg:py-24" style={sectionAlignStyle(block)}>
      <div className="bq-container">
        {block.heading ? (
          <Reveal>
            <SectionHeading
              block={block}
              defaultTag="h2"
              baseSize="clamp(26px, 3.5vw, 38px)"
              className="mb-10 text-center"
              style={{ lineHeight: 1.2 }}
            >
              {block.heading as string}
            </SectionHeading>
          </Reveal>
        ) : null}
        <Reveal>
          <div
            data-tina-field={tinaField(block, "images")}
            className="flex flex-col items-center gap-6 px-4 py-5 md:px-8 md:py-9"
            style={{ background: CARD_BG, borderRadius: 16 }}
          >
            {images.length === 0 ? (
              /* Placeholder until banners are uploaded in the CMS. */
              <>
                <ArtTile palette="moss" width="100%" height={160} radius={8} label="banner" />
                <ArtTile palette="rose" width="100%" height={160} radius={8} label="banner" />
              </>
            ) : layout === "gallery" ? (
              <>
                {banner(images[activeIndex], activeIndex)}
                {images.length > 1 && (
                  <div className="flex w-full items-start gap-4 overflow-x-auto p-3">
                    {images.map((img, i) => (
                      <button
                        key={`${img.src}-${i}`}
                        type="button"
                        onClick={() => setSelected(i)}
                        aria-label={img.alt || `Show banner ${i + 1}`}
                        aria-pressed={i === activeIndex}
                        className="shrink-0 overflow-hidden transition-shadow"
                        style={{
                          borderRadius: 8,
                          border: `6px solid ${
                            i === activeIndex ? ACTIVE_GOLD : "transparent"
                          }`,
                          boxShadow:
                            i === activeIndex
                              ? "0px 4px 4px 0px rgba(0,0,0,0.25)"
                              : undefined,
                          cursor: "pointer",
                          padding: 0,
                          background: "none",
                        }}
                      >
                        <img
                          src={img.src}
                          alt=""
                          loading="lazy"
                          className="block h-auto w-[140px] md:w-[218px]"
                          style={{ borderRadius: 2 }}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              images.map((img, i) => banner(img, i))
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
