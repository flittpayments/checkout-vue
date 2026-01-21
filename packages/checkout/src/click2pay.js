import { loadScript } from '@/utils/load-script'
import { memoizeSinglePromise } from '@/utils/memoize-single-promise'
import { i18n } from '@/i18n'
import { sessionStorage } from '@/utils/store'
import { validate } from 'vee-validate'
import { captureMessage } from '@/sentry/error-buffer'
import { consoleInfo } from '@/utils/console'
import { mergeDeep } from '@/utils/object'

// Standard Error Codes
// $t('c2p_unknown_error')
// $t('c2p_request_timeout')
// $t('c2p_server_error')
// $t('c2p_invalid_parameter')
// $t('c2p_invalid_request')
// $t('c2p_auth_error')
// $t('c2p_not_found')
// $t('c2p_rate_limit_exceeded')
// $t('c2p_service_error')

let VSDK
let sdkUrl
export let srcDigitalCardId
let identityValue

const clickToPay = 'Click to Pay'
const sdkLoad = 'sdk load'
const initializeText = 'initialize'
const getCardsText = 'getCards'
const checkoutText = 'checkout'
const initiateIdentityValidationText = 'initiateIdentityValidation'
const unbindAppInstanceText = 'unbindAppInstance'

const logMessage = (type, name, response = 'ok') => {
  consoleInfo(clickToPay, type, name, JSON.stringify(response, null, 2))
}

const logPayload = (...args) => logMessage('payload', ...args)

const onMessage = name => response => {
  if (response.actionCode === 'ERROR') {
    return Promise.reject(response)
  }

  logMessage('response', name, response)

  return response
}

const onError = name => response => {
  const reason = response?.error?.reason || 'error'
  const message = `${clickToPay} ${name} ${reason}`

  console.warn(message, JSON.stringify(response, null, 2))
  captureMessage(message, {
    level: 'warning',
    extra: response,
  })
  return Promise.reject(`c2p_${reason.replace(/ /g, '_').toLowerCase()}`)
}

const loadMemoize = memoizeSinglePromise(() =>
  loadScript(sdkUrl).then(onMessage(sdkLoad)).catch(onError(sdkLoad))
)

const initializeMemoize = memoizeSinglePromise(() => {
  VSDK = window.VSDK

  const payload = {
    dpaTransactionOptions: {
      dpaBillingPreference: 'NONE',
    },
  }

  logPayload(initializeText, payload)

  return VSDK.initialize(payload)
    .then(onMessage(initializeText))
    .catch(onError(initializeText))
})

const getCardsMemoize = memoizeSinglePromise(data => {
  const payload = mergeDeep(
    {
      consumerIdentity: {
        identityProvider: 'SRC',
        identityValue,
        identityType: 'EMAIL_ADDRESS',
      },
    },
    data
  )
  logPayload(getCardsText, payload)

  return (
    VSDK.getCards(payload)
      .then(onMessage(getCardsText))
      // $t('c2p_auth_invalid')
      // $t('c2p_acct_inaccessible')
      // $t('c2p_acct_fraud')
      // $t('c2p_consumer_id_missing')
      // $t('c2p_consumer_id_format_unsupported')
      // $t('c2p_consumer_id_format_invalid')
      // $t('c2p_otp_send_failed')
      // $t('c2p_validation_data_missing')
      // $t('c2p_validation_data_expired')
      // $t('c2p_validation_data_invalid')
      // $t('c2p_retries_exceeded')
      .catch(onError(getCardsText))
  )
})

export const checkout = input => {
  input = getCheckoutSettings(input)
  logPayload(checkoutText, input)

  return (
    VSDK.checkout(input)
      .then(onMessage(checkoutText))
      // $t('c2p_auth_invalid')
      // $t('c2p_acct_inaccessible')
      // $t('c2p_card_missing')
      // $t('c2p_unable_to_connect')
      // $t('c2p_card_not_recognized')
      // $t('c2p_card_security_code_missing')
      // $t('c2p_billing_address_required')
      // $t('c2p_card_invalid')
      // $t('c2p_card_exp_invalid')
      // $t('c2p_card_add_failed')
      // $t('c2p_terms_and_conditions_not_accepted')
      // $t('c2p_card_not_recognized')
      // $t('c2p_authentication_method_not_supported')
      // $t('c2p_otp_send_failed')
      // $t('c2p_retries_exceeded')
      // $t('c2p_validation_data_missing')
      // $t('c2p_validation_data_expired')
      // $t('c2p_validation_data_invalid')
      .catch(onError(checkoutText))
  )
}

