export const Vue = () => import(/* webpackChunkName: "00" */ 'vue')

export const mitt = () =>
  import(/* webpackChunkName: "000" */ 'mitt').then(module => module.default)

export const App = () =>
  import(/* webpackChunkName: "01" */ '@/app').then(module => module.default)

export const validate = () => import(/* webpackChunkName: "02" */ '@/validate')

export const api = () => import(/* webpackChunkName: "04" */ '@/api')

export const i18n = () => import(/* webpackChunkName: "05" */ '@/i18n')

export const router = () => import(/* webpackChunkName: "06" */ '@/router')

export const store = () => import(/* webpackChunkName: "07" */ '@/store')

export const configDefault = () =>
  import(/* webpackChunkName: "08" */ '@/config/config-default')

export const plugins = () => import(/* webpackChunkName: "09" */ '@/plugins')

export const loadCheckout = () =>
  import(/* webpackChunkName: "1" */ '@flittpayments/js-sdk').then(
    module => module.default
  )

export const sentry = () =>
  Promise.resolve().then(() =>
    SENTRY_DSN
      ? DOMAIN === location.hostname
        ? import(/* webpackChunkName: "3" */ '@/sentry')
        : import(/* webpackChunkName: "4" */ '@/sentry/index-simple')
      : import(/* webpackChunkName: "67" */ '@/sentry/index-mock')
  )

export const loadAsyncValidator = () =>
  import(/* webpackChunkName: "5" */ 'async-validator').then(
    module => module.default
  )
