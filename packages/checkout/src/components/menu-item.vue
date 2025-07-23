<template>
  <f-button-unstyled :class="className" @click="click">
    <f-svg :class="classIcon" :name="icon[method] || method" size="lg" fw />
    <span v-text="title" />
    <f-icons
      ref="icons"
      :class="$style.ml_auto"
      :is-active="isActive"
      :type="method"
    />
    <f-tooltip-default
      v-if="showTooltip"
      :custom-class="$style.tooltip"
      :target="() => $el"
      placement="topright"
      boundary-padding="30"
    >
      <component :is="tooltipIcon" :class="$style.svg" />
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
      return this.$uiClass('style', {
        active: this.isActive,
      })
    },
    classIcon() {
      return this.$uiClass('icon', {
        active: this.isActive,
      })
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

<style lang="scss" module>
.style {
  display: flex;
  align-items: center;
  width: 100%;
  height: px-to-rem(72px);
  padding: 0 px-to-rem(15px) 0 px-to-rem(7px);
  margin-bottom: px-to-rem(12px);
  font-weight: 400;
  color: $menu_item_color;
  text-align: left;
  cursor: pointer;
  background-color: $container_bg;
  border: 1px solid $menu_item_border;
  border-radius: $border-radius;
  transition:
    background-color ease-in-out 0.15s,
    color ease-in-out 0.15s,
    box-shadow ease-in-out 0.15s;

  &:hover {
    padding: 0 px-to-rem(16px) 0 px-to-rem(8px);
    background: $menu_item_hover_bg;
    border: none;
  }

  &:hover,
  &.active {
    text-decoration: none;
  }

  &:focus-visible {
    outline: 0;
    box-shadow:
      0 0 0 px-to-rem(2px) $container_bg,
      0 0 0 px-to-rem(4px) $outline_border;
  }

  &:last-child {
    margin-bottom: 0;
  }
}

.style_adaptive {
  @include media-breakpoint-up(lg) {
    height: px-to-rem(60px);
    padding: 0 px-to-rem(16px) 0 px-to-rem(8px);
    margin-bottom: px-to-rem(4px);
    color: $menu_item_lg_color;
    border: none;
  }
}

.style_active {
  font-weight: 500;
  color: $menu_item_active_color;
  background: $menu_item_active_bg;
}

.icon {
  color: $menu_icon_color;
  transition: all ease-in-out 0.15s;
}

.icon_adaptive {
  @include media-breakpoint-up(lg) {
    color: $menu_icon_lg_color;
  }
}

.icon_active {
  color: $menu_icon_active_color;
}

.ml_auto {
  margin-left: auto;
}

.tooltip {
  :global(.f-tooltip-inner) {
    align-items: center;
  }
}

.svg {
  flex: 0 0 px-to-rem(50px);
  max-width: px-to-rem(50px);
}
</style>
