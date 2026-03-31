import { graphql } from '../generated'

export const ImageFragment = graphql(`
  fragment ImageFragment on Image {
    url
    altText
    width
    height
  }
`)
