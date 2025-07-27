import path from 'node:path'
import fs from 'node:fs'
import Vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import ElementPlus from 'unplugin-element-plus'
import UnoCSS from 'unocss/vite'
import VueJsx from '@vitejs/plugin-vue-jsx'
import VueMacros from 'unplugin-vue-macros/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { type Plugin, defineConfig } from 'vite'

// 在构建前清理 dist 目录 如果不清除dist在打包时会unocss扫描入口文件会报错
function cleanDist(): Plugin {
  return {
    name: 'clean-dist',
    apply: 'build',
    buildStart() {
      const distPath = path.resolve(__dirname, 'dist')
      if (fs.existsSync(distPath)) {
        fs.rmSync(distPath, { recursive: true, force: true })
      }
    },
  }
}

export default defineConfig(({ command }) => {
  return {
    base: command === 'build' ? '/crm-manage' : '/',
    resolve: {
      alias: {
        '@/': `${path.resolve(__dirname, 'src')}/`,
        '~icon/': `${path.resolve(__dirname, 'src')}/assets/image/icon/`,
        '~img/': `${path.resolve(__dirname, 'src')}/assets/image/img/`,
        '~types/': `${path.resolve(__dirname, 'src')}/types/`,
        '~store/': `${path.resolve(__dirname, 'src')}/store/`,
        '~api/': `${path.resolve(__dirname, 'src')}/api/`,
      },
    },
    server: {
      host: '0.0.0.0',
      strictPort: true,
      port: 8800,
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/theme.scss" as *;',
        },
      },
    },
    plugins: [
      ElementPlus.vite({
        useSource: true,
        format: 'esm',
        ignoreComponents: ['ElAutoResizer', 'el-auto-resizer'],
      }),
      Components({
        resolvers: [ElementPlusResolver({
          importStyle: 'sass',
        })], // ts编译无法识别到自动引入的组件类型，需要手动引入
        // include: [/\.vue$/, /\.vue\?vue/, /\.md$/, /\.tsx$/],
      }),
      AutoImport({
        imports: [
          'vue',
          'vue-router',
        ],
        resolvers: [
          ElementPlusResolver(),
        ],
      }),
      VueMacros({
        defineOptions: true,
        defineSlots: true,
        defineRender: true,
        definePropsRefs: true,
        defineProps: true,
        defineModels: true,
        hoistStatic: true,
        shortEmits: true,
        shortBind: true,
        shortVmodel: false,
        namedTemplate: false,
        setupSFC: true,
        setupBlock: true,
        booleanProp: false,
        betterDefine: true,
        reactivityTransform: true,
        plugins: {
          vue: Vue({
            include: [/\.vue$/],
            script: {
              hoistStatic: true,
            },
          }),
          vueJsx: VueJsx({
            include: [/\.(js|ts)x$/],
          }),
        },
      }),
      UnoCSS({
        envMode: 'dev',
      }),
      cleanDist(),
    ],
    build: {
      sourcemap: false,
    },
    define: {
      // __VUE_OPTIONS_API__: JSON.stringify(false),
    },
  }
})
