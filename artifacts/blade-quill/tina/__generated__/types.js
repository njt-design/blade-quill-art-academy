export function gql(strings, ...args) {
  let str = "";
  strings.forEach((string, i) => {
    str += string + (args[i] || "");
  });
  return str;
}
export const HomePartsFragmentDoc = gql`
    fragment HomeParts on Home {
  __typename
  hero {
    __typename
    heading
    subheading
    ctaPrimary
    ctaSecondary
    backgroundImage
  }
  latestSection {
    __typename
    heading
    viewAllLabel
  }
  featuredSection {
    __typename
    heading
    subheading
    viewAllLabel
  }
  artistBanner {
    __typename
    badge
    heading
    bio
    ctaLabel
    portraitImage
  }
  tutorialsSection {
    __typename
    heading
    subheading
    browseAllLabel
  }
  classesSection {
    __typename
    eyebrow
    heading
    subheading
    body
    bullets
    ctaLabel
    ctaLink
    metaTags
    image
  }
  blogSection {
    __typename
    heading
    subheading
    viewAllLabel
  }
  newsletterSection {
    __typename
    heading
    subheading
    placeholderText
    ctaLabel
    privacyNote
  }
  bookPromo {
    __typename
    heading
    description
    ctaLabel
    ctaLink
  }
}
    `;
export const AboutPartsFragmentDoc = gql`
    fragment AboutParts on About {
  __typename
  pageTitle
  portraitImage
  leadText
  paragraph1
  paragraph2
  skill1Label
  skill2Label
  skill3Label
  ctaPrimary
  ctaPrimaryLink
  ctaSecondary
  ctaSecondaryLink
}
    `;
export const ImportantLinksPartsFragmentDoc = gql`
    fragment ImportantLinksParts on ImportantLinks {
  __typename
  pageTitle
  featuredRelease {
    __typename
    eyebrow
    title
    description
    coverImage
    backCoverImage
    ctaLabel
    ctaHref
  }
  reviewsSection {
    __typename
    heading
    intro
    thankYou
    ctaHeading
  }
  reviewLinks {
    __typename
    label
    href
    region
  }
  kofiSection {
    __typename
    heading
    body
    ctaLabel
    href
  }
}
    `;
export const ContactPartsFragmentDoc = gql`
    fragment ContactParts on Contact {
  __typename
  pageTitle
  pageDescription
  email
  location
}
    `;
export const ShopPartsFragmentDoc = gql`
    fragment ShopParts on Shop {
  __typename
  pageTitle
  pageDescription
  emptyHeading
  emptyDescription
}
    `;
export const GalleryPartsFragmentDoc = gql`
    fragment GalleryParts on Gallery {
  __typename
  pageTitle
  pageDescription
  emptyHeading
  emptyDescription
}
    `;
export const TutorialsPartsFragmentDoc = gql`
    fragment TutorialsParts on Tutorials {
  __typename
  pageTitle
  pageDescription
  subscribeLabel
  youtubeUrl
  emptyHeading
  emptyDescription
}
    `;
export const DownloadsPartsFragmentDoc = gql`
    fragment DownloadsParts on Downloads {
  __typename
  pageTitle
  pageDescription
  emptyHeading
  emptyDescription
}
    `;
export const ShopProductPartsFragmentDoc = gql`
    fragment ShopProductParts on ShopProduct {
  __typename
  productId
  name
  description
  price
  category
  image
  gumroadUrl
  downloadUrl
  featured
  inStock
  createdAt
}
    `;
export const PostPartsFragmentDoc = gql`
    fragment PostParts on Post {
  __typename
  title
  excerpt
  coverImage
  publishedAt
  tags
  body
}
    `;
