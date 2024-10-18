import { deepMerge } from '@/utils/helpers'
import { saas } from '@/config/saas'
import configLocales from '@/config/locales.json'
import configSubscription from '@/config/subscription'

const locales = Object.keys(configLocales)

const subscriptionType = 'disabled'

let config = {
  options: {
    methods: ['card'],
    methods_disabled: [],
    wallet_methods_enabled: ['apple', 'google'],
    most_popular_icons: [],
    card_icons: ['mastercard', 'visa'],
    banks_icons: [],
    local_methods_icons: [],
    crypto_icons: ['bitcoincore', 'coinbase', 'binance'],
    loans_icons: [],
    emoney_icons: [],
    wallets_icons: [],
    title: '',
    full_screen: true,
    link: '',
    locales,
    active_tab: '',
    active_method: '',
    logo_url: '',
    offerta_url: '',
    default_country: '',
    countries: [],
    theme: {
      type: 'light',
      preset: '',
      layout: 'default',
    },
    show_menu_first: false,
    disable_request: false,
    subscription: {
      type: subscriptionType,
      periods: ['day', 'week', 'month'],
      quantity: false,
      trial: false,
      unlimited: true,
      readonly: false,
    },
    amount_readonly: true,
    autosubmit: false,
    show_amount: true,
    show_email: false,
    show_fee: true,
    show_lang: true,
    show_link: true,
    show_order_desc: true,
    show_pay_button: true,
    show_pay_button_amount: true,
    show_processed: true,
    show_secure_message: true,
    show_test_mode: true,
    show_title: true,
    show_3ds_close: true,
    cvv2_requirement: 'mandatory',
  },
  params: {
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
    payment_system: '',
    token: '',
    promocode: '',
  },
  button: {},
  messages: {},
  css_variable: {},

  // not config
  error: {
    show: false,
    code: '',
    message: '',
  },
  loading: false,
  order: {},
  info: {
    merchant: {},
  },
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
  isOnlyWallets: false,
  showWalletsTab: false,
  region: '',
  show_gdpr_frame: false,
  subscription: configSubscription[subscriptionType],
  can_make_payment: '',
  has_fields: false,
  need_validate_card: true,
  discount_percent: 0,
  discount_amount: 0,
  fee_amount: 0,
  total_amount: 0,
  notification: '',
  cvv2_requirement: '',
  currencies: [],
  vm_wallets: null,
  mode_test: false,
  promo: false,
  click2pay: {
    ready: false,
    email: '',
    actionCode: '',
  },
}

export const configDefault = deepMerge(config, saas)

locales.forEach(function (locale) {
  configDefault.messages[locale] = {}
})
