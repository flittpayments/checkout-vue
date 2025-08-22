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
        boundary: 'window',
        triggers: 'hover focus',
        placement: 'top',
        customClass: this.$style.style,
      }
    },
  },
}
</script>

<style lang="scss" module>
.style {
  --color: #{$tooltip_secondary2_color};
  --bg: #{$tooltip_secondary2_bg};
  --shadow: initial;
  --opacity: 0.95;
  --padding: #{px-to-rem(16px)};
  --max-width: #{px-to-rem(300px)};
}
</style>
