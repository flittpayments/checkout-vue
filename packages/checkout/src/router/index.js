import { createRouter, createMemoryHistory } from 'vue-router'

import Method from '@/views/checkout/method'
import Checkout from '@/views/checkout'
import Blank from '@/views/checkout/blank'
import ButtonPay from '@/components/button/button-pay'
import Click2payButtonPay from '@/views/click2pay/button-pay'
import {
  Card,
  CardFields,
  CardWrapper,
  Click2payUserExists,
  CardVerify,
  Click2payOtp,
  Banks,
  Local_methods,
  Crypto,
  Sepa,
  Receipt,
  Wallets,
  Loans,
  Emoney,
  Success,
  Error,
  ErrorModal,
  System,
  MethodInfo,
  MethodQrCode,
  MethodDeepLink,
  WithoutSidebar,
  Menu,
  Loading,
  BlankWallets,
  MostPopular,
  Installments,
  Click2paySwitchId,
} from '@/import'

const card = 'card'
const click2pay = 'click2pay'
const verify = 'verify'
const click2pay_otp = 'click2pay_otp'
const click2pay_switch_id = 'click2pay_switch_id'
const banks = 'banks'
const local_methods = 'local_methods'
const crypto = 'crypto'
const sepa = 'sepa'
const receipt = 'receipt'
const wallets = 'wallets'
const loans = 'loans'
const installments = 'installments'
const emoney = 'emoney'
const most_popular = 'most_popular'
const success = 'success'
const error = 'error'
const error_modal = 'error_modal'
const checkout = 'checkout'
const menu = 'menu'

export const create = store => {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      {
        path: '/',
        redirect: { name: checkout },
      },
      {
        path: `/${checkout}`,
        name: checkout,
        component: Checkout,
        children: [
          {
            path: 'method',
            component: Method,
            children: [
              {
                path: card,
                component: Card,
                children: [
                  {
                    path: '',
                    component: CardFields,
                    children: [
                      {
                        path: '',
                        name: card,
                        components: {
                          default: CardWrapper,
                          'button-pay': ButtonPay,
                        },
                        beforeEnter: () => {
                          if (store.state.order.need_verify_code) {
                            return { name: verify }
                          }
                        },
                        meta: {
                          method: card,
                        },
                      },
                      {
                        path: click2pay,
                        name: click2pay,
                        components: {
                          default: Click2payUserExists,
                          'button-pay': Click2payButtonPay,
                        },
                        meta: {
                          method: card,
                        },
                      },
                    ],
                  },
                  {
                    path: verify,
                    name: verify,
                    component: CardVerify,
                    meta: {
                      method: card,
                    },
                  },
                  {
                    path: click2pay_otp,
                    name: click2pay_otp,
                    component: Click2payOtp,
                    meta: {
                      method: card,
                    },
                  },
                  {
                    path: click2pay_switch_id,
                    name: click2pay_switch_id,
                    component: Click2paySwitchId,
                    meta: {
                      method: card,
                    },
                  },
                ],
              },
              {
                path: banks,
                name: banks,
                component: Banks,
                meta: {
                  method: banks,
                },
              },
              {
                path: local_methods,
                name: local_methods,
                component: Local_methods,
                meta: {
                  method: local_methods,
                },
              },
              {
                path: crypto,
                name: crypto,
                component: Crypto,
                meta: {
                  method: crypto,
                },
              },
              {
                path: sepa,
                name: sepa,
                component: Sepa,
                meta: {
                  method: sepa,
                },
              },
              {
                path: receipt,
                name: receipt,
                component: Receipt,
                meta: {
                  method: receipt,
                },
              },
              {
                path: wallets,
                name: wallets,
                component: Wallets,
                meta: {
                  method: wallets,
                },
              },
              {
                path: loans,
                name: loans,
                component: Loans,
                meta: {
                  method: loans,
                },
              },
              {
                path: installments,
                name: installments,
                component: Installments,
                meta: {
                  method: installments,
                },
              },
              {
                path: emoney,
                name: emoney,
                component: Emoney,
                meta: {
                  method: emoney,
                },
              },
              {
                path: most_popular,
                name: most_popular,
                component: MostPopular,
                meta: {
                  method: most_popular,
                },
              },
              {
                path: ':method/:system',
                component: System,
                props: true,
                children: [
                  {
                    path: 'info',
                    name: 'system',
                    component: MethodInfo,
                    meta: route => ({
                      method: route.params.method,
                    }),
                    props: true,
                  },
                  {
                    path: 'qr-code',
                    name: 'qr-code',
                    component: MethodQrCode,
                    meta: route => ({
                      method: route.params.method,
                      noFeeCalc: true,
                    }),
                    props: ({ params, query }) => ({ ...params, ...query }),
                  },
                  {
                    path: 'deep-link',
                    name: 'deep-link',
                    component: MethodDeepLink,
                    meta: route => ({
                      method: route.params.method,
                      noFeeCalc: true,
                    }),
                    props: ({ params, query }) => ({ ...params, ...query }),
                  },
                ],
              },
            ],
          },
          {
            path: 'without-sidebar',
            component: WithoutSidebar,
            children: [
              {
                path: success,
                name: success,
                component: Success,
              },
              {
                path: menu,
                name: menu,
                component: Menu,
              },
              {
                name: 'loading',
                path: 'loading',
                component: Loading,
                props: true,
                meta: {
                  noLoading: true,
                  noShadow: true,
                  isCentered: true,
                  method: installments,
                },
              },
            ],
          },
          {
            path: 'blank',
            component: Blank,
            children: [
              {
                path: 'wallets',
                name: 'blank-wallets',
                component: BlankWallets,
              },
            ],
          },
        ],
      },
      {
        path: `/${error}`,
        name: error,
        component: Error,
      },
      {
        path: `/${error_modal}`,
        name: error_modal,
        component: ErrorModal,
      },
    ],
  })

  router.afterEach(({ name, params }) => {
    store.state.params.payment_system = params.system || name
  })

  return router
}
