import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import checker from 'vite-plugin-checker'
import { resolve } from 'path'
import legacy from '@vitejs/plugin-legacy'
import packageJson from './package.json' with { type: 'json' }
import { execSync } from 'node:child_process'

const { browserslist } = packageJson
const {
  BRANCH,
  ENVIRONMENT,
  SENTRY_DSN,
  SAAS_CDN_URL,
  SAAS_TEMPLATE_NAME,
  API_DOMAIN,
  X_PAYMENT_GATEWAY,
  PUBLIC_PATH,
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

console.log({
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
})

function stringify(obj) {
  return Object.fromEntries(
    Object.entries(obj).map(([name, value]) => [name, JSON.stringify(value)])
  )
}

export default defineConfig(() => {
  let plugins = [vue()]

  if (isProduction) {
    plugins.push(
      legacy({
        targets: browserslist,
      })
    )
  }
  if (isDevelopment) {
    plugins.push({
      name: 'html-transform',
      transformIndexHtml(html) {
        return html.replace('API_DOMAIN', API_DOMAIN)
      },
    })
    plugins.push(
      checker({
        eslint: {
          lintCommand: 'eslint src/**/*.{js,vue}',
        },
      })
    )
  }

  return {
    plugins,
    resolve: {
      alias: {
        '@': resolve(import.meta.dirname, 'src'),
        vue: 'vue/dist/vue.esm-bundler.js',
      },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    },
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
