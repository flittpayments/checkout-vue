<template>
  <div
    id="f"
    :style="style"
    :class="$uiClass('style')"
    :data-e2e-embed="String(!full_screen)"
    :data-e2e-theme="theme.type"
  >
    <router-view />
  </div>
</template>

<script>
import { mapState } from '@/utils/store'
import { resizeMixin } from '@/mixins/resize'
import { errorHandler, windowHeight } from '@/utils/helpers'
import { PROP_TYPE_OBJECT } from '@/constants/props'
import { makeProp } from '@/utils/props'

import '@/scss/fonts.scss'
import '@/scss/style.scss'

export default {
  mixins: [resizeMixin],
  props: {
    optionsUser: makeProp(PROP_TYPE_OBJECT),
  },
  data() {
    return {
      height: null,
    }
  },
  computed: {
    ...mapState('options', ['full_screen', 'theme', 'show_3ds_close']),
    style() {
      return {
        height: this.height,
      }
    },
    isMenu() {
      return this.$route.name === 'menu'
    },
  },
  watch: {
    isBreakpointDownLg(value) {
      if (!value && this.isMenu) {
        this.$router.push({ name: this.store.getRouteName() }).catch(() => {})
      }
    },
  },
  created() {
    this.initEvents()
    this.store
      .setOptions(this.optionsUser)
      .then(this.init)
      .catch(this.goError)
      .catch(errorHandler)
  },
  methods: {
    init() {
      this.add3dsCloseStyle()
      this.initHeight()
      this.store
        .load()
        .then(this.go)
        .catch(this.goErrorModal)
        .catch(errorHandler)
    },
    initHeight() {
      this.height = this.full_screen ? windowHeight() + 'px' : 'auto'
    },
    resize() {
      this.initHeight()
    },
    go() {
      this.$router
        .push({ name: this.store.getRouteName(this.isBreakpointDownLg) })
        .catch(() => {})
    },
    goErrorModal(error) {
      this.$router
        .push({ name: 'error_modal', query: { error } })
        .catch(() => {})
    },
    goError(errors) {
      this.$router.push({ name: 'error', query: { errors } }).catch(() => {})
    },
    initEvents() {
      this.location()
      this.setParams()
    },
    location() {
      this.$root.$on('location', (method, system) => {
        if (system) {
          this.$router
            .push({ name: 'system', params: { method, system } })
            .catch(() => {})
        } else {
          this.$router.push({ name: method }).catch(() => {})
        }
      })
    },
    setParams() {
      this.$root.$on('setParams', params => {
        this.store.setParams(params)
      })
    },
    add3dsCloseStyle() {
      if (this.show_3ds_close) return

      import('@/scss/hide-3ds-close.scss')
    },
  },
}
</script>

<style lang="scss" module>
.style {
  background: var(--bg);
  font-family: inter, sans-serif;
  font-size: $font-size-base;
  line-height: $line-height-base;
  color: var(#{$prefix}main_color);
}

.style_light {
  --bg: #{$ash_400};
}

.style_dark {
  --bg: #1c1f22;
}

.style_adaptive {
  @include breakpoints.up(xl) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
