import { useRoute, useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTina, tinaField } from "tinacms/react";
import HeroBlock from "./blocks/HeroBlock";
import TextBlock from "./blocks/TextBlock";
import ImageGalleryBlock from "./blocks/ImageGalleryBlock";
import CtaBandBlock from "./blocks/CtaBandBlock";
import VideoEmbedBlock from "./blocks/VideoEmbedBlock";
import FeatureGridBlock from "./blocks/FeatureGridBlock";

const pageModules = import.meta.glob("../../content/pages/*.json", { eager: true }) as Record<
  string,
  { default?: Record<string, unknown> } & Record<string, unknown>
>;

function normalizeSlug(slug: string) {
  return slug.replace(/\.json$/i, "").replace(/^\//, "");
}

function getPageData(slug: string) {
  const base = normalizeSlug(slug);
  const key = Object.keys(pageModules).find((k) => k.endsWith(`/${base}.json`));
  if (!key) return null;
  const mod = pageModules[key];
  return (mod.default ?? mod) as Record<string, unknown>;
}

const pageQuery = `
  query landingPage($relativePath: String!) {
    landingPage(relativePath: $relativePath) {
      ... on Document {
        _sys {
          filename
          basename
          hasReferences
          breadcrumbs
          path
          relativePath
          extension
        }
        id
      }
      __typename
      title
      blocks {
        ... on LandingPageBlocksHero {
          __typename
          heading
          subheading
          backgroundImage
          ctaLabel
          ctaLink
        }
        ... on LandingPageBlocksText {
          __typename
          heading
          body
        }
        ... on LandingPageBlocksImageGallery {
          __typename
          heading
          images {
            src
            alt
            caption
          }
        }
        ... on LandingPageBlocksCtaBand {
          __typename
          heading
          description
          ctaLabel
          ctaLink
          variant
        }
        ... on LandingPageBlocksVideoEmbed {
          __typename
          heading
          youtubeUrl
        }
        ... on LandingPageBlocksFeatureGrid {
          __typename
          heading
          items {
            icon
            title
            description
          }
        }
      }
    }
  }
`;

interface Block {
  __typename?: string;
  _template?: string;
  [key: string]: unknown;
}

function BlockRenderer({ block }: { block: Block }) {
  const type = block.__typename || block._template || "";

  if (type.includes("Hero") || type === "hero") return <HeroBlock block={block} />;
  if (type.includes("Text") || type === "text") return <TextBlock block={block} />;
  if (type.includes("ImageGallery") || type === "imageGallery") return <ImageGalleryBlock block={block} />;
  if (type.includes("CtaBand") || type === "ctaBand") return <CtaBandBlock block={block} />;
  if (type.includes("VideoEmbed") || type === "videoEmbed") return <VideoEmbedBlock block={block} />;
  if (type.includes("FeatureGrid") || type === "featureGrid") return <FeatureGridBlock block={block} />;

  return null;
}

export default function LandingPage() {
  const [, params] = useRoute("/p/:slug");
  const [, setLocation] = useLocation();
  const slug = normalizeSlug(params?.slug ?? "");

  const staticData = getPageData(slug);

  const { data } = useTina({
    query: pageQuery,
    variables: { relativePath: `${slug}.json` },
    data: {
      landingPage: staticData
        ? { ...staticData, __typename: "LandingPage" as const }
        : {},
    },
  });

  const page = data.landingPage as Record<string, unknown> | null;

  if (!page || !page.title) {
    return (
      <div className="min-h-screen py-10">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl text-center py-20">
          <h1 className="text-2xl font-display mb-4">Page not found</h1>
          <Button variant="outline" onClick={() => setLocation("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const blocks = (page.blocks as Block[]) ?? [];

  return (
    <div className="min-h-screen">
      {blocks.map((block, i) => (
        <BlockRenderer key={i} block={block} />
      ))}
    </div>
  );
}
