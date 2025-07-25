<template>
  <div :class="className" />
</template>

<script>
import { PROP_TYPE_STRING } from '@/constants/props'
import { makeProp } from '@/utils/props'

export default {
  props: {
    size: makeProp(PROP_TYPE_STRING, undefined, value =>
      ['20', '38', '48x48'].includes(value)
    ),
  },
  computed: {
    className() {
      return [
        'f-preloader',
        this.$style[`s_${this.size}`],
        {
          [`f-h-${this.size}`]: this.size,
        },
      ]
    },
  },
}
</script>

<style lang="scss" module>
:global(#f) .s_48x48 {
  width: px-to-rem(48px);
  height: px-to-rem(48px);
}
</style>
