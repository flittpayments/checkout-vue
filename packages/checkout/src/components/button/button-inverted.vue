<template>
  <f-button :class="$uiClass('style')" v-bind="$attrs" v-on="$listeners">
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
  --bg: #{$black};
  --color: #{$white};
  --hover-bg: #1a1a1a;
  --active-bg: #333333;
}

.style_dark.style_dark {
  --bg: #{$white};
  --color: #{$black};
  --hover-bg: #e6e6e6;
  --active-bg: #cccccc;
}
</style>
