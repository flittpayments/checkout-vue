import { defineAsyncComponent } from 'vue'

export const loadLang = chunk => {
  switch (chunk) {
    case 'az':
      return import(
        /* webpackChunkName: "az" */
        '@/i18n/lang/az'
      )
    case 'cs':
      return import(
        /* webpackChunkName: "cs" */
        '@/i18n/lang/cs'
      )
    case 'da':
      return import(
        /* webpackChunkName: "da" */
        '@/i18n/lang/da'
      )
    case 'de':
      return import(
        /* webpackChunkName: "de" */
        '@/i18n/lang/de'
      )
    case 'en':
      return import(/* webpackChunkName: "en" */ '@/i18n/lang/en')
    case 'es':
      return import(
        /* webpackChunkName: "es" */
        '@/i18n/lang/es'
      )
    case 'fi':
      return import(
        /* webpackChunkName: "fi" */
        '@/i18n/lang/fi'
      )
    case 'fr':
      return import(
        /* webpackChunkName: "fr" */
        '@/i18n/lang/fr'
      )
    case 'hu':
      return import(
        /* webpackChunkName: "hu" */
        '@/i18n/lang/hu'
      )
    case 'it':
      return import(
        /* webpackChunkName: "it" */
        '@/i18n/lang/it'
      )
    case 'ka':
      return import(
        /* webpackChunkName: "ka" */
        '@/i18n/lang/ka'
      )
    case 'ko':
      return import(
        /* webpackChunkName: "ko" */
        '@/i18n/lang/ko'
      )
    case 'lv':
      return import(
        /* webpackChunkName: "lv" */
        '@/i18n/lang/lv'
      )
    case 'nl':
      return import(
        /* webpackChunkName: "nl" */
        '@/i18n/lang/nl'
      )
    case 'pl':
      return import(
        /* webpackChunkName: "pl" */
        '@/i18n/lang/pl'
      )
    case 'ro':
      return import(
        /* webpackChunkName: "ro" */
        '@/i18n/lang/ro'
      )
    case 'ru':
      return import(
        /* webpackChunkName: "ru" */
        '@/i18n/lang/ru'
      )
    case 'sk':
      return import(
        /* webpackChunkName: "sk" */
        '@/i18n/lang/sk'
      )
    case 'uk':
      return import(
        /* webpackChunkName: "uk" */
        '@/i18n/lang/uk'
      )
    case 'uz':
      return import(
        /* webpackChunkName: "uz" */
        '@/i18n/lang/uz'
      )
    case 'zh':
      return import(
        /* webpackChunkName: "zh" */
        '@/i18n/lang/zh'
      )
  }
}

export const Vue = () => import(/* webpackChunkName: "00" */ 'vue')

export const mitt = () =>
  import(/* webpackChunkName: "000" */ 'mitt').then(module => module.default)

export const App = () =>
  import(/* webpackChunkName: "01" */ '@/app').then(module => module.default)

export const validate = () => import(/* webpackChunkName: "02" */ '@/validate')

export const api = () => import(/* webpackChunkName: "04" */ '@/api')

export const i18n = () => import(/* webpackChunkName: "05" */ '@/i18n')

export const router = () => import(/* webpackChunkName: "06" */ '@/router')

export const store = () => import(/* webpackChunkName: "07" */ '@/store')

export const configDefault = () =>
  import(/* webpackChunkName: "08" */ '@/config/config-default')

export const plugins = () => import(/* webpackChunkName: "09" */ '@/plugins')

export const loadCheckout = () =>
  import(/* webpackChunkName: "1" */ '@flittpayments/js-sdk').then(
    module => module.default
  )

export const loadCssVars = () =>
  import(/* webpackChunkName: "2" */ 'css-vars-ponyfill').then(
    module => module.default
  )

export const sentry = () =>
  Promise.resolve().then(() =>
    SENTRY_DSN
      ? DOMAIN === location.hostname
        ? import(/* webpackChunkName: "3" */ '@/sentry')
        : import(/* webpackChunkName: "4" */ '@/sentry/index-simple')
      : import(/* webpackChunkName: "67" */ '@/sentry/index-mock')
  )

export const loadAsyncValidator = () =>
  import(/* webpackChunkName: "5" */ 'async-validator').then(
    module => module.default
  )

export const loadAxios = () =>
  import(/* webpackChunkName: "6" */ 'axios').then(module => module.default)

