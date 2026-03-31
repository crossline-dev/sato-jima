import { graphql } from '../generated'

export const ProductQuery = graphql(
  `
  query getProduct($handle: String!) {
    product(handle: $handle) {
      ...ProductFullFragment
    }
  }
`,
)

export const ProductRecommendationsQuery = graphql(`
  query getProductRecommendations($productId: ID!) {
    productRecommendations(productId: $productId) {
      ...ProductFragment
    }
  }
`)
