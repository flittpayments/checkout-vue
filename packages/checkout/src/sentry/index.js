import {
  init,
  browserTracingIntegration,
  replayIntegration,
  captureMessage,
} from '@sentry/vue'
import { sendBufferedErrors } from '@/sentry/error-buffer'
import { stopError, initErrorChunk } from '@/sentry/error-capture'
import { findGetParameter } from '@/utils/helpers'

let isInit = false

function initSentry(app, optionsUser, router) {
  if (isInit) return
  isInit = true

  const token = findGetParameter('token') || optionsUser.params?.token
  const button =
    findGetParameter('button') ||
    optionsUser.params?.button ||
    optionsUser.button?.token

  init({
    ...(app && { app }),
    dsn: SENTRY_DSN,
    integrations: [
      ...(router ? [browserTracingIntegration({ router })] : []),
      replayIntegration(),
    ],
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    release: VERSION,
    environment: ENVIRONMENT,
    initialScope: scope => {
      scope.setTag('commithash', COMMITHASH)
      scope.setTag('initiator', INITIATOR)
      scope.setTag('url', window.location.href)
      scope.setTag('domain', window.location.hostname)
      if (token) {
        scope.setTag('token', token)
      }
      if (button) {
        scope.setTag('button', button)
      }
    },
  })

  sendBufferedErrors(args => captureMessage(...args))
  stopError()
  initErrorChunk()
}

export const install = (optionsUser, router) => app => {
  initSentry(app, optionsUser, router)
}

export const installMin = optionsUser => {
  initSentry(null, optionsUser)
}
