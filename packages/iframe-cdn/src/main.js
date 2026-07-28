;(function () {
  const defaultIframeOptions = {
    fullscreen_payment_flow: true,
  }

  const defaultOptions = {
    full_screen: false,
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
  }

  let iframeOptions = {}

  let app = null
  const appEl = document.getElementById('app')

  function iframeReady() {
    parent.postMessage({ type: 'iframe:ready' }, '*')
  }

  let heightRaf = null

  function scheduleSendHeight() {
    if (heightRaf) return

    heightRaf = requestAnimationFrame(() => {
      heightRaf = null

      parent.postMessage(
        {
          type: 'iframe:resize',
          height: appEl.offsetHeight + 'px',
        },
        '*'
      )
    })
  }

  function subscribeToEvent(event) {
    app.$on(event, function (payload) {
      parent.postMessage(
        {
          type: 'checkout:on',
          event,
          payload:
            payload && typeof payload.serialize === 'function'
              ? payload.serialize()
              : payload,
        },
        '*'
      )
      scheduleSendHeight()
    })
  }

  function iframeExpanded() {
    if (!iframeOptions.fullscreen_payment_flow) return

    appEl.style.display = 'none'

    parent.postMessage({ type: 'iframe:expanded' }, '*')
  }

  function iframeCollapsed() {
    if (!iframeOptions.fullscreen_payment_flow) return

    appEl.style.display = ''

    parent.postMessage(
      {
        type: 'iframe:collapsed',
        height: appEl.offsetHeight + 'px',
      },
      '*'
    )
  }

  function onMessage(e) {
    if (!e.data) return
    if (typeof e.data !== 'object') return

    const { type, event, config, args } = e.data

    if (type === 'checkout:init') {
      if (app) return

      iframeOptions = Object.assign({}, defaultIframeOptions, config.options)
      config.options = Object.assign({}, defaultOptions, config.options || {})

      Object.keys(defaultIframeOptions).forEach(key => {
        delete config.options[key]
      })

      app = checkout('#app', config)

      const events = ['success', 'error', 'ready', 'show-pay']

      events.forEach(subscribeToEvent)

      ;['payment-request-opened', 'payment-request-closed'].forEach(event => {
        app.$on(event, function (payload) {
          const isApplePayModalOpened =
            payload === 'apple' && !!document.querySelector('apple-pay-modal')

          if (event === 'payment-request-opened' && isApplePayModalOpened) {
            iframeExpanded()
            return
          }
          if (event === 'payment-request-closed') {
            iframeCollapsed()
            return
          }
        })
      })

      scheduleSendHeight()
    }

    if (type === 'checkout:subscribe') {
      if (event === 'callback') {
        subscribeToEvent('callback')
      }
    }

    if (type === 'checkout:emit') {
      app.$emit.apply(app, [event, ...args])
      scheduleSendHeight()
    }

    if (type === 'checkout:destroy') {
      app.$destroy()
      if (heightRaf) {
        cancelAnimationFrame(heightRaf)
        heightRaf = null
      }
      heightObserver.disconnect()
      observer3ds.disconnect()
      window.removeEventListener('message', onMessage)
      window.removeEventListener('load', scheduleSendHeight)
      window.removeEventListener('resize', scheduleSendHeight)
    }
  }

  function init3dsObserver() {
    let isExpanded = false

    const check = () => {
      const modal = document.querySelector('.flitt-modal-wrapper')

      if (modal && !isExpanded) {
        isExpanded = true
        iframeExpanded()
      }

      if (!modal && isExpanded) {
        isExpanded = false
        iframeCollapsed()
      }
    }

    const observer = new MutationObserver(check)

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })

    check()

    return observer
  }

  function initHeightObserver() {
    const observer = new MutationObserver(scheduleSendHeight)

    observer.observe(appEl, {
      childList: true,
      subtree: true,
      attributes: true,
    })

    return observer
  }

  window.addEventListener('message', onMessage)

  iframeReady()

  const observer3ds = init3dsObserver()
  const heightObserver = initHeightObserver()

  window.addEventListener('load', scheduleSendHeight)
  window.addEventListener('resize', scheduleSendHeight)
})()
