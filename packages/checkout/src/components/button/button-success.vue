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
      'btn_success_gradient_enable',
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
      return {
        'f-btn-success-gradient':
          this.btn_success_gradient_enable && !this.btn_success_gradient_custom,
        'f-btn-success-gradient-custom':
          this.btn_success_gradient_custom && !this.btn_success_gradient_enable,
        'f-btn-success-bg-lighten': this.btn_success_bg_lighten,
      }
    },
  },
}
</script>
