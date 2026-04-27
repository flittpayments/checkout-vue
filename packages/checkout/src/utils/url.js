export const appendQueryParams = (url, params) => {
  const urlObj = new URL(url)

  Object.entries(params).forEach(([key, value]) => {
    urlObj.searchParams.set(key, value)
  })

  return urlObj.toString()
}
