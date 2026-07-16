export function gql(strings, ...args) {
  let str = "";
  strings.forEach((string, i) => {
    str += string + (args[i] || "");
  });
  return str;
}
export const PagePartsFragmentDoc = gql`
    fragment PageParts on Page {
  __typename
  title
  layout
  blocks {
    __typename
    ... on PageBlocksHomeHero {
      eyebrow
      heading
      subheading
      ctaPrimary
      ctaPrimaryLink
      ctaSecondary
      ctaSecondaryLink
      metaLine
      marqueeItems
    }
    ... on PageBlocksAboutHero {
      eyebrow
      heading
      leadText
      ctaPrimary
      ctaPrimaryLink
      ctaSecondary
      ctaSecondaryLink
      metaLine
      portraitImage
      portraitCaption
      deskImage
      deskCaption
      screenImage
      screenCaption
    }
    ... on PageBlocksHero {
      heading
      subheading
      backgroundImage
      ctaLabel
      ctaLink
    }
    ... on PageBlocksPageHeader {
      heading
      description
    }
    ... on PageBlocksText {
      heading
      body
    }
    ... on PageBlocksStory {
      number
      label
      heading
      paragraph1
      quote
      paragraph2
      sideImage
      sideCaption
    }
    ... on PageBlocksTimeline {
      number
      label
      events {
        __typename
        year
        title
        description
        image
      }
    }
    ... on PageBlocksStatsRow {
      stats {
        __typename
        value
        label
      }
    }
    ... on PageBlocksFeatureGrid {
      heading
      items {
        __typename
        icon
        title
        description
      }
    }
    ... on PageBlocksCardRow {
      number
      label
      cards {
        __typename
        tag
        title
        body
        image
        ctaLabel
        link
      }
    }
    ... on PageBlocksPillars {
      eyebrow
      heading
      items {
        __typename
        tag
        title
        sub
        cta
        badge
        link
        image
      }
    }
    ... on PageBlocksImageGallery {
      heading
      images {
        __typename
        src
        alt
        caption
      }
    }
    ... on PageBlocksVideoEmbed {
      heading
      youtubeUrl
    }
    ... on PageBlocksFeaturedBook {
      eyebrow
      heading
      description
      stats {
        __typename
        value
        label
      }
      ctaLabel
      ctaLink
      secondaryLabel
      secondaryLink
    }
    ... on PageBlocksFeaturedRelease {
      eyebrow
      title
      description
      coverImage
      backCoverImage
      ctaLabel
      ctaHref
    }
    ... on PageBlocksProductStrip {
      eyebrow
      heading
      viewAllLabel
      viewAllLink
    }
    ... on PageBlocksShopCatalog {
      heading
      highlightText
      description
      showFeaturedBanner
      emptyHeading
      emptyDescription
    }
    ... on PageBlocksGalleryGrid {
      emptyHeading
      emptyDescription
    }
    ... on PageBlocksDownloadsGrid {
      emptyHeading
      emptyDescription
    }
    ... on PageBlocksTutorialsStrip {
      eyebrow
      headingPrefix
      headingHighlight
      headingSuffix
      buttonLabel
      youtubeUrl
      stats {
        __typename
        value
        label
      }
    }
    ... on PageBlocksClassesPitch {
      eyebrow
      heading
      subheading
      bullets
      metaTags
      ctaLabel
      ctaLink
      secondaryLabel
      secondaryLink
    }
    ... on PageBlocksBlogFeed {
      heading
      showNewsletter
      newsletter {
        __typename
        eyebrow
        heading
        subheading
        placeholderText
        ctaLabel
        privacyNote
      }
    }
    ... on PageBlocksCtaBand {
      heading
      description
      ctaLabel
      ctaLink
      variant
    }
    ... on PageBlocksBigCta {
      eyebrow
      heading
      highlightText
      primaryLabel
      primaryLink
      secondaryLabel
      secondaryLink
    }
    ... on PageBlocksNewsletterSignup {
      eyebrow
      heading
      subheading
      placeholderText
      ctaLabel
      privacyNote
    }
    ... on PageBlocksContactInfo {
      email
      location
    }
    ... on PageBlocksContactForm {
      submitLabel
    }
    ... on PageBlocksKofiSupport {
      heading
      body
      ctaLabel
      href
    }
    ... on PageBlocksReviewLinks {
      heading
      intro
      thankYou
      ctaHeading
      links {
        __typename
        label
        href
        region
      }
    }
    ... on PageBlocksMarquee {
      highlightText
      text
    }
    ... on PageBlocksSocialLinks {
      links {
        __typename
        platform
        url
        label
      }
    }
  }
}
    `;
