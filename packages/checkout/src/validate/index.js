import { extend } from 'vee-validate'
import {
  required,
  email,
  numeric,
  alpha,
  min,
  max,
  digits,
  regex,
} from 'vee-validate/dist/rules'
import * as customRules from '@/validate/rules'

export const install = () => {
  let rules = Object.assign(
    {
      required, // $t('rule_required')
      email, // $t('rule_email')
      numeric, // $t('rule_numeric')
      alpha, // $t('rule_alpha')
      min, // $t('rule_min')
      max, // $t('rule_max')
      digits, // $t('rule_digits')
      regex, // $t('rule_regex')
      phone: digits, // $t('rule_phone')
    },
    customRules
  )
  Object.entries(rules).forEach(([name, value]) => {
    extend(name, value)
  })
}
