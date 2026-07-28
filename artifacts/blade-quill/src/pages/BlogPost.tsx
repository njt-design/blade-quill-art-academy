import { useMemo } from "react";
import { useRoute, useLocation } from "wouter";
import { ArrowLeft, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { tinaField } from "tinacms/react";
import { useLiveTina } from "@/hooks/use-live-tina";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { CmsStatusPill } from "@/components/site/CmsStatusPill";
import { RichText } from "@/components/site/RichText";

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

// Must match generated Post query: Document _sys + id are required for Tina to bind edits (including rich-text body).
const postQuery = `
  query post($relativePath: String!) {
    post(relativePath: $relativePath) {
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
      excerpt
      coverImage
      publishedAt
      tags
      body
    }
  }
`;

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

        {post.coverImage && (
          <div className="aspect-[16/9] overflow-hidden rounded-lg mb-8">
            <img
              src={post.coverImage as string}
              alt={post.title as string}
              className="w-full h-full object-cover"
              data-tina-field={tinaField(post, "coverImage")}
            />
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 mb-4 text-sm text-muted-foreground">
          {post.publishedAt && (
            <span
              className="flex items-center gap-1"
              data-tina-field={tinaField(post, "publishedAt")}
            >
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(post.publishedAt as string)}
            </span>
          )}
          {Array.isArray(post.tags) && post.tags.length > 0 && (
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
          )}
        </div>

        <h1
          className="text-3xl md:text-4xl font-display mb-6"
          data-tina-field={tinaField(post, "title")}
        >
          {post.title as string}
        </h1>

        {post.excerpt && (
          <div
            className="text-lg font-sans text-muted-foreground mb-8 leading-relaxed"
            data-tina-field={tinaField(post, "excerpt")}
          >
            <RichText value={post.excerpt} />
          </div>
        )}

        <div
          className="prose prose-neutral max-w-none"
          data-tina-field={tinaField(post, "body")}
        >
          {post.body ? (
            <TinaMarkdown content={post.body} />
          ) : (
            <p className="text-muted-foreground">No content yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
