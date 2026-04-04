import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  CART_ERROR_MESSAGES,
  failCartActionFromUnknown,
  isCartNotFoundError,
} from './cart-error'

describe('isCartNotFoundError', () => {
  it('matches invalid cart phrases but not arbitrary "invalid"', () => {
    expect(isCartNotFoundError('The cart is invalid')).toBe(true)
    expect(isCartNotFoundError('INVALID CART')).toBe(true)
    expect(isCartNotFoundError('Cart id is invalid')).toBe(true)
    expect(isCartNotFoundError('invalid request body')).toBe(false)
    expect(isCartNotFoundError('invalid email format')).toBe(false)
  })
})

describe('failCartActionFromUnknown', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns fallback only and logs the original error', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const err = new Error('internal graphql detail')
    const result = failCartActionFromUnknown(
      err,
      CART_ERROR_MESSAGES.createFailed,
    )
    expect(result).toEqual({
      success: false,
      error: CART_ERROR_MESSAGES.createFailed,
    })
    expect(spy).toHaveBeenCalledWith('[cart-action] unexpected error', err)
  })

  it('does not surface non-Error values in the client payload', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const result = failCartActionFromUnknown(
      'weird',
      CART_ERROR_MESSAGES.addFailed,
    )
    expect(result.error).toBe(CART_ERROR_MESSAGES.addFailed)
    expect(spy).toHaveBeenCalled()
  })
})
