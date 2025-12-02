import { mask } from '@/utils/mask'
import {
  maskCardNumber,
  maskExpiryDate,
  maskCvv,
  maskPhone,
  maskLatinCyrillicWord,
} from '@/config/mask'
import { requestAF } from '@/utils/dom'

export const formatter = (maskField, parseFn) =>
  function formatter(value, ev) {
    const $input = ev.target
    let position = $input.selectionEnd
    const digit = value[position - 1]
    const oldValue = ev.target._value
    const cursorAtEnd = position === value.length
    const addSymbol = oldValue && value.length > oldValue.length
    const checkNextSymbol = cursorAtEnd && addSymbol
    const needFocus = !cursorAtEnd
    const format = mask(
      parseFn ? parseFn(value) : value,
      maskField,
      true,
      checkNextSymbol
    )

    if (needFocus) {
      while (
        position < format.length &&
        format.charAt(position - 1) !== digit
      ) {
        position++
      }

      requestAF(() => {
        if (document.activeElement === $input) {
          $input.setSelectionRange(position, position)
        }
      })
    }

    return format
  }

const parseAutofillExpiryDate = value => {
  value = value.replace(/[^\d]/, '/')
  let [month, year] = value.split('/')

  if ([2, 4].includes(year?.length)) {
    month = `0${month}`.slice(-2)
    year = year.slice(-2)
    value = `${month}/${year}`
  }

  return value
}

export const formattersCardNumber = {
  parse: value => mask(value, maskCardNumber, false),
  format: value => mask(value, maskCardNumber, true, true),
  input: formatter(maskCardNumber),
}

export const formatterExpiryDate = formatter(
  maskExpiryDate,
  parseAutofillExpiryDate
)

export const formatterCvv = value => mask(value, maskCvv)

export const formatterPhone = value => mask(value, maskPhone)

export const formatterLatinCyrillicWord = value =>
  mask(value, maskLatinCyrillicWord)

export const formatterAmount = value => {
  const [integer, decimal] = value.split('.')
  return decimal ? `${integer}.${decimal.slice(0, 2)}` : integer
}
