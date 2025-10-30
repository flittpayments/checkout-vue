import { isFunction } from '@/utils/inspect'

const buffer = []
let logFn = null

export function captureMessage(...args) {
  if (isFunction(logFn)) {
    logFn(args)
  } else {
    buffer.push(args)
  }
}

export function sendBufferedErrors(fn) {
  logFn = fn
  buffer.forEach(fn)
  buffer.length = 0
}
