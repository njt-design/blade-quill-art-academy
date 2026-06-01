import { ArrowRight, Calendar } from "lucide-react";
import { formatBlogDate, type BlogPostMeta } from "@/lib/blog-posts";
import { richTextToPlain } from "@/lib/rich-text";
import { HomeSectionHeader } from "./HomeSectionHeader";
import { ParallaxImage } from "./ParallaxImage";
import {
  SectionReveal,
  SectionRevealItem,
  SectionRevealStagger,
} from "./SectionReveal";

export type BlogSectionContent = {
  heading?: string | null;
  subheading?: string | null;
  viewAllLabel?: string | null;
};

type Props = {
  content?: BlogSectionContent | null;
  posts: BlogPostMeta[];
  onNavigate: (path: string) => void;
};

function PostCard({
  post,
  onNavigate,
}: {
  post: BlogPostMeta;
  onNavigate: (path: string) => void;
}) {
  return (
    <div
      className="home-card group cursor-pointer flex flex-col h-full"
      onClick={() => onNavigate(`/blog/${post.slug}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onNavigate(`/blog/${post.slug}`);
        }
      }}
    >
      {post.coverImage && (
        <div className="home-media-mask">
          <div className="aspect-video overflow-hidden">
            <ParallaxImage
              src={post.coverImage}
              alt={post.title}
              loading="lazy"
            />
          </div>
        </div>
      )}
      <div className="p-5 md:p-6 flex flex-col flex-grow">
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {post.tags.slice(0, 2).map((tag) => (
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
  );
}

export function RecentPostsSection({ content, posts, onNavigate }: Props) {
  const recent = posts.slice(0, 3);

  const cardList =
    recent.length > 0
      ? recent.map((post) => (
          <SectionRevealItem key={post.slug} className="home-snap-item">
            <PostCard post={post} onNavigate={onNavigate} />
          </SectionRevealItem>
        ))
      : null;

  return (
    <SectionReveal className="home-section bg-secondary/40">
      <div className="container mx-auto px-4 md:px-6">
        <HomeSectionHeader
          content={content}
          heading={content?.heading || "Recent Blog Posts"}
          subheading={
            content?.subheading ||
            "News, art tips, and behind-the-scenes updates from Corinne."
          }
          viewAllLabel={content?.viewAllLabel || "View All"}
          onViewAll={() => onNavigate("/blog")}
        />

        {cardList ? (
          <SectionRevealStagger className="home-scroll-snap lg:grid lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {cardList}
          </SectionRevealStagger>
        ) : (
          <div className="text-center py-12 border border-dashed border-border rounded-3xl">
            <p className="text-muted-foreground">No blog posts yet.</p>
          </div>
        )}
      </div>
    </SectionReveal>
  );
}
