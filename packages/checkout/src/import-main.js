export const Vue = () => import('vue')

export const mitt = () => import('mitt').then(module => module.default)

export const App = () => import('@/app').then(module => module.default)

export const validate = () => import('@/validate')

export const api = () => import('@/api')

export const i18n = () => import('@/i18n')

export const router = () => import('@/router')

export const store = () => import('@/store')

export const configDefault = () => import('@/config/config-default')

export const plugins = () => import('@/plugins')

export const loadCheckout = () =>
  import('@flittpayments/js-sdk').then(module => module.default)

export const sentry = () =>
  Promise.resolve().then(() =>
    SENTRY_DSN
      ? DOMAIN === location.hostname
        ? import('@/sentry')
        : import('@/sentry/index-simple')
      : import('@/sentry/index-mock')
  )

export const loadAsyncValidator = () =>
  import('async-validator').then(module => module.default)
