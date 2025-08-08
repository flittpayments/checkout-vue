<template>
  <f-button-success v-bind="attrs" v-on="$listeners">
    <span v-text="$t('pay')" />&nbsp;
    <f-amount v-if="showAmount" :value="total_amount" :currency="currency" />
  </f-button-success>
</template>

<script>
import FButtonSuccess from '@/components/button/button-success'
import FAmount from '@/components/base/amount'
import { mapState } from '@/utils/store'

export default {
  components: {
    FButtonSuccess,
    FAmount,
  },
  computed: {
    ...mapState('options', ['show_pay_button_amount']),
    ...mapState('params', ['currency', 'verification_type']),
    ...mapState(['total_amount']),
    attrs() {
      return {
        ...this.$attrs,
        class: this.$style.style,
        'data-e2e-btn-pay': '',
      }
    },
    showAmount() {
      return (
        this.verification_type !== 'amount' &&
        this.show_pay_button_amount &&
        this.total_amount
      )
    },
  },
}
</script>

<style lang="scss" module>
.style.style {
  font-weight: 400;
}
</style>
