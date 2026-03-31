import type { CurrencyCode } from './generated/graphql'

/**
 * フラット化されたカートラインアイテムの型
 */
export interface CartItem {
  id: string
  quantity: number
  cost: {
    totalAmount: {
      amount: string
      currencyCode: CurrencyCode
    }
  }
  merchandise: {
    id: string
    title: string
    selectedOptions: Array<{ name: string; value: string }>
    price: {
      amount: string
      currencyCode: CurrencyCode
    }
    product: {
      id: string
      handle: string
      title: string
      featuredImage?: {
        url: string
        altText?: string | null
        width?: number | null
        height?: number | null
      } | null
    }
  }
}

/**
 * アプリケーション用にリシェイプされたカート型
 */
export interface Cart {
  id: string
  checkoutUrl: string
  totalQuantity: number
  cost: {
    subtotalAmount: { amount: string; currencyCode: CurrencyCode }
    totalAmount: { amount: string; currencyCode: CurrencyCode }
    totalTaxAmount?: { amount: string; currencyCode: CurrencyCode } | null
  }
  lines: CartItem[]
}
