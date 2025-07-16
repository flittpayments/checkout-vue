<template>
  <div :class="$style.style">
    <div :class="$style.inner" />
  </div>
</template>

<style lang="scss" module>
.style {
  background-image: linear-gradient(
    to bottom,
    $container_bg,
    fade($container_bg, 0)
  );
  @include sticky-top;
}

.inner {
  height: px-to-rem(24px);
}
</style>
