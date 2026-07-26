import { tinaField } from "tinacms/react";
import { Reveal } from "@/components/site/Reveal";
import { type Block } from "./block-utils";
import { captionStyle, type ShowcaseImage } from "./image-showcase-utils";

interface Props {
  block: Block;
}

export default function ImageMasonryBlock({ block }: Props) {
  const images = ((block.images as ShowcaseImage[]) ?? []).filter((img) => img.src);

  return (
    <section className="py-16 lg:py-24">
      <div className="bq-container">
        {block.heading ? (
          <Reveal>
            <h2
              className="mb-10"
              style={{ fontSize: "clamp(26px, 3.5vw, 38px)", lineHeight: 1.2 }}
              data-tina-field={tinaField(block, "heading")}
            >
              {block.heading as string}
            </h2>
          </Reveal>
        ) : null}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {images.map((img, i) => (
            <Reveal key={i}>
              <figure
                className="break-inside-avoid group"
                data-tina-field={tinaField(block, "images", i)}
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
      </div>
    </section>
  );
}
