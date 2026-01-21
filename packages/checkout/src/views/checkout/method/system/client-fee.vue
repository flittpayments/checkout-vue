<template>
  <f-container>
    <f-fee
      :class="$style.mb_16"
      :amount="model.amount"
      :discount-percent="model.discount_percent"
      :discount-amount="model.discount_amount"
      :fee-amount="model.fee_amount"
      :total-amount="model.total_amount"
    />
    <f-form v-slot="{ submit, state }" @submit="onSubmit">
      <f-row-checkbox v-model="accepted" :rules="rules">
        <!--$t('accept_fees')-->
        <i18n-t keypath="accept_fees">
          <template #fees><b v-text="$t('fees')" /></template>
        </i18n-t>
      </f-row-checkbox>
      <f-button-success :disabled="state.disabled" @click="submit">
        <span v-text="$t('pay')" />&nbsp;
        <f-amount :value="model.total_amount" :currency="currency" />
      </f-button-success>
    </f-form>
  </f-container>
</template>

<script>
import FContainer from '@/components/base/container'
import { FFee } from '@/import'
import FForm from '@/components/form/form'
import FRowCheckbox from '@/components/input/row-checkbox'
import I18nT from '@/components/base/i18n-t'
import FButtonSuccess from '@/components/button/button-success'
import FAmount from '@/components/base/amount.vue'
import { makeProp } from '@/utils/props'
import { PROP_TYPE_STRING } from '@/constants/props'
import { mapState } from '@/utils/store'
import { errorHandler } from '@/utils/helpers'

export default {
  components: {
    FContainer,
    FFee,
    FForm,
    FRowCheckbox,
    I18nT,
    FButtonSuccess,
    FAmount,
  },
  inject: ['formRequest'],
  beforeRouteLeave(to) {
    if (!this.isSubmitted) {
      this.store
        .sendRequestBase('api.checkout.form', 'request', {
          payment_system: 'confirm_fee',
          token: this.model.token,
          tran_id: this.model.tran_id,
          status: 'cancel',
        })
        .catch(errorHandler)

      this.store.feeCalc(to.name).catch(errorHandler)
    }
  },
  props: {
    method: makeProp(PROP_TYPE_STRING),
    system: makeProp(PROP_TYPE_STRING),
  },
  data() {
    return {
      accepted: false,
      isSubmitted: false,
    }
  },
  computed: {
    ...mapState(['model']),
    ...mapState('params', ['currency']),
    rules() {
      return { required: true }
    },
  },
  created() {
    this.store.setState({
      discount_percent: this.model.discount_percent,
      discount_amount: this.model.discount_amount,
      fee_amount: this.model.fee_amount,
      total_amount: this.model.total_amount,
    })
  },
  methods: {
    onSubmit() {
      this.isSubmitted = true

      this.formRequest({
        payment_system: 'confirm_fee',
        token: this.model.token,
        tran_id: this.model.tran_id,
        status: 'confirm',
      })
        .finally(() => {
          this.isSubmitted = false
        })
        .catch(errorHandler)
    },
  },
}
</script>

<style lang="scss" module>
.mb_16 {
  margin-bottom: px-to-rem(16px);
}
</style>
