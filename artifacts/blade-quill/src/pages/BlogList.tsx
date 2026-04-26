import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { Calendar, ArrowRight } from "lucide-react";
import { tinaField } from "tinacms/react";

const postModules = import.meta.glob("../../content/posts/*.json", { eager: true }) as Record<
  string,
  { default?: Record<string, unknown> } & Record<string, unknown>
>;

interface PostMeta {
  slug: string;
  title: string;
  excerpt?: string;
  coverImage?: string;
  publishedAt?: string;
  tags?: string[];
}

function loadPosts(): PostMeta[] {
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
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });
}

function formatDate(iso?: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogList() {
  const [, setLocation] = useLocation();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const posts = useMemo(loadPosts, []);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    for (const p of posts) {
      for (const t of p.tags ?? []) set.add(t);
    }
    return Array.from(set).sort();
  }, [posts]);

  const filtered = useMemo(() => {
    if (!selectedTag) return posts;
    return posts.filter((p) => p.tags?.includes(selectedTag));
  }, [posts, selectedTag]);

  return (
    <div className="min-h-screen py-10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-2xl mb-10">
          <h1 className="text-3xl md:text-4xl font-display mb-3">Blog</h1>
          <p className="text-base text-muted-foreground">
            News, behind-the-scenes, and art tips from Corinne.
          </p>
        </div>

        {allTags.length > 0 && (
          <div className="flex flex-nowrap overflow-x-auto scrollbar-hide gap-2 mb-8 pb-1">
            <button
              onClick={() => setSelectedTag(null)}
              className={`tag-pill ${selectedTag === null ? "tag-pill-active" : "tag-pill-inactive"}`}
            >
              All
              <span className="text-xs opacity-60">{posts.length}</span>
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                className={`tag-pill ${selectedTag === tag ? "tag-pill-active" : "tag-pill-inactive"}`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((post) => (
              <div
                key={post.slug}
                className="gumroad-card cursor-pointer group flex flex-col"
                onClick={() => setLocation(`/blog/${post.slug}`)}
              >
                {post.coverImage && (
                  <div className="aspect-[16/9] overflow-hidden">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-4 flex flex-col flex-grow">
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] uppercase tracking-widest font-bold text-violet bg-violet/10 px-2 py-0.5 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <h3 className="font-normal leading-snug line-clamp-2 mb-1.5 group-hover:text-violet transition-colors">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3 flex-grow">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/50">
                    {post.publishedAt && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(post.publishedAt)}
                      </span>
                    )}
                    <span className="text-xs font-medium text-foreground flex items-center gap-0.5">
                      Read <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-border rounded-lg">
            <h3 className="text-xl font-sans text-muted-foreground mb-2">No posts yet</h3>
            <p className="text-sm text-muted-foreground">Check back soon for updates.</p>
          </div>
        )}
      </div>
    </div>
  );
}
