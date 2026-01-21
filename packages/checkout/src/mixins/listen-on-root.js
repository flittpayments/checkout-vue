export const listenMixin = {
  beforeUnmount() {
    if (this._rootListeners) {
      this._rootListeners.forEach(({ event, callback }) => {
        this.$emitter.off(event, callback)
      })
      this._rootListeners = null
    }
  },
  methods: {
    listen(event, callback) {
      this._rootListeners = this._rootListeners || []
      this._rootListeners.push({
        event,
        callback,
      })
      this.$emitter.on(event, callback)
    },
    listenOnce(event, callback) {
      const handler = (...args) => {
        this.$emitter.off(event, handler)
        if (this._rootListeners) {
          this._rootListeners = this._rootListeners.filter(
            listener =>
              listener.event !== event || listener.callback !== handler
          )
        }
        callback(...args)
      }
      this.listen(event, handler)
    },
  },
}
