import { listenOnWindowMixin } from '@/mixins/listen-on-window'
import { isFunction } from '@/utils/inspect'

export const resizeMixin = {
  mixins: [listenOnWindowMixin],
  mounted() {
    const handler = () => {
      if (isFunction(this.resize)) {
        this.resize()
      }
    }

    this.listenOnWindow('resize', handler)
    this.listenOnWindow('orientationchange', handler)
    document.fonts?.ready?.then(handler)

    handler()
  },
}
