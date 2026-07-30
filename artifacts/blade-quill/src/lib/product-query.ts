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
      gumroadUrl
      downloadUrl
      amazonUrl
      googlePlayUrl
      featured
      inStock
      createdAt
    }
  }
`;
