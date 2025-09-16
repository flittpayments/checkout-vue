import {
  Vue,
  App,
  validate,
  sentry,
  plugins,
  api,
  store,
  router,
  i18n,
  configDefault,
  loadCheckout,
  loadAsyncValidator,
} from '@/import'
import { initError, stopErrorChunk } from '@/sentry/error-capture'
import { consoleInfo } from '@/utils/console'

initError()
loadCheckout()
loadAsyncValidator()

const load = Promise.all([
  Vue(),
  App(),
  validate(),
  sentry(),
  plugins(),
  api(),
  store(),
  router(),
  i18n(),
  configDefault(),
])

let instance = {}

class F {
  constructor() {
    this._on = []
    this._emit = []
  }
  $on(...args) {
    if (this.app) {
      this.app.$on.apply(this.app, args)
    } else {
      this._on.push(args)
    }
    return this
  }
  $emit(...args) {
    if (this.app) {
      this.app.$emit.apply(this.app, args)
    } else {
      this._emit.push(args)
    }
    return this
  }
  submit(...args) {
    this.$emit('submit', ...args)
    return this
  }
  location(...args) {
    this.$emit('location', ...args)
    return this
  }
  setParams(...args) {
    this.$emit('setParams', ...args)
    return this
  }
  $destroy() {
    if (this.app) {
      this.app.$destroy()
    }
    return this
  }
  $nextTick(...args) {
    if (this.app) {
      this.app.$nextTick.apply(this.app, args)
    }
    return this
  }
  get $el() {
    return this.app?.$el
  }
  get store() {
    return this.app?.store
  }
  run(app) {
    this.app = app
    this._on.forEach(args => {
      this.app.$on.apply(this.app, args)
    })
    this._emit.forEach(args => {
      this.app.$emit.apply(this.app, args)
    })
  }
}

consoleInfo('commithash', COMMITHASH)
consoleInfo('initiator', INITIATOR)

export const checkout = (window.checkout = function (el, optionsUser) {
  let app = new F()

  load
    .then(
      ([
        Vue,
        App,
        { install: installValidate },
        { install: installSentry },
        { install: installPlugins },
        { install: installApi },
        { createStore },
        { createRouter },
        { i18n },
        { configDefault },
      ]) => {
        let id
        let node
        const isString = typeof el === 'string'
        const isElement = el && el.nodeType === Node.ELEMENT_NODE
        const makeID = () => {
          const chars =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
          const getRandomChar = () =>
            chars[Math.floor(Math.random() * chars.length)]
          return 'id-' + Array.from({ length: 12 }, getRandomChar).join('')
        }

        if (isString || isElement) {
          if (isString) {
            id = el
            node = document.querySelector(el)

            if (!node)
              return console.error(['Selector', el, 'not found'].join(' '))

            if (instance[id]) instance[id].$destroy()
          }
          if (isElement) {
            id = makeID()
            node = el
          }
        } else {
          return console.error('Selector not a string or element')
        }

        if (Object.prototype.toString.call(optionsUser) !== '[object Object]')
          return console.error('Options not an object')

        let store = createStore(id)
        let router = createRouter(id)

        Vue.use(installValidate)
        Vue.use(installSentry(optionsUser, router))
        Vue.use(installPlugins)

        let origin =
          'https://' +
          (optionsUser.options?.api_domain ||
            optionsUser.options?.apiDomain ||
            optionsUser.button?.host ||
            configDefault.options.api_domain)
        let endpoint =
          optionsUser.options?.endpoint || configDefault.options.endpoint
        installApi(
          {
            version: X_PAYMENT_GATEWAY,
            origin,
            endpoint,
          },
          () => {
            store.formLoading(false)
          }
        )

        instance[id] = new Vue({
          store,
          router,
          i18n,
          data: {
            optionsUser,
          },
          destroyed() {
            stopErrorChunk()
          },
          methods: {
            submit() {
              this.$emit('submit')
            },
            location(args) {
              this.$emit('location', ...args)
            },
            setParams(args) {
              this.$emit('setParams', ...args)
            },
          },
          render(h) {
            return h(App, {
              props: {
                optionsUser,
              },
            })
          },
        }).$mount()

        while (node.firstChild) {
          node.removeChild(node.firstChild)
        }
        node.appendChild(instance[id].$el)

        app.run(instance[id])

        return instance[id]
      }
    )
    .catch(() => sentry().then(({ installMin }) => installMin(optionsUser)))

  return app
})
