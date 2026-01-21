import {
  Vue,
  mitt,
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
  mitt(),
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

let instances = {}

class F {
  constructor() {
    this._on = []
    this._emit = []
  }
  $on(...args) {
    if (this.emitter) {
      this.emitter.on(...args)
    } else {
      this._on.push(args)
    }
    return this
  }
  $emit(...args) {
    if (this.emitter) {
      this.emitter.emit(...args)
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
      this.app.unmount()
    }
    return this
  }
  $nextTick(...args) {
    if (this.app) {
      this.nextTick(...args)
    }
    return this
  }
  get $el() {
    return this.node
  }
  get store() {
    return this.app?.store
  }
  run(app, emitter, nextTick, node) {
    this.app = app
    this.emitter = emitter
    this.nextTick = nextTick
    this.node = node
    this._on.forEach(args => {
      this.emitter.on(...args)
    })
    this._emit.forEach(args => {
      this.emitter.emit(...args)
    })
  }
}

consoleInfo('commithash', COMMITHASH)
consoleInfo('initiator', INITIATOR)

export const checkout = (window.checkout = function (el, optionsUser) {
  let appWrapper = new F()

  load
    .then(
      ([
        { createApp, h, nextTick, configureCompat },
        mitt,
        App,
        { install: installValidate },
        { install: installSentry },
        { install: installPlugins },
        { install: installApi },
        { install: installStore, createStore },
        { create: createRouter },
        { i18n },
        { configDefault },
      ]) => {
        configureCompat({
          MODE: 3,
        })

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
        const emitter = mitt()

        if (isString || isElement) {
          if (isString) {
            id = el
            node = document.querySelector(el)

            if (!node)
              return console.error(['Selector', el, 'not found'].join(' '))

            if (instances[id]) instances[id].unmount()
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

        let store = createStore()
        let router = createRouter(store)

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

        const app = (instances[id] = createApp({
          emits: ['submit', 'location', 'setParams'],
          unmounted() {
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
          render() {
            return h(App, {
              optionsUser,
            })
          },
        }))

        app.use(router)
        app.use(i18n)
        app.use(installValidate)
        app.use(installSentry(optionsUser, router))
        app.use(installPlugins(emitter))
        app.use(installStore, store)

        app.mount(node)

        appWrapper.run(app, emitter, nextTick, node)
      }
    )
    .catch(() => sentry().then(({ installMin }) => installMin(optionsUser)))

  return appWrapper
})
