<template>
  <f-button :class="$style.style" v-bind="$attrs" v-on="$listeners">
    <slot />
  </f-button>
</template>

<script>
import FButton from '@/components/button/button'

export default {
  components: {
    FButton,
  },
}
</script>

<style lang="scss" module>
.style.style {
  --bg: #{$ash_500};
  --color: #{$grey_3};
  --hover-bg: #{$ash_600};
  --hover-color: #{$grey_4};
  --hover-shadow-color: #{$ash_400};
  --active-bg: #{$ash_800};
  --active-shadow-color: #{$ash_600};
}
</style>
