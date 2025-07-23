<template>
  <div :class="$style.wrapper">
    <slot />
  </div>
</template>

<style lang="scss" module>
.wrapper {
  #{$prefix}container_bg: $box_bg;

  padding: px-to-rem(12px);
  background-color: $box_bg;
  border-radius: $border-radius;
}
</style>
