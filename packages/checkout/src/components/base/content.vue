<template>
  <div :class="$uiClass('style')">
    <slot />
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" module>
.style {
  position: relative;
  height: calc(100% - #{$header-height});
}

.style_adaptive {
  @include breakpoints.up(lg) {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
