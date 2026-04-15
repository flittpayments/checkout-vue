<template>
  <f-button-unstyled :class="className" @click="click">
    <f-svg class="f-menu-icon" :name="icon[method] || method" size="lg" fw />
    <span v-text="title" />
    <f-icons ref="icons" class="f-menu-icons" :type="method" />
    <f-tooltip-default
      v-if="showTooltip"
      custom-class="f-tooltip-menu"
      :target="() => $el"
      placement="topright"
      boundary-padding="30"
    >
      <component :is="tooltipIcon" />
      <span v-text="$t(`${method}_tooltip`)" />
    </f-tooltip-default>
  </f-button-unstyled>
</template>

<script>
import FButtonUnstyled from '@/components/button/button-unstyled'
import FSvg from '@/components/svg'
import FIcons from '@/components/icons'
import FTooltipDefault from '@/components/tooltip/tooltip-default'
import SvgTimer from '@/svg/timer.svg'
import { resizeMixin } from '@/mixins/resize'
import { makeProp } from '@/utils/props'
import { PROP_TYPE_STRING } from '@/constants/props'
import { mapState } from '@/utils/store'

export default {
  components: {
    FButtonUnstyled,
    FSvg,
    FIcons,
    FTooltipDefault,
    SvgTimer,
  },
  mixins: [resizeMixin],
  props: {
    method: makeProp(PROP_TYPE_STRING),
  },
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
    ...mapState(['can_make_payment']),
    className() {
      return [
        'f-menu-item',
        {
          active: this.isActive,
        },
      ]
    },
    isActive() {
      return this.$meta.method === this.method && !this.isBreakpointDownLg
    },
    showTooltip() {
      return (
        this.$te(`${this.method}_tooltip`, 'en') ||
        this.$te(`${this.method}_tooltip`)
      )
    },
    tooltipIcon() {
      return this.method === 'loans' ? 'svg-timer' : 'span'
    },
    title() {
      return this.method === 'wallets'
        ? this.$t(`${this.method}_${this.can_make_payment}`)
        : this.$t(this.method)
    },
  },
  mounted() {
    this.$el.reference = this.$refs.icons.$el
  },
  methods: {
    click() {
      this.$router.push({ name: this.method }).catch(() => {})
    },
  },
}
</script>
