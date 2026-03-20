import configMethods from '@/config/methods.json'
import { removeDuplicate, includes, excludes } from '@/utils/helpers'
import { isExist } from '@/utils/inspect'
import { sort } from '@/utils/sort'
import { mappingMethod } from '@/config/mapping-method'
import { isNotButtonOnly } from '@/utils/method'

export const methods = (user, server = [], disable) => {
  server = server.map(mappingMethod)
  user = user.map(mappingMethod)
  disable = disable.map(mappingMethod)

  return user
    .filter(includes(server))
    .concat(server)
    .filter(onlyConfig)
    .filter(removeDuplicate)
    .filter(excludes(disable))
}

export const tabs = (tabs = {}, disable) => {
  let result = Object.entries(tabs)
    .map(([tab, { payment_systems }]) => {
      tab = mappingMethod(tab)
      return [tab, parse(payment_systems, tab)]
    })
    .filter(([tab]) => excludes(disable)(tab))

  let allPaymentMethods = result.reduce(
    (accum, [, methods]) => [...accum, ...Object.values(methods)],
    []
  )

  let quick_access = allPaymentMethods.filter(({ params }) =>
    ['button_only', 'button_and_tab'].includes(params?.method_position)
  )

  if (quick_access.length) {
    result.push([
      'quick_access',
      Object.fromEntries(quick_access.map(method => [method.id, method])),
    ])
  }

  let most_popular = allPaymentMethods
    .filter(
      ({ user_priority, country_priority }) =>
        user_priority > 0 || country_priority > 0
    )
    .filter(isNotButtonOnly)

  if (most_popular.length) {
    if (allPaymentMethods.some(({ id }) => id === 'card')) {
      most_popular.push({
        id: 'card',
        method: 'card',
        logo: 'card',
        name: 'credit_debit_cards',
        user_priority: 99,
        country: 'XX',
      })
    }
    result.push([
      'most_popular',
      Object.fromEntries(most_popular.map(method => [method.id, method])),
    ])
  }

  return Object.fromEntries(result)
}

export const tabs_order = (tabs_order = [], tabs) => {
  tabs = Object.fromEntries(
    Object.entries(tabs)
      .map(([tab, methods]) => [
        tab,
        Object.fromEntries(
          Object.entries(methods).filter(
            ([, method]) => tab === 'quick_access' || isNotButtonOnly(method)
          )
        ),
      ])
      .filter(([, methods]) => Object.keys(methods).length)
  )
  tabs_order = tabs_order.map(mappingMethod)
  if (tabs.most_popular) {
    tabs_order.unshift('most_popular')
  }
  if (tabs.quick_access) {
    tabs_order.push('quick_access')
  }
  tabs_order = tabs_order.filter(
    tab => tabs[tab] && Object.keys(tabs[tab]).length
  )
  tabs_order.push('wallets')
  return tabs_order
}

export const most_popular_icons = ({ most_popular }) =>
  most_popular
    ? Object.values(most_popular)
        .sort(sort('country_priority'))
        .sort(sort('user_priority', true))
        .slice(0, 10)
    : []

function onlyConfig(tab) {
  return [...configMethods, 'quick_access'].includes(tab)
}

function parse(methods, tab) {
  return Object.fromEntries(
    Object.entries(methods).map(([id, value]) => [
      id,
      {
        ...value,
        method: tab,
        tab,
        id,
        logo: logo(value, id),
        iban: id.split('|')[1] || '',
      },
    ])
  )
}

function logo({ country, bank_logo }, id) {
  if (isExist(bank_logo)) {
    return (
      bank_logo || (isGermany(country) ? 'germanonlinebanktransfer' : 'no_logo')
    )
  } else {
    return id
  }
}

function isGermany(country) {
  return country === 'DE'
}
