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
        variant: 'success',
        block: true,
      }
    },
    className() {
      if (this.btn_success_gradient_custom)
        return this.$style['gradient-custom']

      if (this.btn_success_bg_lighten) return this.$style['bg-lighten']

      return ''
    },
  },
}
</script>

<style lang="scss" module>
.gradient-custom {
  &::after,
  &:hover::after,
  &:focus::after,
  &:active::after {
    background: $btn_success_gradient_custom;
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

  @include disabled;
}

.bg-lighten {
  &:hover,
  &:focus {
    &::after {
      background-color: lighten($btn_success_bg, 20%);
    }
  }

  &:active {
    &::after {
      background-color: lighten($btn_success_bg, 40%);
    }
  }

  @include disabled;
}
</style>
