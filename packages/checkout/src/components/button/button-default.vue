<template>
  <f-button v-bind="$attrs" :class="$uiClass('style')">
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
.style_light.style_light {
  --bg: #{$ash_500};
  --color: #{$grey_3};
  --hover-bg: #{$ash_600};
  --hover-color: #{$grey_4};
  --hover-shadow-color: #{$ash_400};
  --active-bg: #{$ash_800};
  --active-shadow-color: #{$ash_600};
}

.style_dark.style_dark {
  --bg: #{$white_04};
  --color: #{$white};
  --hover-bg: #{$white_02};
  --hover-shadow-color: #{$black};
  --active-bg: #{$white_01};
}
</style>