export const DatePicker = defineAsyncComponent(
  () =>
    import(/* webpackChunkName: "7" */ '@/components/input/helpers/date-picker')
)

export const FIconBin = defineAsyncComponent(
  () => import(/* webpackChunkName: "8" */ '@/components/icon-bin')
)

export const FAlertGdpr = defineAsyncComponent(
  () => import(/* webpackChunkName: "9" */ '@/components/alert/alert-gdpr')
)

export const FCreditCardPlain = defineAsyncComponent(
  () =>
    import(
      /* webpackChunkName: "10" */ '@/views/checkout/method/card/credit-card-plain'
    )
)

export const Card = () =>
  import(/* webpackChunkName: "11" */ '@/views/checkout/method/card')

export const CardFields = () =>
  import(/* webpackChunkName: "11" */ '@/views/checkout/method/card/fields')

export const CardWrapper = () =>
  import(/* webpackChunkName: "11" */ '@/views/checkout/method/card/wrapper')

export const Banks = () =>
  import(/* webpackChunkName: "12" */ '@/views/checkout/method/banks')

export const Local_methods = () =>
  import(/* webpackChunkName: "13" */ '@/views/checkout/method/local_methods')

export const Sepa = () =>
  import(/* webpackChunkName: "14" */ '@/views/checkout/method/sepa')

export const Receipt = () =>
  import(/* webpackChunkName: "15" */ '@/views/checkout/method/receipt')

export const Wallets = () =>
  import(/* webpackChunkName: "16" */ '@/views/checkout/method/wallets')

export const Loans = () =>
  import(/* webpackChunkName: "17" */ '@/views/checkout/method/loans')

export const loadStyleAdaptive = () =>
  import(
    /* webpackChunkName: "18" */
    '@/scss/style-adaptive.scss'
  )

export const Success = () =>
  import(
    /* webpackChunkName: "19" */ '@/views/checkout/without-sidebar/success'
  )

export const FSecureMessageIcons = defineAsyncComponent(
  () => import(/* webpackChunkName: "20" */ '@/components/secure-message-icons')
)

export const Error = () => import(/* webpackChunkName: "21" */ '@/views/error')

export const ErrorModal = () =>
  import(/* webpackChunkName: "22" */ '@/views/error_modal')

export const System = () =>
  import(/* webpackChunkName: "23" */ '@/views/checkout/method/system')

export const FSubscription = defineAsyncComponent(
  () => import(/* webpackChunkName: "24" */ '@/components/subscription')
)

export const CardVerify = () =>
  import(/* webpackChunkName: "25" */ '@/views/checkout/method/card/verify')

export const InputText = defineAsyncComponent(
  () => import(/* webpackChunkName: "26" */ '@/components/input-text')
)

export const InputHidden = defineAsyncComponent(
  () => import(/* webpackChunkName: "26" */ '@/components/input-hidden')
)

export const InputAmount = defineAsyncComponent(
  () => import(/* webpackChunkName: "26" */ '@/components/input-amount')
)

export const WithoutSidebar = () =>
  import(/* webpackChunkName: "27" */ '@/views/checkout/without-sidebar')

export const Menu = () =>
  import(/* webpackChunkName: "28" */ '@/views/checkout/without-sidebar/menu')

export const FModalError = defineAsyncComponent(
  () => import(/* webpackChunkName: "29" */ '@/components/modal/modal-error')
)

export const FLogo = defineAsyncComponent(
  () => import(/* webpackChunkName: "30" */ '@/views/logo')
)

export const BlankWallets = () =>
  import(/* webpackChunkName: "31" */ '@/views/checkout/blank/wallets')

export const FCardListWrapper = defineAsyncComponent(
  () => import(/* webpackChunkName: "32" */ '@/components/card-list-wrapper')
)

export const Emoney = () =>
  import(/* webpackChunkName: "34" */ '@/views/checkout/method/emoney')

export const FAlertNotification = defineAsyncComponent(
  () =>
    import(/* webpackChunkName: "35" */ '@/components/alert/alert-notification')
)

export const FSidebarInner = defineAsyncComponent(
  () => import(/* webpackChunkName: "36" */ '@/components/sidebar-inner')
)

export const Crypto = () =>
  import(/* webpackChunkName: "37" */ '@/views/checkout/method/crypto')

export const MostPopular = () =>
  import(/* webpackChunkName: "38" */ '@/views/checkout/method/most_popular')

