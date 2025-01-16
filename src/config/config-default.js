import configLocales from '@/config/locales.json'
import configTheme from '@/config/theme'
import configSubscription from '@/config/subscription'

const locales = Object.keys(configLocales)

const theme = 'light'

export const configDefault = {
  options: {
    methods: ['card'],
    methods_disabled: [],
    wallet_methods_enabled: ['apple', 'google'],
    most_popular_icons: [],
    card_icons: ['mastercard', 'visa'],
    banklinks_eu_icons: [],
    local_methods_icons: [],
    crypto_icons: ['bitcoincore', 'coinbase', 'binance'],
    loans_icons: [],
    emoney_icons: [],
    wallets_icons: [],
    title: '',
    hide_title: false,
    full_screen: true,
    link: '',
    hide_link: false,
    locales,
    api_domain: 'pay.flitt.com',
    endpoint: {
      gateway: '/latest/checkout-v2/index.html',
      button: '/latest/checkout-v2/button/index.html',
    },
    active_tab: '',
    active_method: '',
    logo_url: '',
    offerta_url: '',
    button: true,
    fee: true,
    email: false,
    fields: false,
    default_country: '',
    countries: [],
    lang: true,
    theme: {
      type: theme,
      preset: configTheme[theme],
    },
    show_menu_first: false,
    disable_request: false,
    show_button_amount: true,
    subscription: {
      type: 'disable',
      periods: ['day', 'week', 'month'],
      quantity: false,
      trial: false,
      unlimited: true,
      readonly: false,
    },
    loading:
      'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBmaWxsPSIjNzA4N2ZjIiBkPSJNMTAgNTBzMCAuNS4xIDEuNGMwIC41LjEgMSAuMiAxLjcgMCAuMy4xLjcuMSAxLjEuMS40LjEuOC4yIDEuMi4yLjguMyAxLjguNSAyLjguMyAxIC42IDIuMS45IDMuMi4zIDEuMS45IDIuMyAxLjQgMy41LjUgMS4yIDEuMiAyLjQgMS44IDMuNy4zLjYuOCAxLjIgMS4yIDEuOS40LjYuOCAxLjMgMS4zIDEuOSAxIDEuMiAxLjkgMi42IDMuMSAzLjcgMi4yIDIuNSA1IDQuNyA3LjkgNi43IDMgMiA2LjUgMy40IDEwLjEgNC42IDMuNiAxLjEgNy41IDEuNSAxMS4yIDEuNiA0LS4xIDcuNy0uNiAxMS4zLTEuNiAzLjYtMS4yIDctMi42IDEwLTQuNiAzLTIgNS44LTQuMiA3LjktNi43IDEuMi0xLjIgMi4xLTIuNSAzLjEtMy43LjUtLjYuOS0xLjMgMS4zLTEuOS40LS42LjgtMS4zIDEuMi0xLjkuNi0xLjMgMS4zLTIuNSAxLjgtMy43LjUtMS4yIDEtMi40IDEuNC0zLjUuMy0xLjEuNi0yLjIuOS0zLjIuMi0xIC40LTEuOS41LTIuOC4xLS40LjEtLjguMi0xLjIgMC0uNC4xLS43LjEtMS4xLjEtLjcuMS0xLjIuMi0xLjcuMS0uOS4xLTEuNC4xLTEuNHY0LjJjMCAuNC0uMS44LS4xIDEuMi0uMS45LS4yIDEuOC0uNCAyLjgtLjIgMS0uNSAyLjEtLjcgMy4zLS4zIDEuMi0uOCAyLjQtMS4yIDMuNy0uMi43LS41IDEuMy0uOCAxLjktLjMuNy0uNiAxLjMtLjkgMi0uMy43LS43IDEuMy0xLjEgMi0uNC43LS43IDEuNC0xLjIgMi0xIDEuMy0xLjkgMi43LTMuMSA0LTIuMiAyLjctNSA1LTguMSA3LjFMNzAgODUuN2MtLjguNS0xLjcuOS0yLjYgMS4zbC0xLjQuNy0xLjQuNWMtLjkuMy0xLjguNy0yLjggMUM1OCA5MC4zIDUzLjkgOTAuOSA1MCA5MWwtMy0uMmMtMSAwLTItLjItMy0uM2wtMS41LS4yLS43LS4xLS43LS4yYy0xLS4zLTEuOS0uNS0yLjktLjctLjktLjMtMS45LS43LTIuOC0xbC0xLjQtLjYtMS4zLS42Yy0uOS0uNC0xLjgtLjgtMi42LTEuM2wtMi40LTEuNWMtMy4xLTIuMS01LjktNC41LTguMS03LjEtMS4yLTEuMi0yLjEtMi43LTMuMS00LS41LS42LS44LTEuNC0xLjItMi0uNC0uNy0uOC0xLjMtMS4xLTItLjMtLjctLjYtMS4zLS45LTItLjMtLjctLjYtMS4zLS44LTEuOS0uNC0xLjMtLjktMi41LTEuMi0zLjctLjMtMS4yLS41LTIuMy0uNy0zLjMtLjItMS0uMy0yLS40LTIuOC0uMS0uNC0uMS0uOC0uMS0xLjJ2LTIuOGMtLjEtMS0uMS0xLjUtLjEtMS41eiI+PGFuaW1hdGVUcmFuc2Zvcm0gYXR0cmlidXRlTmFtZT0idHJhbnNmb3JtIiBkdXI9IjFzIiBmcm9tPSIwIDUwIDUwIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgdG89IjM2MCA1MCA1MCIgdHlwZT0icm90YXRlIi8+PC9wYXRoPjwvc3ZnPg==',
    hide_button_title: false,
    amount_readonly: true,
  },
  params: {
    merchant_id: 1396424, // 900024 dev, 1396424 prod
    amount: 0,
    fee: 0, // %
    currency: '',
    recurring: 'n',
    recurring_data: {
      period: 'month',
      every: 1,
      start_time: '',
      end_time: '',
      amount: 0,
      quantity: 0,
      trial_period: '',
      trial_quantity: 0,
    },
    card_number: '',
    hash: '',
    expiry_date: '',
    cvv2: '',
    email: '',
    code: '',
    order_desc: '',
    offer: false,
    lang: '',
    custom: {}, // users x-vue-template fields
    customer_data: {}, // customer_required_data fields
    form: {}, // bank form fields
    order_id: '',
    save_card: true,
    verification_type: null,
    token: '',
    promocode: '',
  },
  button: {},
  messages: {},
  validate: {},
  css_variable: {},

  // not config
  css_class: {},
  error: {
    show: false,
    code: '',
    message: '',
  },
  loading: false,
  order: {},
  info: {},
  cards: [],
  pay: {},
  isSubmit: false,
  submited: false,
  read_only: false,
  tabs: {},
  ready: false,
  fields_custom: [],
  fields_customer: [],
  validate_expdate: true,
  isOnlyCard: true,
  region: '',
  show_gdpr_frame: false,
  subscription: configSubscription.disabled,
  can_make_payment: '',
  has_fields: false,
  need_validate_card: true,
  discount_percent: 0,
  discount_amount: 0,
  fee_amount: 0,
  total_amount: 0,
  notification: '',
  cvv2_requirement: 'mandatory',
  currencies: [],
  init_wallets: false,
  vm_wallets: null,
  mode_test: false,
  promo: false,
  click2pay_otp: false,
}

locales.forEach(function (locale) {
  configDefault.messages[locale] = {}
  configDefault.validate[locale] = {}
})
