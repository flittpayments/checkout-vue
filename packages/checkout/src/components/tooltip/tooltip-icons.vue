<template>
  <f-tooltip-base v-bind="attrs" v-on="$listeners">
    <slot />
  </f-tooltip-base>
</template>

<script>
import FTooltipBase from '@/components/tooltip/tooltip-base'

export default {
  components: {
    FTooltipBase,
  },
  inheritAttrs: false,
  computed: {
    attrs() {
      return {
        ...this.$attrs,
        triggers: 'hover focus',
        placement: 'topleft',
        customClass: this.$uiClass('style'),
        innerClass: this.$style.inner,
      }
    },
  },
}
</script>

<style lang="scss" module>
.style {
  --shadow: initial;
  --opacity: 0.95;
  --padding: #{px-to-rem(12px) px-to-rem(4px) px-to-rem(4px) px-to-rem(12px)};
  --max-width: #{px-to-rem(304px)};
}

.style_light {
  --color: #{$white};
  --bg: #{$grey_9};
}

.style_dark {
  --color: #{$grey_2};
  --bg: #{$white};
}

.inner {
  flex-wrap: wrap;
}
</style>
