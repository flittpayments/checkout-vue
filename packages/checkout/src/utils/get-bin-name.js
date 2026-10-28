import bins from '@/config/bins.json'
import { CARD_CONFIG, DEFAULT_CARD_CONFIG } from '@/config/card-config'

export const getBinName = value =>
  Object.entries(bins).find(([, bin]) =>
    new RegExp(`^(${bin.join('|')})`).test(value)
  )?.[0] || ''

export const getCardConfig = value =>
  CARD_CONFIG[getBinName(value)] || DEFAULT_CARD_CONFIG
