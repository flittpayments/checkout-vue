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
      return [this.$style.style, this.$style[`s_${this.size}`]]
    },
  },
}
</script>

<style lang="scss" module>
.style {
  height: px-to-rem(56px);
  background: linear-gradient(
    120deg,
    $preloader_bg 41%,
    $preloader_inner_bg 50%,
    $preloader_bg 59%
  );
  background-size: 200% 100%;
  border-radius: $border-radius;
  animation: f-preloader 2s ease-in-out infinite;
}

.s_20 {
  height: px-to-rem(20px);
}

.s_38 {
  height: px-to-rem(38px);
}

.s_48x48 {
  width: px-to-rem(48px);
  height: px-to-rem(48px);
}

@keyframes f-preloader {
  0% {
    background-position: 80% 0;
  }

  50% {
    background-position: 20% 0;
  }

  100% {
    background-position: 80% 0;
  }
}
</style>
