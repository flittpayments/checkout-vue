<template>
  <div :class="$uiClass('style')">
    <div v-if="showDemo" :class="$style.title" v-text="$t('demo_title')" />
    <div v-if="showTest" :class="$style.title" v-text="$t('mode_test')" />
  </div>
</template>

<script>
import { mapState } from '@/utils/store'

export default {
  computed: {
    ...mapState(['mode_test']),
    ...mapState('options', ['disable_request', 'show_test_mode']),
    showDemo() {
      return this.disable_request
    },
    showTest() {
      return this.show_test_mode && this.mode_test
    },
  },
}
</script>

<style lang="scss" module>
.style {
  position: absolute;
  right: 0;
  left: 0;
  z-index: 1;
  display: block;
  content: '';
  border-top: 2px solid var(#{$prefix}main);
}

.style_adaptive {
  @include breakpoints.up(xl) {
    height: $border-radius-lg;
    border-radius: $border-radius-lg $border-radius-lg 0 0;
  }
}

.title {
  position: absolute;
  left: 50%;
  padding: px-to-rem(1px) px-to-rem(16px);
  font-size: px-to-rem(14px);
  font-weight: 500;
  color: $white;
  background: var(#{$prefix}main);
  border-radius: 0 0 $border-radius-sm $border-radius-sm;
  transform: translateX(-50%);
}
</style>
