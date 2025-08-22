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
        placement: 'top',
        customClass: this.$style.style,
      }
    },
  },
}
</script>

<style lang="scss" module>
.style {
  --color: #{$tooltip_secondary_color};
  --bg: #{$tooltip_secondary_bg};
  --shadow: #{0 px-to-rem(8px) px-to-rem(32px)
    fade($tooltip_secondary_shadow, 50%)};
  --opacity: 1;
  --padding: #{px-to-rem(16px)};
  --max-width: #{px-to-rem(300px)};
}
</style>
