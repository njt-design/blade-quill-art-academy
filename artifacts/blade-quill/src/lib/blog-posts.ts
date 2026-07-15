import { isRichText, type RichTextValue } from "@/lib/rich-text";

const postModules = import.meta.glob("../../content/posts/*.json", {
  eager: true,
}) as Record<
  string,
  { default?: Record<string, unknown> } & Record<string, unknown>
>;

export interface BlogPostMeta {
  slug: string;
  title: string;
  excerpt?: string | RichTextValue;
  coverImage?: string;
  publishedAt?: string;
  tags?: string[];
}

/** Build a BlogPostMeta from raw Tina document data (bundled JSON or GraphQL node). */
export function toBlogPostMeta(
  slug: string,
  data: Record<string, unknown>
): BlogPostMeta {
  return {
    slug,
    title: (data.title as string) ?? "Untitled",
    excerpt: isRichText(data.excerpt)
      ? data.excerpt
      : (data.excerpt as string | undefined),
    coverImage: data.coverImage as string | undefined,
    publishedAt: data.publishedAt as string | undefined,
    tags: data.tags as string[] | undefined,
  };
}

/** Newest-first sort shared by the bundled and live post loaders. */
export function sortBlogPosts(posts: BlogPostMeta[]): BlogPostMeta[] {
  return [...posts].sort((a, b) => {
    if (!a.publishedAt) return 1;
    if (!b.publishedAt) return -1;
    return (
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  });
}

export function loadBlogPosts(): BlogPostMeta[] {
  return sortBlogPosts(
    Object.entries(postModules).map(([path, mod]) => {
      const data = (mod.default ?? mod) as Record<string, unknown>;
      const slug = path.split("/").pop()?.replace(".json", "") ?? "";
      return toBlogPostMeta(slug, data);
    })
  );
}

export function formatBlogDate(iso?: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
