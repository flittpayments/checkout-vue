<template>
  <f-container>
    <f-fee
      :class="$style.mb_16"
      :amount="data.amount"
      :discount-percent="data.discount_percent"
      :discount-amount="data.discount_amount"
      :fee-amount="data.fee_amount"
      :total-amount="data.total_amount"
    />
    <f-form v-slot="{ submit, disabled }" @submit="onSubmit">
      <f-form-group
        v-model="accepted"
        name=""
        component="checkbox"
        :rules="rules"
      >
        <!--$t('accept_fees')-->
        <i18n path="accept_fees">
          <template #fees><b v-text="$t('fees')" /></template>
        </i18n>
      </f-form-group>
      <f-button
        class="f-button-pay"
        variant="success"
        size="lg"
        block
        :disabled="disabled"
        @click="submit"
      >
        <span v-text="$t('pay')" />&nbsp;
        <f-amount :value="data.total_amount" :currency="currency" />
      </f-button>
    </f-form>
  </f-container>
</template>

<script>
import FContainer from '@/components/base/container'
import { FFee } from '@/import'
import FForm from '@/components/form/form/form.vue'
import FButton from '@/components/button/button'
import FAmount from '@/components/base/amount.vue'
import { makeProp } from '@/utils/props'
import { PROP_TYPE_OBJECT, PROP_TYPE_STRING } from '@/constants/props'
import { mapState } from '@/utils/store'
import { errorHandler } from '@/utils/helpers'

export default {
  components: {
    FContainer,
    FFee,
    FForm,
    FButton,
    FAmount,
  },
  inject: ['formRequest'],
  beforeRouteLeave(to, from, next) {
    if (!this.isSubmitted) {
      this.store
        .sendRequestBase('api.checkout.form', 'request', {
          payment_system: 'confirm_fee',
          token: this.data.token,
          tran_id: this.data.tran_id,
          status: 'cancel',
        })
        .catch(errorHandler)

      this.store.feeCalc(to.name).catch(errorHandler)
    }

    next()
  },
  props: {
    method: makeProp(PROP_TYPE_STRING),
    system: makeProp(PROP_TYPE_STRING),
    data: makeProp(PROP_TYPE_OBJECT),
  },
  data() {
    return {
      accepted: false,
      isSubmitted: false,
    }
  },
  computed: {
    ...mapState('params', ['currency']),
    rules() {
      return { required: true }
    },
  },
  created() {
    this.store.setState({
      discount_percent: this.data.discount_percent,
      discount_amount: this.data.discount_amount,
      fee_amount: this.data.fee_amount,
      total_amount: this.data.total_amount,
    })
  },
  methods: {
    onSubmit() {
      this.isSubmitted = true

      this.formRequest({
        payment_system: 'confirm_fee',
        token: this.data.token,
        tran_id: this.data.tran_id,
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
