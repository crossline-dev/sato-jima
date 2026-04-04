import { updateTag } from 'next/cache'
import { TAGS } from '@/lib/shopify/constants'

export function revalidateCartTag() {
  updateTag(TAGS.cart)
}
