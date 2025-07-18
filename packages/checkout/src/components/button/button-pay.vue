<template>
  <f-button-success-pay v-if="show" :disabled="disabled" @click="click" />
</template>

<script>
import FButtonSuccessPay from '@/components/button/button-success-pay'
import { mapState } from '@/utils/store'
import { errorHandler } from '@/utils/helpers'
import { validatorMixin } from '@/mixins/validator'

export default {
  components: {
    FButtonSuccessPay,
  },
  mixins: [validatorMixin],
  inject: ['submit'],
  data() {
    return {
      isSubmit: false,
    }
  },
  computed: {
    ...mapState('options', { show: 'show_pay_button' }),
    disabled() {
      return this.isError && this.isSubmit
    },
  },
  methods: {
    click() {
      this.isSubmit = true
      this.submit().catch(errorHandler)
    },
  },
}
</script>
