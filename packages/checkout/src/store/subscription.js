import { isBoolean, isString } from '@/utils/inspect'
import configSubscription from '@/config/subscription'
import { deepMerge } from '@/utils/helpers'
import { configDefault } from '@/config/config-default'

export const subscription = (recurring_data = {}) => {
  let {
    amount,
    period,
    every,
    start_time,
    end_time,
    readonly,
    conditions = {},
    state,
  } = deepMerge({}, configDefault.params.recurring_data, recurring_data)

  const { quantity, trial_period, trial_quantity } = deepMerge(
    {},
    configDefault.params.recurring_data,
    conditions
  )
  const type = getType(true, state)
  const unlimited = Boolean(!quantity && !end_time)
  return {
    options: {
      subscription: {
        type,
        quantity: Boolean(quantity || unlimited),
        unlimited,
        trial: Boolean(trial_period && trial_quantity),
        readonly,
      },
    },
    params: {
      recurring_data: {
        amount,
        period,
        every,
        start_time,
        end_time,
        quantity,
        trial_period,
        trial_quantity,
      },
    },
    subscription: configSubscription[type],
  }
}

export const getType = (isSubscription, state) => {
  let type

  if (!isSubscription) return 'disabled'

  if (isBoolean(state)) {
    type = state ? 'shown_edit_on' : 'shown_edit_off'
  } else if (isString(state) && state in configSubscription) {
    type = state
  } else {
    type = 'shown_readonly'
  }

  return type
}
