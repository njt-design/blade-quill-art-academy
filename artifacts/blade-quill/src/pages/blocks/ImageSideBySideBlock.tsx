import { tinaField } from "tinacms/react";
import { ArtTile } from "@/components/site/ArtTile";
import { Polaroid } from "@/components/site/Polaroid";
import { Reveal } from "@/components/site/Reveal";
import { type Block } from "./block-utils";
import { captionStyle, type ShowcaseImage } from "./image-showcase-utils";
import { SectionHeading, sectionAlignStyle } from "./text-style";

interface Props {
  block: Block;
}

function ImageCell({
  image,
  style,
  rotate,
}: {
  image: ShowcaseImage;
  style: string;
  rotate: number;
}) {
  const img = (
    <ArtTile
      palette="warm"
      width="100%"
      height={320}
      src={image.src}
      alt={image.alt || image.caption || "Artwork"}
      radius={style === "rounded" ? 12 : 2}
    />
  );

  if (style === "polaroid") {
    return (
      <Polaroid rotate={rotate} washiColor={rotate > 0 ? "var(--maroon)" : "var(--taupe)"} hoverStraighten>
        {img}
        {image.caption ? <div className="mt-3 text-center" style={captionStyle}>{image.caption}</div> : null}
      </Polaroid>
    );
  }

  return (
    <div
      className={style === "rounded" ? "overflow-hidden rounded-2xl" : "overflow-hidden"}
      style={{ boxShadow: style === "clean" ? "0 8px 24px rgba(46,34,34,0.12)" : undefined }}
    >
      {img}
      {image.caption ? (
        <p className="mt-3 text-center" style={captionStyle}>
          {image.caption}
        </p>
      ) : null}
    </div>
  );
}

export default function ImageSideBySideBlock({ block }: Props) {
  const frameStyle = (block.style as string) || "polaroid";
  const left = (block.leftImage as ShowcaseImage) ?? {};
  const right = (block.rightImage as ShowcaseImage) ?? {};

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
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start max-w-5xl mx-auto">
          <Reveal>
            <div data-tina-field={tinaField(block, "leftImage")}>
              <ImageCell image={left} style={frameStyle} rotate={-3} />
            </div>
          </Reveal>
          <Reveal>
            <div data-tina-field={tinaField(block, "rightImage")}>
              <ImageCell image={right} style={frameStyle} rotate={3} />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
