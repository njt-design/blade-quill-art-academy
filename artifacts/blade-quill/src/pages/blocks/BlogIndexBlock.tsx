import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { Calendar, ArrowRight } from "lucide-react";
import { tinaField } from "tinacms/react";
import { useLiveBlogPosts } from "@/hooks/use-live-content";
import { formatBlogDate } from "@/lib/blog-posts";
import { richTextToPlain } from "@/lib/rich-text";
import { type Block } from "./block-utils";

interface Props {
  block: Block;
}

/**
 * Blog Index — the full post grid with an optional tag filter. Posts appear
 * automatically from the Blog Posts collection; this block just renders them.
 * Lives on /blog by default but can be dropped on any page.
 */
export default function BlogIndexBlock({ block }: Props) {
  const [, setLocation] = useLocation();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const posts = useLiveBlogPosts();
  const showTagFilter = block.showTagFilter !== false;

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
    <section className="pt-2 pb-16">
      <div className="container mx-auto px-4 md:px-6">
        {showTagFilter && allTags.length > 0 && (
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
                  <div className="aspect-[16/9] img-fit-wrap bg-muted">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="img-fit"
                      onError={(e) => {
                        // Broken cover URL: hide the image area instead of showing alt text.
                        e.currentTarget.parentElement!.style.display = "none";
                      }}
                    />
                  </div>
                )}
                <div className="p-4 flex flex-col flex-grow">
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] uppercase tracking-widest font-bold text-brown bg-brown/10 px-2 py-0.5 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <h3 className="font-normal leading-snug line-clamp-2 mb-1.5 group-hover:text-brown transition-colors">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3 flex-grow">
                      {richTextToPlain(post.excerpt)}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/50">
                    {post.publishedAt && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatBlogDate(post.publishedAt)}
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
          <div
            className="text-center py-20 border border-dashed border-border rounded-lg"
            data-tina-field={tinaField(block, "emptyHeading")}
          >
            <h3 className="text-xl font-sans text-muted-foreground mb-2">
              {(block.emptyHeading as string) || "No posts yet"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {(block.emptyDescription as string) || "Check back soon for updates."}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
