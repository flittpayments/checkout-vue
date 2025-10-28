<template>
  <f-button v-bind="attrs" v-on="$listeners">
    <slot />
  </f-button>
</template>

<script>
import { mapState } from '@/utils/store'
import FButton from '@/components/button/button'

export default {
  components: {
    FButton,
  },
  computed: {
    ...mapState('css_variable', [
      'btn_success_gradient_custom',
      'btn_success_bg_lighten',
    ]),
    attrs() {
      return {
        size: 'lg',
        ...this.$attrs,
        class: this.className,
        block: true,
      }
    },
    className() {
      return this.$uiClass('style', {
        lighten: this.btn_success_bg_lighten,
        gradient: this.btn_success_gradient_custom,
      })
    },
  },
}
</script>

<style lang="scss" module>
@use '@/scss/core/functions/functions';

$btn_success_bg: var(#{$prefix}btn_success_bg);

.style.style {
  --bg: #{$btn_success_bg};
  --color: #{var(#{$prefix}btn_success_color)};
  --shadow-color: #{var(#{$prefix}btn_success_shadow)};
  --hover-bg: #{functions.darken($btn_success_bg, 20%)};
  --active-bg: #{functions.darken($btn_success_bg, 40%)};

  #{$prefix}outline_border: $btn_success_bg;
}

.style_dark.style_dark {
  --shadow-color: #{$black};
}

.style_lighten.style_lighten {
  --hover-bg: #{functions.lighten($btn_success_bg, 20%)};
  --active-bg: #{functions.lighten($btn_success_bg, 40%)};
}

.style_gradient.style_gradient {
  --bg: #{var(#{$prefix}btn_success_gradient_custom)};
  --hover-bg: #{var(#{$prefix}btn_success_gradient_custom)};
  --active-bg: #{var(#{$prefix}btn_success_gradient_custom)};

  &::after {
    background-repeat: no-repeat;
  }

  &:hover,
  &:focus {
    &::after {
      background-position-x: -25px;
    }
  }

  &:active {
    &::after {
      background-position-x: -50px;
    }
  }
}
</style>
