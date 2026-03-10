import Vue from 'vue'
import { configDefault } from '@/config/config-default'
import notSet from '@/config/not-set'
import cssVariable from '@/config/css-variable'
import cssClass from '@/config/css-class'
import {
  getCookie,
  deepMerge,
  errorHandler,
  removeWallets,
  getRouteName,
  findGetParameter,
} from '@/utils/helpers'
import { removeMostPopular } from '@/utils/method'
import { sendRequest } from '@/api'
import { isExist } from '@/utils/inspect'
import { i18n, loadLanguageAsync, getBrowserLanguage } from '@/i18n/index'
import store from '@/store/setup'
import { loadButton } from '@/store/button'
import { initCssVariable, setCssVariables } from '@/store/css-variable'
import loadCardImg from '@/store/card-img'
import { methods, most_popular_icons, tabs, tabs_order } from '@/store/parse'
import { localStorage } from '@/utils/store'
import configSubscription from '@/config/subscription'
import { allowAutoSubmit } from '@/config/allow-auto-submit'
import { activeMethod } from '@/config/active-method'
import { methodRoute } from '@/config/method-route'
import { mappingMethod } from '@/config/mapping-method'
import { subscription } from '@/store/subscription'
import validate from '@/schema/validate'
import Model from '@/class/model'
import initFavicon from '@/store/favicon'
import { loadClick2pay, loadStyleAdaptive } from '@/import'
import { arrayIncludes } from '@/utils/array'
import { formatKiev } from '@/utils/date'
import locales from '@/config/locales.json'
import { keys } from '@/utils/object'
import { testCardNumbers } from '@/config/test-card-numbers'
import { parseFieldsCustom } from '@/schema/parse-fields-custom'
import { select } from '@/utils/dom'

Vue.use(store)

let instance = {}

