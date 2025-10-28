<template>
  <div :class="className" />
</template>

<script>
import { mapState } from '@/utils/store'

export default {
  computed: {
    ...mapState('css_variable', [
      'card_bg_lighten',
      'card_gradient_custom',
      'card_img',
    ]),
    className() {
      return this.$uiClass('style', {
        lighten: this.card_bg_lighten,
        gradient: this.card_gradient_custom,
        img: this.card_img,
      })
    },
  },
}
</script>

<style lang="scss" module>
@use '@/scss/core/functions/functions';
$card_bg: var(#{$prefix}card_bg);

.style {
  --bg: #{linear-gradient(
      180deg,
      functions.custom($card_bg, +6%, +8%) 0%,
      $card_bg 35%,
      functions.custom($card_bg, -0%, -8%) 100%
    )};

  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  content: '';
  background: var(--bg);
  background-clip: padding-box;
  border-radius: $border-radius-lg;
  box-shadow: var(#{$prefix}card_shadow_custom);
}

.style_lighten {
  --bg: #{linear-gradient(
      180deg,
      functions.custom($card_bg, +6%, +16%) 0%,
      functions.custom($card_bg, +0%, +8%) 35%,
      $card_bg 100%
    )};
}

.style_gradient {
  --bg: #{var(#{$prefix}card_gradient_custom)};
}

.style_img {
  --bg: #{var(#{$prefix}card_img)} no-repeat 0 0 / 100% 100%;
}
</style>
