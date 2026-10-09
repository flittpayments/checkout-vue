import { defineRule } from 'vee-validate'
import {
  required,
  email,
  numeric,
  alpha,
  min,
  max,
  digits,
  regex,
} from '@vee-validate/rules'
import * as customRules from '@/validate/rules'

export const install = () => {
  const rules = {
    required, // $t('rule_required')
    email, // $t('rule_email')
    numeric, // $t('rule_numeric')
    alpha, // $t('rule_alpha')
    min, // $t('rule_min')
    max, // $t('rule_max')
    digits, // $t('rule_digits')
    regex, // $t('rule_regex')
    phone: digits, // $t('rule_phone')
    ...customRules,
  }

  Object.entries(rules).forEach(([name, rule]) => {
    defineRule(name, rule)
  })
}