class Store extends Model {
  constructor() {
    super()
    this.setStateDefault()
  }
  sendRequestBase(...args) {
    if (this.state.options.disable_request) return Promise.reject()

    Object.assign(args[2], this.defaultParams())

    return sendRequest(...args)
  }
  sendRequest(...args) {
    if (this.state.options.disable_request) return Promise.reject()

    return this.sendRequestBase(...args).catch(model => {
      this.showError(model.attr('error.code'), model.attr('error.message'))
      return Promise.reject(model)
    })
  }
  sendRequestApp() {
    return this.sendRequest(
      'api.checkout',
      'app',
      this.infoParams({
        lang: this.user.params?.lang && this.state.params.lang,
      }),
      {
        cached: this.token,
      }
    )
  }
  sendRequestInfo() {
    this.sendRequest(
      'api.checkout.info',
      'get',
      this.infoParams({
        lang: this.state.params.lang,
      })
    ).catch(errorHandler)
  }
  feeCalc(data) {
    const {
      amount,
      currency,
      token,
      landing_token,
      button,
      merchant_id,
      promocode,
    } = this.state.params

    this.state.notification = ''

    return this.sendRequest(
      'api.checkout.fee',
      'v2',
      {
        amount,
        currency,
        token,
        landing_token,
        button,
        merchant_id,
        promocode,
        ...data,
      },
      {
        cached: true,
      }
    ).then(model => {
      const {
        discount_percent,
        discount_amount,
        fee_amount,
        total_amount,
        message,
        cvv2_requirement = 'mandatory',
      } = model.data

      this.setState({
        discount_percent,
        discount_amount,
        fee_amount,
        total_amount,
        notification: message,
        cvv2_requirement,
      })

      return model
    })
  }
  click2payCardEncrypt(data) {
    return this.sendRequestBase('api.checkout.click2pay.encrypt', 'get', {
      ...data,
      order_id: this.state.order.order_data.order_id,
      merchant_id: this.state.params.merchant_id,
    }).then(model => ({
      encryptedCard: model.attr('encrypted_card'),
      firstName: model.attr('first_name'),
      lastName: model.attr('last_name'),
    }))
  }
  infoSuccess(model) {
    this.state.info = model.data

    this.info(model)

    this.state.options.active_tab =
      mappingMethod(findGetParameter('active_tab')) ||
      this.parseActiveTab(model) ||
      this.state.options.active_tab
    this.state.options.active_method =
      findGetParameter('active_method') ||
      model.attr('active_method') ||
      this.state.options.active_method

    let lang = model.attr('lang')
    if (arrayIncludes(keys(locales), lang) && !this.user.params?.lang) {
      this.state.params.lang = lang
      this.initLang()
    }
    this.initHasFields()
    this.initIsOnlyCard()
    this.initClick2pay()
  }
  cardSuccess(data) {
    this.state.cards =
      !this.state.options.disable_request && this.state.mode_test
        ? testCardNumbers
        : data
  }
  paySuccess(data) {
    this.state.pay = data
  }
  location(isBreakpointDownLg) {
    return (
      this.getRouteIfSinglePaymentMethod() ||
      this.activeMethod() || {
        name: getRouteName(
          this.state.options.methods,
          this.state.options.active_tab,
          isBreakpointDownLg
        ),
      }
    )
  }
  getAutoSubmitParams() {
    const infoParams = this.state.info.autosubmit_params
    const methodId = this.getMethodIdIfAutoSubmitAllowed()

    if (infoParams) {
      this.state.params.payment_system = String(infoParams.payment_system)

      return infoParams
    } else if (methodId) {
      this.state.params.payment_system = methodId

      return this.formParams()
    }
  }
  getRouteIfSinglePaymentMethod() {
    if (this.getAutoSubmitParams()) return

    const singleMethod = this.getSingleMethodIfExists()

    if (!singleMethod) return

    return {
      name: 'system',
      params: { method: singleMethod.method, system: singleMethod.id },
    }
  }
  getMethodIdIfAutoSubmitAllowed() {
    if (this.state.has_fields) return

    const singleMethod = this.getSingleMethodIfExists()

    if (!singleMethod) return

    if (singleMethod.form?.fields.length) return

    return singleMethod.id
  }
  getSingleMethodIfExists() {
    let tabs = this.state.options.methods.filter(removeMostPopular)

    if (
      !this.user.options?.methods?.includes('wallets') ||
      this.user.options?.methods_disabled?.includes('wallets')
    ) {
      tabs = tabs.filter(removeWallets)
    }

    if (tabs.length !== 1) return

    const tab = tabs[0]

    if (!allowAutoSubmit.includes(tab)) return

    if (!this.state.tabs[tab]) return

    let methods = Object.values(this.state.tabs[tab])

    if (methods.length !== 1) return

    return methods[0]
  }
  activeMethod() {
    let active_method = this.state.options.active_method

    if (!active_method) return

    let paymentSystems = Object.entries(this.state.tabs)
      .filter(([method]) => arrayIncludes(activeMethod, method))
      .reduce(
        (accum, [method, value]) => ({
          ...accum,
          ...Object.fromEntries(
            Object.entries(value)
              .filter(([, { alias }]) => alias)
              .map(([id, { alias }]) => [alias, { system: id, method }])
          ),
        }),
        {}
      )

    let paymentSystem = paymentSystems[active_method]

    if (!paymentSystem) return

    let { system, method } = paymentSystem

    let name = methodRoute[method]

    if (!name) return

    return {
      name,
      params: { method, system },
    }
  }
  info(model) {
    if (isExist(model.attr('validate_expdate'))) {
      this.state.validate_expdate = model.attr('validate_expdate')
    }
    this.state.options.link =
      model.attr('merchant.merchant_url') || this.state.options.link
    this.state.options.show_email =
      model.attr('checkout_email_required') || this.state.options.show_email
    this.state.options.title =
      this.state.options.title || model.attr('merchant.localized_name')
    this.state.options.logo_url =
      this.state.options.logo_url || model.attr('merchant.logo_url')
    this.state.options.offerta_url =
      this.state.options.offerta_url || model.attr('merchant.offerta_url')
    this.state.region = (model.attr('merchant.country') || '').toLowerCase()

    this.state.options.default_country =
      this.state.options.default_country || model.attr('default_country')
    this.state.tabs = tabs(
      model.attr('tabs'),
      this.state.options.methods_disabled
    )
    this.state.options.methods = methods(
      this.state.options.methods,
      tabs_order(model.attr('tabs_order'), this.state.tabs),
      this.state.options.methods_disabled
    )
    this.state.options.most_popular_icons = most_popular_icons(this.state.tabs)

    this.state.params.fee = model.attr('client_fee') || 0
    this.state.fields_customer = model.attr('customer_required_data') || []

    if (model.attr('order.fields_custom')) {
      this.state.fields_custom = model
        .attr('order.fields_custom')
        .map(parseFieldsCustom)
    }

    this.state.params.order_desc =
      this.state.params.order_desc || model.attr('order.order_desc') || ' '

    subscription(model.attr('order'))
      .then(config => this.setState(config))
      .catch(errorHandler)

    this.state.show_gdpr_frame = model.attr('show_gdpr_frame')

    this.state.mode_test = model.attr('istest')
    this.state.promo = model.attr('merchant.promo')
  }
  setStateDefault() {
    this.state = JSON.parse(JSON.stringify(configDefault))
  }
  setOptions(userConfig) {
    return validate(userConfig)
      .init()
      .then(() => {
        this.init(userConfig)
      })
  }
  init(userConfig) {
    // delete undefined property
    this.user = JSON.parse(JSON.stringify(userConfig))

    deepMerge(this.state.params, this.user.params, notSet.params)
    deepMerge(this.state.options, this.user.options, notSet.options)
    Object.assign(this.state.button, this.user.button)
    Object.assign(this.state.fields_custom, this.user.fields_custom)
    Object.assign(this.state.messages, this.user.messages)
    Object.assign(this.state.validate, userConfig.validate) // userConfig because functions are removed in this.user
    Object.assign(
      this.state.css_variable,
      cssVariable(this.state.options.theme),
      this.user.css_variable
    )
    Object.assign(this.state.css_class, cssClass(this.state.options.theme.type))
    Object.assign(
      this.state.subscription,
      configSubscription[this.state.options.subscription.type]
    )

    this.initFavicon()
    this.initMethods()
    this.initLang()
    this.initCssDevice()
    this.initHasFields()
    this.initIsOnlyCard()
    initCssVariable(this.state.css_variable)
    this.initTotalAmount()
  }
  initFavicon() {
    if (!this.state.options.full_screen) return
    initFavicon()
  }
  initMethods() {
    this.state.options.methods = methods(
      this.state.options.methods,
      this.state.options.methods,
      this.state.options.methods_disabled
    )
  }
  initLang() {
    this.changeLang(
      getCookie('lang_s') || this.state.params.lang || getBrowserLanguage()
    )
  }
  initCssDevice() {
    if (!this.state.options.full_screen) return

    loadStyleAdaptive()
  }
  initHasFields() {
    this.state.has_fields =
      !this.state.options.amount_readonly ||
      this.state.fields_customer.length ||
      this.state.fields_custom.length ||
      select('#f-fields') ||
      this.state.options.offerta_url
  }
  initIsOnlyCard() {
    let methods = this.state.options.methods.filter(removeWallets)
    this.state.isOnlyCard = methods.length === 1 && methods[0] === 'card'
  }
  initTotalAmount() {
    this.state.total_amount = this.state.params.amount
  }
  initClick2pay() {
    if (!this.enabledClick2pay()) return

    loadClick2pay()
      .then(({ setIdentityValue, initClick2pay }) =>
        setIdentityValue(this.state.params.email)
          .then(() => this.setClick2payEmail(this.state.params.email))
          .finally(() => {
            this.state.click2pay.ready = true
            return initClick2pay(this.state.info.click2pay.sdk_url)
          })
      )
      .catch(errorHandler)
  }
  parseActiveTab(model) {
    let active_tab = mappingMethod(model.attr('active_tab'))
    active_tab = active_tab === 'card' ? '' : active_tab
    let methodsLength = this.state.options.methods.filter(removeWallets).length

    if (!this.state.params.token) return

    if (active_tab) return active_tab

    if (this.user.options?.active_tab) return

    if (methodsLength > 1) {
      return 'menu'
    }

    if (methodsLength === 1) {
      return this.state.options.methods[0]
    }
  }
  load() {
    return Promise.all([this.loadButton(), this.loadCardImg()])
  }
  loadButton() {
    if (!this.state.button.token && !this.state.params.button) {
      return Promise.resolve()
    }

    return loadButton(
      this.state.options.api_domain,
      this.state.params.button,
      this.state.button
    ).then(config => {
      if (this.state.options.full_screen) {
        document.title = config.options.title
      }

      config.fields_custom = config.fields_custom || this.state.fields_custom

      this.setState(config)
      this.initLang()
      this.initHasFields()
      this.initIsOnlyCard()
      this.initTotalAmount()
    })
  }
  loadCardImg() {
    return loadCardImg(this.state.options.theme.preset).then(config => {
      if (!config) return
      this.setState(config)
      setCssVariables(config.css_variable)
    })
  }
  setState(state) {
    deepMerge(this.state, JSON.parse(JSON.stringify(state)))
  }
  changeLang(lang) {
    if (this.state.options.full_screen) {
      document.querySelector('html').setAttribute('lang', lang)
    }

    this.state.params.lang = lang

    loadLanguageAsync(lang, this).catch(errorHandler)
  }
  setCardNumber({
    card_number = '',
    expiry_date = '',
    email,
    hash,
    cvv2 = '',
    read_only,
  } = {}) {
    let options = {
      params: {
        card_number,
        expiry_date,
        hash,
        cvv2,
      },
      read_only,
    }
    if (email) {
      options.params.email = email
    }
    this.setState(options)
  }
  showError(code, message) {
    this.state.error.code = code
    this.state.error.message = message
    this.state.error.show = true
  }
  hideError() {
    this.state.error.show = false
  }
  formLoading(loading) {
    if (this.state.options.disable_request) return

    if (loading) {
      this.hideError()
    }

    this.state.loading = loading
  }
  setParams(params) {
    if (this.state.params.token || this.state.params.order_id) {
      console.warn(
        'You can not change the parameters if there is a token or an order is created'
      )
      return
    }
    validate({ params: params })
      .validate()
      .then(() => {
        deepMerge(this.state.params, params)
      })
      .catch(errorHandler)
  }
  defaultParams() {
    return {
      referrer: document.referrer,
      embedded: !this.state.options.full_screen,
      location: location.href,
    }
  }
  infoParams(data) {
    return this.state.params.token
      ? { ...data, token: this.state.params.token }
      : this.formParams(data)
  }
  formParams(data) {
    // copy params
    let params = JSON.parse(JSON.stringify(this.state.params))

    params.save_card = Boolean(localStorage.get('save_card'))

    params.custom = Object.fromEntries(
      Object.entries(params.custom).map(([name, value]) => {
        let fields = Object.fromEntries(
          this.state.fields_custom.map(({ name, label, placeholder }) => [
            name,
            label || placeholder,
          ])
        )
        return [
          name,
          {
            value,
            label: fields[name] || i18n.t(name),
          },
        ]
      })
    )

    if (this.state.order.need_verify_code) {
      delete params.custom
    }

    if (this.state.subscription.show) {
      params.recurring_data = Object.fromEntries(
        Object.entries(params.recurring_data)
          .filter(([, value]) => value !== 0 && value !== '')
          .map(([name, value]) => [
            name,
            arrayIncludes(['start_time', 'end_time'], name)
              ? formatKiev(value)
              : value,
          ])
      )
    }

    if (params.recurring === 'n') {
      delete params.recurring_data
    }

    delete params.lang

    return Object.assign(params, data, this.defaultParams())
  }
  setToken(token) {
    if (this.state.params.token) return
    if (!this.state.options.amount_readonly) return

    this.state.params.token = token
  }
  readyToSubmit() {
    return !(
      this.state.order.show_success_page || this.enabledClick2payCheckout()
    )
  }
  enabledClick2pay() {
    return (
      !this.state.options.disable_request &&
      this.state.info.click2pay?.init_enabled
    )
  }
  enabledClick2payCheckout() {
    return (
      this.enabledClick2pay() &&
      this.state.order.order_data?.click2pay_save_card
    )
  }
  setClick2payEmail(value) {
    this.state.click2pay.email = value
  }
  setClick2payActionCode(value) {
    this.state.click2pay.actionCode = value
  }
  getTabByMethodId(id) {
    return Object.values(this.state.tabs)
      .flatMap(Object.values)
      .find(method => method.id === id)?.tab
  }
}

export const createStore = name => {
  return (instance[name] = new Store())
}

export const getStore = name => {
  if (instance[name]) return instance[name]

  return createStore(name)
}
