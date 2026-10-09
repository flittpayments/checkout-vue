<template>
  <f-tooltip-base v-bind="attrs">
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
        triggers: 'focus',
        placement: 'top',
        customClass: this.$style.style,
        innerClass: this.$style.inner,
      }
    },
  },
}
</script>

<style lang="scss" module>
.style {
  --color: #{$error};
  --bg: #{$white};
  --shadow: #{0 px-to-rem(8px) px-to-rem(32px) rgba(#b6b9bf, 0.5)};
  --opacity: 1;
  --padding: #{px-to-rem(16px)};
  --max-width: #{px-to-rem(300px)};
}

.inner {
  align-items: center;
}
</style>
