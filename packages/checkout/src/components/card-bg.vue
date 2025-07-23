<template>
  <div :class="className" />
</template>

<script>
import { mapState } from '@/utils/store'

export default {
  computed: {
    ...mapState('css_variable', [
      'card_bg_lighten',
      'card_img',
      'card_gradient_custom',
    ]),
    className() {
      return [
        this.$style.style,
        {
          [this.$style.img]: this.card_img && !this.card_gradient_custom,
          [this.$style.gradient]: this.card_gradient_custom && !this.card_img,
          [this.$style.lighten]: this.card_bg_lighten,
        },
      ]
    },
  },
}
</script>

<style lang="scss" module>
.style {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  content: '';
  background: linear-gradient(
    180deg,
    custom($card_bg, +6%, +8%) 0%,
    $card_bg 35%,
    custom($card_bg, -0%, -8%) 100%
  );
  background-clip: padding-box;
  border-radius: $border-radius-lg;
  box-shadow: $card_shadow_custom;
}

.lighten {
  background: linear-gradient(
    180deg,
    custom($card_bg, +6%, +16%) 0%,
    custom($card_bg, +0%, +8%) 35%,
    $card_bg 100%
  );
}

.img {
  background: $card_img no-repeat 0 0 / 100% 100%;
}

.gradient {
  background: $card_gradient_custom;
}
</style>
