import { graphql } from '../generated'

export const CollectionFragment = graphql(`
  fragment CollectionFragment on Collection {
    id
    handle
    title
    description
    image {
      ...ImageFragment
    }
    seo {
      title
      description
    }
    updatedAt
  }
`)
