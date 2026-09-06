/**
 * GraphQL query for a single Shop Product — Document _sys + id are required
 * for Tina visual editing (tinaField / click-to-edit) to bind.
 */
export const shopProductQuery = `
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
      __typename
      productId
      name
      description
      price
      category
      image
      galleryImages {
        src
        alt
      }
      spreadImages {
        src
        alt
      }
      pageCopy {
        eyebrow
        coverSubtitle
        fullDescription
        shippingNote
        supportEmail
        paperbackLabel
        ebookLabel
        ebookStoresLabel
        addToCartLabel
        buyNowLabel
        gumroadButtonLabel
        amazonButtonLabel
        googlePlayButtonLabel
      }
      trustBullets {
        label
      }
      details {
        format
        studio
        rows {
          label
          value
        }
      }
      reviews {
        rating
        countLabel
        items {
          name
          date
          body
          stars
        }
      }
      tabs {
        descriptionLabel
        insideLabel
        reviewsLabel
        shippingLabel
        showInside
        showReviews
        showShipping
      }
      related {
        eyebrow
        heading
        show
      }
      gumroadUrl
      downloadUrl
      amazonUrl
      googlePlayUrl
      featured
      inStock
      createdAt
      seo { metaTitle metaDescription }
    }
  }
`;