export const FCountry = defineAsyncComponent(
  () => import(/* webpackChunkName: "39" */ '@/components/country')
)

export const countriesSearch = () =>
  import(/* webpackChunkName: "40" */ '@/config/countries-search')

export const FLoading = defineAsyncComponent(
  () => import(/* webpackChunkName: "42" */ '@/components/loading')
)

export const FModal = defineAsyncComponent(
  () => import(/* webpackChunkName: "43" */ '@/components/modal/modal')
)

export const FModal3ds = defineAsyncComponent(
  () => import(/* webpackChunkName: "44" */ '@/components/modal/modal-3ds')
)

export const Installments = () =>
  import(/* webpackChunkName: "46" */ '@/views/checkout/method/installments')

export const FMode = defineAsyncComponent(
  () => import(/* webpackChunkName: "48" */ '@/components/mode')
)

export const FButtonCancel = defineAsyncComponent(
  () => import(/* webpackChunkName: "49" */ '@/components/button/button-cancel')
)

export const FPromo = defineAsyncComponent(
  () => import(/* webpackChunkName: "50" */ '@/components/promo')
)

export const countriesCallingCodes = defineAsyncComponent(
  () => import(/* webpackChunkName: "51" */ '@/config/countries-calling-codes')
)

export const FButtonReturnToSite = defineAsyncComponent(
  () =>
    import(
      /* webpackChunkName: "52" */ '@/views/checkout/without-sidebar/button-return-to-site'
    )
)

export const FLinkDownloadReceipt = defineAsyncComponent(
  () =>
    import(
      /* webpackChunkName: "52_" */ '@/views/checkout/without-sidebar/link-download-receipt'
    )
)

export const loadClick2pay = () =>
  import(/* webpackChunkName: "54" */ '@/click2pay')

export const Click2payCheckout = defineAsyncComponent(
  () => import(/* webpackChunkName: "55" */ '@/views/click2pay/checkout')
)

export const Click2payOtp = () =>
  import(/* webpackChunkName: "57" */ '@/views/click2pay/otp')

export const Click2payUserExists = () =>
  import(/* webpackChunkName: "58" */ '@/views/click2pay/user-exists')

export const Click2payUserExistsHeader = defineAsyncComponent(
  () =>
    import(/* webpackChunkName: "59" */ '@/views/click2pay/user-exists-header')
)

export const Click2paySwitchId = () =>
  import(/* webpackChunkName: "62" */ '@/views/click2pay/switch-id')

export const Click2payChangeEmail = defineAsyncComponent(
  () => import(/* webpackChunkName: "63" */ '@/views/click2pay/change-email')
)

export const FSecureMessage = defineAsyncComponent(
  () => import(/* webpackChunkName: "65" */ '@/components/secure-message')
)

export const FProcessed = defineAsyncComponent(
  () => import(/* webpackChunkName: "66" */ '@/components/processed')
)

export const MethodInfo = () =>
  import(/* webpackChunkName: "68" */ '@/views/checkout/method/system/info')

export const MethodQrCode = () =>
  import(/* webpackChunkName: "69" */ '@/views/checkout/method/system/qr-code')

export const MethodDeepLink = () =>
  import(
    /* webpackChunkName: "70" */ '@/views/checkout/method/system/deep-link'
  )

export const Loading = () =>
  import(
    /* webpackChunkName: "71" */ '@/views/checkout/without-sidebar/loading'
  )

export const FQuickAccess = defineAsyncComponent(
  () => import(/* webpackChunkName: "72" */ '@/components/quick-access')
)

export const FCreditCardInline = defineAsyncComponent(
  () =>
    import(
      /* webpackChunkName: "73" */ '@/views/checkout/method/card/credit-card-inline'
    )
)

export const RowFloating = defineAsyncComponent(
  () =>
    import(
      /* webpackChunkName: "69" */ '@/components/input/helpers/row-floating'
    )
)

export const RowNoFloating = defineAsyncComponent(
  () =>
    import(
      /* webpackChunkName: "70" */ '@/components/input/helpers/row-no-floating'
    )
)

export const FDate = defineAsyncComponent(
  () => import(/* webpackChunkName: "71" */ '@/components/input/item/date')
)

export const FSelect = defineAsyncComponent(
  () => import(/* webpackChunkName: "72" */ '@/components/input/item/select')
)

export const FInput = defineAsyncComponent(
  () => import(/* webpackChunkName: "72" */ '@/components/input/item/input')
)
