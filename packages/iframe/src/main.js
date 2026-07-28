export const checkout = function (containerSelector, config = {}) {
  const container =
    typeof containerSelector === 'string'
      ? document.querySelector(containerSelector)
      : containerSelector

  if (!container) {
    throw new Error(`Container ${containerSelector} not found`)
  }

  const iframe = document.createElement('iframe')
  iframe.sandbox = 'allow-scripts allow-same-origin allow-forms allow-popups'
  iframe.setAttribute('allow', 'payment')
  Object.assign(iframe.style, {
    display: 'block',
    border: '0',
    width: '100%',
  })
  iframe.setAttribute('scrolling', 'no')

  const url = '{{IFRAME_URL}}'
  iframe.src = url

  const targetOrigin = new URL(url).origin

  container.appendChild(iframe)

  const listenersMap = new Map()
  let isReady = false
  let isIframeExpanded = false

  function onMessage(e) {
    if (e.source !== iframe.contentWindow) return
    if (e.origin !== targetOrigin) return
    if (!e.data) return
    if (typeof e.data !== 'object') return

    const { type, event, payload, height } = e.data

    if (type === 'iframe:ready') {
      isReady = true
      iframe.contentWindow?.postMessage(
        {
          type: 'checkout:init',
          config,
        },
        targetOrigin
      )

      if (listenersMap.has('callback')) {
        iframe.contentWindow?.postMessage(
          {
            type: 'checkout:subscribe',
            event: 'callback',
          },
          targetOrigin
        )
      }
      return
    }

    if (type === 'iframe:expanded') {
      isIframeExpanded = true
      container.style.minHeight = iframe.offsetHeight + 'px'
      Object.assign(iframe.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        zIndex: '9999999',
      })
    }

    if (type === 'iframe:collapsed') {
      isIframeExpanded = false
      container.style.minHeight = ''
      Object.assign(iframe.style, {
        position: '',
        top: '',
        left: '',
        width: '100%',
        height,
        zIndex: '',
      })
    }

    if (type === 'checkout:on') {
      const listeners = listenersMap.get(event)
      if (listeners) {
        const model = {
          ...payload,
          attr(...args) {
            let [name = '', value] = args
            name = name.split('.')
            let data = this
            let prop = name.pop()
            let len = args.length

            name.forEach(item => {
              if (data && item in data) {
                data = data[item]
              } else if (len === 2) {
                data = data[item] = {}
              }
            })
            if (len === 1) {
              return data ? data[prop] : null
            }
            if (len === 2) {
              data[prop] = value
            }
          },
        }
        listeners.forEach(fn => {
          try {
            fn(model)
          } catch (err) {
            console.error(err)
          }
        })
      }
      return
    }

    if (type === 'iframe:resize') {
      if (isIframeExpanded) return
      iframe.style.height = height
      return
    }
  }

  window.addEventListener('message', onMessage)

  return {
    $on(event, handler) {
      if (!listenersMap.has(event)) {
        listenersMap.set(event, new Set())
        if (event === 'callback' && isReady) {
          iframe.contentWindow?.postMessage(
            {
              type: 'checkout:subscribe',
              event,
            },
            targetOrigin
          )
        }
      }
      listenersMap.get(event).add(handler)
    },
    $emit(event, ...args) {
      iframe.contentWindow?.postMessage(
        {
          type: 'checkout:emit',
          event,
          args,
        },
        targetOrigin
      )
    },
    $destroy() {
      iframe.contentWindow?.postMessage(
        { type: 'checkout:destroy' },
        targetOrigin
      )
      window.removeEventListener('message', onMessage)
      iframe.remove()
      listenersMap.clear()
    },
  }
}

if (typeof window !== 'undefined') {
  window.checkout = checkout
}
