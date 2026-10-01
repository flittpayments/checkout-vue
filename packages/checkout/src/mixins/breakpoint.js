import { listenOnWindowMixin } from '@/mixins/listen-on-window'
import { mapState } from '@/utils/store'
import { windowWidth } from '@/utils/helpers'

export const breakpointMixin = {
  mixins: [listenOnWindowMixin],
  data() {
    return {
      isBreakpointDownMd: false,
      isBreakpointDownLg: false,
      isWidthSm: false,
    }
  },
  computed: {
    ...mapState('options', ['full_screen']),
  },
  mounted() {
    const handler = () => {
      const width = windowWidth()

      this.isBreakpointDownMd = this.full_screen ? width < 768 : true
      this.isBreakpointDownLg = this.full_screen ? width < 992 : true
      this.isWidthSm = width < 768
    }

    this.listenOnWindow('resize', handler)
    this.listenOnWindow('orientationchange', handler)
    document.fonts?.ready?.then(handler)

    handler()
  },
}
