import { useMemo } from "react";
import { useRoute, useLocation } from "wouter";
import { ArrowLeft, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { tinaField } from "tinacms/react";
import { useLiveTina } from "@/hooks/use-live-tina";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { CmsStatusPill } from "@/components/site/CmsStatusPill";
import { RichText } from "@/components/site/RichText";
import { postQuery } from "@/lib/post-queries";
import type { Block } from "@/pages/blocks/block-utils";
import ArticleSectionRenderer from "@/pages/blog/ArticleSectionRenderer";
import ArticleToc from "@/pages/blog/ArticleToc";
import { collectTocItems } from "@/pages/blog/article-utils";

const postModules = import.meta.glob("../../content/posts/*.json", { eager: true }) as Record<
  string,
  { default?: Record<string, unknown> } & Record<string, unknown>
>;

function normalizeSlug(slug: string) {
  return slug.replace(/\.json$/i, "").replace(/^\//, "");
}

function getPostData(slug: string) {
  const base = normalizeSlug(slug);
  const key = Object.keys(postModules).find((k) => k.endsWith(`/${base}.json`));
  if (!key) return null;
  const mod = postModules[key];
  return (mod.default ?? mod) as Record<string, unknown>;
}

function formatDate(iso?: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogPost() {
  const [, params] = useRoute("/blog/:slug");
  const [, setLocation] = useLocation();
  const slug = normalizeSlug(params?.slug ?? "");

  const staticData = getPostData(slug);

  const { data, freshness } = useLiveTina({
    query: postQuery,
    variables: { relativePath: `${slug}.json` },
    data: {
      post: staticData
        ? { ...staticData, __typename: "Post" as const }
        : {},
    },
  });

  const post = data.post as Record<string, unknown> | null;

  const sections = useMemo(() => {
    const raw = post?.sections;
    return Array.isArray(raw) ? (raw as Block[]) : [];
  }, [post?.sections]);

  const tocItems = useMemo(() => {
    if (!post?.showTableOfContents) return [];
    return collectTocItems(sections);
  }, [post?.showTableOfContents, sections]);

  // Temporary fallback for posts not yet migrated off legacy `body`.
  const legacyBody = post?.body;

  if (!post || !post.title) {
    return (
      <div className="min-h-screen py-10">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl text-center py-20">
          <h1 className="text-2xl font-display mb-4">Post not found</h1>
          <Button variant="outline" onClick={() => setLocation("/blog")}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10">
      <CmsStatusPill freshness={freshness} />
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        <button
          onClick={() => setLocation("/blog")}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Blog
        </button>

        {typeof post.coverImage === "string" && post.coverImage ? (
          <div className="aspect-[16/9] overflow-hidden rounded-lg mb-8">
            <img
              src={post.coverImage}
              alt={post.title as string}
              className="w-full h-full object-cover"
              data-tina-field={tinaField(post, "coverImage")}
            />
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-3 mb-4 text-sm text-muted-foreground">
          {typeof post.publishedAt === "string" && post.publishedAt ? (
            <span
              className="flex items-center gap-1"
              data-tina-field={tinaField(post, "publishedAt")}
            >
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(post.publishedAt)}
            </span>
          ) : null}
          {Array.isArray(post.tags) && post.tags.length > 0 ? (
            <div className="flex flex-wrap gap-1.5" data-tina-field={tinaField(post, "tags")}>
              {(post.tags as string[]).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] uppercase tracking-widest font-bold text-brown bg-brown/10 px-2 py-0.5 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <h1
          className="text-3xl md:text-4xl font-display mb-6"
          data-tina-field={tinaField(post, "title")}
        >
          {post.title as string}
        </h1>

        {post.excerpt ? (
          <div
            className="text-lg font-sans text-muted-foreground mb-8 leading-relaxed"
            data-tina-field={tinaField(post, "excerpt")}
          >
            <RichText value={post.excerpt} />
          </div>
        ) : null}

        {tocItems.length > 0 ? <ArticleToc items={tocItems} /> : null}

        <div data-tina-field={tinaField(post, "sections")}>
          {sections.length > 0 ? (
            <ArticleSectionRenderer sections={sections} />
          ) : legacyBody ? (
            <div className="prose prose-neutral max-w-none">
              <TinaMarkdown content={legacyBody as any} />
            </div>
          ) : (
            <p className="text-muted-foreground">No content yet. Add Post Sections in the editor.</p>
          )}
        </div>
      </div>
    </div>
  );
}
