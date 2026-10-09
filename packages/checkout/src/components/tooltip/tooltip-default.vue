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
        triggers: 'hover focus',
        customClass: this.$uiClass('style'),
      }
    },
  },
}
</script>

<style lang="scss" module>
.style {
  --shadow: initial;
  --opacity: 1;
  --padding: #{px-to-rem(16px)};
  --max-width: #{px-to-rem(300px)};
}

.style_light {
  --color: #{$white};
  --bg: #{$grey_9};
}

.style_dark {
  --color: #{$grey_2};
  --bg: #{$white};
}
</style>
