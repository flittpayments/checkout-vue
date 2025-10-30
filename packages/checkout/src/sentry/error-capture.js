import { eventOff, eventOn } from '@/utils/events'
import { captureMessage } from '@/sentry/error-buffer'

let handler = null
let handlerChunk = null

function createHandler(logChunkOnly) {
  return function (event) {
    const target = event.target || event.srcElement
    const tag = target?.tagName?.toLowerCase()
    const src = target?.src || target?.href || event.filename
    const integrity = target?.integrity
    const message = event.message || event.error?.message
    const stack = event.error?.stack || event.reason?.stack
    const isChunkError = ['script', 'link'].includes(tag)

    if (logChunkOnly && !isChunkError) return

    captureMessage(isChunkError ? 'ChunkLoadError' : 'PreInitError', {
      level: 'error',
      tags: {
        type: isChunkError ? 'chunk' : 'other',
      },
      extra: {
        src,
        integrity,
        message,
        stack,
      },
    })
  }
}

export function initError() {
  if (SENTRY_DSN && DOMAIN === location.hostname) {
    handler = createHandler(false)
    eventOn(window, 'error', handler, true)
    eventOn(window, 'unhandledrejection', handler, true)
  }
}

export function initErrorChunk() {
  handlerChunk = createHandler(true)
  eventOn(window, 'error', handlerChunk, true)
}

export function stopError() {
  if (handler) {
    eventOff(window, 'error', handler, true)
    eventOff(window, 'unhandledrejection', handler, true)
    handler = null
  }
}

export function stopErrorChunk() {
  if (handlerChunk) {
    eventOff(window, 'error', handlerChunk, true)
    handlerChunk = null
  }
}
