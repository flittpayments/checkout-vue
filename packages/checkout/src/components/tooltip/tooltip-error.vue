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
        triggers: 'focus',
        placement: 'top',
        'custom-class': this.$style.style,
        variant: 'secondary',
        ...this.$attrs,
      }
    },
  },
}
</script>

<style lang="scss" module>
:global(#f) .style {
  :global(.f-tooltip-inner) {
    align-items: center;
    color: $error;
  }
}
</style>
