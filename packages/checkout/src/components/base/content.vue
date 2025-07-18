<template>
  <div :class="className">
    <slot />
  </div>
</template>

<script>
import { mapState } from '@/utils/store'

export default {
  computed: {
    ...mapState('options', ['full_screen']),
    className() {
      return [
        this.$style.style,
        {
          [this.$style.style_adaptive]: this.full_screen,
        },
      ]
    },
  },
}
</script>

<style lang="scss" module>
.style {
  position: relative;
  height: calc(100% - #{$header-height});
}

.style_adaptive {
  @include media-breakpoint-up(lg) {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
