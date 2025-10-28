<template>
  <div :class="$style.style">
    <div :class="$style.inner" />
  </div>
</template>

<style lang="scss" module>
@use '@/scss/core/functions/functions';
@use '@/scss/core/mixins/sticky';

.style {
  background-image: linear-gradient(
    to bottom,
    $container_bg,
    functions.fade($container_bg, 0)
  );
  @include sticky.top;
}

.inner {
  height: px-to-rem(24px);
}
</style>
