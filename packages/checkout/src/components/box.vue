<template>
  <div :class="$uiClass('wrapper')">
    <slot />
  </div>
</template>

<style lang="scss" module>
.wrapper {
  padding: px-to-rem(12px);
  background: var(--bg);
  border-radius: $border-radius;
}

.wrapper_light {
  --bg: #{$ash_200};
  #{$prefix}container_bg: $ash_200;
}

.wrapper_dark {
  --bg: #{$white_007};
  #{$prefix}container_bg: $white_007;
}
</style>
