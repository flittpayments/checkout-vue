import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import checker from 'vite-plugin-checker'
import svgLoader from 'vite-svg-loader'
import { visualizer } from 'rollup-plugin-visualizer'
import { resolve } from 'path'
import { execSync } from 'node:child_process'

const {
  BRANCH,
  ENVIRONMENT,
  SENTRY_DSN,
  SAAS_CDN_URL,
  SAAS_TEMPLATE_NAME,
  API_DOMAIN,
  X_PAYMENT_GATEWAY,
  PUBLIC_PATH = '/',
  LIBRARY_TYPE,
} = process.env
const PUBLIC_URL = new URL(PUBLIC_PATH, 'https://checkout')
const COMMITHASH = execSync('git rev-parse HEAD').toString().trim()
const VERSION = (
  BRANCH || execSync('git branch --show-current').toString().trim()
).replace('origin/', '')
const DOMAIN = PUBLIC_URL.hostname
const INITIATOR =
  LIBRARY_TYPE || PUBLIC_URL.pathname.split('/').filter(Boolean)[0]
const isProduction = process.env.NODE_ENV === 'production'
const isDevelopment = process.env.NODE_ENV === 'development'
const localhostServe = 'http://localhost:3000/'

function stringify(obj) {
  return Object.fromEntries(
    Object.entries(obj).map(([name, value]) => [name, JSON.stringify(value)])
  )
}

export default defineConfig(() => {
  let plugins = [
    vue(),
    svgLoader(),
    {
      name: 'html-transform',
      transformIndexHtml(html) {
        return html.replace('API_DOMAIN', API_DOMAIN)
      },
    },
  ]

  if (isDevelopment) {
    plugins.push(
      checker({
        eslint: {
          lintCommand: 'eslint src/**/*.{js,vue}',
        },
      })
    )
  }
  if (isProduction && PUBLIC_PATH === localhostServe) {
    plugins.push(
      visualizer({
        filename: 'stats.html',
        gzipSize: true,
      })
    )
  }

  return {
    base: PUBLIC_PATH,
    plugins,
    resolve: {
      alias: {
        '@': resolve(import.meta.dirname, 'src'),
        vue: 'vue/dist/vue.esm-bundler.js',
      },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    },
    build: {
      target: 'es2015',
    },
    server: isDevelopment
      ? {
          host: '0.0.0.0',
          port: 8080,
          hmr: {
            protocol: 'wss',
            host: DOMAIN,
            path: '/ws',
            clientPort: 443,
          },
        }
      : undefined,
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: [
            '@use "@/scss/core/constants" as *;',
            '@use "@/scss/core/colors" as *;',
            '@use "@/scss/core/variables" as *;',
            '@use "@/scss/core/mixins/breakpoints";',
            '@use "@/scss/core/functions/px-to-rem" as *;',
          ].join('\n'),
          silenceDeprecations: ['if-function'],
        },
      },
    },
    define: stringify({
      VERSION,
      COMMITHASH,
      ENVIRONMENT,
      SENTRY_DSN,
      DOMAIN,
      SAAS_CDN_URL,
      SAAS_TEMPLATE_NAME,
      API_DOMAIN,
      X_PAYMENT_GATEWAY,
      PUBLIC_PATH,
      INITIATOR,
    }),
  }
})