export const LandingPagePartsFragmentDoc = gql`
    fragment LandingPageParts on LandingPage {
  __typename
  title
  blocks {
    __typename
    ... on LandingPageBlocksHero {
      heading
      subheading
      backgroundImage
      ctaLabel
      ctaLink
    }
    ... on LandingPageBlocksText {
      heading
      body
    }
    ... on LandingPageBlocksImageGallery {
      heading
      images {
        __typename
        src
        alt
        caption
      }
    }
    ... on LandingPageBlocksCtaBand {
      heading
      description
      ctaLabel
      ctaLink
      variant
    }
    ... on LandingPageBlocksVideoEmbed {
      heading
      youtubeUrl
    }
    ... on LandingPageBlocksFeatureGrid {
      heading
      items {
        __typename
        icon
        title
        description
      }
    }
  }
}
    `;
export const HomeDocument = gql`
    query home($relativePath: String!) {
  home(relativePath: $relativePath) {
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
    ...HomeParts
  }
}
    ${HomePartsFragmentDoc}`;
export const HomeConnectionDocument = gql`
    query homeConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: HomeFilter) {
  homeConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
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
        ...HomeParts
      }
    }
  }
}
    ${HomePartsFragmentDoc}`;
export const AboutDocument = gql`
    query about($relativePath: String!) {
  about(relativePath: $relativePath) {
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
    ...AboutParts
  }
}
    ${AboutPartsFragmentDoc}`;
export const AboutConnectionDocument = gql`
    query aboutConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: AboutFilter) {
  aboutConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
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
        ...AboutParts
      }
    }
  }
}
    ${AboutPartsFragmentDoc}`;
export const ImportantLinksDocument = gql`
    query importantLinks($relativePath: String!) {
  importantLinks(relativePath: $relativePath) {
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
    ...ImportantLinksParts
  }
}
    ${ImportantLinksPartsFragmentDoc}`;
export const ImportantLinksConnectionDocument = gql`
    query importantLinksConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: ImportantLinksFilter) {
  importantLinksConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
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
        ...ImportantLinksParts
      }
    }
  }
}
    ${ImportantLinksPartsFragmentDoc}`;
export const ContactDocument = gql`
    query contact($relativePath: String!) {
  contact(relativePath: $relativePath) {
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
    ...ContactParts
  }
}
    ${ContactPartsFragmentDoc}`;
export const ContactConnectionDocument = gql`
    query contactConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: ContactFilter) {
  contactConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
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
        ...ContactParts
      }
    }
  }
}
    ${ContactPartsFragmentDoc}`;
export const ShopDocument = gql`
    query shop($relativePath: String!) {
  shop(relativePath: $relativePath) {
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
    ...ShopParts
  }
}
    ${ShopPartsFragmentDoc}`;
export const ShopConnectionDocument = gql`
    query shopConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: ShopFilter) {
  shopConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
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
        ...ShopParts
      }
    }
  }
}
    ${ShopPartsFragmentDoc}`;
export const GalleryDocument = gql`
    query gallery($relativePath: String!) {
  gallery(relativePath: $relativePath) {
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
    ...GalleryParts
  }
}
    ${GalleryPartsFragmentDoc}`;
export const GalleryConnectionDocument = gql`
    query galleryConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: GalleryFilter) {
  galleryConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
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
        ...GalleryParts
      }
    }
  }
}
    ${GalleryPartsFragmentDoc}`;
export const TutorialsDocument = gql`
    query tutorials($relativePath: String!) {
  tutorials(relativePath: $relativePath) {
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
    ...TutorialsParts
  }
}
    ${TutorialsPartsFragmentDoc}`;
export const TutorialsConnectionDocument = gql`
    query tutorialsConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: TutorialsFilter) {
  tutorialsConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
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
        ...TutorialsParts
      }
    }
  }
}
    ${TutorialsPartsFragmentDoc}`;
export const DownloadsDocument = gql`
    query downloads($relativePath: String!) {
  downloads(relativePath: $relativePath) {
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
    ...DownloadsParts
  }
}
    ${DownloadsPartsFragmentDoc}`;
export const DownloadsConnectionDocument = gql`
    query downloadsConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: DownloadsFilter) {
  downloadsConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
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
        ...DownloadsParts
      }
    }
  }
}
    ${DownloadsPartsFragmentDoc}`;
