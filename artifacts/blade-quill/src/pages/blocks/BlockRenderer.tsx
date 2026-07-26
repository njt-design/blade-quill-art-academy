import type { ComponentType } from "react";
import { type Block } from "./block-utils";

import HeroBlock from "./HeroBlock";
import TextBlock from "./TextBlock";
import ImageGalleryBlock from "./ImageGalleryBlock";
import CtaBandBlock from "./CtaBandBlock";
import VideoEmbedBlock from "./VideoEmbedBlock";
import FeatureGridBlock from "./FeatureGridBlock";
import BigCtaBlock from "./BigCtaBlock";
import PageHeaderBlock from "./PageHeaderBlock";
import HomeHeroBlock from "./HomeHeroBlock";
import PillarsBlock from "./PillarsBlock";
import FeaturedBookBlock from "./FeaturedBookBlock";
import ClassesPitchBlock from "./ClassesPitchBlock";
import TutorialsStripBlock from "./TutorialsStripBlock";
import ProductStripBlock from "./ProductStripBlock";
import BlogFeedBlock from "./BlogFeedBlock";
import NewsletterSignupBlock from "./NewsletterSignupBlock";
import AboutHeroBlock from "./AboutHeroBlock";
import StatsRowBlock from "./StatsRowBlock";
import StoryBlock from "./StoryBlock";
import TimelineBlock from "./TimelineBlock";
import CardRowBlock from "./CardRowBlock";
import ShopCatalogBlock from "./ShopCatalogBlock";
import GalleryGridBlock from "./GalleryGridBlock";
import DownloadsGridBlock from "./DownloadsGridBlock";
import ContactInfoBlock from "./ContactInfoBlock";
import ContactFormBlock from "./ContactFormBlock";
import DummyBookRequestBlock from "./DummyBookRequestBlock";
import MarqueeBlock from "./MarqueeBlock";
import FeaturedReleaseBlock from "./FeaturedReleaseBlock";
import KofiSupportBlock from "./KofiSupportBlock";
import SocialLinksBlock from "./SocialLinksBlock";
import ReviewLinksBlock from "./ReviewLinksBlock";
import HeroSplitImageBlock from "./HeroSplitImageBlock";
import HeroFullBleedBlock from "./HeroFullBleedBlock";
import HeroFloatingImagesBlock from "./HeroFloatingImagesBlock";
import HeroImageGridBlock from "./HeroImageGridBlock";
import ImageSpotlightBlock from "./ImageSpotlightBlock";
import ImageSideBySideBlock from "./ImageSideBySideBlock";
import ImageMasonryBlock from "./ImageMasonryBlock";

const BLOCK_COMPONENTS: Record<string, ComponentType<{ block: Block }>> = {
  hero: HeroBlock,
  text: TextBlock,
  imageGallery: ImageGalleryBlock,
  ctaBand: CtaBandBlock,
  videoEmbed: VideoEmbedBlock,
  featureGrid: FeatureGridBlock,
  bigCta: BigCtaBlock,
  pageHeader: PageHeaderBlock,
  homeHero: HomeHeroBlock,
  pillars: PillarsBlock,
  featuredBook: FeaturedBookBlock,
  classesPitch: ClassesPitchBlock,
  tutorialsStrip: TutorialsStripBlock,
  productStrip: ProductStripBlock,
  blogFeed: BlogFeedBlock,
  newsletterSignup: NewsletterSignupBlock,
  aboutHero: AboutHeroBlock,
  statsRow: StatsRowBlock,
  story: StoryBlock,
  timeline: TimelineBlock,
  cardRow: CardRowBlock,
  shopCatalog: ShopCatalogBlock,
  galleryGrid: GalleryGridBlock,
  downloadsGrid: DownloadsGridBlock,
  contactInfo: ContactInfoBlock,
  contactForm: ContactFormBlock,
  dummyBookRequest: DummyBookRequestBlock,
  marquee: MarqueeBlock,
  featuredRelease: FeaturedReleaseBlock,
  kofiSupport: KofiSupportBlock,
  socialLinks: SocialLinksBlock,
  reviewLinks: ReviewLinksBlock,
  heroSplitImage: HeroSplitImageBlock,
  heroFullBleed: HeroFullBleedBlock,
  heroFloatingImages: HeroFloatingImagesBlock,
  heroImageGrid: HeroImageGridBlock,
  imageSpotlight: ImageSpotlightBlock,
  imageSideBySide: ImageSideBySideBlock,
  imageMasonry: ImageMasonryBlock,
};

/**
 * Resolve a block's template key from either the raw JSON `_template`
 * ("homeHero") or a GraphQL `__typename` ("PageBlocksHomeHero",
 * "LandingPageEventBlocksHomeHero", ...).
 */
function blockKey(block: Block): string | null {
  if (block._template && BLOCK_COMPONENTS[block._template]) {
    return block._template;
  }
  const typename = block.__typename ?? "";
  const idx = typename.lastIndexOf("Blocks");
  if (idx >= 0) {
    const pascal = typename.slice(idx + "Blocks".length);
    const key = pascal.charAt(0).toLowerCase() + pascal.slice(1);
    if (BLOCK_COMPONENTS[key]) return key;
  }
  return null;
}

export function BlockRenderer({ block }: { block: Block }) {
  const key = blockKey(block);
  if (!key) return null;
  const Component = BLOCK_COMPONENTS[key];
  return <Component block={block} />;
}
