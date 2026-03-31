import { graphql } from '../generated'

export const ProductMetafieldsFragment = graphql(`
  fragment ProductMetafieldsFragment on Product {
    materials: metafield(namespace: "custom", key: "material") {
      value
    }
    dimensions: metafield(namespace: "custom", key: "dimensions") {
      value
    }
    materialFeature: metafield(namespace: "custom", key: "material_feature") {
      value
    }
    precautions: metafield(namespace: "custom", key: "precautions") {
      value
    }
    saleStartDate: metafield(namespace: "custom", key: "sale_start_date") {
      value
    }
    madeToOrderNotice: metafield(namespace: "custom", key: "made_to_order_notice") {
      value
    }
  }
`)
