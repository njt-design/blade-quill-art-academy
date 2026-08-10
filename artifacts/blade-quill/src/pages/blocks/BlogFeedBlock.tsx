import { Link } from "wouter";
import { useLiveBlogPosts } from "@/hooks/use-live-content";
import { formatBlogDate } from "@/lib/blog-posts";
import { ArtTile, type ArtTilePalette } from "@/components/site/ArtTile";
import { Reveal } from "@/components/site/Reveal";
import { type Block } from "./block-utils";
import { NewsletterPanel, type NewsletterContent } from "./NewsletterPanel";
import { SectionHeading, sectionAlignStyle } from "./text-style";

interface Props {
  block: Block;
}

export default function BlogFeedBlock({ block }: Props) {
  const blogPosts = useLiveBlogPosts().slice(0, 3);
  const showNewsletter = block.showNewsletter !== false;
  const newsletter = (block.newsletter as NewsletterContent | undefined) ?? {};

  const postsList = (
    <div style={sectionAlignStyle(block)}>
      <Reveal>
        <SectionHeading
          block={block}
          defaultTag="h2"
          baseSize="clamp(32px, 4vw, 44px)"
          className="mb-7"
        >
          {(block.heading as string) || "Recent writing."}
        </SectionHeading>
      </Reveal>
      <Reveal stagger>
        <div className="flex flex-col">
          {blogPosts.map((post, i) => {
            const palette: ArtTilePalette = (
              ["warm", "rose", "violet"] as ArtTilePalette[]
            )[i % 3];
            return (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="blog-row grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-[140px_1fr_auto] items-start sm:items-center"
                style={{
                  padding: "22px 0",
                  borderBottom: "1px solid rgba(46,34,34,0.1)",
                }}
              >
                <div className="w-full sm:w-[140px]">
                  <ArtTile
                    palette={palette}
                    src={post.coverImage}
                    width="100%"
                    height={86}
                    alt={post.title}
                  />
                </div>
                <div>
                  <div className="eyebrow mb-1.5">
                    {(formatBlogDate(post.publishedAt) || "").toUpperCase()}
                  </div>
                  <h3 style={{ fontSize: "clamp(18px, 2vw, 22px)", lineHeight: 1.3 }}>
                    {post.title}
                  </h3>
                </div>
                <span
                  className="blog-arrow hidden sm:block"
                  style={{
                    fontFamily: "var(--f-mono)",
                    fontSize: 18,
                    color: "var(--maroon)",
                  }}
                >
                  →
                </span>
              </Link>
            );
          })}
        </div>
      </Reveal>
    </div>
  );

  return (
    <section className="py-24 lg:py-28" style={{ background: "var(--paper-2)" }}>
      <div className="bq-container">
        {showNewsletter ? (
          <div className="grid items-stretch gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
            {postsList}
            <Reveal className="h-full min-h-0">
              <NewsletterPanel content={newsletter} />
            </Reveal>
          </div>
        ) : (
          postsList
        )}
      </div>
    </section>
  );
}
