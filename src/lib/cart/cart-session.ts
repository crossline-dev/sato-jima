import { cookies } from 'next/headers'

const CART_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 30, // 30 days
}

export async function getCartIdFromCookies(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get('cartId')?.value
}

export async function setCartIdCookie(cartId: string) {
  const cookieStore = await cookies()
  cookieStore.set('cartId', cartId, CART_COOKIE_OPTIONS)
}

export async function deleteCartIdCookie() {
  const cookieStore = await cookies()
  cookieStore.delete('cartId')
}
