export interface ShopifyError {
  status: number
  message: string
  cause?: string
}

export function isShopifyError(object: unknown): object is ShopifyError {
  return (
    typeof object === 'object' &&
    object !== null &&
    'status' in object &&
    'message' in object
  )
}
