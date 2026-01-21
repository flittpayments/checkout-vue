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
      :target="() => $el"
      :placement-target="() => $refs.icons.$el"
    >
      <component :is="tooltipIcon" v-if="tooltipIcon" :class="$style.svg" />
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
      return this.method === 'loans' ? 'svg-timer' : ''
    },
    title() {
      return this.method === 'wallets'
        ? this.$t(`${this.method}_${this.can_make_payment}`)
        : this.$t(this.method)
    },
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
  color: var(--color);
  text-align: left;
  cursor: pointer;
  background-color: $container_bg;
  border: 1px solid var(--border-color);
  border-radius: $border-radius;
  transition:
    background-color ease-in-out 0.15s,
    color ease-in-out 0.15s,
    box-shadow ease-in-out 0.15s;

  &:hover {
    padding: 0 px-to-rem(16px) 0 px-to-rem(8px);
    background: var(--hover-bg);
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

.style_light {
  --color: #{$grey};
  --lg-color: #{$grey_2};
  --border-color: #{$ash_400};
  --hover-bg: #{$ash_100};
  --active-color: #{$grey};
  --active-bg: #{$ash_200};
}

.style_dark {
  --color: #{$white_06};
  --lg-color: #{$white_05};
  --border-color: #{$white_02};
  --hover-bg: #{$white_005};
  --active-color: #{$white};
  --active-bg: #{$white_01};
}

.style_adaptive {
  @include breakpoints.up(lg) {
    height: px-to-rem(60px);
    padding: 0 px-to-rem(16px) 0 px-to-rem(8px);
    margin-bottom: px-to-rem(4px);
    color: var(--lg-color);
    border: none;
  }
}

.style_active {
  font-weight: 500;
  color: var(--active-color);
  background: var(--active-bg);
}

.icon {
  color: var(--color);
  transition: all ease-in-out 0.15s;
}

.icon_light {
  --color: #{$grey_2};
  --lg-color: #{$ash_500};
  --active-color: #{$grey};
}

.icon_dark {
  --color: #{$white_04};
  --lg-color: #{$white_03};
  --active-color: #{$white};
}

.icon_adaptive {
  @include breakpoints.up(lg) {
    color: var(--lg-color);
  }
}

.icon_active {
  color: var(--active-color);
}

.ml_auto {
  margin-left: auto;
}

.svg {
  flex: 0 0 px-to-rem(50px);
  max-width: px-to-rem(50px);
}
</style>
