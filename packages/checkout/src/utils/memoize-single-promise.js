export const memoizeSinglePromise = fn => {
  let promise = null

  const memoized = (...args) => {
    if (promise) {
      return promise
    }

    promise = Promise.resolve()
      .then(() => fn.apply(null, args))
      .catch(error => {
        promise = null
        return Promise.reject(error)
      })

    return promise
  }

  memoized.clear = () => (promise = null)

  memoized.get = () => promise

  memoized.set = value => (promise = Promise.resolve(value))

  return memoized
}
