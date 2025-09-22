// uno.config.ts
import { defineConfig, presetAttributify, presetUno, transformerDirectives } from 'unocss'
import presetRemToPx from '@unocss/preset-rem-to-px'
import transformerAttributifyJsx from '@unocss/transformer-attributify-jsx'

export default defineConfig({
  content: {
    filesystem: [
      '**/*.{html,js,ts,jsx,tsx,vue,svelte,astro}',
    ],
  },
  presets: [
    presetUno(),
    presetAttributify({
      prefix: 'un-',
      prefixedOnly: true,
    }),
    presetRemToPx({
      baseFontSize: 10,
    }),
  ],
  transformers: [
    transformerDirectives(),
    transformerAttributifyJsx(),
  ],
  shortcuts: [
    {
      'common-page': 'bg-white h-[100%] rounded-[8px] p-[20px] box-border',
      'flex-v': 'flex flex-col w-[100%] h-[100%] items-center',
    },
  ],
})
