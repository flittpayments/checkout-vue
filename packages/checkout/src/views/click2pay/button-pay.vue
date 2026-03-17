<template>
  <div>
    <div v-if="error" :class="$style.error" v-text="$t(error)" />
    <f-button
      class="f-button-pay"
      variant="success"
      size="lg"
      block
      @click="click"
    >
      <span v-text="$t('pay')" />&nbsp;
      <f-amount v-if="showAmount" :value="total_amount" :currency="currency" />
      <f-svg v-if="loading" :class="$style.spin" name="redo" size="20" spin />
    </f-button>
  </div>
</template>

<script>
import FButton from '@/components/button/button'
import FAmount from '@/components/base/amount'
import FSvg from '@/components/svg'
import { validatorMixin } from '@/mixins/validator'
import { mapState } from '@/utils/store'
import { checkoutSelectedCard } from '@/click2pay'
import { coinsToAmountString, errorHandler } from '@/utils/helpers'
import { v4 as uuidv4 } from 'uuid'

export default {
  components: {
    FButton,
    FAmount,
    FSvg,
  },
  mixins: [validatorMixin],
  inject: ['validate', 'formRequest'],
  data() {
    return {
      isSubmit: false,
      loading: false,
      error: '',
    }
  },
  computed: {
    ...mapState('options', ['show_pay_button_amount', 'title']),
    ...mapState('params', ['currency', 'order_id', 'merchant_id']),
    ...mapState(['total_amount']),
    ...mapState('info', ['click2pay']),
    disabled() {
      return this.isError && this.isSubmit
    },
    showAmount() {
      return this.show_pay_button_amount
    },
  },
  methods: {
    click() {
      if (this.loading) return
      this.loading = true

      this.error = ''

      this.isSubmit = true

      const {
        merchantCategoryCode,
        acquirerBIN,
        authenticationMethodType,
        challengeIndicator,
      } = this.click2pay

      this.validate()
        .then(() =>
          checkoutSelectedCard({
            payloadTypeIndicatorCheckout: 'FULL',
            dpaTransactionOptions: {
              transactionAmount: {
                transactionAmount: coinsToAmountString(this.total_amount),
                transactionCurrencyCode: this.currency,
              },
              merchantCategoryCode,
              merchantOrderId:
                this.order_id || crypto?.randomUUID() || uuidv4(),
              merchantName: this.title,
              acquirerBIN,
              acquirerMerchantId: String(this.merchant_id),
              authenticationPreferences: {
                authenticationMethods: [
                  {
                    authenticationMethodType,
                    methodAttributes: {
                      challengeIndicator,
                    },
                  },
                ],
              },
            },
          }).catch(error => {
            this.error = error

            return Promise.reject()
          })
        )
        .then(data => this.formRequest(this.store.formParams(data)))
        .finally(() => {
          this.loading = false
        })
        .catch(errorHandler)
    },
  },
}
</script>

<style lang="scss" module>
.error {
  font-size: px-to-rem(16px);
  line-height: px-to-rem(20px);
  font-weight: 500;
  color: $error;
  margin-bottom: px-to-rem(8px);
}

.spin {
  position: relative;
  z-index: 1;
  margin-left: px-to-rem(4px);
}
</style>
