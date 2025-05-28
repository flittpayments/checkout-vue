import { findGetParameter } from '@/utils/helpers'
import Model from '@/class/model'
import { isPlainObject, isExist } from '@/utils/inspect'
import configTheme from '@/config/theme'
import descriptor from '@/schema/descriptor'
import { sentry } from '@/import'
import { loadAsyncValidator } from '@/import'
import { sort } from '@/utils/sort'
import { parseFieldsCustom } from '@/schema/parse-fields-custom'
import { createDate, format } from '@/utils/date'
import { formatServer } from '@/config/date'

class Validate extends Model {
  constructor(data) {
    super()
    this.data = data
  }

  init() {
    this.format(this.data)
    this.compatibility()
    this.configDefault()
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
    this.depreciatedOptions('fields')
    this.depreciatedOptions('hide_button_title')
  }

  supportOldOptions(newName, oldName) {
    const oldValue = this.data.options?.[oldName]
    const newValue = this.data.options?.[newName]

    if (!isExist(oldValue)) return

    if (!isExist(newValue)) {
      this.attr(`data.options.${newName}`, oldValue)
    }

    const message = `options.${oldName} is depreciated, use options.${newName}`
    sentry().then(({ captureMessage }) => captureMessage(message, 'warning'))
    console.warn(message)

    delete this.data.options[oldName]
  }

  depreciatedOptions(name) {
    if (!isExist(this.data.options?.[name])) return

    const message = `options.${name} is depreciated, needs to be deleted`
    sentry().then(({ captureMessage }) => captureMessage(message, 'warning'))
    console.warn(message)

    delete this.data.options[name]
  }

  configDefault() {
    this.showMenuFirst()
    this.preset()
  }

  format(options) {
    let regex = /[A-Z]+/g

    if (!isPlainObject(options)) return

    for (let prop in options) {
      if (['messages', 'validate'].includes(prop)) continue
      if (Object.prototype.hasOwnProperty.call(options, prop)) {
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
    this.token()
    this.parse()
  }

  parse() {
    this.fieldsCustom()
    this.startTime()

    return this
  }

  email() {
    let sender_email = this.data.params?.sender_email

    if (!sender_email) return

    this.data.params.email = sender_email

    delete this.data.params.sender_email
  }

  button() {
    let button = findGetParameter('button') || this.data.params?.button
    if (!button) return

    this.attr('data.params.button', button)
  }

  showMenuFirst() {
    if (!this.attr('data.options.active_tab')) return

    this.attr('data.options.show_menu_first', false)
  }

  preset() {
    const preset = this.data.options?.theme?.preset
    const theme = this.data.options?.theme?.type

    if (isExist(preset) || !theme) return

    this.attr('data.options.theme.preset', configTheme[theme])
  }

  token() {
    let token = findGetParameter('token') || this.data.params?.token
    if (!token) return

    if (this.data.params) {
      delete this.data.params.amount
      delete this.data.params.currency
    }

    if (this.data.options) {
      delete this.data.options.amount_readonly
    }

    this.attr('data.params.token', token)
  }

  fieldsCustom() {
    let fields_custom = this.data.fields_custom

    if (!fields_custom) return

    this.attr(
      'data.fields_custom',
      Object.values(fields_custom).sort(sort('p')).map(parseFieldsCustom)
    )
  }

  startTime() {
    let start_time = this.data.params?.recurring_data?.start_time

    if (!start_time) return

    let value = createDate(start_time)
    let now = createDate()

    if (now > value) value = now

    this.attr(
      'data.params.recurring_data.start_time',
      format(value, formatServer)
    )
  }
}

export default config => new Validate(config)
