import {
  init,
  browserTracingIntegration,
  replayIntegration,
  setTag,
  captureMessage as msg,
} from '@sentry/vue'

let isInit

export const install = router => Vue => {
  if (isInit) return
  isInit = true

  init({
    Vue,
    dsn: SENTRY_DSN,
    integrations: [browserTracingIntegration({ router }), replayIntegration()],
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    release: VERSION,
    environment: ENVIRONMENT,
  })

  setTag('commithash', COMMITHASH)
}

export const captureMessage = (message, level, extra) =>
  msg(message, {
    level,
    extra,
  })
