import bins from '@/config/bins.json'

export const getBinName = value =>
  Object.entries(bins).find(([, bin]) =>
    new RegExp(`^(${bin.join('|')})`).test(value)
  )?.[0] || ''
