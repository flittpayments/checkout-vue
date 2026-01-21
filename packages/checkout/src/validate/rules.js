import { parse, isAfter, isEqual, isValid } from '@/utils/date'
import { amountToCoins } from '@/utils/helpers'

// $t('rule_date_format')
export const date_format = (value, [format]) => {
  return isValid(parse(value, format))
}

// $t('rule_after')
export const after = (value, [target, inclusion = false, format]) => {
  value = parse(value, format)
  target = parse(target, format)

  if (!isValid(value) || !isValid(target)) {
    return false
  }

  return isAfter(value, target) || (inclusion && isEqual(value, target))
}

// $t('rule_customer_field')
export const customer_field = value => /^(?!\s)[0-9A-Za-z-\/.,\s]+$/.test(value)

// $t('rule_customer_name')
export const customer_name = value => /^([a-zA-Z]+(\s|$)){2,}$/.test(value)

// $t('rule_customer_field_utf8')
export const customer_field_utf8 = value =>
  /^(?!\s+)[\u00BF-\u1FFF\u2C00-\uD7FF\w`\-\/.,\s]+$/.test(value)

// $t('rule_phonemobile')
export const phonemobile = value => /^\+?\d{7,14}$/.test(value)

// $t('rule_numrange')
export const numrange = (value, range) => {
  value = parseInt(value, 10)
  range = range.map(i => parseInt(i, 10))
  return range[0] <= value && value <= range[1]
}

// $t('rule_ccard')
export const ccard = value => {
  const REGEXP_LUHN_DASHED = /^[\d\-\s]+$/
  if (!REGEXP_LUHN_DASHED.test(value)) return false

  let nCheck = 0
  let bEven = false
  const strippedField = value.replace(/\D/g, '')

  for (let n = strippedField.length - 1; n >= 0; n--) {
    let nDigit = parseInt(strippedField.charAt(n), 10)
    if (bEven) {
      if ((nDigit *= 2) > 9) nDigit -= 9
    }
    nCheck += nDigit
    bEven = !bEven
  }
  return nCheck % 10 === 0
}

// $t('rule_one')
export const one = value => parseInt(value, 10) > 0

// $t('rule_no_zero')
export const no_zero = value => amountToCoins(value) > 0

// $t('rule_required_one')
export const required_one = (value, params) => {
  const isRequired = !params.some(item => item)
  return isRequired ? !!value : true
}