export const initiateIdentityValidation = () =>
  VSDK.initiateIdentityValidation()
    .then(onMessage(initiateIdentityValidationText))
    // $t('c2p_otp_send_failed')
    // $t('c2p_retries_exceeded')
    // $t('c2p_acct_inaccessible')
    .catch(onError(initiateIdentityValidationText))

export const unbindAppInstance = () =>
  VSDK.unbindAppInstance()
    .then(onMessage(unbindAppInstanceText))
    // $t('c2p_auth_invalid')
    // $t('c2p_acct_inaccessible')
    .catch(onError(unbindAppInstanceText))

export const setIdentityValue = email =>
  validateEmail(email)
    .then(() => (identityValue = email))
    .catch(error => consoleInfo(clickToPay, 'setIdentityValue', error))

export const validateEmail = email =>
  validate(email, 'required|email').then(({ valid }) =>
    valid ? Promise.resolve() : Promise.reject('email is not valid')
  )

export const getCards = () => getCardsMemoize()

export const initialize = () => loadMemoize().then(() => initializeMemoize())

export const initializeGetCards = () =>
  validateEmail(identityValue)
    .then(() => initialize())
    .then(() => getCards())

export const initClick2pay = value => {
  sdkUrl = value
  return initialize()
}

export const allowedCheckout = () =>
  initializeGetCards().then(response =>
    ['ADD_CARD', 'SUCCESS'].includes(response.actionCode)
      ? Promise.resolve(response)
      : Promise.reject('actionCode is not ADD_CARD or SUCCESS')
  )

export const redirect = () =>
  initializeGetCards().then(({ actionCode }) => [
    actionCode,
    getRouterName(actionCode),
  ])

export const setRememberMe = value => sessionStorage.set('rememberMe', value)

export const getRememberMe = () => !!sessionStorage.get('rememberMe')

export const complete = validationData => {
  const cache = getCardsMemoize.get()
  getCardsMemoize.clear()
  return getCardsMemoize({
    validationData,
  })
    .then(response =>
      response.actionCode === 'SUCCESS'
        ? Promise.resolve(response)
        : Promise.reject('actionCode is not SUCCESS')
    )
    .catch(response => {
      getCardsMemoize.set(cache)
      return Promise.reject(response)
    })
}

export const setSrcDigitalCardId = value => (srcDigitalCardId = value)

export const checkoutSelectedCard = data =>
  checkout({
    srcDigitalCardId,
    ...data,
  }).then(({ checkoutResponse }) =>
    checkoutResponse
      ? Promise.resolve({ data: { token: checkoutResponse } })
      : Promise.reject('c2p_no_checkout_response')
  )

export const switchUser = email =>
  validateEmail(email)
    .then(() => getCardsMemoize.clear())
    .then(() =>
      getCardsMemoize({
        consumerIdentity: {
          identityValue: email,
        },
      })
    )
    .then(({ actionCode }) => {
      setIdentityValue(email)

      return [actionCode, getRouterName(actionCode)]
    })

const getRouterName = actionCode =>
  ({
    SUCCESS: 'click2pay',
    PENDING_CONSUMER_IDV: 'click2pay_otp',
    ADD_CARD: 'card',
  })[actionCode]

const getCheckoutSettings = data =>
  mergeDeep(
    {
      dpaTransactionOptions: {
        dpaBillingPreference: 'NONE',
        dpaAcceptedBillingCountries: ['GE'],
        consumerNationalIdentifierRequested: false,
        merchantCountryCode: 'GE',
        paymentOptions: [
          {
            dpaDynamicDataTtlMinutes: 2,
            dynamicDataType: 'CARD_APPLICATION_CRYPTOGRAM_LONG_FORM',
          },
        ],
        dpaLocale: 'en_GE',
        authenticationPreferences: {
          authenticationMethods: [
            {
              authenticationSubject: 'CARDHOLDER',
            },
          ],
          payloadRequested: 'AUTHENTICATED',
        },
      },
      complianceSettings: {
        complianceResources: [
          {
            complianceType: 'TERMS_AND_CONDITIONS',
            uri: i18n.global.t('c2p_terms_url'),
          },
          {
            complianceType: 'PRIVACY_POLICY',
            uri: i18n.global.t('c2p_privacy_notice_url'),
          },
          ...(getRememberMe()
            ? [
                {
                  complianceType: 'REMEMBER_ME',
                  uri: i18n.global.t('c2p_cookie_notice_url'),
                },
              ]
            : []),
        ],
      },
    },
    data
  )
