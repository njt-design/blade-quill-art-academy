const postModules = import.meta.glob("../../content/posts/*.json", {
  eager: true,
}) as Record<
  string,
  { default?: Record<string, unknown> } & Record<string, unknown>
>;

export interface BlogPostMeta {
  slug: string;
  title: string;
  excerpt?: string;
  coverImage?: string;
  publishedAt?: string;
  tags?: string[];
}

export function loadBlogPosts(): BlogPostMeta[] {
  return Object.entries(postModules)
    .map(([path, mod]) => {
      const data = (mod.default ?? mod) as Record<string, unknown>;
      const slug = path.split("/").pop()?.replace(".json", "") ?? "";
      return {
        slug,
        title: (data.title as string) ?? "Untitled",
        excerpt: data.excerpt as string | undefined,
        coverImage: data.coverImage as string | undefined,
        publishedAt: data.publishedAt as string | undefined,
        tags: data.tags as string[] | undefined,
      };
    })
    .sort((a, b) => {
      if (!a.publishedAt) return 1;
      if (!b.publishedAt) return -1;
      return (
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    });
}

export function formatBlogDate(iso?: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
