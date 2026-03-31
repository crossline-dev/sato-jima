import { graphql } from '../generated'

/**
 * 単一バリエーションの共通断片
 */
export const ProductVariantFragment = graphql(`
  fragment ProductVariantFragment on ProductVariant {
    id
    title
    availableForSale
    quantityAvailable
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
`)

/**
 * 商品一覧や商品カードで使用する共通断片
 */
export const ProductFragment = graphql(`
  fragment ProductFragment on Product {
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
          ...ProductVariantFragment
        }
      }
    }
    featuredImage {
      ...ImageFragment
    }
    images(first: 20) {
      edges {
        node {
          ...ImageFragment
        }
      }
    }
    tags
    updatedAt
  }
`)

/**
 * 商品詳細ページで使用する完全な共通断片
 */
export const ProductFullFragment = graphql(`
  fragment ProductFullFragment on Product {
    ...ProductFragment
    seo {
      description
      title
    }
    ...ProductMetafieldsFragment
  }
`)
