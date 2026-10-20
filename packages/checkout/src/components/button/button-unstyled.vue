<template>
  <button :class="$style.style" type="button" v-on="$listeners">
    <slot />
  </button>
</template>

<style lang="scss" module>
.style {
  padding: 0;
  margin: 0;
  overflow: initial;
  font: inherit;
  line-height: inherit;
  color: inherit;
  text-align: initial;
  vertical-align: initial;
  text-transform: none; // Remove the inheritance of text transform in Firefox
  cursor: pointer;
  background: none;
  border: 0;
  border-radius: $border-radius-sm;

  &:focus-visible {
    outline: 0;
    box-shadow: 0 0 0 px-to-rem(2px) $outline_border;
  }

  &:not(:disabled) {
    cursor: pointer;
  }
}
</style>
