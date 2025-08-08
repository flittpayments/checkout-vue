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
.style.style {
  --border-width: #{px-to-rem(1px)};
  font-size: px-to-rem(14px);
}

.style_light.style_light {
  --border-color: #{$ash_500};
  --color: #{$grey_2};
  --hover-bg: #{$ash_100};
  --hover-border-color: #{$ash_600};
  --active-bg: #{$ash_300};
}

.style_dark.style_dark {
  --border-color: #{$white_02};
  --color: #{$white_06};
  --hover-bg: #{$white_01};
  --hover-border-color: #6b6d71;
  --hover-color: #b5b6b8;
  --active-bg: #{$white_02};
  --active-border-color: #7b7d81;
  --active-color: #bdbec0;
}
</style>
