export const DEFAULT_CARD_CONFIG = {
  cardNumberMaxLength: 23,
  cardNumberLengths: [16, 19],
  cardNumberPlaceholder: '____ ____ ____ ____',
  cardNumberMask: 'XXXX XXXX XXXX XXXX XXX',
  cvvLength: 3,
  cvvPlaceholder: '___',
  cvvMask: '###',
}

export const CARD_CONFIG = {
  american_express: {
    cardNumberMaxLength: 17,
    cardNumberLengths: [15],
    cardNumberPlaceholder: '____ ______ _____',
    cardNumberMask: 'XXXX XXXXXX XXXXX',
    cvvLength: 4,
    cvvPlaceholder: '____',
    cvvMask: '####',
  },
}
