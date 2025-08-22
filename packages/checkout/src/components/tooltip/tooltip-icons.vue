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
        customClass: this.$style.style,
        innerClass: this.$style.inner,
      }
    },
  },
}
</script>

<style lang="scss" module>
.style {
  --color: #{$tooltip_default_color};
  --bg: #{$tooltip_default_bg};
  --shadow: initial;
  --opacity: 0.95;
  --padding: #{px-to-rem(12px) px-to-rem(4px) px-to-rem(4px) px-to-rem(12px)};
  --max-width: #{px-to-rem(304px)};
}

.inner {
  flex-wrap: wrap;
}
</style>
