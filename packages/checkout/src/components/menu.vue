<template>
  <div>
    <f-button-unstyled
      v-for="method in list"
      :key="method"
      :ref="method"
      :class="className(method)"
      :data-e2e-menu-item="method"
      @click="click(method)"
    >
      <f-svg class="f-menu-icon" :name="icon[method] || method" size="lg" fw />
      <span v-text="title(method)" />
      <f-icons :ref="`${method}_icons`" class="f-menu-icons" :type="method" />
      <f-tooltip-default
        v-if="showTooltip(method)"
        :ref="`${method}_tooltip`"
        custom-class="f-tooltip-menu"
        :target="() => $refs[method][0].$el"
        placement="topright"
        boundary-padding="30"
      >
        <component :is="tooltipIcon(method)" />
        <span v-text="$t(`${method}_tooltip`)" />
      </f-tooltip-default>
    </f-button-unstyled>
  </div>
</template>

<script>
import FButtonUnstyled from '@/components/button/button-unstyled'
import FSvg from '@/components/svg'
import FIcons from '@/components/icons'
import FTooltipDefault from '@/components/tooltip/tooltip-default'
import SvgTimer from '@/svg/timer.svg'
import { mapState } from '@/utils/store'
import { resizeMixin } from '@/mixins/resize'
import { removeWallets } from '@/utils/helpers'
import { isFunction } from '@/utils/inspect'

export default {
  components: {
    FButtonUnstyled,
    FSvg,
    FIcons,
    FTooltipDefault,
    SvgTimer,
  },
  mixins: [resizeMixin],
  data() {
    return {
      icon: {
        sepa: 'local',
        banks: 'bank',
        local_methods: 'local',
        emoney: 'wallet',
        most_popular: 'star',
        installments: 'loans',
      },
    }
  },
  computed: {
    ...mapState('options', ['methods']),
    ...mapState(['showWalletsTab', 'can_make_payment']),
    className() {
      return function (item) {
        return [
          'f-menu-item',
          {
            active: this.meta.method === item && !this.isBreakpointDownLg,
          },
        ]
      }
    },
    meta() {
      if (isFunction(this.$route.meta)) {
        return this.$route.meta(this.$route)
      } else {
        return this.$route.meta
      }
    },
    list() {
      return this.showWalletsTab && this.can_make_payment
        ? this.methods
        : this.methods.filter(removeWallets)
    },
    showTooltip() {
      return method =>
        this.$te(`${method}_tooltip`, 'en') || this.$te(`${method}_tooltip`)
    },
    tooltipIcon() {
      return method => (method === 'loans' ? 'svg-timer' : 'span')
    },
    title() {
      return method =>
        method === 'wallets'
          ? this.$t(`${method}_${this.can_make_payment}`)
          : this.$t(method)
    },
  },
  mounted() {
    this.methods.forEach(method => {
      if (!this.$refs[method]) return
      this.$refs[method][0].$el.reference = this.$refs[`${method}_icons`][0].$el
    })
  },
  methods: {
    click(method) {
      this.$router.push({ name: method }).catch(() => {})
    },
  },
}
</script>
