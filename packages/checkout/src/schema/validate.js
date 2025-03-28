import { deepMerge, findGetParameter, removeWallets } from '@/utils/helpers'
import { isPlainObject, isExist, isArray } from '@/utils/inspect'
import descriptor from '@/schema/descriptor'
import { sentry } from '@/import'
import { loadAsyncValidator } from '@/import'
import { sort } from '@/utils/sort'
import { parseFieldsCustom } from '@/schema/parse-fields-custom'
import { createDate, format } from '@/utils/date'
import { formatServer } from '@/config/date'
import configMethods from '@/config/methods.json'

class Validate {
  constructor(data) {
    this.data = deepMerge(data, {
      options: { theme: {} },
      params: {},
    })
    this.options = this.data.options
    this.params = this.data.params
  }

  init() {
    this.format(this.data)
    this.compatibility()
    return this.validate().then(this.afterValidate.bind(this))
  }

  compatibility() {
    this.email()
    this.button()
    this.supportOldOptions('show_email', 'email')
    this.supportOldOptions('show_fee', 'fee')
    this.supportOldOptions('show_lang', 'lang')
    this.supportOldOptions('show_link', 'hide_link')
    this.supportOldOptions('show_pay_button', 'button')
    this.supportOldOptions('show_pay_button_amount', 'show_button_amount')
    this.supportOldOptions('show_title', 'hide_title')
    this.supportOldOptions('banks_icons', 'banklinks_eu_icons')
    this.supportOldOptionsArray('methods', 'banks', 'trustly')
    this.supportOldOptionsArray('methods', 'banks', 'banklinks_eu')
    this.supportOldOptionsArray('methods_disabled', 'banks', 'trustly')
    this.supportOldOptionsArray('methods_disabled', 'banks', 'banklinks_eu')
    this.deprecatedOptions('fields')
    this.deprecatedOptions('hide_button_title')
  }

  supportOldOptions(newName, oldName) {
    const oldValue = this.options[oldName]
    const newValue = this.options[newName]

    if (!isExist(oldValue)) return

    if (!isExist(newValue)) {
      this.options[newName] = oldValue
    }

    this.log(`options.${oldName} is deprecated, use options.${newName}`)

    delete this.options[oldName]
  }

  supportOldOptionsArray(field, newName, oldName) {
    const value = this.options[field]

    if (!isArray(value)) return

    this.options[field] = value.map(item => {
      if (item === oldName) {
        this.log(
          `${oldName} is deprecated in the options.${field}, use ${newName}`
        )

        return newName
      } else {
        return item
      }
    })
  }

  deprecatedOptions(name) {
    if (!isExist(this.options[name])) return

    this.log(`options.${name} is deprecated, needs to be deleted`)

    delete this.options[name]
  }

  log(message) {
    sentry().then(({ captureMessage }) => captureMessage(message, 'warning'))
    console.warn(message)
  }

  format(options) {
    let regex = /[A-Z]+/g

    if (!isPlainObject(options)) return

    for (let prop in options) {
      if (['messages', 'validate'].includes(prop)) continue
      if (!Object.prototype.hasOwnProperty.call(options, prop)) continue

      let modified = prop.replace(regex, function (match) {
        return '_' + match.toLowerCase()
      })
      if (prop !== modified) {
        if (Object.prototype.hasOwnProperty.call(options, modified)) continue
        options[modified] = options[prop]
        delete options[prop]
        this.format(options[modified])
      } else {
        this.format(options[prop])
      }
    }
  }

  validate() {
    return loadAsyncValidator()
      .then(Schema => new Schema(descriptor).validate({ config: this.data }))
      .catch(({ errors }) => {
        errors = errors.map(({ message }) => message)
        sentry().then(({ captureMessage }) =>
          captureMessage('config', 'info', errors)
        )

        return Promise.reject(errors)
      })
  }

  afterValidate() {
    this.activeTab()
    this.token()
    this.layout()
    this.parse()
  }

  parse() {
    this.fieldsCustom()
    this.startTime()

    return this
  }

  email() {
    let sender_email = this.params.sender_email

    if (!sender_email) return

    this.params.email = sender_email

    delete this.params.sender_email
  }

  button() {
    const button = findGetParameter('button') || this.params.button

    if (!button) return

    this.params.button = button
  }

  activeTab() {
    const active_tab = this.options.active_tab
    const show_menu_first = this.options.show_menu_first
    const methods = this.options.methods || []
    const methodsLength = methods.filter(removeWallets).length

    if (
      !active_tab &&
      (show_menu_first || (!isExist(show_menu_first) && methodsLength > 1))
    ) {
      this.options.active_tab = 'menu'
    }
  }

  token() {
    let token = findGetParameter('token') || this.params.token
    if (!token) return

    delete this.params.amount
    delete this.params.currency
    delete this.options.amount_readonly

    this.params.token = token
  }

  layout() {
    const layout = this.options.theme.layout

    if (layout === 'wallets_only') {
      this.setData({
        options: {
          methods: ['wallets'],
          methods_disabled: configMethods.filter(removeWallets),
          full_screen: false,
        },
      })
    }
    if (layout === 'plain') {
      this.setDefaultData({
        options: {
          card_icons: [],
          show_amount: false,
          // show_email: false, by default
          show_fee: false,
          show_lang: false,
          show_link: false,
          show_order_desc: false,
          // show_pay_button: true, by default
          // show_pay_button_amount: true, by default
          // show_processed: true, by default
          show_secure_message: false,
          show_test_mode: false,
          show_title: false,
        },
      })
    }
  }

  setData(data) {
    deepMerge(this.data, data)
  }

  setDefaultData(data) {
    deepMerge(this.data, data, JSON.parse(JSON.stringify(this.data)))
  }

  fieldsCustom() {
    const fields_custom = this.data.fields_custom

    if (!fields_custom) return

    this.data.fields_custom = Object.values(fields_custom)
      .sort(sort('p'))
      .map(parseFieldsCustom)
  }

  startTime() {
    let start_time = this.params.recurring_data?.start_time

    if (!start_time) return

    let value = createDate(start_time)
    let now = createDate()

    if (now > value) value = now

    this.params.recurring_data.start_time = format(value, formatServer)
  }
}

export default config => new Validate(config)
