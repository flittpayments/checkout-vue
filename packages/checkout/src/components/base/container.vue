<template>
  <div :class="$style.style">
    <slot />
  </div>
</template>

<style lang="scss" module>
.style {
  width: 100%;
  max-width: 280px;
  margin: 0 auto;

  @include media-breakpoint-up(ss) {
    width: 100%;
    max-width: 335px;
  }

  @include media-breakpoint-up(sm) {
    max-width: 360px;
  }
}
</style>
