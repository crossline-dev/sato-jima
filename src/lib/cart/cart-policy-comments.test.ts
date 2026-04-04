import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../..')

describe('policy-comment-violation', () => {
  it('cart surface modules do not use @agent-guard blocks', () => {
    const paths = [
      'src/lib/cart/cart-context.tsx',
      'src/lib/cart/cart-reducer.ts',
      'src/lib/cart/cart-error.ts',
      'src/actions/cart-actions.ts',
    ]
    for (const rel of paths) {
      const content = readFileSync(resolve(projectRoot, rel), 'utf8')
      expect(content, rel).not.toContain('@agent-guard')
    }
  })
})
