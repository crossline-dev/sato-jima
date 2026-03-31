import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  ignore: [],
  project: ['**/*.{ts,tsx}'],
  ignoreDependencies: [
    'tailwindcss',
    'eslint-config-next',
    'tw-animate-css',
    'embla-carousel-react',
    'postcss',
  ],
  ignoreBinaries: [],
}

export default config
