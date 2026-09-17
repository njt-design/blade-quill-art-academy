import type { ComponentType, ReactNode } from "react";
import type { Block } from "@/pages/blocks/block-utils";
import ImageGalleryBlock from "@/pages/blocks/ImageGalleryBlock";
import ImageSideBySideBlock from "@/pages/blocks/ImageSideBySideBlock";
import VideoEmbedBlock from "@/pages/blocks/VideoEmbedBlock";
import CtaBandBlock from "@/pages/blocks/CtaBandBlock";
import ArticleHeading from "./ArticleHeading";
import ArticleText from "./ArticleText";
import ArticleSpacer from "./ArticleSpacer";
import ArticleDivider from "./ArticleDivider";
import ArticleImage from "./ArticleImage";
import ArticleCallout from "./ArticleCallout";
import { sectionKey } from "./article-utils";
import { BlockRenderer } from "@/pages/blocks/BlockRenderer";

/**
 * Page image/video/CTA blocks use large marketing padding. Wrap them so the
 * article column stays tight and readable.
 */
function ArticleShell({ children }: { children: ReactNode }) {
  return (
    <div className="article-section-shell [&_section]:py-6 [&_section]:lg:py-8 [&_.bq-container]:px-0 [&_.bq-container]:max-w-none [&_.container]:px-0 [&_.container]:max-w-none">
      {children}
    </div>
  );
}

function ArticleImagePair({ block }: { block: Block }) {
  return (
    <ArticleShell>
      <ImageSideBySideBlock block={block} />
    </ArticleShell>
  );
}

function ArticleGallery({ block }: { block: Block }) {
  return (
    <ArticleShell>
      <ImageGalleryBlock block={block} />
    </ArticleShell>
  );
}

function ArticleVideo({ block }: { block: Block }) {
  return (
    <ArticleShell>
      <VideoEmbedBlock block={block} />
    </ArticleShell>
  );
}

function ArticleCta({ block }: { block: Block }) {
  return (
    <div className="my-10 -mx-4 md:-mx-6 [&_section]:rounded-md [&_section]:py-8">
      <CtaBandBlock block={block} />
    </div>
  );
}

type SectionProps = { block: Block; headingIndex?: number };

const SECTION_COMPONENTS: Record<string, ComponentType<{ block: Block; headingIndex?: number }>> = {
  heading: ArticleHeading,
  text: ArticleText,
  spacer: ArticleSpacer,
  divider: ArticleDivider,
  image: ArticleImage,
  imageSideBySide: ArticleImagePair,
  imageGallery: ArticleGallery,
  videoEmbed: ArticleVideo,
  callout: ArticleCallout,
  ctaBand: ArticleCta,
};

interface Props {
  sections: Block[];
}

/**
 * Any page pattern dropped into a post (not one of the article-tuned sections
 * above) breaks out of the narrow article column and displays at full page
 * width, exactly as it does on a normal page. The post root clips the
 * scrollbar-width overshoot from `w-screen`.
 */
function FullWidthPageBlock({ block }: { block: Block }) {
  return (
    <div className="relative left-1/2 w-screen -translate-x-1/2 my-10">
      <BlockRenderer block={block} />
    </div>
  );
}

export default function ArticleSectionRenderer({ sections }: Props) {
  let headingIndex = 0;

  return (
    <div className="article-sections">
      {sections.map((section, i) => {
        const key = sectionKey(section);
        if (!key) return null;
        const Component = SECTION_COMPONENTS[key];
        if (!Component) {
          // Page pattern — inject the resolved key so BlockRenderer can map
          // GraphQL's PostSections* typenames to the right component.
          return (
            <FullWidthPageBlock
              key={`${key}-${i}`}
              block={{ ...section, _template: key }}
            />
          );
        }

        const props: SectionProps = { block: section };
        if (key === "heading") {
          props.headingIndex = headingIndex;
          headingIndex += 1;
        }

        return <Component key={`${key}-${i}`} {...props} />;
      })}
    </div>
  );
}
