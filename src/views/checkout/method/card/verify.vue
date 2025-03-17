<template>
  <div>
    <f-credit-card-plain v-if="isLayoutPlain" disabled />
    <f-credit-card v-else disabled />
    <f-field-email />
    <f-form-group
      v-if="isCode"
      v-model="code"
      name="verification_code"
      :rules="validCode"
      type="tel"
      :maxlength="4"
    />
    <f-form-group
      v-if="isAmount"
      v-model="code"
      name="verification_amount"
      :rules="validAmount"
      type="text"
    />
    <f-subscription-wrapper />
    <f-offer />
    <f-button-pay :no-amount="isAmount" />
    <f-button-cancel-wrapper />
  </div>
</template>

<script>
import FCreditCard from '@/views/checkout/method/card/credit-card'
import FFieldEmail from '@/components/fields/email'
import FSubscriptionWrapper from '@/components/subscription-wrapper'
import FOffer from '@/components/offer'
import FButtonPay from '@/components/button/button-pay'
import FButtonCancelWrapper from '@/components/button/button-cancel-wrapper'
import { mapState, mapStateGetSet } from '@/utils/store'
import { FCreditCardPlain } from '@/import'

export default {
  components: {
    FCreditCardPlain,
    FCreditCard,
    FFieldEmail,
    FSubscriptionWrapper,
    FOffer,
    FButtonPay,
    FButtonCancelWrapper,
  },
  computed: {
    ...mapState(['order']),
    ...mapStateGetSet('params', [
      'card_number',
      'expiry_date',
      'cvv2',
      'code',
      'verification_type',
    ]),
    ...mapState('options', ['theme']),
    isLayoutPlain() {
      return this.theme.layout === 'plain'
    },
    validCode() {
      return /EURT/.test(this.code) ? 'required' : 'required|digits:4'
    },
    validAmount() {
      return {
        required: true,
        numrange: [0, 9999999.99],
        regex: '^\\d{1,7}([,.]\\d{1,2})?$',
      }
    },
    isCode() {
      return this.verification_type !== 'amount'
    },
    isAmount() {
      return this.verification_type === 'amount'
    },
  },
  created() {
    this.card_number = this.order.order_data.masked_card
    this.expiry_date = this.order.order_data.expiry_date || ''
    this.cvv2 = ''
  },
}
</script>