export const ShopProductDocument = gql`
    query shopProduct($relativePath: String!) {
  shopProduct(relativePath: $relativePath) {
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
    ...ShopProductParts
  }
}
    ${ShopProductPartsFragmentDoc}`;
export const ShopProductConnectionDocument = gql`
    query shopProductConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: ShopProductFilter) {
  shopProductConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
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
        ...ShopProductParts
      }
    }
  }
}
    ${ShopProductPartsFragmentDoc}`;
export const PostDocument = gql`
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
    ...PostParts
  }
}
    ${PostPartsFragmentDoc}`;
export const PostConnectionDocument = gql`
    query postConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: PostFilter) {
  postConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
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
        ...PostParts
      }
    }
  }
}
    ${PostPartsFragmentDoc}`;
export const LandingPageDocument = gql`
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
    ...LandingPageParts
  }
}
    ${LandingPagePartsFragmentDoc}`;
export const LandingPageConnectionDocument = gql`
    query landingPageConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: LandingPageFilter) {
  landingPageConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
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
        ...LandingPageParts
      }
    }
  }
}
    ${LandingPagePartsFragmentDoc}`;
export function getSdk(requester) {
  return {
    home(variables, options) {
      return requester(HomeDocument, variables, options);
    },
    homeConnection(variables, options) {
      return requester(HomeConnectionDocument, variables, options);
    },
    about(variables, options) {
      return requester(AboutDocument, variables, options);
    },
    aboutConnection(variables, options) {
      return requester(AboutConnectionDocument, variables, options);
    },
    importantLinks(variables, options) {
      return requester(ImportantLinksDocument, variables, options);
    },
    importantLinksConnection(variables, options) {
      return requester(ImportantLinksConnectionDocument, variables, options);
    },
    contact(variables, options) {
      return requester(ContactDocument, variables, options);
    },
    contactConnection(variables, options) {
      return requester(ContactConnectionDocument, variables, options);
    },
    shop(variables, options) {
      return requester(ShopDocument, variables, options);
    },
    shopConnection(variables, options) {
      return requester(ShopConnectionDocument, variables, options);
    },
    gallery(variables, options) {
      return requester(GalleryDocument, variables, options);
    },
    galleryConnection(variables, options) {
      return requester(GalleryConnectionDocument, variables, options);
    },
    tutorials(variables, options) {
      return requester(TutorialsDocument, variables, options);
    },
    tutorialsConnection(variables, options) {
      return requester(TutorialsConnectionDocument, variables, options);
    },
    downloads(variables, options) {
      return requester(DownloadsDocument, variables, options);
    },
    downloadsConnection(variables, options) {
      return requester(DownloadsConnectionDocument, variables, options);
    },
    shopProduct(variables, options) {
      return requester(ShopProductDocument, variables, options);
    },
    shopProductConnection(variables, options) {
      return requester(ShopProductConnectionDocument, variables, options);
    },
    post(variables, options) {
      return requester(PostDocument, variables, options);
    },
    postConnection(variables, options) {
      return requester(PostConnectionDocument, variables, options);
    },
    landingPage(variables, options) {
      return requester(LandingPageDocument, variables, options);
    },
    landingPageConnection(variables, options) {
      return requester(LandingPageConnectionDocument, variables, options);
    }
  };
}
import { createClient } from "tinacms/dist/client";
const generateRequester = (client) => {
  const requester = async (doc, vars, options) => {
    let url = client.apiUrl;
    if (options?.branch) {
      const index = client.apiUrl.lastIndexOf("/");
      url = client.apiUrl.substring(0, index + 1) + options.branch;
    }
    const data = await client.request({
      query: doc,
      variables: vars,
      url
    }, options);
    return { data: data?.data, errors: data?.errors, query: doc, variables: vars || {} };
  };
  return requester;
};
export const ExperimentalGetTinaClient = () => getSdk(
  generateRequester(
    createClient({
      url: "http://localhost:4001/graphql",
      queries
    })
  )
);
export const queries = (client) => {
  const requester = generateRequester(client);
  return getSdk(requester);
};
