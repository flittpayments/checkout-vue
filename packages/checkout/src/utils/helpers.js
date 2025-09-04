import { isError, isPlainObject } from '@/utils/inspect'
import { captureMessage } from '@/sentry/error-buffer'
import { memoize } from '@/utils/memoize'

export const getCookie = name => {
  let matches = document.cookie.match(
    new RegExp(
      '(?:^|; )' +
        name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') +
        '=([^;]*)'
    )
  )
  return matches && decodeURIComponent(matches[1])
}

// TODO https://github.com/TehShrike/deepmerge

export const deepMerge = (...args) => {
  let extended = args[0]

  let merge = function (obj) {
    for (let prop in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, prop)) {
        if (isPlainObject(obj[prop])) {
          extended[prop] = extended[prop] || {}
          extended[prop] = deepMerge(extended[prop], obj[prop])
        } else {
          extended[prop] = obj[prop]
        }
      }
    }
  }

  for (let i = 1; i < args.length; i++) {
    merge(args[i])
  }

  return extended
}

export const findGetParameter = name =>
  new URLSearchParams(location.search).get(name)

export const errorHandler = error => {
  if (isError(error)) {
    console.log(error)
    captureMessage('error', {
      level: 'error',
      extra: error,
    })
  }
}

export const clearEmptyValue = object => {
  return Object.fromEntries(
    Object.entries(object).filter(([, v]) => v !== '' && v !== null)
  )
}

export const removeDuplicate = (item, key, self) => self.indexOf(item) === key

export const includes = list => item => list.includes(item)

export const excludes = list => item => !list.includes(item)

export const createConfig = (names, values) =>
  values.reduce((result, value, key) => {
    result[names[key].join('_')] = value
    return result
  }, {})

export const windowWidth = () => window.innerWidth

export const windowHeight = () => window.innerHeight

export const fib = memoize(x => (x <= 1 ? x : fib(x - 1) + fib(x - 2)))

export const codeToFlag = code => {
  if (!code) return

  if (String.fromCodePoint) {
    return String.fromCodePoint(
      ...[...code].map(c => 127462 - 65 + c.charCodeAt(0))
    )
  }
}

export const amountToCoins = value =>
  Math.round(parseFloat(value).toFixed(2) * 100) || 0

export const coinsToAmountString = value => (value / 100).toFixed(2)

export const pick = (data, list) =>
  Object.fromEntries(
    Object.entries(data).filter(([name]) => list.indexOf(name) >= 0)
  )

export const omit = (data, list) =>
  Object.fromEntries(
    Object.entries(data).filter(([name]) => list.indexOf(name) < 0)
  )
