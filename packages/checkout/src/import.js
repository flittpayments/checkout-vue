import { defineAsyncComponent } from 'vue'

const langs = import.meta.glob('@/i18n/lang/*.js')

export const loadLang = lang => langs[`/src/i18n/lang/${lang}.js`]()

export const Vue = () => import('vue')

export const mitt = () => import('mitt').then(module => module.default)

export const App = () => import('@/app').then(module => module.default)

export const validate = () => import('@/validate')

export const api = () => import('@/api')

export const i18n = () => import('@/i18n')

export const router = () => import('@/router')

export const store = () => import('@/store')

export const configDefault = () => import('@/config/config-default')

export const plugins = () => import('@/plugins')

export const loadCheckout = () =>
  import('@flittpayments/js-sdk').then(module => module.default)

export const loadCssVars = () =>
  import('css-vars-ponyfill').then(module => module.default)

export const sentry = () =>
  Promise.resolve().then(() =>
    SENTRY_DSN
      ? DOMAIN === location.hostname
        ? import('@/sentry')
        : import('@/sentry/index-simple')
      : import('@/sentry/index-mock')
  )

export const loadAsyncValidator = () =>
  import('async-validator').then(module => module.default)

export const loadAxios = () => import('axios').then(module => module.default)

export const FIconBin = defineAsyncComponent(
  () => import('@/components/icon-bin')
)

export const FAlertGdpr = defineAsyncComponent(
  () => import('@/components/alert/alert-gdpr')
)

export const FCreditCardPlain = defineAsyncComponent(
  () => import('@/views/checkout/method/card/credit-card-plain')
)

export const Card = () => import('@/views/checkout/method/card')

export const CardFields = () => import('@/views/checkout/method/card/fields')

export const CardWrapper = () => import('@/views/checkout/method/card/wrapper')

export const Banks = () => import('@/views/checkout/method/banks')

export const Local_methods = () =>
  import('@/views/checkout/method/local_methods')

export const Sepa = () => import('@/views/checkout/method/sepa')

export const Receipt = () => import('@/views/checkout/method/receipt')

export const Wallets = () => import('@/views/checkout/method/wallets')

export const Loans = () => import('@/views/checkout/method/loans')

export const loadStyleAdaptive = () => import('@/scss/style-adaptive.scss')

export const Success = () => import('@/views/checkout/without-sidebar/success')

export const FSecureMessageIcons = defineAsyncComponent(
  () => import('@/components/secure-message-icons')
)

export const Error = () => import('@/views/error')

export const ErrorModal = () => import('@/views/error_modal')

export const System = () => import('@/views/checkout/method/system')

export const FSubscription = defineAsyncComponent(
  () => import('@/components/subscription')
)

export const CardVerify = () => import('@/views/checkout/method/card/verify')

export const InputText = defineAsyncComponent(
  () => import('@/components/input-text')
)

export const InputHidden = defineAsyncComponent(
  () => import('@/components/input-hidden')
)

export const InputAmount = defineAsyncComponent(
  () => import('@/components/input-amount')
)

export const WithoutSidebar = () => import('@/views/checkout/without-sidebar')

export const Menu = () => import('@/views/checkout/without-sidebar/menu')

export const FModalError = defineAsyncComponent(
  () => import('@/components/modal/modal-error')
)

export const FLogo = defineAsyncComponent(() => import('@/views/logo'))

export const BlankWallets = () => import('@/views/checkout/blank/wallets')

export const FCardListWrapper = defineAsyncComponent(
  () => import('@/components/card-list-wrapper')
)

export const Emoney = () => import('@/views/checkout/method/emoney')

export const FAlertNotification = defineAsyncComponent(
  () => import('@/components/alert/alert-notification')
)

export const FSidebarInner = defineAsyncComponent(
  () => import('@/components/sidebar-inner')
)

export const Crypto = () => import('@/views/checkout/method/crypto')

export const MostPopular = () => import('@/views/checkout/method/most_popular')

export const FCountry = defineAsyncComponent(
  () => import('@/components/country')
)

export const countriesSearch = () => import('@/config/countries-search')

export const FLoading = defineAsyncComponent(
  () => import('@/components/loading')
)

export const FModal = defineAsyncComponent(
  () => import('@/components/modal/modal')
)

export const FModal3ds = defineAsyncComponent(
  () => import('@/components/modal/modal-3ds')
)

export const Installments = () => import('@/views/checkout/method/installments')

export const FMode = defineAsyncComponent(() => import('@/components/mode'))

export const FButtonCancel = defineAsyncComponent(
  () => import('@/components/button/button-cancel')
)

export const FPromo = defineAsyncComponent(() => import('@/components/promo'))

export const countriesCallingCodes = defineAsyncComponent(
  () => import('@/config/countries-calling-codes')
)

export const FButtonReturnToSite = defineAsyncComponent(
  () => import('@/views/checkout/without-sidebar/button-return-to-site')
)

export const FLinkDownloadReceipt = defineAsyncComponent(
  () => import('@/views/checkout/without-sidebar/link-download-receipt')
)

export const loadClick2pay = () => import('@/click2pay')

export const Click2payCheckout = defineAsyncComponent(
  () => import('@/views/click2pay/checkout')
)

export const Click2payOtp = () => import('@/views/click2pay/otp')

export const Click2payUserExists = () => import('@/views/click2pay/user-exists')

export const Click2payUserExistsHeader = defineAsyncComponent(
  () => import('@/views/click2pay/user-exists-header')
)

export const Click2paySwitchId = () => import('@/views/click2pay/switch-id')

export const Click2payChangeEmail = defineAsyncComponent(
  () => import('@/views/click2pay/change-email')
)

export const FSecureMessage = defineAsyncComponent(
  () => import('@/components/secure-message')
)

export const FProcessed = defineAsyncComponent(
  () => import('@/components/processed')
)

export const MethodInfo = () => import('@/views/checkout/method/system/info')

export const MethodQrCode = () =>
  import('@/views/checkout/method/system/qr-code')

export const MethodDeepLink = () =>
  import('@/views/checkout/method/system/deep-link')

export const Loading = () => import('@/views/checkout/without-sidebar/loading')

export const FQuickAccess = defineAsyncComponent(
  () => import('@/components/quick-access')
)

export const FCreditCardInline = defineAsyncComponent(
  () => import('@/views/checkout/method/card/credit-card-inline')
)

export const FFee = defineAsyncComponent(() => import('@/components/base/fee'))

export const MethodClientFee = () =>
  import('@/views/checkout/method/system/client-fee')

export const RowFloating = defineAsyncComponent(
  () => import('@/components/input/helpers/row-floating')
)

export const RowNoFloating = defineAsyncComponent(
  () => import('@/components/input/helpers/row-no-floating')
)

export const FDate = defineAsyncComponent(
  () => import('@/components/input/item/date')
)

export const FSelect = defineAsyncComponent(
  () => import('@/components/input/item/select')
)

export const FInput = defineAsyncComponent(
  () => import('@/components/input/item/input')
)
