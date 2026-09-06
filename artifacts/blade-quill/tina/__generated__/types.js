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
      backgroundImage
      eyebrow
      heading
      subheading
      ctaPrimary
      ctaPrimaryLink
      ctaSecondary
      ctaSecondaryLink
      metaLine
      marqueeItems
      textStyle {
        __typename
        headingSize
        headingType
        headingFont
        align
        bodySize
      }
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
      textStyle {
        __typename
        headingSize
        headingType
        headingFont
        align
        bodySize
      }
    }
    ... on PageBlocksHero {
      heading
      subheading
      backgroundImage
      ctaLabel
      ctaLink
      textStyle {
        __typename
        headingSize
        headingType
        headingFont
        align
        bodySize
      }
    }
    ... on PageBlocksHeroSplitImage {
      eyebrow
      heading
      subheading
      featuredImage
      imageAlt
      imageCaption
      imagePosition
      ctaPrimary
      ctaPrimaryLink
      ctaSecondary
      ctaSecondaryLink
      textStyle {
        __typename
        headingSize
        headingType
        headingFont
        align
        bodySize
      }
    }
    ... on PageBlocksHeroFullBleed {
      backgroundImage
      heading
      subheading
      overlay
      textAlign
      minHeight
      ctaLabel
      ctaLink
      textStyle {
        __typename
        headingSize
        headingType
        headingFont
        align
        bodySize
      }
    }
    ... on PageBlocksHeroFloatingImages {
      eyebrow
      heading
      subheading
      images {
        __typename
        src
        alt
        caption
      }
      ctaPrimary
      ctaPrimaryLink
      ctaSecondary
      ctaSecondaryLink
      textStyle {
        __typename
        headingSize
        headingType
        headingFont
        align
        bodySize
      }
    }
    ... on PageBlocksHeroImageGrid {
      eyebrow
      heading
      subheading
      layout
      images {
        __typename
        src
        alt
        caption
      }
      ctaLabel
      ctaLink
      textStyle {
        __typename
        headingSize
        headingType
        headingFont
        align
        bodySize
      }
    }
    ... on PageBlocksPageHeader {
      heading
      description
      textStyle {
        __typename
        headingSize
        headingType
        headingFont
        align
        bodySize
      }
    }
    ... on PageBlocksText {
      heading
      body
      textStyle {
        __typename
        headingSize
        headingType
        headingFont
        align
        bodySize
      }
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
      textStyle {
        __typename
        headingSize
        headingType
        headingFont
        align
        bodySize
      }
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
      textStyle {
        __typename
        headingSize
        headingType
        headingFont
        align
        bodySize
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
      textStyle {
        __typename
        headingSize
        headingType
        headingFont
        align
        bodySize
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
      textStyle {
        __typename
        headingSize
        headingType
        headingFont
        align
        bodySize
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
      textStyle {
        __typename
        headingSize
        headingType
        headingFont
        align
        bodySize
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
      textStyle {
        __typename
        headingSize
        headingType
        headingFont
        align
        bodySize
      }
    }
    ... on PageBlocksImageSpotlight {
      eyebrow
      heading
      image
      alt
      caption
      aspect
      body
      textStyle {
        __typename
        headingSize
        headingType
        headingFont
        align
        bodySize
      }
    }
    ... on PageBlocksImageSideBySide {
      heading
      leftImage {
        __typename
        src
        alt
        caption
      }
      rightImage {
        __typename
        src
        alt
        caption
      }
      style
      textStyle {
        __typename
        headingSize
        headingType
        headingFont
        align
        bodySize
      }
    }
    ... on PageBlocksImageMasonry {
      heading
      images {
        __typename
        src
        alt
        caption
        size
      }
      textStyle {
        __typename
        headingSize
        headingType
        headingFont
        align
        bodySize
      }
    }
    ... on PageBlocksVideoEmbed {
      heading
      youtubeUrl
      textStyle {
        __typename
        headingSize
        headingType
        headingFont
        align
        bodySize
      }
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
      textStyle {
        __typename
        headingSize
        headingType
        headingFont
        align
        bodySize
      }
    }
    ... on PageBlocksFeaturedRelease {
      eyebrow
      title
      description
      coverImage
      backCoverImage
      ctaLabel
      ctaHref
      textStyle {
        __typename
        headingSize
        headingType
        headingFont
        align
        bodySize
      }
    }
    ... on PageBlocksProductStrip {
      eyebrow
      heading
      viewAllLabel
      viewAllLink
      textStyle {
        __typename
        headingSize
        headingType
        headingFont
        align
        bodySize
      }
    }
    ... on PageBlocksShopCatalog {
      heading
      highlightText
      description
      showFeaturedBanner
      emptyHeading
      emptyDescription
      textStyle {
        __typename
        headingSize
        headingType
        headingFont
        align
        bodySize
      }
    }
    ... on PageBlocksGalleryGrid {
      emptyHeading
      emptyDescription
      textStyle {
        __typename
        headingSize
        headingType
        headingFont
        align
        bodySize
      }
    }
    ... on PageBlocksDownloadsGrid {
      emptyHeading
      emptyDescription
      textStyle {
        __typename
        headingSize
        headingType
        headingFont
        align
        bodySize
      }
    }
    ... on PageBlocksFeaturedVideo {
      eyebrow
      heading
      description
      youtubeUrl
      buttonLabel
      textStyle {
        __typename
        headingSize
        headingType
        headingFont
        align
        bodySize
      }
    }
    ... on PageBlocksGalleryPreview {
      eyebrow
      heading
      description
      maxItems
      viewAllLabel
      viewAllLink
      textStyle {
        __typename
        headingSize
        headingType
        headingFont
        align
        bodySize
      }
    }
    ... on PageBlocksDownloadsPreview {
      eyebrow
      heading
      description
      maxItems
      viewAllLabel
      viewAllLink
      textStyle {
        __typename
        headingSize
        headingType
        headingFont
        align
        bodySize
      }
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
      textStyle {
        __typename
        headingSize
        headingType
        headingFont
        align
        bodySize
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
      textStyle {
        __typename
        headingSize
        headingType
        headingFont
        align
        bodySize
      }
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
      textStyle {
        __typename
        headingSize
        headingType
        headingFont
        align
        bodySize
      }
    }
    ... on PageBlocksCtaBand {
      heading
      description
      ctaLabel
      ctaLink
      variant
      textStyle {
        __typename
        headingSize
        headingType
        headingFont
        align
        bodySize
      }
    }
    ... on PageBlocksBigCta {
      eyebrow
      heading
      highlightText
      primaryLabel
      primaryLink
      secondaryLabel
      secondaryLink
      textStyle {
        __typename
        headingSize
        headingType
        headingFont
        align
        bodySize
      }
    }
    ... on PageBlocksNewsletterSignup {
      eyebrow
      heading
      subheading
      placeholderText
      ctaLabel
      privacyNote
      textStyle {
        __typename
        headingSize
        headingType
        headingFont
        align
        bodySize
      }
    }
    ... on PageBlocksContactInfo {
      email
      location
    }
    ... on PageBlocksContactForm {
      submitLabel
    }
    ... on PageBlocksDummyBookRequest {
      heading
      description
      pdfUrl
      submitLabel
      successHeading
      successNote
      downloadLabel
      textStyle {
        __typename
        headingSize
        headingType
        headingFont
        align
        bodySize
      }
    }
    ... on PageBlocksKofiSupport {
      heading
      body
      ctaLabel
      href
      textStyle {
        __typename
        headingSize
        headingType
        headingFont
        align
        bodySize
      }
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
      textStyle {
        __typename
        headingSize
        headingType
        headingFont
        align
        bodySize
      }
    }
    ... on PageBlocksMarquee {
      highlightText
      text
    }
    ... on PageBlocksSocialLinks {
      heading
      body
      links {
        __typename
        platform
        url
        label
      }
      textStyle {
        __typename
        headingSize
        headingType
        headingFont
        align
        bodySize
      }
    }
  }
  seoAssistant
  seo {
    __typename
    metaTitle
    metaDescription
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
        backgroundImage
        eyebrow
        heading
        subheading
        ctaPrimary
        ctaPrimaryLink
        ctaSecondary
        ctaSecondaryLink
        metaLine
        marqueeItems
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
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
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageBlankBlocksHero {
        heading
        subheading
        backgroundImage
        ctaLabel
        ctaLink
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageBlankBlocksHeroSplitImage {
        eyebrow
        heading
        subheading
        featuredImage
        imageAlt
        imageCaption
        imagePosition
        ctaPrimary
        ctaPrimaryLink
        ctaSecondary
        ctaSecondaryLink
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageBlankBlocksHeroFullBleed {
        backgroundImage
        heading
        subheading
        overlay
        textAlign
        minHeight
        ctaLabel
        ctaLink
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageBlankBlocksHeroFloatingImages {
        eyebrow
        heading
        subheading
        images {
          __typename
          src
          alt
          caption
        }
        ctaPrimary
        ctaPrimaryLink
        ctaSecondary
        ctaSecondaryLink
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageBlankBlocksHeroImageGrid {
        eyebrow
        heading
        subheading
        layout
        images {
          __typename
          src
          alt
          caption
        }
        ctaLabel
        ctaLink
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageBlankBlocksPageHeader {
        heading
        description
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageBlankBlocksText {
        heading
        body
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
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
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
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
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
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
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
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
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
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
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
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
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageBlankBlocksImageSpotlight {
        eyebrow
        heading
        image
        alt
        caption
        aspect
        body
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageBlankBlocksImageSideBySide {
        heading
        leftImage {
          __typename
          src
          alt
          caption
        }
        rightImage {
          __typename
          src
          alt
          caption
        }
        style
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageBlankBlocksImageMasonry {
        heading
        images {
          __typename
          src
          alt
          caption
          size
        }
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageBlankBlocksVideoEmbed {
        heading
        youtubeUrl
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
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
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageBlankBlocksFeaturedRelease {
        eyebrow
        title
        description
        coverImage
        backCoverImage
        ctaLabel
        ctaHref
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageBlankBlocksProductStrip {
        eyebrow
        heading
        viewAllLabel
        viewAllLink
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageBlankBlocksShopCatalog {
        heading
        highlightText
        description
        showFeaturedBanner
        emptyHeading
        emptyDescription
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageBlankBlocksGalleryGrid {
        emptyHeading
        emptyDescription
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageBlankBlocksDownloadsGrid {
        emptyHeading
        emptyDescription
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageBlankBlocksFeaturedVideo {
        eyebrow
        heading
        description
        youtubeUrl
        buttonLabel
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageBlankBlocksGalleryPreview {
        eyebrow
        heading
        description
        maxItems
        viewAllLabel
        viewAllLink
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageBlankBlocksDownloadsPreview {
        eyebrow
        heading
        description
        maxItems
        viewAllLabel
        viewAllLink
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
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
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
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
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
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
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageBlankBlocksCtaBand {
        heading
        description
        ctaLabel
        ctaLink
        variant
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageBlankBlocksBigCta {
        eyebrow
        heading
        highlightText
        primaryLabel
        primaryLink
        secondaryLabel
        secondaryLink
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageBlankBlocksNewsletterSignup {
        eyebrow
        heading
        subheading
        placeholderText
        ctaLabel
        privacyNote
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageBlankBlocksContactInfo {
        email
        location
      }
      ... on LandingPageBlankBlocksContactForm {
        submitLabel
      }
      ... on LandingPageBlankBlocksDummyBookRequest {
        heading
        description
        pdfUrl
        submitLabel
        successHeading
        successNote
        downloadLabel
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageBlankBlocksKofiSupport {
        heading
        body
        ctaLabel
        href
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
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
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageBlankBlocksMarquee {
        highlightText
        text
      }
      ... on LandingPageBlankBlocksSocialLinks {
        heading
        body
        links {
          __typename
          platform
          url
          label
        }
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
    }
    seoAssistant
    seo {
      __typename
      metaTitle
      metaDescription
    }
  }
  ... on LandingPageEvent {
    title
    layout
    blocks {
      __typename
      ... on LandingPageEventBlocksHomeHero {
        backgroundImage
        eyebrow
        heading
        subheading
        ctaPrimary
        ctaPrimaryLink
        ctaSecondary
        ctaSecondaryLink
        metaLine
        marqueeItems
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
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
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageEventBlocksHero {
        heading
        subheading
        backgroundImage
        ctaLabel
        ctaLink
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageEventBlocksHeroSplitImage {
        eyebrow
        heading
        subheading
        featuredImage
        imageAlt
        imageCaption
        imagePosition
        ctaPrimary
        ctaPrimaryLink
        ctaSecondary
        ctaSecondaryLink
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageEventBlocksHeroFullBleed {
        backgroundImage
        heading
        subheading
        overlay
        textAlign
        minHeight
        ctaLabel
        ctaLink
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageEventBlocksHeroFloatingImages {
        eyebrow
        heading
        subheading
        images {
          __typename
          src
          alt
          caption
        }
        ctaPrimary
        ctaPrimaryLink
        ctaSecondary
        ctaSecondaryLink
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageEventBlocksHeroImageGrid {
        eyebrow
        heading
        subheading
        layout
        images {
          __typename
          src
          alt
          caption
        }
        ctaLabel
        ctaLink
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageEventBlocksPageHeader {
        heading
        description
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageEventBlocksText {
        heading
        body
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
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
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
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
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
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
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
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
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
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
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
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
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageEventBlocksImageSpotlight {
        eyebrow
        heading
        image
        alt
        caption
        aspect
        body
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageEventBlocksImageSideBySide {
        heading
        leftImage {
          __typename
          src
          alt
          caption
        }
        rightImage {
          __typename
          src
          alt
          caption
        }
        style
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageEventBlocksImageMasonry {
        heading
        images {
          __typename
          src
          alt
          caption
          size
        }
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageEventBlocksVideoEmbed {
        heading
        youtubeUrl
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
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
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageEventBlocksFeaturedRelease {
        eyebrow
        title
        description
        coverImage
        backCoverImage
        ctaLabel
        ctaHref
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageEventBlocksProductStrip {
        eyebrow
        heading
        viewAllLabel
        viewAllLink
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageEventBlocksShopCatalog {
        heading
        highlightText
        description
        showFeaturedBanner
        emptyHeading
        emptyDescription
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageEventBlocksGalleryGrid {
        emptyHeading
        emptyDescription
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageEventBlocksDownloadsGrid {
        emptyHeading
        emptyDescription
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageEventBlocksFeaturedVideo {
        eyebrow
        heading
        description
        youtubeUrl
        buttonLabel
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageEventBlocksGalleryPreview {
        eyebrow
        heading
        description
        maxItems
        viewAllLabel
        viewAllLink
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageEventBlocksDownloadsPreview {
        eyebrow
        heading
        description
        maxItems
        viewAllLabel
        viewAllLink
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
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
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
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
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
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
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageEventBlocksCtaBand {
        heading
        description
        ctaLabel
        ctaLink
        variant
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageEventBlocksBigCta {
        eyebrow
        heading
        highlightText
        primaryLabel
        primaryLink
        secondaryLabel
        secondaryLink
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageEventBlocksNewsletterSignup {
        eyebrow
        heading
        subheading
        placeholderText
        ctaLabel
        privacyNote
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageEventBlocksContactInfo {
        email
        location
      }
      ... on LandingPageEventBlocksContactForm {
        submitLabel
      }
      ... on LandingPageEventBlocksDummyBookRequest {
        heading
        description
        pdfUrl
        submitLabel
        successHeading
        successNote
        downloadLabel
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageEventBlocksKofiSupport {
        heading
        body
        ctaLabel
        href
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
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
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageEventBlocksMarquee {
        highlightText
        text
      }
      ... on LandingPageEventBlocksSocialLinks {
        heading
        body
        links {
          __typename
          platform
          url
          label
        }
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
    }
    seoAssistant
    seo {
      __typename
      metaTitle
      metaDescription
    }
  }
  ... on LandingPagePromo {
    title
    layout
    blocks {
      __typename
      ... on LandingPagePromoBlocksHomeHero {
        backgroundImage
        eyebrow
        heading
        subheading
        ctaPrimary
        ctaPrimaryLink
        ctaSecondary
        ctaSecondaryLink
        metaLine
        marqueeItems
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
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
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPagePromoBlocksHero {
        heading
        subheading
        backgroundImage
        ctaLabel
        ctaLink
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPagePromoBlocksHeroSplitImage {
        eyebrow
        heading
        subheading
        featuredImage
        imageAlt
        imageCaption
        imagePosition
        ctaPrimary
        ctaPrimaryLink
        ctaSecondary
        ctaSecondaryLink
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPagePromoBlocksHeroFullBleed {
        backgroundImage
        heading
        subheading
        overlay
        textAlign
        minHeight
        ctaLabel
        ctaLink
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPagePromoBlocksHeroFloatingImages {
        eyebrow
        heading
        subheading
        images {
          __typename
          src
          alt
          caption
        }
        ctaPrimary
        ctaPrimaryLink
        ctaSecondary
        ctaSecondaryLink
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPagePromoBlocksHeroImageGrid {
        eyebrow
        heading
        subheading
        layout
        images {
          __typename
          src
          alt
          caption
        }
        ctaLabel
        ctaLink
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPagePromoBlocksPageHeader {
        heading
        description
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPagePromoBlocksText {
        heading
        body
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
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
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
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
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
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
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
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
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
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
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
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
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPagePromoBlocksImageSpotlight {
        eyebrow
        heading
        image
        alt
        caption
        aspect
        body
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPagePromoBlocksImageSideBySide {
        heading
        leftImage {
          __typename
          src
          alt
          caption
        }
        rightImage {
          __typename
          src
          alt
          caption
        }
        style
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPagePromoBlocksImageMasonry {
        heading
        images {
          __typename
          src
          alt
          caption
          size
        }
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPagePromoBlocksVideoEmbed {
        heading
        youtubeUrl
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
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
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPagePromoBlocksFeaturedRelease {
        eyebrow
        title
        description
        coverImage
        backCoverImage
        ctaLabel
        ctaHref
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPagePromoBlocksProductStrip {
        eyebrow
        heading
        viewAllLabel
        viewAllLink
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPagePromoBlocksShopCatalog {
        heading
        highlightText
        description
        showFeaturedBanner
        emptyHeading
        emptyDescription
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPagePromoBlocksGalleryGrid {
        emptyHeading
        emptyDescription
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPagePromoBlocksDownloadsGrid {
        emptyHeading
        emptyDescription
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPagePromoBlocksFeaturedVideo {
        eyebrow
        heading
        description
        youtubeUrl
        buttonLabel
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPagePromoBlocksGalleryPreview {
        eyebrow
        heading
        description
        maxItems
        viewAllLabel
        viewAllLink
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPagePromoBlocksDownloadsPreview {
        eyebrow
        heading
        description
        maxItems
        viewAllLabel
        viewAllLink
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
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
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
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
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
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
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPagePromoBlocksCtaBand {
        heading
        description
        ctaLabel
        ctaLink
        variant
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPagePromoBlocksBigCta {
        eyebrow
        heading
        highlightText
        primaryLabel
        primaryLink
        secondaryLabel
        secondaryLink
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPagePromoBlocksNewsletterSignup {
        eyebrow
        heading
        subheading
        placeholderText
        ctaLabel
        privacyNote
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPagePromoBlocksContactInfo {
        email
        location
      }
      ... on LandingPagePromoBlocksContactForm {
        submitLabel
      }
      ... on LandingPagePromoBlocksDummyBookRequest {
        heading
        description
        pdfUrl
        submitLabel
        successHeading
        successNote
        downloadLabel
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPagePromoBlocksKofiSupport {
        heading
        body
        ctaLabel
        href
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
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
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPagePromoBlocksMarquee {
        highlightText
        text
      }
      ... on LandingPagePromoBlocksSocialLinks {
        heading
        body
        links {
          __typename
          platform
          url
          label
        }
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
    }
    seoAssistant
    seo {
      __typename
      metaTitle
      metaDescription
    }
  }
  ... on LandingPageInfo {
    title
    layout
    blocks {
      __typename
      ... on LandingPageInfoBlocksHomeHero {
        backgroundImage
        eyebrow
        heading
        subheading
        ctaPrimary
        ctaPrimaryLink
        ctaSecondary
        ctaSecondaryLink
        metaLine
        marqueeItems
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
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
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageInfoBlocksHero {
        heading
        subheading
        backgroundImage
        ctaLabel
        ctaLink
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageInfoBlocksHeroSplitImage {
        eyebrow
        heading
        subheading
        featuredImage
        imageAlt
        imageCaption
        imagePosition
        ctaPrimary
        ctaPrimaryLink
        ctaSecondary
        ctaSecondaryLink
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageInfoBlocksHeroFullBleed {
        backgroundImage
        heading
        subheading
        overlay
        textAlign
        minHeight
        ctaLabel
        ctaLink
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageInfoBlocksHeroFloatingImages {
        eyebrow
        heading
        subheading
        images {
          __typename
          src
          alt
          caption
        }
        ctaPrimary
        ctaPrimaryLink
        ctaSecondary
        ctaSecondaryLink
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageInfoBlocksHeroImageGrid {
        eyebrow
        heading
        subheading
        layout
        images {
          __typename
          src
          alt
          caption
        }
        ctaLabel
        ctaLink
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageInfoBlocksPageHeader {
        heading
        description
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageInfoBlocksText {
        heading
        body
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
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
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
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
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
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
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
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
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
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
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
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
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageInfoBlocksImageSpotlight {
        eyebrow
        heading
        image
        alt
        caption
        aspect
        body
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageInfoBlocksImageSideBySide {
        heading
        leftImage {
          __typename
          src
          alt
          caption
        }
        rightImage {
          __typename
          src
          alt
          caption
        }
        style
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageInfoBlocksImageMasonry {
        heading
        images {
          __typename
          src
          alt
          caption
          size
        }
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageInfoBlocksVideoEmbed {
        heading
        youtubeUrl
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
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
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageInfoBlocksFeaturedRelease {
        eyebrow
        title
        description
        coverImage
        backCoverImage
        ctaLabel
        ctaHref
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageInfoBlocksProductStrip {
        eyebrow
        heading
        viewAllLabel
        viewAllLink
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageInfoBlocksShopCatalog {
        heading
        highlightText
        description
        showFeaturedBanner
        emptyHeading
        emptyDescription
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageInfoBlocksGalleryGrid {
        emptyHeading
        emptyDescription
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageInfoBlocksDownloadsGrid {
        emptyHeading
        emptyDescription
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageInfoBlocksFeaturedVideo {
        eyebrow
        heading
        description
        youtubeUrl
        buttonLabel
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageInfoBlocksGalleryPreview {
        eyebrow
        heading
        description
        maxItems
        viewAllLabel
        viewAllLink
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageInfoBlocksDownloadsPreview {
        eyebrow
        heading
        description
        maxItems
        viewAllLabel
        viewAllLink
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
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
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
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
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
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
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageInfoBlocksCtaBand {
        heading
        description
        ctaLabel
        ctaLink
        variant
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageInfoBlocksBigCta {
        eyebrow
        heading
        highlightText
        primaryLabel
        primaryLink
        secondaryLabel
        secondaryLink
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageInfoBlocksNewsletterSignup {
        eyebrow
        heading
        subheading
        placeholderText
        ctaLabel
        privacyNote
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageInfoBlocksContactInfo {
        email
        location
      }
      ... on LandingPageInfoBlocksContactForm {
        submitLabel
      }
      ... on LandingPageInfoBlocksDummyBookRequest {
        heading
        description
        pdfUrl
        submitLabel
        successHeading
        successNote
        downloadLabel
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageInfoBlocksKofiSupport {
        heading
        body
        ctaLabel
        href
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
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
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageInfoBlocksMarquee {
        highlightText
        text
      }
      ... on LandingPageInfoBlocksSocialLinks {
        heading
        body
        links {
          __typename
          platform
          url
          label
        }
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
    }
    seoAssistant
    seo {
      __typename
      metaTitle
      metaDescription
    }
  }
  ... on LandingPageLinkInBio {
    title
    layout
    blocks {
      __typename
      ... on LandingPageLinkInBioBlocksHomeHero {
        backgroundImage
        eyebrow
        heading
        subheading
        ctaPrimary
        ctaPrimaryLink
        ctaSecondary
        ctaSecondaryLink
        metaLine
        marqueeItems
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
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
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageLinkInBioBlocksHero {
        heading
        subheading
        backgroundImage
        ctaLabel
        ctaLink
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageLinkInBioBlocksHeroSplitImage {
        eyebrow
        heading
        subheading
        featuredImage
        imageAlt
        imageCaption
        imagePosition
        ctaPrimary
        ctaPrimaryLink
        ctaSecondary
        ctaSecondaryLink
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageLinkInBioBlocksHeroFullBleed {
        backgroundImage
        heading
        subheading
        overlay
        textAlign
        minHeight
        ctaLabel
        ctaLink
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageLinkInBioBlocksHeroFloatingImages {
        eyebrow
        heading
        subheading
        images {
          __typename
          src
          alt
          caption
        }
        ctaPrimary
        ctaPrimaryLink
        ctaSecondary
        ctaSecondaryLink
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageLinkInBioBlocksHeroImageGrid {
        eyebrow
        heading
        subheading
        layout
        images {
          __typename
          src
          alt
          caption
        }
        ctaLabel
        ctaLink
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageLinkInBioBlocksPageHeader {
        heading
        description
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageLinkInBioBlocksText {
        heading
        body
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
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
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
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
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
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
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
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
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
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
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
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
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageLinkInBioBlocksImageSpotlight {
        eyebrow
        heading
        image
        alt
        caption
        aspect
        body
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageLinkInBioBlocksImageSideBySide {
        heading
        leftImage {
          __typename
          src
          alt
          caption
        }
        rightImage {
          __typename
          src
          alt
          caption
        }
        style
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageLinkInBioBlocksImageMasonry {
        heading
        images {
          __typename
          src
          alt
          caption
          size
        }
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageLinkInBioBlocksVideoEmbed {
        heading
        youtubeUrl
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
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
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageLinkInBioBlocksFeaturedRelease {
        eyebrow
        title
        description
        coverImage
        backCoverImage
        ctaLabel
        ctaHref
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageLinkInBioBlocksProductStrip {
        eyebrow
        heading
        viewAllLabel
        viewAllLink
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageLinkInBioBlocksShopCatalog {
        heading
        highlightText
        description
        showFeaturedBanner
        emptyHeading
        emptyDescription
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageLinkInBioBlocksGalleryGrid {
        emptyHeading
        emptyDescription
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageLinkInBioBlocksDownloadsGrid {
        emptyHeading
        emptyDescription
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageLinkInBioBlocksFeaturedVideo {
        eyebrow
        heading
        description
        youtubeUrl
        buttonLabel
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageLinkInBioBlocksGalleryPreview {
        eyebrow
        heading
        description
        maxItems
        viewAllLabel
        viewAllLink
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageLinkInBioBlocksDownloadsPreview {
        eyebrow
        heading
        description
        maxItems
        viewAllLabel
        viewAllLink
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
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
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
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
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
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
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageLinkInBioBlocksCtaBand {
        heading
        description
        ctaLabel
        ctaLink
        variant
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageLinkInBioBlocksBigCta {
        eyebrow
        heading
        highlightText
        primaryLabel
        primaryLink
        secondaryLabel
        secondaryLink
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageLinkInBioBlocksNewsletterSignup {
        eyebrow
        heading
        subheading
        placeholderText
        ctaLabel
        privacyNote
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageLinkInBioBlocksContactInfo {
        email
        location
      }
      ... on LandingPageLinkInBioBlocksContactForm {
        submitLabel
      }
      ... on LandingPageLinkInBioBlocksDummyBookRequest {
        heading
        description
        pdfUrl
        submitLabel
        successHeading
        successNote
        downloadLabel
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageLinkInBioBlocksKofiSupport {
        heading
        body
        ctaLabel
        href
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
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
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
      ... on LandingPageLinkInBioBlocksMarquee {
        highlightText
        text
      }
      ... on LandingPageLinkInBioBlocksSocialLinks {
        heading
        body
        links {
          __typename
          platform
          url
          label
        }
        textStyle {
          __typename
          headingSize
          headingType
          headingFont
          align
          bodySize
        }
      }
    }
    seoAssistant
    seo {
      __typename
      metaTitle
      metaDescription
    }
  }
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
  showTableOfContents
  sections {
    __typename
    ... on PostSectionsHeading {
      number
      text
      level
    }
    ... on PostSectionsText {
      heading
      body
      textStyle {
        __typename
        headingSize
        headingType
        headingFont
        align
        bodySize
      }
    }
    ... on PostSectionsSpacer {
      size
    }
    ... on PostSectionsDivider {
      style
    }
    ... on PostSectionsImage {
      src
      alt
      caption
      width
      aspect
    }
    ... on PostSectionsImageSideBySide {
      heading
      leftImage {
        __typename
        src
        alt
        caption
      }
      rightImage {
        __typename
        src
        alt
        caption
      }
      style
      textStyle {
        __typename
        headingSize
        headingType
        headingFont
        align
        bodySize
      }
    }
    ... on PostSectionsImageGallery {
      heading
      images {
        __typename
        src
        alt
        caption
      }
      textStyle {
        __typename
        headingSize
        headingType
        headingFont
        align
        bodySize
      }
    }
    ... on PostSectionsVideoEmbed {
      heading
      youtubeUrl
      textStyle {
        __typename
        headingSize
        headingType
        headingFont
        align
        bodySize
      }
    }
    ... on PostSectionsCallout {
      title
      body
      tone
    }
    ... on PostSectionsCtaBand {
      heading
      description
      ctaLabel
      ctaLink
      variant
      textStyle {
        __typename
        headingSize
        headingType
        headingFont
        align
        bodySize
      }
    }
  }
  seoAssistant
  seo {
    __typename
    metaTitle
    metaDescription
  }
}
    `;
export const ShopProductPartsFragmentDoc = gql`
    fragment ShopProductParts on ShopProduct {
  __typename
  name
  description
  price
  category
  image
  galleryImages {
    __typename
    src
    alt
  }
  spreadImages {
    __typename
    src
    alt
  }
  featured
  inStock
  downloadFiles {
    __typename
    file
    label
  }
  downloadUrl
  gumroadUrl
  amazonUrl
  googlePlayUrl
  productId
  createdAt
  seoAssistant
  seo {
    __typename
    metaTitle
    metaDescription
  }
}
    `;
export const GalleryPartsFragmentDoc = gql`
    fragment GalleryParts on Gallery {
  __typename
  items {
    __typename
    title
    image
    description
    downloadFile
  }
}
    `;
export const DownloadPartsFragmentDoc = gql`
    fragment DownloadParts on Download {
  __typename
  items {
    __typename
    title
    description
    file
    fileType
    thumbnail
  }
}
    `;
export const TutorialPartsFragmentDoc = gql`
    fragment TutorialParts on Tutorial {
  __typename
  items {
    __typename
    title
    youtubeId
    description
    topic
    featured
  }
}
    `;
export const NavigationPartsFragmentDoc = gql`
    fragment NavigationParts on Navigation {
  __typename
  items {
    __typename
    label
    linkType
    page {
      ... on Page {
        __typename
        title
        layout
        blocks {
          __typename
          ... on PageBlocksHomeHero {
            backgroundImage
            eyebrow
            heading
            subheading
            ctaPrimary
            ctaPrimaryLink
            ctaSecondary
            ctaSecondaryLink
            metaLine
            marqueeItems
            textStyle {
              __typename
              headingSize
              headingType
              headingFont
              align
              bodySize
            }
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
            textStyle {
              __typename
              headingSize
              headingType
              headingFont
              align
              bodySize
            }
          }
          ... on PageBlocksHero {
            heading
            subheading
            backgroundImage
            ctaLabel
            ctaLink
            textStyle {
              __typename
              headingSize
              headingType
              headingFont
              align
              bodySize
            }
          }
          ... on PageBlocksHeroSplitImage {
            eyebrow
            heading
            subheading
            featuredImage
            imageAlt
            imageCaption
            imagePosition
            ctaPrimary
            ctaPrimaryLink
            ctaSecondary
            ctaSecondaryLink
            textStyle {
              __typename
              headingSize
              headingType
              headingFont
              align
              bodySize
            }
          }
          ... on PageBlocksHeroFullBleed {
            backgroundImage
            heading
            subheading
            overlay
            textAlign
            minHeight
            ctaLabel
            ctaLink
            textStyle {
              __typename
              headingSize
              headingType
              headingFont
              align
              bodySize
            }
          }
          ... on PageBlocksHeroFloatingImages {
            eyebrow
            heading
            subheading
            images {
              __typename
              src
              alt
              caption
            }
            ctaPrimary
            ctaPrimaryLink
            ctaSecondary
            ctaSecondaryLink
            textStyle {
              __typename
              headingSize
              headingType
              headingFont
              align
              bodySize
            }
          }
          ... on PageBlocksHeroImageGrid {
            eyebrow
            heading
            subheading
            layout
            images {
              __typename
              src
              alt
              caption
            }
            ctaLabel
            ctaLink
            textStyle {
              __typename
              headingSize
              headingType
              headingFont
              align
              bodySize
            }
          }
          ... on PageBlocksPageHeader {
            heading
            description
            textStyle {
              __typename
              headingSize
              headingType
              headingFont
              align
              bodySize
            }
          }
          ... on PageBlocksText {
            heading
            body
            textStyle {
              __typename
              headingSize
              headingType
              headingFont
              align
              bodySize
            }
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
            textStyle {
              __typename
              headingSize
              headingType
              headingFont
              align
              bodySize
            }
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
            textStyle {
              __typename
              headingSize
              headingType
              headingFont
              align
              bodySize
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
            textStyle {
              __typename
              headingSize
              headingType
              headingFont
              align
              bodySize
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
            textStyle {
              __typename
              headingSize
              headingType
              headingFont
              align
              bodySize
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
            textStyle {
              __typename
              headingSize
              headingType
              headingFont
              align
              bodySize
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
            textStyle {
              __typename
              headingSize
              headingType
              headingFont
              align
              bodySize
            }
          }
          ... on PageBlocksImageSpotlight {
            eyebrow
            heading
            image
            alt
            caption
            aspect
            body
            textStyle {
              __typename
              headingSize
              headingType
              headingFont
              align
              bodySize
            }
          }
          ... on PageBlocksImageSideBySide {
            heading
            leftImage {
              __typename
              src
              alt
              caption
            }
            rightImage {
              __typename
              src
              alt
              caption
            }
            style
            textStyle {
              __typename
              headingSize
              headingType
              headingFont
              align
              bodySize
            }
          }
          ... on PageBlocksImageMasonry {
            heading
            images {
              __typename
              src
              alt
              caption
              size
            }
            textStyle {
              __typename
              headingSize
              headingType
              headingFont
              align
              bodySize
            }
          }
          ... on PageBlocksVideoEmbed {
            heading
            youtubeUrl
            textStyle {
              __typename
              headingSize
              headingType
              headingFont
              align
              bodySize
            }
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
            textStyle {
              __typename
              headingSize
              headingType
              headingFont
              align
              bodySize
            }
          }
          ... on PageBlocksFeaturedRelease {
            eyebrow
            title
            description
            coverImage
            backCoverImage
            ctaLabel
            ctaHref
            textStyle {
              __typename
              headingSize
              headingType
              headingFont
              align
              bodySize
            }
          }
          ... on PageBlocksProductStrip {
            eyebrow
            heading
            viewAllLabel
            viewAllLink
            textStyle {
              __typename
              headingSize
              headingType
              headingFont
              align
              bodySize
            }
          }
          ... on PageBlocksShopCatalog {
            heading
            highlightText
            description
            showFeaturedBanner
            emptyHeading
            emptyDescription
            textStyle {
              __typename
              headingSize
              headingType
              headingFont
              align
              bodySize
            }
          }
          ... on PageBlocksGalleryGrid {
            emptyHeading
            emptyDescription
            textStyle {
              __typename
              headingSize
              headingType
              headingFont
              align
              bodySize
            }
          }
          ... on PageBlocksDownloadsGrid {
            emptyHeading
            emptyDescription
            textStyle {
              __typename
              headingSize
              headingType
              headingFont
              align
              bodySize
            }
          }
          ... on PageBlocksFeaturedVideo {
            eyebrow
            heading
            description
            youtubeUrl
            buttonLabel
            textStyle {
              __typename
              headingSize
              headingType
              headingFont
              align
              bodySize
            }
          }
          ... on PageBlocksGalleryPreview {
            eyebrow
            heading
            description
            maxItems
            viewAllLabel
            viewAllLink
            textStyle {
              __typename
              headingSize
              headingType
              headingFont
              align
              bodySize
            }
          }
          ... on PageBlocksDownloadsPreview {
            eyebrow
            heading
            description
            maxItems
            viewAllLabel
            viewAllLink
            textStyle {
              __typename
              headingSize
              headingType
              headingFont
              align
              bodySize
            }
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
            textStyle {
              __typename
              headingSize
              headingType
              headingFont
              align
              bodySize
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
            textStyle {
              __typename
              headingSize
              headingType
              headingFont
              align
              bodySize
            }
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
            textStyle {
              __typename
              headingSize
              headingType
              headingFont
              align
              bodySize
            }
          }
          ... on PageBlocksCtaBand {
            heading
            description
            ctaLabel
            ctaLink
            variant
            textStyle {
              __typename
              headingSize
              headingType
              headingFont
              align
              bodySize
            }
          }
          ... on PageBlocksBigCta {
            eyebrow
            heading
            highlightText
            primaryLabel
            primaryLink
            secondaryLabel
            secondaryLink
            textStyle {
              __typename
              headingSize
              headingType
              headingFont
              align
              bodySize
            }
          }
          ... on PageBlocksNewsletterSignup {
            eyebrow
            heading
            subheading
            placeholderText
            ctaLabel
            privacyNote
            textStyle {
              __typename
              headingSize
              headingType
              headingFont
              align
              bodySize
            }
          }
          ... on PageBlocksContactInfo {
            email
            location
          }
          ... on PageBlocksContactForm {
            submitLabel
          }
          ... on PageBlocksDummyBookRequest {
            heading
            description
            pdfUrl
            submitLabel
            successHeading
            successNote
            downloadLabel
            textStyle {
              __typename
              headingSize
              headingType
              headingFont
              align
              bodySize
            }
          }
          ... on PageBlocksKofiSupport {
            heading
            body
            ctaLabel
            href
            textStyle {
              __typename
              headingSize
              headingType
              headingFont
              align
              bodySize
            }
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
            textStyle {
              __typename
              headingSize
              headingType
              headingFont
              align
              bodySize
            }
          }
          ... on PageBlocksMarquee {
            highlightText
            text
          }
          ... on PageBlocksSocialLinks {
            heading
            body
            links {
              __typename
              platform
              url
              label
            }
            textStyle {
              __typename
              headingSize
              headingType
              headingFont
              align
              bodySize
            }
          }
        }
        seoAssistant
        seo {
          __typename
          metaTitle
          metaDescription
        }
      }
      ... on LandingPage {
        __typename
        ... on LandingPageBlank {
          title
          layout
          blocks {
            __typename
            ... on LandingPageBlankBlocksHomeHero {
              backgroundImage
              eyebrow
              heading
              subheading
              ctaPrimary
              ctaPrimaryLink
              ctaSecondary
              ctaSecondaryLink
              metaLine
              marqueeItems
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageBlankBlocksHero {
              heading
              subheading
              backgroundImage
              ctaLabel
              ctaLink
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageBlankBlocksHeroSplitImage {
              eyebrow
              heading
              subheading
              featuredImage
              imageAlt
              imageCaption
              imagePosition
              ctaPrimary
              ctaPrimaryLink
              ctaSecondary
              ctaSecondaryLink
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageBlankBlocksHeroFullBleed {
              backgroundImage
              heading
              subheading
              overlay
              textAlign
              minHeight
              ctaLabel
              ctaLink
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageBlankBlocksHeroFloatingImages {
              eyebrow
              heading
              subheading
              images {
                __typename
                src
                alt
                caption
              }
              ctaPrimary
              ctaPrimaryLink
              ctaSecondary
              ctaSecondaryLink
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageBlankBlocksHeroImageGrid {
              eyebrow
              heading
              subheading
              layout
              images {
                __typename
                src
                alt
                caption
              }
              ctaLabel
              ctaLink
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageBlankBlocksPageHeader {
              heading
              description
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageBlankBlocksText {
              heading
              body
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageBlankBlocksImageSpotlight {
              eyebrow
              heading
              image
              alt
              caption
              aspect
              body
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageBlankBlocksImageSideBySide {
              heading
              leftImage {
                __typename
                src
                alt
                caption
              }
              rightImage {
                __typename
                src
                alt
                caption
              }
              style
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageBlankBlocksImageMasonry {
              heading
              images {
                __typename
                src
                alt
                caption
                size
              }
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageBlankBlocksVideoEmbed {
              heading
              youtubeUrl
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageBlankBlocksFeaturedRelease {
              eyebrow
              title
              description
              coverImage
              backCoverImage
              ctaLabel
              ctaHref
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageBlankBlocksProductStrip {
              eyebrow
              heading
              viewAllLabel
              viewAllLink
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageBlankBlocksShopCatalog {
              heading
              highlightText
              description
              showFeaturedBanner
              emptyHeading
              emptyDescription
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageBlankBlocksGalleryGrid {
              emptyHeading
              emptyDescription
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageBlankBlocksDownloadsGrid {
              emptyHeading
              emptyDescription
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageBlankBlocksFeaturedVideo {
              eyebrow
              heading
              description
              youtubeUrl
              buttonLabel
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageBlankBlocksGalleryPreview {
              eyebrow
              heading
              description
              maxItems
              viewAllLabel
              viewAllLink
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageBlankBlocksDownloadsPreview {
              eyebrow
              heading
              description
              maxItems
              viewAllLabel
              viewAllLink
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageBlankBlocksCtaBand {
              heading
              description
              ctaLabel
              ctaLink
              variant
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageBlankBlocksBigCta {
              eyebrow
              heading
              highlightText
              primaryLabel
              primaryLink
              secondaryLabel
              secondaryLink
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageBlankBlocksNewsletterSignup {
              eyebrow
              heading
              subheading
              placeholderText
              ctaLabel
              privacyNote
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageBlankBlocksContactInfo {
              email
              location
            }
            ... on LandingPageBlankBlocksContactForm {
              submitLabel
            }
            ... on LandingPageBlankBlocksDummyBookRequest {
              heading
              description
              pdfUrl
              submitLabel
              successHeading
              successNote
              downloadLabel
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageBlankBlocksKofiSupport {
              heading
              body
              ctaLabel
              href
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageBlankBlocksMarquee {
              highlightText
              text
            }
            ... on LandingPageBlankBlocksSocialLinks {
              heading
              body
              links {
                __typename
                platform
                url
                label
              }
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
          }
          seoAssistant
          seo {
            __typename
            metaTitle
            metaDescription
          }
        }
        ... on LandingPageEvent {
          title
          layout
          blocks {
            __typename
            ... on LandingPageEventBlocksHomeHero {
              backgroundImage
              eyebrow
              heading
              subheading
              ctaPrimary
              ctaPrimaryLink
              ctaSecondary
              ctaSecondaryLink
              metaLine
              marqueeItems
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageEventBlocksHero {
              heading
              subheading
              backgroundImage
              ctaLabel
              ctaLink
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageEventBlocksHeroSplitImage {
              eyebrow
              heading
              subheading
              featuredImage
              imageAlt
              imageCaption
              imagePosition
              ctaPrimary
              ctaPrimaryLink
              ctaSecondary
              ctaSecondaryLink
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageEventBlocksHeroFullBleed {
              backgroundImage
              heading
              subheading
              overlay
              textAlign
              minHeight
              ctaLabel
              ctaLink
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageEventBlocksHeroFloatingImages {
              eyebrow
              heading
              subheading
              images {
                __typename
                src
                alt
                caption
              }
              ctaPrimary
              ctaPrimaryLink
              ctaSecondary
              ctaSecondaryLink
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageEventBlocksHeroImageGrid {
              eyebrow
              heading
              subheading
              layout
              images {
                __typename
                src
                alt
                caption
              }
              ctaLabel
              ctaLink
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageEventBlocksPageHeader {
              heading
              description
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageEventBlocksText {
              heading
              body
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageEventBlocksImageSpotlight {
              eyebrow
              heading
              image
              alt
              caption
              aspect
              body
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageEventBlocksImageSideBySide {
              heading
              leftImage {
                __typename
                src
                alt
                caption
              }
              rightImage {
                __typename
                src
                alt
                caption
              }
              style
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageEventBlocksImageMasonry {
              heading
              images {
                __typename
                src
                alt
                caption
                size
              }
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageEventBlocksVideoEmbed {
              heading
              youtubeUrl
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageEventBlocksFeaturedRelease {
              eyebrow
              title
              description
              coverImage
              backCoverImage
              ctaLabel
              ctaHref
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageEventBlocksProductStrip {
              eyebrow
              heading
              viewAllLabel
              viewAllLink
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageEventBlocksShopCatalog {
              heading
              highlightText
              description
              showFeaturedBanner
              emptyHeading
              emptyDescription
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageEventBlocksGalleryGrid {
              emptyHeading
              emptyDescription
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageEventBlocksDownloadsGrid {
              emptyHeading
              emptyDescription
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageEventBlocksFeaturedVideo {
              eyebrow
              heading
              description
              youtubeUrl
              buttonLabel
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageEventBlocksGalleryPreview {
              eyebrow
              heading
              description
              maxItems
              viewAllLabel
              viewAllLink
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageEventBlocksDownloadsPreview {
              eyebrow
              heading
              description
              maxItems
              viewAllLabel
              viewAllLink
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageEventBlocksCtaBand {
              heading
              description
              ctaLabel
              ctaLink
              variant
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageEventBlocksBigCta {
              eyebrow
              heading
              highlightText
              primaryLabel
              primaryLink
              secondaryLabel
              secondaryLink
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageEventBlocksNewsletterSignup {
              eyebrow
              heading
              subheading
              placeholderText
              ctaLabel
              privacyNote
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageEventBlocksContactInfo {
              email
              location
            }
            ... on LandingPageEventBlocksContactForm {
              submitLabel
            }
            ... on LandingPageEventBlocksDummyBookRequest {
              heading
              description
              pdfUrl
              submitLabel
              successHeading
              successNote
              downloadLabel
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageEventBlocksKofiSupport {
              heading
              body
              ctaLabel
              href
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageEventBlocksMarquee {
              highlightText
              text
            }
            ... on LandingPageEventBlocksSocialLinks {
              heading
              body
              links {
                __typename
                platform
                url
                label
              }
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
          }
          seoAssistant
          seo {
            __typename
            metaTitle
            metaDescription
          }
        }
        ... on LandingPagePromo {
          title
          layout
          blocks {
            __typename
            ... on LandingPagePromoBlocksHomeHero {
              backgroundImage
              eyebrow
              heading
              subheading
              ctaPrimary
              ctaPrimaryLink
              ctaSecondary
              ctaSecondaryLink
              metaLine
              marqueeItems
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPagePromoBlocksHero {
              heading
              subheading
              backgroundImage
              ctaLabel
              ctaLink
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPagePromoBlocksHeroSplitImage {
              eyebrow
              heading
              subheading
              featuredImage
              imageAlt
              imageCaption
              imagePosition
              ctaPrimary
              ctaPrimaryLink
              ctaSecondary
              ctaSecondaryLink
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPagePromoBlocksHeroFullBleed {
              backgroundImage
              heading
              subheading
              overlay
              textAlign
              minHeight
              ctaLabel
              ctaLink
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPagePromoBlocksHeroFloatingImages {
              eyebrow
              heading
              subheading
              images {
                __typename
                src
                alt
                caption
              }
              ctaPrimary
              ctaPrimaryLink
              ctaSecondary
              ctaSecondaryLink
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPagePromoBlocksHeroImageGrid {
              eyebrow
              heading
              subheading
              layout
              images {
                __typename
                src
                alt
                caption
              }
              ctaLabel
              ctaLink
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPagePromoBlocksPageHeader {
              heading
              description
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPagePromoBlocksText {
              heading
              body
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPagePromoBlocksImageSpotlight {
              eyebrow
              heading
              image
              alt
              caption
              aspect
              body
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPagePromoBlocksImageSideBySide {
              heading
              leftImage {
                __typename
                src
                alt
                caption
              }
              rightImage {
                __typename
                src
                alt
                caption
              }
              style
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPagePromoBlocksImageMasonry {
              heading
              images {
                __typename
                src
                alt
                caption
                size
              }
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPagePromoBlocksVideoEmbed {
              heading
              youtubeUrl
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPagePromoBlocksFeaturedRelease {
              eyebrow
              title
              description
              coverImage
              backCoverImage
              ctaLabel
              ctaHref
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPagePromoBlocksProductStrip {
              eyebrow
              heading
              viewAllLabel
              viewAllLink
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPagePromoBlocksShopCatalog {
              heading
              highlightText
              description
              showFeaturedBanner
              emptyHeading
              emptyDescription
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPagePromoBlocksGalleryGrid {
              emptyHeading
              emptyDescription
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPagePromoBlocksDownloadsGrid {
              emptyHeading
              emptyDescription
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPagePromoBlocksFeaturedVideo {
              eyebrow
              heading
              description
              youtubeUrl
              buttonLabel
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPagePromoBlocksGalleryPreview {
              eyebrow
              heading
              description
              maxItems
              viewAllLabel
              viewAllLink
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPagePromoBlocksDownloadsPreview {
              eyebrow
              heading
              description
              maxItems
              viewAllLabel
              viewAllLink
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPagePromoBlocksCtaBand {
              heading
              description
              ctaLabel
              ctaLink
              variant
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPagePromoBlocksBigCta {
              eyebrow
              heading
              highlightText
              primaryLabel
              primaryLink
              secondaryLabel
              secondaryLink
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPagePromoBlocksNewsletterSignup {
              eyebrow
              heading
              subheading
              placeholderText
              ctaLabel
              privacyNote
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPagePromoBlocksContactInfo {
              email
              location
            }
            ... on LandingPagePromoBlocksContactForm {
              submitLabel
            }
            ... on LandingPagePromoBlocksDummyBookRequest {
              heading
              description
              pdfUrl
              submitLabel
              successHeading
              successNote
              downloadLabel
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPagePromoBlocksKofiSupport {
              heading
              body
              ctaLabel
              href
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPagePromoBlocksMarquee {
              highlightText
              text
            }
            ... on LandingPagePromoBlocksSocialLinks {
              heading
              body
              links {
                __typename
                platform
                url
                label
              }
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
          }
          seoAssistant
          seo {
            __typename
            metaTitle
            metaDescription
          }
        }
        ... on LandingPageInfo {
          title
          layout
          blocks {
            __typename
            ... on LandingPageInfoBlocksHomeHero {
              backgroundImage
              eyebrow
              heading
              subheading
              ctaPrimary
              ctaPrimaryLink
              ctaSecondary
              ctaSecondaryLink
              metaLine
              marqueeItems
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageInfoBlocksHero {
              heading
              subheading
              backgroundImage
              ctaLabel
              ctaLink
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageInfoBlocksHeroSplitImage {
              eyebrow
              heading
              subheading
              featuredImage
              imageAlt
              imageCaption
              imagePosition
              ctaPrimary
              ctaPrimaryLink
              ctaSecondary
              ctaSecondaryLink
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageInfoBlocksHeroFullBleed {
              backgroundImage
              heading
              subheading
              overlay
              textAlign
              minHeight
              ctaLabel
              ctaLink
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageInfoBlocksHeroFloatingImages {
              eyebrow
              heading
              subheading
              images {
                __typename
                src
                alt
                caption
              }
              ctaPrimary
              ctaPrimaryLink
              ctaSecondary
              ctaSecondaryLink
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageInfoBlocksHeroImageGrid {
              eyebrow
              heading
              subheading
              layout
              images {
                __typename
                src
                alt
                caption
              }
              ctaLabel
              ctaLink
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageInfoBlocksPageHeader {
              heading
              description
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageInfoBlocksText {
              heading
              body
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageInfoBlocksImageSpotlight {
              eyebrow
              heading
              image
              alt
              caption
              aspect
              body
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageInfoBlocksImageSideBySide {
              heading
              leftImage {
                __typename
                src
                alt
                caption
              }
              rightImage {
                __typename
                src
                alt
                caption
              }
              style
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageInfoBlocksImageMasonry {
              heading
              images {
                __typename
                src
                alt
                caption
                size
              }
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageInfoBlocksVideoEmbed {
              heading
              youtubeUrl
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageInfoBlocksFeaturedRelease {
              eyebrow
              title
              description
              coverImage
              backCoverImage
              ctaLabel
              ctaHref
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageInfoBlocksProductStrip {
              eyebrow
              heading
              viewAllLabel
              viewAllLink
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageInfoBlocksShopCatalog {
              heading
              highlightText
              description
              showFeaturedBanner
              emptyHeading
              emptyDescription
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageInfoBlocksGalleryGrid {
              emptyHeading
              emptyDescription
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageInfoBlocksDownloadsGrid {
              emptyHeading
              emptyDescription
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageInfoBlocksFeaturedVideo {
              eyebrow
              heading
              description
              youtubeUrl
              buttonLabel
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageInfoBlocksGalleryPreview {
              eyebrow
              heading
              description
              maxItems
              viewAllLabel
              viewAllLink
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageInfoBlocksDownloadsPreview {
              eyebrow
              heading
              description
              maxItems
              viewAllLabel
              viewAllLink
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageInfoBlocksCtaBand {
              heading
              description
              ctaLabel
              ctaLink
              variant
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageInfoBlocksBigCta {
              eyebrow
              heading
              highlightText
              primaryLabel
              primaryLink
              secondaryLabel
              secondaryLink
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageInfoBlocksNewsletterSignup {
              eyebrow
              heading
              subheading
              placeholderText
              ctaLabel
              privacyNote
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageInfoBlocksContactInfo {
              email
              location
            }
            ... on LandingPageInfoBlocksContactForm {
              submitLabel
            }
            ... on LandingPageInfoBlocksDummyBookRequest {
              heading
              description
              pdfUrl
              submitLabel
              successHeading
              successNote
              downloadLabel
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageInfoBlocksKofiSupport {
              heading
              body
              ctaLabel
              href
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageInfoBlocksMarquee {
              highlightText
              text
            }
            ... on LandingPageInfoBlocksSocialLinks {
              heading
              body
              links {
                __typename
                platform
                url
                label
              }
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
          }
          seoAssistant
          seo {
            __typename
            metaTitle
            metaDescription
          }
        }
        ... on LandingPageLinkInBio {
          title
          layout
          blocks {
            __typename
            ... on LandingPageLinkInBioBlocksHomeHero {
              backgroundImage
              eyebrow
              heading
              subheading
              ctaPrimary
              ctaPrimaryLink
              ctaSecondary
              ctaSecondaryLink
              metaLine
              marqueeItems
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageLinkInBioBlocksHero {
              heading
              subheading
              backgroundImage
              ctaLabel
              ctaLink
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageLinkInBioBlocksHeroSplitImage {
              eyebrow
              heading
              subheading
              featuredImage
              imageAlt
              imageCaption
              imagePosition
              ctaPrimary
              ctaPrimaryLink
              ctaSecondary
              ctaSecondaryLink
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageLinkInBioBlocksHeroFullBleed {
              backgroundImage
              heading
              subheading
              overlay
              textAlign
              minHeight
              ctaLabel
              ctaLink
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageLinkInBioBlocksHeroFloatingImages {
              eyebrow
              heading
              subheading
              images {
                __typename
                src
                alt
                caption
              }
              ctaPrimary
              ctaPrimaryLink
              ctaSecondary
              ctaSecondaryLink
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageLinkInBioBlocksHeroImageGrid {
              eyebrow
              heading
              subheading
              layout
              images {
                __typename
                src
                alt
                caption
              }
              ctaLabel
              ctaLink
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageLinkInBioBlocksPageHeader {
              heading
              description
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageLinkInBioBlocksText {
              heading
              body
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageLinkInBioBlocksImageSpotlight {
              eyebrow
              heading
              image
              alt
              caption
              aspect
              body
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageLinkInBioBlocksImageSideBySide {
              heading
              leftImage {
                __typename
                src
                alt
                caption
              }
              rightImage {
                __typename
                src
                alt
                caption
              }
              style
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageLinkInBioBlocksImageMasonry {
              heading
              images {
                __typename
                src
                alt
                caption
                size
              }
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageLinkInBioBlocksVideoEmbed {
              heading
              youtubeUrl
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageLinkInBioBlocksFeaturedRelease {
              eyebrow
              title
              description
              coverImage
              backCoverImage
              ctaLabel
              ctaHref
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageLinkInBioBlocksProductStrip {
              eyebrow
              heading
              viewAllLabel
              viewAllLink
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageLinkInBioBlocksShopCatalog {
              heading
              highlightText
              description
              showFeaturedBanner
              emptyHeading
              emptyDescription
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageLinkInBioBlocksGalleryGrid {
              emptyHeading
              emptyDescription
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageLinkInBioBlocksDownloadsGrid {
              emptyHeading
              emptyDescription
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageLinkInBioBlocksFeaturedVideo {
              eyebrow
              heading
              description
              youtubeUrl
              buttonLabel
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageLinkInBioBlocksGalleryPreview {
              eyebrow
              heading
              description
              maxItems
              viewAllLabel
              viewAllLink
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageLinkInBioBlocksDownloadsPreview {
              eyebrow
              heading
              description
              maxItems
              viewAllLabel
              viewAllLink
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageLinkInBioBlocksCtaBand {
              heading
              description
              ctaLabel
              ctaLink
              variant
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageLinkInBioBlocksBigCta {
              eyebrow
              heading
              highlightText
              primaryLabel
              primaryLink
              secondaryLabel
              secondaryLink
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageLinkInBioBlocksNewsletterSignup {
              eyebrow
              heading
              subheading
              placeholderText
              ctaLabel
              privacyNote
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageLinkInBioBlocksContactInfo {
              email
              location
            }
            ... on LandingPageLinkInBioBlocksContactForm {
              submitLabel
            }
            ... on LandingPageLinkInBioBlocksDummyBookRequest {
              heading
              description
              pdfUrl
              submitLabel
              successHeading
              successNote
              downloadLabel
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageLinkInBioBlocksKofiSupport {
              heading
              body
              ctaLabel
              href
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on LandingPageLinkInBioBlocksMarquee {
              highlightText
              text
            }
            ... on LandingPageLinkInBioBlocksSocialLinks {
              heading
              body
              links {
                __typename
                platform
                url
                label
              }
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
          }
          seoAssistant
          seo {
            __typename
            metaTitle
            metaDescription
          }
        }
      }
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
    }
    href
    children {
      __typename
      label
      linkType
      page {
        ... on Page {
          __typename
          title
          layout
          blocks {
            __typename
            ... on PageBlocksHomeHero {
              backgroundImage
              eyebrow
              heading
              subheading
              ctaPrimary
              ctaPrimaryLink
              ctaSecondary
              ctaSecondaryLink
              metaLine
              marqueeItems
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on PageBlocksHero {
              heading
              subheading
              backgroundImage
              ctaLabel
              ctaLink
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on PageBlocksHeroSplitImage {
              eyebrow
              heading
              subheading
              featuredImage
              imageAlt
              imageCaption
              imagePosition
              ctaPrimary
              ctaPrimaryLink
              ctaSecondary
              ctaSecondaryLink
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on PageBlocksHeroFullBleed {
              backgroundImage
              heading
              subheading
              overlay
              textAlign
              minHeight
              ctaLabel
              ctaLink
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on PageBlocksHeroFloatingImages {
              eyebrow
              heading
              subheading
              images {
                __typename
                src
                alt
                caption
              }
              ctaPrimary
              ctaPrimaryLink
              ctaSecondary
              ctaSecondaryLink
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on PageBlocksHeroImageGrid {
              eyebrow
              heading
              subheading
              layout
              images {
                __typename
                src
                alt
                caption
              }
              ctaLabel
              ctaLink
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on PageBlocksPageHeader {
              heading
              description
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on PageBlocksText {
              heading
              body
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on PageBlocksImageSpotlight {
              eyebrow
              heading
              image
              alt
              caption
              aspect
              body
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on PageBlocksImageSideBySide {
              heading
              leftImage {
                __typename
                src
                alt
                caption
              }
              rightImage {
                __typename
                src
                alt
                caption
              }
              style
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on PageBlocksImageMasonry {
              heading
              images {
                __typename
                src
                alt
                caption
                size
              }
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on PageBlocksVideoEmbed {
              heading
              youtubeUrl
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on PageBlocksFeaturedRelease {
              eyebrow
              title
              description
              coverImage
              backCoverImage
              ctaLabel
              ctaHref
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on PageBlocksProductStrip {
              eyebrow
              heading
              viewAllLabel
              viewAllLink
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on PageBlocksShopCatalog {
              heading
              highlightText
              description
              showFeaturedBanner
              emptyHeading
              emptyDescription
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on PageBlocksGalleryGrid {
              emptyHeading
              emptyDescription
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on PageBlocksDownloadsGrid {
              emptyHeading
              emptyDescription
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on PageBlocksFeaturedVideo {
              eyebrow
              heading
              description
              youtubeUrl
              buttonLabel
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on PageBlocksGalleryPreview {
              eyebrow
              heading
              description
              maxItems
              viewAllLabel
              viewAllLink
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on PageBlocksDownloadsPreview {
              eyebrow
              heading
              description
              maxItems
              viewAllLabel
              viewAllLink
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on PageBlocksCtaBand {
              heading
              description
              ctaLabel
              ctaLink
              variant
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on PageBlocksBigCta {
              eyebrow
              heading
              highlightText
              primaryLabel
              primaryLink
              secondaryLabel
              secondaryLink
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on PageBlocksNewsletterSignup {
              eyebrow
              heading
              subheading
              placeholderText
              ctaLabel
              privacyNote
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on PageBlocksContactInfo {
              email
              location
            }
            ... on PageBlocksContactForm {
              submitLabel
            }
            ... on PageBlocksDummyBookRequest {
              heading
              description
              pdfUrl
              submitLabel
              successHeading
              successNote
              downloadLabel
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on PageBlocksKofiSupport {
              heading
              body
              ctaLabel
              href
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on PageBlocksMarquee {
              highlightText
              text
            }
            ... on PageBlocksSocialLinks {
              heading
              body
              links {
                __typename
                platform
                url
                label
              }
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
          }
          seoAssistant
          seo {
            __typename
            metaTitle
            metaDescription
          }
        }
        ... on LandingPage {
          __typename
          ... on LandingPageBlank {
            title
            layout
            blocks {
              __typename
              ... on LandingPageBlankBlocksHomeHero {
                backgroundImage
                eyebrow
                heading
                subheading
                ctaPrimary
                ctaPrimaryLink
                ctaSecondary
                ctaSecondaryLink
                metaLine
                marqueeItems
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageBlankBlocksHero {
                heading
                subheading
                backgroundImage
                ctaLabel
                ctaLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageBlankBlocksHeroSplitImage {
                eyebrow
                heading
                subheading
                featuredImage
                imageAlt
                imageCaption
                imagePosition
                ctaPrimary
                ctaPrimaryLink
                ctaSecondary
                ctaSecondaryLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageBlankBlocksHeroFullBleed {
                backgroundImage
                heading
                subheading
                overlay
                textAlign
                minHeight
                ctaLabel
                ctaLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageBlankBlocksHeroFloatingImages {
                eyebrow
                heading
                subheading
                images {
                  __typename
                  src
                  alt
                  caption
                }
                ctaPrimary
                ctaPrimaryLink
                ctaSecondary
                ctaSecondaryLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageBlankBlocksHeroImageGrid {
                eyebrow
                heading
                subheading
                layout
                images {
                  __typename
                  src
                  alt
                  caption
                }
                ctaLabel
                ctaLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageBlankBlocksPageHeader {
                heading
                description
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageBlankBlocksText {
                heading
                body
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageBlankBlocksImageSpotlight {
                eyebrow
                heading
                image
                alt
                caption
                aspect
                body
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageBlankBlocksImageSideBySide {
                heading
                leftImage {
                  __typename
                  src
                  alt
                  caption
                }
                rightImage {
                  __typename
                  src
                  alt
                  caption
                }
                style
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageBlankBlocksImageMasonry {
                heading
                images {
                  __typename
                  src
                  alt
                  caption
                  size
                }
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageBlankBlocksVideoEmbed {
                heading
                youtubeUrl
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageBlankBlocksFeaturedRelease {
                eyebrow
                title
                description
                coverImage
                backCoverImage
                ctaLabel
                ctaHref
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageBlankBlocksProductStrip {
                eyebrow
                heading
                viewAllLabel
                viewAllLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageBlankBlocksShopCatalog {
                heading
                highlightText
                description
                showFeaturedBanner
                emptyHeading
                emptyDescription
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageBlankBlocksGalleryGrid {
                emptyHeading
                emptyDescription
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageBlankBlocksDownloadsGrid {
                emptyHeading
                emptyDescription
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageBlankBlocksFeaturedVideo {
                eyebrow
                heading
                description
                youtubeUrl
                buttonLabel
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageBlankBlocksGalleryPreview {
                eyebrow
                heading
                description
                maxItems
                viewAllLabel
                viewAllLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageBlankBlocksDownloadsPreview {
                eyebrow
                heading
                description
                maxItems
                viewAllLabel
                viewAllLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageBlankBlocksCtaBand {
                heading
                description
                ctaLabel
                ctaLink
                variant
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageBlankBlocksBigCta {
                eyebrow
                heading
                highlightText
                primaryLabel
                primaryLink
                secondaryLabel
                secondaryLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageBlankBlocksNewsletterSignup {
                eyebrow
                heading
                subheading
                placeholderText
                ctaLabel
                privacyNote
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageBlankBlocksContactInfo {
                email
                location
              }
              ... on LandingPageBlankBlocksContactForm {
                submitLabel
              }
              ... on LandingPageBlankBlocksDummyBookRequest {
                heading
                description
                pdfUrl
                submitLabel
                successHeading
                successNote
                downloadLabel
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageBlankBlocksKofiSupport {
                heading
                body
                ctaLabel
                href
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageBlankBlocksMarquee {
                highlightText
                text
              }
              ... on LandingPageBlankBlocksSocialLinks {
                heading
                body
                links {
                  __typename
                  platform
                  url
                  label
                }
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
            }
            seoAssistant
            seo {
              __typename
              metaTitle
              metaDescription
            }
          }
          ... on LandingPageEvent {
            title
            layout
            blocks {
              __typename
              ... on LandingPageEventBlocksHomeHero {
                backgroundImage
                eyebrow
                heading
                subheading
                ctaPrimary
                ctaPrimaryLink
                ctaSecondary
                ctaSecondaryLink
                metaLine
                marqueeItems
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageEventBlocksHero {
                heading
                subheading
                backgroundImage
                ctaLabel
                ctaLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageEventBlocksHeroSplitImage {
                eyebrow
                heading
                subheading
                featuredImage
                imageAlt
                imageCaption
                imagePosition
                ctaPrimary
                ctaPrimaryLink
                ctaSecondary
                ctaSecondaryLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageEventBlocksHeroFullBleed {
                backgroundImage
                heading
                subheading
                overlay
                textAlign
                minHeight
                ctaLabel
                ctaLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageEventBlocksHeroFloatingImages {
                eyebrow
                heading
                subheading
                images {
                  __typename
                  src
                  alt
                  caption
                }
                ctaPrimary
                ctaPrimaryLink
                ctaSecondary
                ctaSecondaryLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageEventBlocksHeroImageGrid {
                eyebrow
                heading
                subheading
                layout
                images {
                  __typename
                  src
                  alt
                  caption
                }
                ctaLabel
                ctaLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageEventBlocksPageHeader {
                heading
                description
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageEventBlocksText {
                heading
                body
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageEventBlocksImageSpotlight {
                eyebrow
                heading
                image
                alt
                caption
                aspect
                body
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageEventBlocksImageSideBySide {
                heading
                leftImage {
                  __typename
                  src
                  alt
                  caption
                }
                rightImage {
                  __typename
                  src
                  alt
                  caption
                }
                style
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageEventBlocksImageMasonry {
                heading
                images {
                  __typename
                  src
                  alt
                  caption
                  size
                }
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageEventBlocksVideoEmbed {
                heading
                youtubeUrl
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageEventBlocksFeaturedRelease {
                eyebrow
                title
                description
                coverImage
                backCoverImage
                ctaLabel
                ctaHref
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageEventBlocksProductStrip {
                eyebrow
                heading
                viewAllLabel
                viewAllLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageEventBlocksShopCatalog {
                heading
                highlightText
                description
                showFeaturedBanner
                emptyHeading
                emptyDescription
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageEventBlocksGalleryGrid {
                emptyHeading
                emptyDescription
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageEventBlocksDownloadsGrid {
                emptyHeading
                emptyDescription
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageEventBlocksFeaturedVideo {
                eyebrow
                heading
                description
                youtubeUrl
                buttonLabel
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageEventBlocksGalleryPreview {
                eyebrow
                heading
                description
                maxItems
                viewAllLabel
                viewAllLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageEventBlocksDownloadsPreview {
                eyebrow
                heading
                description
                maxItems
                viewAllLabel
                viewAllLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageEventBlocksCtaBand {
                heading
                description
                ctaLabel
                ctaLink
                variant
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageEventBlocksBigCta {
                eyebrow
                heading
                highlightText
                primaryLabel
                primaryLink
                secondaryLabel
                secondaryLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageEventBlocksNewsletterSignup {
                eyebrow
                heading
                subheading
                placeholderText
                ctaLabel
                privacyNote
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageEventBlocksContactInfo {
                email
                location
              }
              ... on LandingPageEventBlocksContactForm {
                submitLabel
              }
              ... on LandingPageEventBlocksDummyBookRequest {
                heading
                description
                pdfUrl
                submitLabel
                successHeading
                successNote
                downloadLabel
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageEventBlocksKofiSupport {
                heading
                body
                ctaLabel
                href
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageEventBlocksMarquee {
                highlightText
                text
              }
              ... on LandingPageEventBlocksSocialLinks {
                heading
                body
                links {
                  __typename
                  platform
                  url
                  label
                }
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
            }
            seoAssistant
            seo {
              __typename
              metaTitle
              metaDescription
            }
          }
          ... on LandingPagePromo {
            title
            layout
            blocks {
              __typename
              ... on LandingPagePromoBlocksHomeHero {
                backgroundImage
                eyebrow
                heading
                subheading
                ctaPrimary
                ctaPrimaryLink
                ctaSecondary
                ctaSecondaryLink
                metaLine
                marqueeItems
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPagePromoBlocksHero {
                heading
                subheading
                backgroundImage
                ctaLabel
                ctaLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPagePromoBlocksHeroSplitImage {
                eyebrow
                heading
                subheading
                featuredImage
                imageAlt
                imageCaption
                imagePosition
                ctaPrimary
                ctaPrimaryLink
                ctaSecondary
                ctaSecondaryLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPagePromoBlocksHeroFullBleed {
                backgroundImage
                heading
                subheading
                overlay
                textAlign
                minHeight
                ctaLabel
                ctaLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPagePromoBlocksHeroFloatingImages {
                eyebrow
                heading
                subheading
                images {
                  __typename
                  src
                  alt
                  caption
                }
                ctaPrimary
                ctaPrimaryLink
                ctaSecondary
                ctaSecondaryLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPagePromoBlocksHeroImageGrid {
                eyebrow
                heading
                subheading
                layout
                images {
                  __typename
                  src
                  alt
                  caption
                }
                ctaLabel
                ctaLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPagePromoBlocksPageHeader {
                heading
                description
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPagePromoBlocksText {
                heading
                body
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPagePromoBlocksImageSpotlight {
                eyebrow
                heading
                image
                alt
                caption
                aspect
                body
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPagePromoBlocksImageSideBySide {
                heading
                leftImage {
                  __typename
                  src
                  alt
                  caption
                }
                rightImage {
                  __typename
                  src
                  alt
                  caption
                }
                style
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPagePromoBlocksImageMasonry {
                heading
                images {
                  __typename
                  src
                  alt
                  caption
                  size
                }
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPagePromoBlocksVideoEmbed {
                heading
                youtubeUrl
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPagePromoBlocksFeaturedRelease {
                eyebrow
                title
                description
                coverImage
                backCoverImage
                ctaLabel
                ctaHref
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPagePromoBlocksProductStrip {
                eyebrow
                heading
                viewAllLabel
                viewAllLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPagePromoBlocksShopCatalog {
                heading
                highlightText
                description
                showFeaturedBanner
                emptyHeading
                emptyDescription
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPagePromoBlocksGalleryGrid {
                emptyHeading
                emptyDescription
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPagePromoBlocksDownloadsGrid {
                emptyHeading
                emptyDescription
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPagePromoBlocksFeaturedVideo {
                eyebrow
                heading
                description
                youtubeUrl
                buttonLabel
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPagePromoBlocksGalleryPreview {
                eyebrow
                heading
                description
                maxItems
                viewAllLabel
                viewAllLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPagePromoBlocksDownloadsPreview {
                eyebrow
                heading
                description
                maxItems
                viewAllLabel
                viewAllLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPagePromoBlocksCtaBand {
                heading
                description
                ctaLabel
                ctaLink
                variant
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPagePromoBlocksBigCta {
                eyebrow
                heading
                highlightText
                primaryLabel
                primaryLink
                secondaryLabel
                secondaryLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPagePromoBlocksNewsletterSignup {
                eyebrow
                heading
                subheading
                placeholderText
                ctaLabel
                privacyNote
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPagePromoBlocksContactInfo {
                email
                location
              }
              ... on LandingPagePromoBlocksContactForm {
                submitLabel
              }
              ... on LandingPagePromoBlocksDummyBookRequest {
                heading
                description
                pdfUrl
                submitLabel
                successHeading
                successNote
                downloadLabel
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPagePromoBlocksKofiSupport {
                heading
                body
                ctaLabel
                href
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPagePromoBlocksMarquee {
                highlightText
                text
              }
              ... on LandingPagePromoBlocksSocialLinks {
                heading
                body
                links {
                  __typename
                  platform
                  url
                  label
                }
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
            }
            seoAssistant
            seo {
              __typename
              metaTitle
              metaDescription
            }
          }
          ... on LandingPageInfo {
            title
            layout
            blocks {
              __typename
              ... on LandingPageInfoBlocksHomeHero {
                backgroundImage
                eyebrow
                heading
                subheading
                ctaPrimary
                ctaPrimaryLink
                ctaSecondary
                ctaSecondaryLink
                metaLine
                marqueeItems
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageInfoBlocksHero {
                heading
                subheading
                backgroundImage
                ctaLabel
                ctaLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageInfoBlocksHeroSplitImage {
                eyebrow
                heading
                subheading
                featuredImage
                imageAlt
                imageCaption
                imagePosition
                ctaPrimary
                ctaPrimaryLink
                ctaSecondary
                ctaSecondaryLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageInfoBlocksHeroFullBleed {
                backgroundImage
                heading
                subheading
                overlay
                textAlign
                minHeight
                ctaLabel
                ctaLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageInfoBlocksHeroFloatingImages {
                eyebrow
                heading
                subheading
                images {
                  __typename
                  src
                  alt
                  caption
                }
                ctaPrimary
                ctaPrimaryLink
                ctaSecondary
                ctaSecondaryLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageInfoBlocksHeroImageGrid {
                eyebrow
                heading
                subheading
                layout
                images {
                  __typename
                  src
                  alt
                  caption
                }
                ctaLabel
                ctaLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageInfoBlocksPageHeader {
                heading
                description
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageInfoBlocksText {
                heading
                body
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageInfoBlocksImageSpotlight {
                eyebrow
                heading
                image
                alt
                caption
                aspect
                body
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageInfoBlocksImageSideBySide {
                heading
                leftImage {
                  __typename
                  src
                  alt
                  caption
                }
                rightImage {
                  __typename
                  src
                  alt
                  caption
                }
                style
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageInfoBlocksImageMasonry {
                heading
                images {
                  __typename
                  src
                  alt
                  caption
                  size
                }
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageInfoBlocksVideoEmbed {
                heading
                youtubeUrl
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageInfoBlocksFeaturedRelease {
                eyebrow
                title
                description
                coverImage
                backCoverImage
                ctaLabel
                ctaHref
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageInfoBlocksProductStrip {
                eyebrow
                heading
                viewAllLabel
                viewAllLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageInfoBlocksShopCatalog {
                heading
                highlightText
                description
                showFeaturedBanner
                emptyHeading
                emptyDescription
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageInfoBlocksGalleryGrid {
                emptyHeading
                emptyDescription
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageInfoBlocksDownloadsGrid {
                emptyHeading
                emptyDescription
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageInfoBlocksFeaturedVideo {
                eyebrow
                heading
                description
                youtubeUrl
                buttonLabel
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageInfoBlocksGalleryPreview {
                eyebrow
                heading
                description
                maxItems
                viewAllLabel
                viewAllLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageInfoBlocksDownloadsPreview {
                eyebrow
                heading
                description
                maxItems
                viewAllLabel
                viewAllLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageInfoBlocksCtaBand {
                heading
                description
                ctaLabel
                ctaLink
                variant
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageInfoBlocksBigCta {
                eyebrow
                heading
                highlightText
                primaryLabel
                primaryLink
                secondaryLabel
                secondaryLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageInfoBlocksNewsletterSignup {
                eyebrow
                heading
                subheading
                placeholderText
                ctaLabel
                privacyNote
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageInfoBlocksContactInfo {
                email
                location
              }
              ... on LandingPageInfoBlocksContactForm {
                submitLabel
              }
              ... on LandingPageInfoBlocksDummyBookRequest {
                heading
                description
                pdfUrl
                submitLabel
                successHeading
                successNote
                downloadLabel
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageInfoBlocksKofiSupport {
                heading
                body
                ctaLabel
                href
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageInfoBlocksMarquee {
                highlightText
                text
              }
              ... on LandingPageInfoBlocksSocialLinks {
                heading
                body
                links {
                  __typename
                  platform
                  url
                  label
                }
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
            }
            seoAssistant
            seo {
              __typename
              metaTitle
              metaDescription
            }
          }
          ... on LandingPageLinkInBio {
            title
            layout
            blocks {
              __typename
              ... on LandingPageLinkInBioBlocksHomeHero {
                backgroundImage
                eyebrow
                heading
                subheading
                ctaPrimary
                ctaPrimaryLink
                ctaSecondary
                ctaSecondaryLink
                metaLine
                marqueeItems
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageLinkInBioBlocksHero {
                heading
                subheading
                backgroundImage
                ctaLabel
                ctaLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageLinkInBioBlocksHeroSplitImage {
                eyebrow
                heading
                subheading
                featuredImage
                imageAlt
                imageCaption
                imagePosition
                ctaPrimary
                ctaPrimaryLink
                ctaSecondary
                ctaSecondaryLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageLinkInBioBlocksHeroFullBleed {
                backgroundImage
                heading
                subheading
                overlay
                textAlign
                minHeight
                ctaLabel
                ctaLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageLinkInBioBlocksHeroFloatingImages {
                eyebrow
                heading
                subheading
                images {
                  __typename
                  src
                  alt
                  caption
                }
                ctaPrimary
                ctaPrimaryLink
                ctaSecondary
                ctaSecondaryLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageLinkInBioBlocksHeroImageGrid {
                eyebrow
                heading
                subheading
                layout
                images {
                  __typename
                  src
                  alt
                  caption
                }
                ctaLabel
                ctaLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageLinkInBioBlocksPageHeader {
                heading
                description
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageLinkInBioBlocksText {
                heading
                body
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageLinkInBioBlocksImageSpotlight {
                eyebrow
                heading
                image
                alt
                caption
                aspect
                body
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageLinkInBioBlocksImageSideBySide {
                heading
                leftImage {
                  __typename
                  src
                  alt
                  caption
                }
                rightImage {
                  __typename
                  src
                  alt
                  caption
                }
                style
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageLinkInBioBlocksImageMasonry {
                heading
                images {
                  __typename
                  src
                  alt
                  caption
                  size
                }
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageLinkInBioBlocksVideoEmbed {
                heading
                youtubeUrl
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageLinkInBioBlocksFeaturedRelease {
                eyebrow
                title
                description
                coverImage
                backCoverImage
                ctaLabel
                ctaHref
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageLinkInBioBlocksProductStrip {
                eyebrow
                heading
                viewAllLabel
                viewAllLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageLinkInBioBlocksShopCatalog {
                heading
                highlightText
                description
                showFeaturedBanner
                emptyHeading
                emptyDescription
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageLinkInBioBlocksGalleryGrid {
                emptyHeading
                emptyDescription
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageLinkInBioBlocksDownloadsGrid {
                emptyHeading
                emptyDescription
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageLinkInBioBlocksFeaturedVideo {
                eyebrow
                heading
                description
                youtubeUrl
                buttonLabel
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageLinkInBioBlocksGalleryPreview {
                eyebrow
                heading
                description
                maxItems
                viewAllLabel
                viewAllLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageLinkInBioBlocksDownloadsPreview {
                eyebrow
                heading
                description
                maxItems
                viewAllLabel
                viewAllLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageLinkInBioBlocksCtaBand {
                heading
                description
                ctaLabel
                ctaLink
                variant
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageLinkInBioBlocksBigCta {
                eyebrow
                heading
                highlightText
                primaryLabel
                primaryLink
                secondaryLabel
                secondaryLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageLinkInBioBlocksNewsletterSignup {
                eyebrow
                heading
                subheading
                placeholderText
                ctaLabel
                privacyNote
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageLinkInBioBlocksContactInfo {
                email
                location
              }
              ... on LandingPageLinkInBioBlocksContactForm {
                submitLabel
              }
              ... on LandingPageLinkInBioBlocksDummyBookRequest {
                heading
                description
                pdfUrl
                submitLabel
                successHeading
                successNote
                downloadLabel
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageLinkInBioBlocksKofiSupport {
                heading
                body
                ctaLabel
                href
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageLinkInBioBlocksMarquee {
                highlightText
                text
              }
              ... on LandingPageLinkInBioBlocksSocialLinks {
                heading
                body
                links {
                  __typename
                  platform
                  url
                  label
                }
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
            }
            seoAssistant
            seo {
              __typename
              metaTitle
              metaDescription
            }
          }
        }
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
      }
      href
    }
  }
  footerColumns {
    __typename
    heading
    links {
      __typename
      label
      linkType
      page {
        ... on Page {
          __typename
          title
          layout
          blocks {
            __typename
            ... on PageBlocksHomeHero {
              backgroundImage
              eyebrow
              heading
              subheading
              ctaPrimary
              ctaPrimaryLink
              ctaSecondary
              ctaSecondaryLink
              metaLine
              marqueeItems
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on PageBlocksHero {
              heading
              subheading
              backgroundImage
              ctaLabel
              ctaLink
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on PageBlocksHeroSplitImage {
              eyebrow
              heading
              subheading
              featuredImage
              imageAlt
              imageCaption
              imagePosition
              ctaPrimary
              ctaPrimaryLink
              ctaSecondary
              ctaSecondaryLink
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on PageBlocksHeroFullBleed {
              backgroundImage
              heading
              subheading
              overlay
              textAlign
              minHeight
              ctaLabel
              ctaLink
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on PageBlocksHeroFloatingImages {
              eyebrow
              heading
              subheading
              images {
                __typename
                src
                alt
                caption
              }
              ctaPrimary
              ctaPrimaryLink
              ctaSecondary
              ctaSecondaryLink
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on PageBlocksHeroImageGrid {
              eyebrow
              heading
              subheading
              layout
              images {
                __typename
                src
                alt
                caption
              }
              ctaLabel
              ctaLink
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on PageBlocksPageHeader {
              heading
              description
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on PageBlocksText {
              heading
              body
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on PageBlocksImageSpotlight {
              eyebrow
              heading
              image
              alt
              caption
              aspect
              body
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on PageBlocksImageSideBySide {
              heading
              leftImage {
                __typename
                src
                alt
                caption
              }
              rightImage {
                __typename
                src
                alt
                caption
              }
              style
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on PageBlocksImageMasonry {
              heading
              images {
                __typename
                src
                alt
                caption
                size
              }
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on PageBlocksVideoEmbed {
              heading
              youtubeUrl
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on PageBlocksFeaturedRelease {
              eyebrow
              title
              description
              coverImage
              backCoverImage
              ctaLabel
              ctaHref
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on PageBlocksProductStrip {
              eyebrow
              heading
              viewAllLabel
              viewAllLink
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on PageBlocksShopCatalog {
              heading
              highlightText
              description
              showFeaturedBanner
              emptyHeading
              emptyDescription
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on PageBlocksGalleryGrid {
              emptyHeading
              emptyDescription
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on PageBlocksDownloadsGrid {
              emptyHeading
              emptyDescription
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on PageBlocksFeaturedVideo {
              eyebrow
              heading
              description
              youtubeUrl
              buttonLabel
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on PageBlocksGalleryPreview {
              eyebrow
              heading
              description
              maxItems
              viewAllLabel
              viewAllLink
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on PageBlocksDownloadsPreview {
              eyebrow
              heading
              description
              maxItems
              viewAllLabel
              viewAllLink
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on PageBlocksCtaBand {
              heading
              description
              ctaLabel
              ctaLink
              variant
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on PageBlocksBigCta {
              eyebrow
              heading
              highlightText
              primaryLabel
              primaryLink
              secondaryLabel
              secondaryLink
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on PageBlocksNewsletterSignup {
              eyebrow
              heading
              subheading
              placeholderText
              ctaLabel
              privacyNote
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on PageBlocksContactInfo {
              email
              location
            }
            ... on PageBlocksContactForm {
              submitLabel
            }
            ... on PageBlocksDummyBookRequest {
              heading
              description
              pdfUrl
              submitLabel
              successHeading
              successNote
              downloadLabel
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on PageBlocksKofiSupport {
              heading
              body
              ctaLabel
              href
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
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
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
            ... on PageBlocksMarquee {
              highlightText
              text
            }
            ... on PageBlocksSocialLinks {
              heading
              body
              links {
                __typename
                platform
                url
                label
              }
              textStyle {
                __typename
                headingSize
                headingType
                headingFont
                align
                bodySize
              }
            }
          }
          seoAssistant
          seo {
            __typename
            metaTitle
            metaDescription
          }
        }
        ... on LandingPage {
          __typename
          ... on LandingPageBlank {
            title
            layout
            blocks {
              __typename
              ... on LandingPageBlankBlocksHomeHero {
                backgroundImage
                eyebrow
                heading
                subheading
                ctaPrimary
                ctaPrimaryLink
                ctaSecondary
                ctaSecondaryLink
                metaLine
                marqueeItems
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageBlankBlocksHero {
                heading
                subheading
                backgroundImage
                ctaLabel
                ctaLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageBlankBlocksHeroSplitImage {
                eyebrow
                heading
                subheading
                featuredImage
                imageAlt
                imageCaption
                imagePosition
                ctaPrimary
                ctaPrimaryLink
                ctaSecondary
                ctaSecondaryLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageBlankBlocksHeroFullBleed {
                backgroundImage
                heading
                subheading
                overlay
                textAlign
                minHeight
                ctaLabel
                ctaLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageBlankBlocksHeroFloatingImages {
                eyebrow
                heading
                subheading
                images {
                  __typename
                  src
                  alt
                  caption
                }
                ctaPrimary
                ctaPrimaryLink
                ctaSecondary
                ctaSecondaryLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageBlankBlocksHeroImageGrid {
                eyebrow
                heading
                subheading
                layout
                images {
                  __typename
                  src
                  alt
                  caption
                }
                ctaLabel
                ctaLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageBlankBlocksPageHeader {
                heading
                description
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageBlankBlocksText {
                heading
                body
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageBlankBlocksImageSpotlight {
                eyebrow
                heading
                image
                alt
                caption
                aspect
                body
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageBlankBlocksImageSideBySide {
                heading
                leftImage {
                  __typename
                  src
                  alt
                  caption
                }
                rightImage {
                  __typename
                  src
                  alt
                  caption
                }
                style
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageBlankBlocksImageMasonry {
                heading
                images {
                  __typename
                  src
                  alt
                  caption
                  size
                }
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageBlankBlocksVideoEmbed {
                heading
                youtubeUrl
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageBlankBlocksFeaturedRelease {
                eyebrow
                title
                description
                coverImage
                backCoverImage
                ctaLabel
                ctaHref
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageBlankBlocksProductStrip {
                eyebrow
                heading
                viewAllLabel
                viewAllLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageBlankBlocksShopCatalog {
                heading
                highlightText
                description
                showFeaturedBanner
                emptyHeading
                emptyDescription
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageBlankBlocksGalleryGrid {
                emptyHeading
                emptyDescription
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageBlankBlocksDownloadsGrid {
                emptyHeading
                emptyDescription
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageBlankBlocksFeaturedVideo {
                eyebrow
                heading
                description
                youtubeUrl
                buttonLabel
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageBlankBlocksGalleryPreview {
                eyebrow
                heading
                description
                maxItems
                viewAllLabel
                viewAllLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageBlankBlocksDownloadsPreview {
                eyebrow
                heading
                description
                maxItems
                viewAllLabel
                viewAllLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageBlankBlocksCtaBand {
                heading
                description
                ctaLabel
                ctaLink
                variant
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageBlankBlocksBigCta {
                eyebrow
                heading
                highlightText
                primaryLabel
                primaryLink
                secondaryLabel
                secondaryLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageBlankBlocksNewsletterSignup {
                eyebrow
                heading
                subheading
                placeholderText
                ctaLabel
                privacyNote
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageBlankBlocksContactInfo {
                email
                location
              }
              ... on LandingPageBlankBlocksContactForm {
                submitLabel
              }
              ... on LandingPageBlankBlocksDummyBookRequest {
                heading
                description
                pdfUrl
                submitLabel
                successHeading
                successNote
                downloadLabel
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageBlankBlocksKofiSupport {
                heading
                body
                ctaLabel
                href
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageBlankBlocksMarquee {
                highlightText
                text
              }
              ... on LandingPageBlankBlocksSocialLinks {
                heading
                body
                links {
                  __typename
                  platform
                  url
                  label
                }
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
            }
            seoAssistant
            seo {
              __typename
              metaTitle
              metaDescription
            }
          }
          ... on LandingPageEvent {
            title
            layout
            blocks {
              __typename
              ... on LandingPageEventBlocksHomeHero {
                backgroundImage
                eyebrow
                heading
                subheading
                ctaPrimary
                ctaPrimaryLink
                ctaSecondary
                ctaSecondaryLink
                metaLine
                marqueeItems
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageEventBlocksHero {
                heading
                subheading
                backgroundImage
                ctaLabel
                ctaLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageEventBlocksHeroSplitImage {
                eyebrow
                heading
                subheading
                featuredImage
                imageAlt
                imageCaption
                imagePosition
                ctaPrimary
                ctaPrimaryLink
                ctaSecondary
                ctaSecondaryLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageEventBlocksHeroFullBleed {
                backgroundImage
                heading
                subheading
                overlay
                textAlign
                minHeight
                ctaLabel
                ctaLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageEventBlocksHeroFloatingImages {
                eyebrow
                heading
                subheading
                images {
                  __typename
                  src
                  alt
                  caption
                }
                ctaPrimary
                ctaPrimaryLink
                ctaSecondary
                ctaSecondaryLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageEventBlocksHeroImageGrid {
                eyebrow
                heading
                subheading
                layout
                images {
                  __typename
                  src
                  alt
                  caption
                }
                ctaLabel
                ctaLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageEventBlocksPageHeader {
                heading
                description
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageEventBlocksText {
                heading
                body
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageEventBlocksImageSpotlight {
                eyebrow
                heading
                image
                alt
                caption
                aspect
                body
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageEventBlocksImageSideBySide {
                heading
                leftImage {
                  __typename
                  src
                  alt
                  caption
                }
                rightImage {
                  __typename
                  src
                  alt
                  caption
                }
                style
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageEventBlocksImageMasonry {
                heading
                images {
                  __typename
                  src
                  alt
                  caption
                  size
                }
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageEventBlocksVideoEmbed {
                heading
                youtubeUrl
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageEventBlocksFeaturedRelease {
                eyebrow
                title
                description
                coverImage
                backCoverImage
                ctaLabel
                ctaHref
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageEventBlocksProductStrip {
                eyebrow
                heading
                viewAllLabel
                viewAllLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageEventBlocksShopCatalog {
                heading
                highlightText
                description
                showFeaturedBanner
                emptyHeading
                emptyDescription
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageEventBlocksGalleryGrid {
                emptyHeading
                emptyDescription
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageEventBlocksDownloadsGrid {
                emptyHeading
                emptyDescription
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageEventBlocksFeaturedVideo {
                eyebrow
                heading
                description
                youtubeUrl
                buttonLabel
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageEventBlocksGalleryPreview {
                eyebrow
                heading
                description
                maxItems
                viewAllLabel
                viewAllLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageEventBlocksDownloadsPreview {
                eyebrow
                heading
                description
                maxItems
                viewAllLabel
                viewAllLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageEventBlocksCtaBand {
                heading
                description
                ctaLabel
                ctaLink
                variant
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageEventBlocksBigCta {
                eyebrow
                heading
                highlightText
                primaryLabel
                primaryLink
                secondaryLabel
                secondaryLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageEventBlocksNewsletterSignup {
                eyebrow
                heading
                subheading
                placeholderText
                ctaLabel
                privacyNote
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageEventBlocksContactInfo {
                email
                location
              }
              ... on LandingPageEventBlocksContactForm {
                submitLabel
              }
              ... on LandingPageEventBlocksDummyBookRequest {
                heading
                description
                pdfUrl
                submitLabel
                successHeading
                successNote
                downloadLabel
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageEventBlocksKofiSupport {
                heading
                body
                ctaLabel
                href
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageEventBlocksMarquee {
                highlightText
                text
              }
              ... on LandingPageEventBlocksSocialLinks {
                heading
                body
                links {
                  __typename
                  platform
                  url
                  label
                }
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
            }
            seoAssistant
            seo {
              __typename
              metaTitle
              metaDescription
            }
          }
          ... on LandingPagePromo {
            title
            layout
            blocks {
              __typename
              ... on LandingPagePromoBlocksHomeHero {
                backgroundImage
                eyebrow
                heading
                subheading
                ctaPrimary
                ctaPrimaryLink
                ctaSecondary
                ctaSecondaryLink
                metaLine
                marqueeItems
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPagePromoBlocksHero {
                heading
                subheading
                backgroundImage
                ctaLabel
                ctaLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPagePromoBlocksHeroSplitImage {
                eyebrow
                heading
                subheading
                featuredImage
                imageAlt
                imageCaption
                imagePosition
                ctaPrimary
                ctaPrimaryLink
                ctaSecondary
                ctaSecondaryLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPagePromoBlocksHeroFullBleed {
                backgroundImage
                heading
                subheading
                overlay
                textAlign
                minHeight
                ctaLabel
                ctaLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPagePromoBlocksHeroFloatingImages {
                eyebrow
                heading
                subheading
                images {
                  __typename
                  src
                  alt
                  caption
                }
                ctaPrimary
                ctaPrimaryLink
                ctaSecondary
                ctaSecondaryLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPagePromoBlocksHeroImageGrid {
                eyebrow
                heading
                subheading
                layout
                images {
                  __typename
                  src
                  alt
                  caption
                }
                ctaLabel
                ctaLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPagePromoBlocksPageHeader {
                heading
                description
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPagePromoBlocksText {
                heading
                body
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPagePromoBlocksImageSpotlight {
                eyebrow
                heading
                image
                alt
                caption
                aspect
                body
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPagePromoBlocksImageSideBySide {
                heading
                leftImage {
                  __typename
                  src
                  alt
                  caption
                }
                rightImage {
                  __typename
                  src
                  alt
                  caption
                }
                style
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPagePromoBlocksImageMasonry {
                heading
                images {
                  __typename
                  src
                  alt
                  caption
                  size
                }
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPagePromoBlocksVideoEmbed {
                heading
                youtubeUrl
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPagePromoBlocksFeaturedRelease {
                eyebrow
                title
                description
                coverImage
                backCoverImage
                ctaLabel
                ctaHref
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPagePromoBlocksProductStrip {
                eyebrow
                heading
                viewAllLabel
                viewAllLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPagePromoBlocksShopCatalog {
                heading
                highlightText
                description
                showFeaturedBanner
                emptyHeading
                emptyDescription
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPagePromoBlocksGalleryGrid {
                emptyHeading
                emptyDescription
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPagePromoBlocksDownloadsGrid {
                emptyHeading
                emptyDescription
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPagePromoBlocksFeaturedVideo {
                eyebrow
                heading
                description
                youtubeUrl
                buttonLabel
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPagePromoBlocksGalleryPreview {
                eyebrow
                heading
                description
                maxItems
                viewAllLabel
                viewAllLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPagePromoBlocksDownloadsPreview {
                eyebrow
                heading
                description
                maxItems
                viewAllLabel
                viewAllLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPagePromoBlocksCtaBand {
                heading
                description
                ctaLabel
                ctaLink
                variant
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPagePromoBlocksBigCta {
                eyebrow
                heading
                highlightText
                primaryLabel
                primaryLink
                secondaryLabel
                secondaryLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPagePromoBlocksNewsletterSignup {
                eyebrow
                heading
                subheading
                placeholderText
                ctaLabel
                privacyNote
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPagePromoBlocksContactInfo {
                email
                location
              }
              ... on LandingPagePromoBlocksContactForm {
                submitLabel
              }
              ... on LandingPagePromoBlocksDummyBookRequest {
                heading
                description
                pdfUrl
                submitLabel
                successHeading
                successNote
                downloadLabel
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPagePromoBlocksKofiSupport {
                heading
                body
                ctaLabel
                href
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPagePromoBlocksMarquee {
                highlightText
                text
              }
              ... on LandingPagePromoBlocksSocialLinks {
                heading
                body
                links {
                  __typename
                  platform
                  url
                  label
                }
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
            }
            seoAssistant
            seo {
              __typename
              metaTitle
              metaDescription
            }
          }
          ... on LandingPageInfo {
            title
            layout
            blocks {
              __typename
              ... on LandingPageInfoBlocksHomeHero {
                backgroundImage
                eyebrow
                heading
                subheading
                ctaPrimary
                ctaPrimaryLink
                ctaSecondary
                ctaSecondaryLink
                metaLine
                marqueeItems
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageInfoBlocksHero {
                heading
                subheading
                backgroundImage
                ctaLabel
                ctaLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageInfoBlocksHeroSplitImage {
                eyebrow
                heading
                subheading
                featuredImage
                imageAlt
                imageCaption
                imagePosition
                ctaPrimary
                ctaPrimaryLink
                ctaSecondary
                ctaSecondaryLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageInfoBlocksHeroFullBleed {
                backgroundImage
                heading
                subheading
                overlay
                textAlign
                minHeight
                ctaLabel
                ctaLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageInfoBlocksHeroFloatingImages {
                eyebrow
                heading
                subheading
                images {
                  __typename
                  src
                  alt
                  caption
                }
                ctaPrimary
                ctaPrimaryLink
                ctaSecondary
                ctaSecondaryLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageInfoBlocksHeroImageGrid {
                eyebrow
                heading
                subheading
                layout
                images {
                  __typename
                  src
                  alt
                  caption
                }
                ctaLabel
                ctaLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageInfoBlocksPageHeader {
                heading
                description
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageInfoBlocksText {
                heading
                body
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageInfoBlocksImageSpotlight {
                eyebrow
                heading
                image
                alt
                caption
                aspect
                body
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageInfoBlocksImageSideBySide {
                heading
                leftImage {
                  __typename
                  src
                  alt
                  caption
                }
                rightImage {
                  __typename
                  src
                  alt
                  caption
                }
                style
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageInfoBlocksImageMasonry {
                heading
                images {
                  __typename
                  src
                  alt
                  caption
                  size
                }
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageInfoBlocksVideoEmbed {
                heading
                youtubeUrl
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageInfoBlocksFeaturedRelease {
                eyebrow
                title
                description
                coverImage
                backCoverImage
                ctaLabel
                ctaHref
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageInfoBlocksProductStrip {
                eyebrow
                heading
                viewAllLabel
                viewAllLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageInfoBlocksShopCatalog {
                heading
                highlightText
                description
                showFeaturedBanner
                emptyHeading
                emptyDescription
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageInfoBlocksGalleryGrid {
                emptyHeading
                emptyDescription
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageInfoBlocksDownloadsGrid {
                emptyHeading
                emptyDescription
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageInfoBlocksFeaturedVideo {
                eyebrow
                heading
                description
                youtubeUrl
                buttonLabel
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageInfoBlocksGalleryPreview {
                eyebrow
                heading
                description
                maxItems
                viewAllLabel
                viewAllLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageInfoBlocksDownloadsPreview {
                eyebrow
                heading
                description
                maxItems
                viewAllLabel
                viewAllLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageInfoBlocksCtaBand {
                heading
                description
                ctaLabel
                ctaLink
                variant
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageInfoBlocksBigCta {
                eyebrow
                heading
                highlightText
                primaryLabel
                primaryLink
                secondaryLabel
                secondaryLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageInfoBlocksNewsletterSignup {
                eyebrow
                heading
                subheading
                placeholderText
                ctaLabel
                privacyNote
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageInfoBlocksContactInfo {
                email
                location
              }
              ... on LandingPageInfoBlocksContactForm {
                submitLabel
              }
              ... on LandingPageInfoBlocksDummyBookRequest {
                heading
                description
                pdfUrl
                submitLabel
                successHeading
                successNote
                downloadLabel
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageInfoBlocksKofiSupport {
                heading
                body
                ctaLabel
                href
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageInfoBlocksMarquee {
                highlightText
                text
              }
              ... on LandingPageInfoBlocksSocialLinks {
                heading
                body
                links {
                  __typename
                  platform
                  url
                  label
                }
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
            }
            seoAssistant
            seo {
              __typename
              metaTitle
              metaDescription
            }
          }
          ... on LandingPageLinkInBio {
            title
            layout
            blocks {
              __typename
              ... on LandingPageLinkInBioBlocksHomeHero {
                backgroundImage
                eyebrow
                heading
                subheading
                ctaPrimary
                ctaPrimaryLink
                ctaSecondary
                ctaSecondaryLink
                metaLine
                marqueeItems
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageLinkInBioBlocksHero {
                heading
                subheading
                backgroundImage
                ctaLabel
                ctaLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageLinkInBioBlocksHeroSplitImage {
                eyebrow
                heading
                subheading
                featuredImage
                imageAlt
                imageCaption
                imagePosition
                ctaPrimary
                ctaPrimaryLink
                ctaSecondary
                ctaSecondaryLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageLinkInBioBlocksHeroFullBleed {
                backgroundImage
                heading
                subheading
                overlay
                textAlign
                minHeight
                ctaLabel
                ctaLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageLinkInBioBlocksHeroFloatingImages {
                eyebrow
                heading
                subheading
                images {
                  __typename
                  src
                  alt
                  caption
                }
                ctaPrimary
                ctaPrimaryLink
                ctaSecondary
                ctaSecondaryLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageLinkInBioBlocksHeroImageGrid {
                eyebrow
                heading
                subheading
                layout
                images {
                  __typename
                  src
                  alt
                  caption
                }
                ctaLabel
                ctaLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageLinkInBioBlocksPageHeader {
                heading
                description
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageLinkInBioBlocksText {
                heading
                body
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageLinkInBioBlocksImageSpotlight {
                eyebrow
                heading
                image
                alt
                caption
                aspect
                body
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageLinkInBioBlocksImageSideBySide {
                heading
                leftImage {
                  __typename
                  src
                  alt
                  caption
                }
                rightImage {
                  __typename
                  src
                  alt
                  caption
                }
                style
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageLinkInBioBlocksImageMasonry {
                heading
                images {
                  __typename
                  src
                  alt
                  caption
                  size
                }
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageLinkInBioBlocksVideoEmbed {
                heading
                youtubeUrl
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageLinkInBioBlocksFeaturedRelease {
                eyebrow
                title
                description
                coverImage
                backCoverImage
                ctaLabel
                ctaHref
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageLinkInBioBlocksProductStrip {
                eyebrow
                heading
                viewAllLabel
                viewAllLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageLinkInBioBlocksShopCatalog {
                heading
                highlightText
                description
                showFeaturedBanner
                emptyHeading
                emptyDescription
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageLinkInBioBlocksGalleryGrid {
                emptyHeading
                emptyDescription
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageLinkInBioBlocksDownloadsGrid {
                emptyHeading
                emptyDescription
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageLinkInBioBlocksFeaturedVideo {
                eyebrow
                heading
                description
                youtubeUrl
                buttonLabel
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageLinkInBioBlocksGalleryPreview {
                eyebrow
                heading
                description
                maxItems
                viewAllLabel
                viewAllLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageLinkInBioBlocksDownloadsPreview {
                eyebrow
                heading
                description
                maxItems
                viewAllLabel
                viewAllLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageLinkInBioBlocksCtaBand {
                heading
                description
                ctaLabel
                ctaLink
                variant
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageLinkInBioBlocksBigCta {
                eyebrow
                heading
                highlightText
                primaryLabel
                primaryLink
                secondaryLabel
                secondaryLink
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageLinkInBioBlocksNewsletterSignup {
                eyebrow
                heading
                subheading
                placeholderText
                ctaLabel
                privacyNote
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageLinkInBioBlocksContactInfo {
                email
                location
              }
              ... on LandingPageLinkInBioBlocksContactForm {
                submitLabel
              }
              ... on LandingPageLinkInBioBlocksDummyBookRequest {
                heading
                description
                pdfUrl
                submitLabel
                successHeading
                successNote
                downloadLabel
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageLinkInBioBlocksKofiSupport {
                heading
                body
                ctaLabel
                href
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
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
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
              ... on LandingPageLinkInBioBlocksMarquee {
                highlightText
                text
              }
              ... on LandingPageLinkInBioBlocksSocialLinks {
                heading
                body
                links {
                  __typename
                  platform
                  url
                  label
                }
                textStyle {
                  __typename
                  headingSize
                  headingType
                  headingFont
                  align
                  bodySize
                }
              }
            }
            seoAssistant
            seo {
              __typename
              metaTitle
              metaDescription
            }
          }
        }
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
      }
      href
    }
  }
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
export const DownloadDocument = gql`
    query download($relativePath: String!) {
  download(relativePath: $relativePath) {
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
    ...DownloadParts
  }
}
    ${DownloadPartsFragmentDoc}`;
export const DownloadConnectionDocument = gql`
    query downloadConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: DownloadFilter) {
  downloadConnection(
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
        ...DownloadParts
      }
    }
  }
}
    ${DownloadPartsFragmentDoc}`;
export const TutorialDocument = gql`
    query tutorial($relativePath: String!) {
  tutorial(relativePath: $relativePath) {
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
    ...TutorialParts
  }
}
    ${TutorialPartsFragmentDoc}`;
export const TutorialConnectionDocument = gql`
    query tutorialConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: TutorialFilter) {
  tutorialConnection(
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
        ...TutorialParts
      }
    }
  }
}
    ${TutorialPartsFragmentDoc}`;
export const NavigationDocument = gql`
    query navigation($relativePath: String!) {
  navigation(relativePath: $relativePath) {
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
    ...NavigationParts
  }
}
    ${NavigationPartsFragmentDoc}`;
export const NavigationConnectionDocument = gql`
    query navigationConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: NavigationFilter) {
  navigationConnection(
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
        ...NavigationParts
      }
    }
  }
}
    ${NavigationPartsFragmentDoc}`;
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
    post(variables, options) {
      return requester(PostDocument, variables, options);
    },
    postConnection(variables, options) {
      return requester(PostConnectionDocument, variables, options);
    },
    shopProduct(variables, options) {
      return requester(ShopProductDocument, variables, options);
    },
    shopProductConnection(variables, options) {
      return requester(ShopProductConnectionDocument, variables, options);
    },
    gallery(variables, options) {
      return requester(GalleryDocument, variables, options);
    },
    galleryConnection(variables, options) {
      return requester(GalleryConnectionDocument, variables, options);
    },
    download(variables, options) {
      return requester(DownloadDocument, variables, options);
    },
    downloadConnection(variables, options) {
      return requester(DownloadConnectionDocument, variables, options);
    },
    tutorial(variables, options) {
      return requester(TutorialDocument, variables, options);
    },
    tutorialConnection(variables, options) {
      return requester(TutorialConnectionDocument, variables, options);
    },
    navigation(variables, options) {
      return requester(NavigationDocument, variables, options);
    },
    navigationConnection(variables, options) {
      return requester(NavigationConnectionDocument, variables, options);
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
