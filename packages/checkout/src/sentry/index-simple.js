import { BrowserClient, makeFetchTransport } from '@sentry/browser'
import { Scope } from '@sentry/core'
import { sendBufferedErrors } from '@/sentry/error-buffer'
import { findGetParameter } from '@/utils/helpers'
import { isString } from '@/utils/inspect'

let isInit

function initSentry(optionsUser) {
  if (isInit) return
  isInit = true

  const token = findGetParameter('token') || optionsUser.params?.token
  const client = new BrowserClient({
    dsn: SENTRY_DSN,
    transport: makeFetchTransport,
    defaultIntegrations: false,
    integrations: [],
    tracesSampleRate: 0,
    release: VERSION,
    environment: ENVIRONMENT,
    stackParser: () => [],
  })
  const scope = new Scope()

  scope.setTag('commithash', COMMITHASH)
  scope.setTag('library_type', LIBRARY_TYPE)
  if (token) {
    scope.setTag('token', token)
  }

  function captureMessage(message, options) {
    const normalized = isString(options) ? { level: options } : options || {}
    const event = { ...normalized, message }

    client.captureEvent(event, undefined, scope)
  }

  sendBufferedErrors(args => captureMessage(...args))
}

export const install = optionsUser => () => {
  initSentry(optionsUser)
}

export const installMin = optionsUser => {
  initSentry(optionsUser)
}
