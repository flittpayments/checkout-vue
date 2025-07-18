<template>
  <div :data-e2e-method="$route.name" :class="$style.style">
    <slot />
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" module>
.style {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
