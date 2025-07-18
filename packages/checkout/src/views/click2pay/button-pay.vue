<template>
  <div>
    <div v-if="error" :class="$style.error" v-text="$t(error)" />
    <f-button-success-pay
      :disabled="disabled"
      :loading="loading"
      @click="click"
    />
  </div>
</template>

<script>
import FButtonSuccessPay from '@/components/button/button-success-pay'
import { validatorMixin } from '@/mixins/validator'
import { mapState } from '@/utils/store'
import { checkoutSelectedCard } from '@/click2pay'
import { coinsToAmountString, errorHandler } from '@/utils/helpers'
import { v4 as uuidv4 } from 'uuid'

export default {
  components: {
    FButtonSuccessPay,
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
    ...mapState('options', ['title']),
    ...mapState('params', ['currency', 'order_id', 'merchant_id']),
    ...mapState(['total_amount']),
    ...mapState('info', ['click2pay']),
    disabled() {
      return this.isError && this.isSubmit
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
</style>