export const LandingPagePartsFragmentDoc = gql`
    fragment LandingPageParts on LandingPage {
  __typename
  ... on LandingPageBlank {
    title
    layout
    blocks {
      __typename
      ... on LandingPageBlankBlocksHomeHero {
        eyebrow
        heading
        subheading
        ctaPrimary
        ctaPrimaryLink
        ctaSecondary
        ctaSecondaryLink
        metaLine
        marqueeItems
      }
      ... on LandingPageBlankBlocksAboutHero {
        eyebrow
        heading
        leadText
        ctaPrimary
        ctaPrimaryLink
        ctaSecondary
        ctaSecondaryLink
        metaLine
        portraitImage
        portraitCaption
        deskImage
        deskCaption
        screenImage
        screenCaption
      }
      ... on LandingPageBlankBlocksHero {
        heading
        subheading
        backgroundImage
        ctaLabel
        ctaLink
      }
      ... on LandingPageBlankBlocksPageHeader {
        heading
        description
      }
      ... on LandingPageBlankBlocksText {
        heading
        body
      }
      ... on LandingPageBlankBlocksStory {
        number
        label
        heading
        paragraph1
        quote
        paragraph2
        sideImage
        sideCaption
      }
      ... on LandingPageBlankBlocksTimeline {
        number
        label
        events {
          __typename
          year
          title
          description
          image
        }
      }
      ... on LandingPageBlankBlocksStatsRow {
        stats {
          __typename
          value
          label
        }
      }
      ... on LandingPageBlankBlocksFeatureGrid {
        heading
        items {
          __typename
          icon
          title
          description
        }
      }
      ... on LandingPageBlankBlocksCardRow {
        number
        label
        cards {
          __typename
          tag
          title
          body
          image
          ctaLabel
          link
        }
      }
      ... on LandingPageBlankBlocksPillars {
        eyebrow
        heading
        items {
          __typename
          tag
          title
          sub
          cta
          badge
          link
          image
        }
      }
      ... on LandingPageBlankBlocksImageGallery {
        heading
        images {
          __typename
          src
          alt
          caption
        }
      }
      ... on LandingPageBlankBlocksVideoEmbed {
        heading
        youtubeUrl
      }
      ... on LandingPageBlankBlocksFeaturedBook {
        eyebrow
        heading
        description
        stats {
          __typename
          value
          label
        }
        ctaLabel
        ctaLink
        secondaryLabel
        secondaryLink
      }
      ... on LandingPageBlankBlocksFeaturedRelease {
        eyebrow
        title
        description
        coverImage
        backCoverImage
        ctaLabel
        ctaHref
      }
      ... on LandingPageBlankBlocksProductStrip {
        eyebrow
        heading
        viewAllLabel
        viewAllLink
      }
      ... on LandingPageBlankBlocksShopCatalog {
        heading
        highlightText
        description
        showFeaturedBanner
        emptyHeading
        emptyDescription
      }
      ... on LandingPageBlankBlocksGalleryGrid {
        emptyHeading
        emptyDescription
      }
      ... on LandingPageBlankBlocksDownloadsGrid {
        emptyHeading
        emptyDescription
      }
      ... on LandingPageBlankBlocksTutorialsStrip {
        eyebrow
        headingPrefix
        headingHighlight
        headingSuffix
        buttonLabel
        youtubeUrl
        stats {
          __typename
          value
          label
        }
      }
      ... on LandingPageBlankBlocksClassesPitch {
        eyebrow
        heading
        subheading
        bullets
        metaTags
        ctaLabel
        ctaLink
        secondaryLabel
        secondaryLink
      }
      ... on LandingPageBlankBlocksBlogFeed {
        heading
        showNewsletter
        newsletter {
          __typename
          eyebrow
          heading
          subheading
          placeholderText
          ctaLabel
          privacyNote
        }
      }
      ... on LandingPageBlankBlocksCtaBand {
        heading
        description
        ctaLabel
        ctaLink
        variant
      }
      ... on LandingPageBlankBlocksBigCta {
        eyebrow
        heading
        highlightText
        primaryLabel
        primaryLink
        secondaryLabel
        secondaryLink
      }
      ... on LandingPageBlankBlocksNewsletterSignup {
        eyebrow
        heading
        subheading
        placeholderText
        ctaLabel
        privacyNote
      }
      ... on LandingPageBlankBlocksContactInfo {
        email
        location
      }
      ... on LandingPageBlankBlocksContactForm {
        submitLabel
      }
      ... on LandingPageBlankBlocksKofiSupport {
        heading
        body
        ctaLabel
        href
      }
      ... on LandingPageBlankBlocksReviewLinks {
        heading
        intro
        thankYou
        ctaHeading
        links {
          __typename
          label
          href
          region
        }
      }
      ... on LandingPageBlankBlocksMarquee {
        highlightText
        text
      }
      ... on LandingPageBlankBlocksSocialLinks {
        links {
          __typename
          platform
          url
          label
        }
      }
    }
  }
  ... on LandingPageEvent {
    title
    layout
    blocks {
      __typename
      ... on LandingPageEventBlocksHomeHero {
        eyebrow
        heading
        subheading
        ctaPrimary
        ctaPrimaryLink
        ctaSecondary
        ctaSecondaryLink
        metaLine
        marqueeItems
      }
      ... on LandingPageEventBlocksAboutHero {
        eyebrow
        heading
        leadText
        ctaPrimary
        ctaPrimaryLink
        ctaSecondary
        ctaSecondaryLink
        metaLine
        portraitImage
        portraitCaption
        deskImage
        deskCaption
        screenImage
        screenCaption
      }
      ... on LandingPageEventBlocksHero {
        heading
        subheading
        backgroundImage
        ctaLabel
        ctaLink
      }
      ... on LandingPageEventBlocksPageHeader {
        heading
        description
      }
      ... on LandingPageEventBlocksText {
        heading
        body
      }
      ... on LandingPageEventBlocksStory {
        number
        label
        heading
        paragraph1
        quote
        paragraph2
        sideImage
        sideCaption
      }
      ... on LandingPageEventBlocksTimeline {
        number
        label
        events {
          __typename
          year
          title
          description
          image
        }
      }
      ... on LandingPageEventBlocksStatsRow {
        stats {
          __typename
          value
          label
        }
      }
      ... on LandingPageEventBlocksFeatureGrid {
        heading
        items {
          __typename
          icon
          title
          description
        }
      }
      ... on LandingPageEventBlocksCardRow {
        number
        label
        cards {
          __typename
          tag
          title
          body
          image
          ctaLabel
          link
        }
      }
      ... on LandingPageEventBlocksPillars {
        eyebrow
        heading
        items {
          __typename
          tag
          title
          sub
          cta
          badge
          link
          image
        }
      }
      ... on LandingPageEventBlocksImageGallery {
        heading
        images {
          __typename
          src
          alt
          caption
        }
      }
      ... on LandingPageEventBlocksVideoEmbed {
        heading
        youtubeUrl
      }
      ... on LandingPageEventBlocksFeaturedBook {
        eyebrow
        heading
        description
        stats {
          __typename
          value
          label
        }
        ctaLabel
        ctaLink
        secondaryLabel
        secondaryLink
      }
      ... on LandingPageEventBlocksFeaturedRelease {
        eyebrow
        title
        description
        coverImage
        backCoverImage
        ctaLabel
        ctaHref
      }
      ... on LandingPageEventBlocksProductStrip {
        eyebrow
        heading
        viewAllLabel
        viewAllLink
      }
      ... on LandingPageEventBlocksShopCatalog {
        heading
        highlightText
        description
        showFeaturedBanner
        emptyHeading
        emptyDescription
      }
      ... on LandingPageEventBlocksGalleryGrid {
        emptyHeading
        emptyDescription
      }
      ... on LandingPageEventBlocksDownloadsGrid {
        emptyHeading
        emptyDescription
      }
      ... on LandingPageEventBlocksTutorialsStrip {
        eyebrow
        headingPrefix
        headingHighlight
        headingSuffix
        buttonLabel
        youtubeUrl
        stats {
          __typename
          value
          label
        }
      }
      ... on LandingPageEventBlocksClassesPitch {
        eyebrow
        heading
        subheading
        bullets
        metaTags
        ctaLabel
        ctaLink
        secondaryLabel
        secondaryLink
      }
      ... on LandingPageEventBlocksBlogFeed {
        heading
        showNewsletter
        newsletter {
          __typename
          eyebrow
          heading
          subheading
          placeholderText
          ctaLabel
          privacyNote
        }
      }
      ... on LandingPageEventBlocksCtaBand {
        heading
        description
        ctaLabel
        ctaLink
        variant
      }
      ... on LandingPageEventBlocksBigCta {
        eyebrow
        heading
        highlightText
        primaryLabel
        primaryLink
        secondaryLabel
        secondaryLink
      }
      ... on LandingPageEventBlocksNewsletterSignup {
        eyebrow
        heading
        subheading
        placeholderText
        ctaLabel
        privacyNote
      }
      ... on LandingPageEventBlocksContactInfo {
        email
        location
      }
      ... on LandingPageEventBlocksContactForm {
        submitLabel
      }
      ... on LandingPageEventBlocksKofiSupport {
        heading
        body
        ctaLabel
        href
      }
      ... on LandingPageEventBlocksReviewLinks {
        heading
        intro
        thankYou
        ctaHeading
        links {
          __typename
          label
          href
          region
        }
      }
      ... on LandingPageEventBlocksMarquee {
        highlightText
        text
      }
      ... on LandingPageEventBlocksSocialLinks {
        links {
          __typename
          platform
          url
          label
        }
      }
    }
  }
  ... on LandingPagePromo {
    title
    layout
    blocks {
      __typename
      ... on LandingPagePromoBlocksHomeHero {
        eyebrow
        heading
        subheading
        ctaPrimary
        ctaPrimaryLink
        ctaSecondary
        ctaSecondaryLink
        metaLine
        marqueeItems
      }
      ... on LandingPagePromoBlocksAboutHero {
        eyebrow
        heading
        leadText
        ctaPrimary
        ctaPrimaryLink
        ctaSecondary
        ctaSecondaryLink
        metaLine
        portraitImage
        portraitCaption
        deskImage
        deskCaption
        screenImage
        screenCaption
      }
      ... on LandingPagePromoBlocksHero {
        heading
        subheading
        backgroundImage
        ctaLabel
        ctaLink
      }
      ... on LandingPagePromoBlocksPageHeader {
        heading
        description
      }
      ... on LandingPagePromoBlocksText {
        heading
        body
      }
      ... on LandingPagePromoBlocksStory {
        number
        label
        heading
        paragraph1
        quote
        paragraph2
        sideImage
        sideCaption
      }
      ... on LandingPagePromoBlocksTimeline {
        number
        label
        events {
          __typename
          year
          title
          description
          image
        }
      }
      ... on LandingPagePromoBlocksStatsRow {
        stats {
          __typename
          value
          label
        }
      }
      ... on LandingPagePromoBlocksFeatureGrid {
        heading
        items {
          __typename
          icon
          title
          description
        }
      }
      ... on LandingPagePromoBlocksCardRow {
        number
        label
        cards {
          __typename
          tag
          title
          body
          image
          ctaLabel
          link
        }
      }
      ... on LandingPagePromoBlocksPillars {
        eyebrow
        heading
        items {
          __typename
          tag
          title
          sub
          cta
          badge
          link
          image
        }
      }
      ... on LandingPagePromoBlocksImageGallery {
        heading
        images {
          __typename
          src
          alt
          caption
        }
      }
      ... on LandingPagePromoBlocksVideoEmbed {
        heading
        youtubeUrl
      }
      ... on LandingPagePromoBlocksFeaturedBook {
        eyebrow
        heading
        description
        stats {
          __typename
          value
          label
        }
        ctaLabel
        ctaLink
        secondaryLabel
        secondaryLink
      }
      ... on LandingPagePromoBlocksFeaturedRelease {
        eyebrow
        title
        description
        coverImage
        backCoverImage
        ctaLabel
        ctaHref
      }
      ... on LandingPagePromoBlocksProductStrip {
        eyebrow
        heading
        viewAllLabel
        viewAllLink
      }
      ... on LandingPagePromoBlocksShopCatalog {
        heading
        highlightText
        description
        showFeaturedBanner
        emptyHeading
        emptyDescription
      }
      ... on LandingPagePromoBlocksGalleryGrid {
        emptyHeading
        emptyDescription
      }
      ... on LandingPagePromoBlocksDownloadsGrid {
        emptyHeading
        emptyDescription
      }
      ... on LandingPagePromoBlocksTutorialsStrip {
        eyebrow
        headingPrefix
        headingHighlight
        headingSuffix
        buttonLabel
        youtubeUrl
        stats {
          __typename
          value
          label
        }
      }
      ... on LandingPagePromoBlocksClassesPitch {
        eyebrow
        heading
        subheading
        bullets
        metaTags
        ctaLabel
        ctaLink
        secondaryLabel
        secondaryLink
      }
      ... on LandingPagePromoBlocksBlogFeed {
        heading
        showNewsletter
        newsletter {
          __typename
          eyebrow
          heading
          subheading
          placeholderText
          ctaLabel
          privacyNote
        }
      }
      ... on LandingPagePromoBlocksCtaBand {
        heading
        description
        ctaLabel
        ctaLink
        variant
      }
      ... on LandingPagePromoBlocksBigCta {
        eyebrow
        heading
        highlightText
        primaryLabel
        primaryLink
        secondaryLabel
        secondaryLink
      }
      ... on LandingPagePromoBlocksNewsletterSignup {
        eyebrow
        heading
        subheading
        placeholderText
        ctaLabel
        privacyNote
      }
      ... on LandingPagePromoBlocksContactInfo {
        email
        location
      }
      ... on LandingPagePromoBlocksContactForm {
        submitLabel
      }
      ... on LandingPagePromoBlocksKofiSupport {
        heading
        body
        ctaLabel
        href
      }
      ... on LandingPagePromoBlocksReviewLinks {
        heading
        intro
        thankYou
        ctaHeading
        links {
          __typename
          label
          href
          region
        }
      }
      ... on LandingPagePromoBlocksMarquee {
        highlightText
        text
      }
      ... on LandingPagePromoBlocksSocialLinks {
        links {
          __typename
          platform
          url
          label
        }
      }
    }
  }
  ... on LandingPageInfo {
    title
    layout
    blocks {
      __typename
      ... on LandingPageInfoBlocksHomeHero {
        eyebrow
        heading
        subheading
        ctaPrimary
        ctaPrimaryLink
        ctaSecondary
        ctaSecondaryLink
        metaLine
        marqueeItems
      }
      ... on LandingPageInfoBlocksAboutHero {
        eyebrow
        heading
        leadText
        ctaPrimary
        ctaPrimaryLink
        ctaSecondary
        ctaSecondaryLink
        metaLine
        portraitImage
        portraitCaption
        deskImage
        deskCaption
        screenImage
        screenCaption
      }
      ... on LandingPageInfoBlocksHero {
        heading
        subheading
        backgroundImage
        ctaLabel
        ctaLink
      }
      ... on LandingPageInfoBlocksPageHeader {
        heading
        description
      }
      ... on LandingPageInfoBlocksText {
        heading
        body
      }
      ... on LandingPageInfoBlocksStory {
        number
        label
        heading
        paragraph1
        quote
        paragraph2
        sideImage
        sideCaption
      }
      ... on LandingPageInfoBlocksTimeline {
        number
        label
        events {
          __typename
          year
          title
          description
          image
        }
      }
      ... on LandingPageInfoBlocksStatsRow {
        stats {
          __typename
          value
          label
        }
      }
      ... on LandingPageInfoBlocksFeatureGrid {
        heading
        items {
          __typename
          icon
          title
          description
        }
      }
      ... on LandingPageInfoBlocksCardRow {
        number
        label
        cards {
          __typename
          tag
          title
          body
          image
          ctaLabel
          link
        }
      }
      ... on LandingPageInfoBlocksPillars {
        eyebrow
        heading
        items {
          __typename
          tag
          title
          sub
          cta
          badge
          link
          image
        }
      }
      ... on LandingPageInfoBlocksImageGallery {
        heading
        images {
          __typename
          src
          alt
          caption
        }
      }
      ... on LandingPageInfoBlocksVideoEmbed {
        heading
        youtubeUrl
      }
      ... on LandingPageInfoBlocksFeaturedBook {
        eyebrow
        heading
        description
        stats {
          __typename
          value
          label
        }
        ctaLabel
        ctaLink
        secondaryLabel
        secondaryLink
      }
      ... on LandingPageInfoBlocksFeaturedRelease {
        eyebrow
        title
        description
        coverImage
        backCoverImage
        ctaLabel
        ctaHref
      }
      ... on LandingPageInfoBlocksProductStrip {
        eyebrow
        heading
        viewAllLabel
        viewAllLink
      }
      ... on LandingPageInfoBlocksShopCatalog {
        heading
        highlightText
        description
        showFeaturedBanner
        emptyHeading
        emptyDescription
      }
      ... on LandingPageInfoBlocksGalleryGrid {
        emptyHeading
        emptyDescription
      }
      ... on LandingPageInfoBlocksDownloadsGrid {
        emptyHeading
        emptyDescription
      }
      ... on LandingPageInfoBlocksTutorialsStrip {
        eyebrow
        headingPrefix
        headingHighlight
        headingSuffix
        buttonLabel
        youtubeUrl
        stats {
          __typename
          value
          label
        }
      }
      ... on LandingPageInfoBlocksClassesPitch {
        eyebrow
        heading
        subheading
        bullets
        metaTags
        ctaLabel
        ctaLink
        secondaryLabel
        secondaryLink
      }
      ... on LandingPageInfoBlocksBlogFeed {
        heading
        showNewsletter
        newsletter {
          __typename
          eyebrow
          heading
          subheading
          placeholderText
          ctaLabel
          privacyNote
        }
      }
      ... on LandingPageInfoBlocksCtaBand {
        heading
        description
        ctaLabel
        ctaLink
        variant
      }
      ... on LandingPageInfoBlocksBigCta {
        eyebrow
        heading
        highlightText
        primaryLabel
        primaryLink
        secondaryLabel
        secondaryLink
      }
      ... on LandingPageInfoBlocksNewsletterSignup {
        eyebrow
        heading
        subheading
        placeholderText
        ctaLabel
        privacyNote
      }
      ... on LandingPageInfoBlocksContactInfo {
        email
        location
      }
      ... on LandingPageInfoBlocksContactForm {
        submitLabel
      }
      ... on LandingPageInfoBlocksKofiSupport {
        heading
        body
        ctaLabel
        href
      }
      ... on LandingPageInfoBlocksReviewLinks {
        heading
        intro
        thankYou
        ctaHeading
        links {
          __typename
          label
          href
          region
        }
      }
      ... on LandingPageInfoBlocksMarquee {
        highlightText
        text
      }
      ... on LandingPageInfoBlocksSocialLinks {
        links {
          __typename
          platform
          url
          label
        }
      }
    }
  }
  ... on LandingPageLinkInBio {
    title
    layout
    blocks {
      __typename
      ... on LandingPageLinkInBioBlocksHomeHero {
        eyebrow
        heading
        subheading
        ctaPrimary
        ctaPrimaryLink
        ctaSecondary
        ctaSecondaryLink
        metaLine
        marqueeItems
      }
      ... on LandingPageLinkInBioBlocksAboutHero {
        eyebrow
        heading
        leadText
        ctaPrimary
        ctaPrimaryLink
        ctaSecondary
        ctaSecondaryLink
        metaLine
        portraitImage
        portraitCaption
        deskImage
        deskCaption
        screenImage
        screenCaption
      }
      ... on LandingPageLinkInBioBlocksHero {
        heading
        subheading
        backgroundImage
        ctaLabel
        ctaLink
      }
      ... on LandingPageLinkInBioBlocksPageHeader {
        heading
        description
      }
      ... on LandingPageLinkInBioBlocksText {
        heading
        body
      }
      ... on LandingPageLinkInBioBlocksStory {
        number
        label
        heading
        paragraph1
        quote
        paragraph2
        sideImage
        sideCaption
      }
      ... on LandingPageLinkInBioBlocksTimeline {
        number
        label
        events {
          __typename
          year
          title
          description
          image
        }
      }
      ... on LandingPageLinkInBioBlocksStatsRow {
        stats {
          __typename
          value
          label
        }
      }
      ... on LandingPageLinkInBioBlocksFeatureGrid {
        heading
        items {
          __typename
          icon
          title
          description
        }
      }
      ... on LandingPageLinkInBioBlocksCardRow {
        number
        label
        cards {
          __typename
          tag
          title
          body
          image
          ctaLabel
          link
        }
      }
      ... on LandingPageLinkInBioBlocksPillars {
        eyebrow
        heading
        items {
          __typename
          tag
          title
          sub
          cta
          badge
          link
          image
        }
      }
      ... on LandingPageLinkInBioBlocksImageGallery {
        heading
        images {
          __typename
          src
          alt
          caption
        }
      }
      ... on LandingPageLinkInBioBlocksVideoEmbed {
        heading
        youtubeUrl
      }
      ... on LandingPageLinkInBioBlocksFeaturedBook {
        eyebrow
        heading
        description
        stats {
          __typename
          value
          label
        }
        ctaLabel
        ctaLink
        secondaryLabel
        secondaryLink
      }
      ... on LandingPageLinkInBioBlocksFeaturedRelease {
        eyebrow
        title
        description
        coverImage
        backCoverImage
        ctaLabel
        ctaHref
      }
      ... on LandingPageLinkInBioBlocksProductStrip {
        eyebrow
        heading
        viewAllLabel
        viewAllLink
      }
      ... on LandingPageLinkInBioBlocksShopCatalog {
        heading
        highlightText
        description
        showFeaturedBanner
        emptyHeading
        emptyDescription
      }
      ... on LandingPageLinkInBioBlocksGalleryGrid {
        emptyHeading
        emptyDescription
      }
      ... on LandingPageLinkInBioBlocksDownloadsGrid {
        emptyHeading
        emptyDescription
      }
      ... on LandingPageLinkInBioBlocksTutorialsStrip {
        eyebrow
        headingPrefix
        headingHighlight
        headingSuffix
        buttonLabel
        youtubeUrl
        stats {
          __typename
          value
          label
        }
      }
      ... on LandingPageLinkInBioBlocksClassesPitch {
        eyebrow
        heading
        subheading
        bullets
        metaTags
        ctaLabel
        ctaLink
        secondaryLabel
        secondaryLink
      }
      ... on LandingPageLinkInBioBlocksBlogFeed {
        heading
        showNewsletter
        newsletter {
          __typename
          eyebrow
          heading
          subheading
          placeholderText
          ctaLabel
          privacyNote
        }
      }
      ... on LandingPageLinkInBioBlocksCtaBand {
        heading
        description
        ctaLabel
        ctaLink
        variant
      }
      ... on LandingPageLinkInBioBlocksBigCta {
        eyebrow
        heading
        highlightText
        primaryLabel
        primaryLink
        secondaryLabel
        secondaryLink
      }
      ... on LandingPageLinkInBioBlocksNewsletterSignup {
        eyebrow
        heading
        subheading
        placeholderText
        ctaLabel
        privacyNote
      }
      ... on LandingPageLinkInBioBlocksContactInfo {
        email
        location
      }
      ... on LandingPageLinkInBioBlocksContactForm {
        submitLabel
      }
      ... on LandingPageLinkInBioBlocksKofiSupport {
        heading
        body
        ctaLabel
        href
      }
      ... on LandingPageLinkInBioBlocksReviewLinks {
        heading
        intro
        thankYou
        ctaHeading
        links {
          __typename
          label
          href
          region
        }
      }
      ... on LandingPageLinkInBioBlocksMarquee {
        highlightText
        text
      }
      ... on LandingPageLinkInBioBlocksSocialLinks {
        links {
          __typename
          platform
          url
          label
        }
      }
    }
  }
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
export const PageDocument = gql`
    query page($relativePath: String!) {
  page(relativePath: $relativePath) {
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
    ...PageParts
  }
}
    ${PagePartsFragmentDoc}`;
export const PageConnectionDocument = gql`
    query pageConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: PageFilter) {
  pageConnection(
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
        ...PageParts
      }
    }
  }
}
    ${PagePartsFragmentDoc}`;
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
export function getSdk(requester) {
  return {
    page(variables, options) {
      return requester(PageDocument, variables, options);
    },
    pageConnection(variables, options) {
      return requester(PageConnectionDocument, variables, options);
    },
    landingPage(variables, options) {
      return requester(LandingPageDocument, variables, options);
    },
    landingPageConnection(variables, options) {
      return requester(LandingPageConnectionDocument, variables, options);
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
