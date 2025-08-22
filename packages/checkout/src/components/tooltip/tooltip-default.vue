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
        customClass: this.$style.style,
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
  --opacity: 1;
  --padding: #{px-to-rem(16px)};
  --max-width: #{px-to-rem(300px)};
}
</style>
