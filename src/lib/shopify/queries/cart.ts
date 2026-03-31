import { graphql } from '../generated'

export const CartQuery = graphql(`
  query getCart($cartId: ID!) {
    cart(id: $cartId) {
      ...CartFragment
    }
  }
`)
