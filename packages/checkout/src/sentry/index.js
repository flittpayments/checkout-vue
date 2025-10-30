import {
  init,
  browserTracingIntegration,
  replayIntegration,
  setTag,
  captureMessage,
} from '@sentry/vue'
import { sendBufferedErrors } from '@/sentry/error-buffer'
import { stopError, initErrorChunk } from '@/sentry/error-capture'

let isInit

function initSentry(Vue = null, router = null) {
  if (isInit) return
  isInit = true

  init({
    ...(Vue && { Vue }),
    dsn: SENTRY_DSN,
    integrations: [
      ...(router ? [browserTracingIntegration({ router })] : []),
      replayIntegration(),
    ],
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    release: VERSION,
    environment: ENVIRONMENT,
  })

  setTag('commithash', COMMITHASH)

  sendBufferedErrors(args => captureMessage(...args))
  stopError()
  initErrorChunk()
}

export const install = router => Vue => {
  initSentry(Vue, router)
}

export const installMin = () => {
  initSentry()
}

export { setTag }
