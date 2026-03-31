import { graphql } from '../generated'

/**
 * カートを新規作成する
 * lines を同時に指定することで、作成と追加を1回のリクエストで行える
 */
export const CartCreateMutation = graphql(`
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        ...CartFragment
      }
      userErrors {
        field
        message
      }
    }
  }
`)

/**
 * カートにアイテムを追加する
 */
export const CartLinesAddMutation = graphql(`
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFragment
      }
      userErrors {
        field
        message
      }
    }
  }
`)

/**
 * カートのアイテム数量を更新する
 * 注意: lineId (merchandiseId ではない) を指定する必要がある
 */
export const CartLinesUpdateMutation = graphql(`
  mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFragment
      }
      userErrors {
        field
        message
      }
    }
  }
`)

/**
 * カートからアイテムを削除する
 * 注意: lineId (merchandiseId ではない) を指定する必要がある
 */
export const CartLinesRemoveMutation = graphql(`
  mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...CartFragment
      }
      userErrors {
        field
        message
      }
    }
  }
`)
