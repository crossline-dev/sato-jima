import { graphql } from '../generated'

/**
 * 単一コレクション情報を取得
 */
export const CollectionQuery = graphql(`
  query getCollection($handle: String!) {
    collection(handle: $handle) {
      ...CollectionFragment
    }
  }
`)

/**
 * コレクション内の商品一覧を取得
 */
export const CollectionProductsQuery = graphql(`
  query getCollectionProducts(
    $handle: String!
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
  ) {
    collection(handle: $handle) {
      products(first: 100, sortKey: $sortKey, reverse: $reverse) {
        edges {
          node {
            id
            handle
            availableForSale
            title
            description
            descriptionHtml
            options {
              id
              name
              values
            }
            priceRange {
              maxVariantPrice {
                amount
                currencyCode
              }
              minVariantPrice {
                amount
                currencyCode
              }
            }
            variants(first: 250) {
              edges {
                node {
                  id
                  title
                  availableForSale
                  selectedOptions {
                    name
                    value
                  }
                  price {
                    amount
                    currencyCode
                  }
                  compareAtPrice {
                    amount
                    currencyCode
                  }
                  image {
                    ...ImageFragment
                  }
                }
              }
            }
            featuredImage {
              ...ImageFragment
            }
            images(first: 10) {
              edges {
                node {
                  ...ImageFragment
                }
              }
            }
            seo {
              description
              title
            }
            tags
            updatedAt
          }
        }
      }
    }
  }
`)

/**
 * 全コレクション一覧を取得
 */
export const CollectionsQuery = graphql(`
  query getCollections {
    collections(first: 100, sortKey: TITLE) {
      edges {
        node {
          ...CollectionFragment
        }
      }
    }
  }
`)
