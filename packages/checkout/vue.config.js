const webpack = require('webpack')
const path = require('path')
const { defineConfig } = require('@vue/cli-service')
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const { SubresourceIntegrityPlugin } = require('webpack-subresource-integrity')
const { WebpackAssetsManifest } = require('webpack-assets-manifest')
const { execSync } = require('node:child_process')

const run = command => execSync(command, { encoding: 'utf8' }).trim()
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
const COMMITHASH = run('git rev-parse HEAD')
const VERSION = (BRANCH || run('git branch --show-current')).replace(
  'origin/',
  ''
)
const DOMAIN = PUBLIC_URL.hostname
const INITIATOR =
  LIBRARY_TYPE || PUBLIC_URL.pathname.split('/').filter(Boolean)[0]
const isProduction = process.env.NODE_ENV === 'production'
const isDevelopment = process.env.NODE_ENV === 'development'
const isModule = INITIATOR === 'module'
const localhostServe = 'http://localhost:3000/'

function stringify(obj) {
  return Object.fromEntries(
    Object.entries(obj).map(([name, value]) => [name, JSON.stringify(value)])
  )
}

module.exports = defineConfig({
  pages: {
    checkout: {
      entry: ['src/main.js', 'src/scss/fonts.scss'],
      template: 'public/index.html',
      filename: 'index.html',
      scriptLoading: 'blocking',
      inject: 'head',
      minify: {
        collapseWhitespace: false, // true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
    },
  },
  devServer: {
    client: {
      webSocketURL: `wss://${DOMAIN}/ws`,
    },
  },
  lintOnSave: false,
  runtimeCompiler: true,
  transpileDependencies: true,
  productionSourceMap: false,
  publicPath: PUBLIC_PATH,
  css: {
    loaderOptions: {
      scss: {
        additionalData: [
          '@use "@/scss/core/constants" as *;',
          '@use "@/scss/core/colors" as *;',
          '@use "@/scss/core/variables" as *;',
          '@use "@/scss/core/mixins/breakpoints";',
          '@use "@/scss/core/functions/px-to-rem" as *;',
        ].join(''),
      },
    },
  },
  chainWebpack: config => {
    // prettier-ignore
    config
      .when(isProduction, config => {
        config
          .optimization
            .set('realContentHash', true)
            .splitChunks({
              cacheGroups: {
                defaultVendors: {
                  test: /[\\/]node_modules[\\/]/,
                  priority: -10,
                },
                default: {
                  minChunks: 2,
                },
                styles: {
                  name: 'styles',
                  test: /\/components\/(button\/button-unstyled|svg)/,
                  type: 'css/mini-extract',
                  enforce: true,
                },
              },
            })
            .end()
          .output
            .filename('[name].js')
            .crossOriginLoading('anonymous')
            .end()
          .plugin('copy')
            .tap(options => {
              options[0].patterns[0].globOptions.ignore.push(
                path.join(process.cwd(), 'public', 'buttons', '**')
              )
              return options
            })
            .end()
          .module
            .rule('scss')
              .oneOf('vue-modules')
                .use('css-loader')
                  .tap(options => {
                    options.modules.localIdentName = '[hash:base64:6]'
                    return options
                  }).end()
                .end()
              .end()
            .end()
          .plugin('extract-css')
            .tap(([options]) => {
              return [{
                ...options,
                ignoreOrder: true,
                filename: '[name].css',
                insert: function(linkTag) {
                  linkTag.removeAttribute && linkTag.removeAttribute('crossorigin')
                  document.head.appendChild(linkTag)
                },
              }]
            })
            .end()
          .plugin('banner')
            .use(webpack.BannerPlugin, [{
              banner: [
                VERSION,
                'commithash',
                COMMITHASH,
                new Date().toUTCString(),
              ].join(' '),
              entryOnly: true,
              exclude: /css$/
            }])
            .end()
          .plugin('sri')
            .use(SubresourceIntegrityPlugin, [{
              hashLoading: 'lazy',
            }])
            .end()
          .plugin('assets-manifest')
            .use(WebpackAssetsManifest, [{
              publicPath: true,
              integrity: true,
              integrityHashes: ['sha384'],
            }])
            .end()
      })
      .when(isProduction && PUBLIC_PATH !== localhostServe, config => {
        config.plugins.delete('html-checkout')
      })
      .when(isProduction && PUBLIC_PATH === localhostServe, config => {
        config
          .plugin('webpack-bundle-analyzer')
            .use(BundleAnalyzerPlugin)
            .end()
      })
      .when(isModule, config => {
        config
          .entry('checkout')
            .clear()
            .add('./src/main.js')
            .end()
          .merge({
            output: {
              filename: '[name].mjs',
              library: {
                type: 'module',
              },
            },
            experiments: {
              outputModule: true,
            },
          })
      })
      .when(isDevelopment, config => {
        config
          .plugin('stylelint')
            .use('stylelint-webpack-plugin',[{
              files: 'src/**/*.scss',
              fix: true,
            }])
            .end()
          .plugin('circular-dependency-plugin')
            .use('circular-dependency-plugin',[{
              exclude: /node_modules/,
              cwd: process.cwd(),
            }])
            .end()
      })
      .module
        .rules.delete('svg').end()
        .rule('svg')
          .test(/\.(svg)(\?.*)?$/)
          .oneOf('svg-component')
            .test(/src\/svg/)
            .use('vue-loader')
              .loader('vue-loader')
              .end()
            .use('vue-svg-loader')
              .loader('vue-svg-loader')
              .options({ svgo: { plugins: [{ cleanupIDs: false }] } })
              .end()
            .end()
          .oneOf('svg')
            .set('type', 'asset/resource')
            .set('generator', {
              filename: 'img/[name].[hash:8][ext]'
            })
            .end()
          .end()
        .end()
      .plugin('define-plugin')
        .use(webpack.DefinePlugin, [stringify({
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
        })])
        .end()
  },
})
