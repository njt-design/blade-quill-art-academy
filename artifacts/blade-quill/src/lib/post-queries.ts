/**
 * GraphQL field selections for blog post sections.
 * Must stay in sync with BLOG_BLOCKS in tina/blog-blocks.ts.
 */

const TEXT_STYLE_SELECTION =
  "textStyle { headingSize headingType headingFont align bodySize }";

function withTextStyle(fields: string): string {
  return `${fields} ${TEXT_STYLE_SELECTION}`;
}

/** GraphQL field selection for each blog section template (keyed by template name). */
export const BLOG_SECTION_FIELDS: Record<string, string> = {
  heading: "number text level",
  text: withTextStyle("heading body"),
  spacer: "size",
  divider: "style",
  image: "src alt caption width aspect",
  imageSideBySide: withTextStyle(
    "heading leftImage { src alt caption } rightImage { src alt caption } style"
  ),
  imageGallery: withTextStyle("heading images { src alt caption }"),
  videoEmbed: withTextStyle("heading youtubeUrl"),
  callout: "title body tone",
  ctaBand: withTextStyle("heading description ctaLabel ctaLink variant"),
};

function pascalCase(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

/** Inline fragments for Post.sections under Tina's PostSections* union. */
function sectionsSelection(): string {
  return Object.entries(BLOG_SECTION_FIELDS)
    .map(
      ([name, fields]) =>
        `... on PostSections${pascalCase(name)} { __typename ${fields} }`
    )
    .join("\n        ");
}

const SYS_SELECTION =
  "... on Document { _sys { filename basename hasReferences breadcrumbs path relativePath extension } id }";

/** Live Tina query for a single blog post (visual editing + freshness). */
export const postQuery = `
  query post($relativePath: String!) {
    post(relativePath: $relativePath) {
      ${SYS_SELECTION}
      __typename
      title
      excerpt
      coverImage
      publishedAt
      tags
      showTableOfContents
      sections {
        ${sectionsSelection()}
      }
    }
  }
`;
