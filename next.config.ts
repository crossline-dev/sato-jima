import type { NextConfig } from 'next'

const isDev = process.env.NODE_ENV === 'development'

/**
 * Content-Security-Policy（段階的強化）
 *
 * - script-src 'unsafe-inline': Next.js がハイドレーション等でインラインスクリプトを挿入する。
 *   nonce/hash ベースへ移行すれば削除可能。
 * - script-src 'unsafe-eval': 開発時のみ。webpack の eval 系 source map / HMR で eval が使われるため。
 *   本番の next start ではバンドル実行に eval は不要なため付与しない。
 * - style-src 'unsafe-inline': React の style 属性・一部 UI でインラインスタイルが使われる。
 * - reCAPTCHA ドメイン: 現状コード未使用だが、問い合わせ等への導入や Shopify 周辺で要ることがあるため互換のため維持。
 * - X-XSS-Protection は削除（モダンブラウザでは非推奨・CSP が代替。効果も限定的）。
 */
function buildContentSecurityPolicy(): string {
  const scriptSrc = [
    "'self'",
    "'unsafe-inline'",
    ...(isDev ? (["'unsafe-eval'"] as const) : []),
    'https://cdn.shopify.com',
    'https://va.vercel-scripts.com',
    'https://www.google.com/recaptcha/',
    'https://www.gstatic.com/recaptcha/',
  ]

  return [
    "default-src 'self'",
    `script-src ${scriptSrc.join(' ')}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' https://cdn.shopify.com https://images.microcms-assets.io data: blob:",
    "font-src 'self' data:",
    "connect-src 'self' https://*.myshopify.com https://*.microcms.io https://va.vercel-scripts.com https://monorail-edge.shopifysvc.com https://www.google.com/recaptcha/",
    'frame-src https://www.google.com/recaptcha/ https://recaptcha.google.com/recaptcha/',
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "object-src 'none'",
  ].join('; ')
}

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
      },
      {
        protocol: 'https',
        hostname: 'images.microcms-assets.io',
      },
    ],
  },
  experimental: {
    // パッケージのバレルファイルからの個別インポートを最適化
    // 未使用のエクスポートを除外してバンドルサイズを削減
    optimizePackageImports: [
      '@phosphor-icons/react',
      '@radix-ui/react-accordion',
      '@radix-ui/react-dialog',
      '@radix-ui/react-navigation-menu',
      '@radix-ui/react-scroll-area',
      '@radix-ui/react-slot',
      'lucide-react',
      '@shopify/hydrogen-react',
      'embla-carousel-react',
    ],
  },
  async headers() {
    const contentSecurityPolicy = buildContentSecurityPolicy()

    return [
      {
        source: '/(.*?)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: contentSecurityPolicy,
          },
        ],
      },
    ]
  },
}

export default nextConfig
