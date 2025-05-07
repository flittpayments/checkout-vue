<template>
  <div>
    <f-price v-if="!amount_readonly" />
    <f-fields-customer />
    <f-fields-custom />
    <f-fields-user />
    <f-offer />
    <f-button-wallet-el />
    <f-button-cancel-wrapper />
  </div>
</template>

<script>
import FPrice from '@/components/price.vue'
import FFieldsCustomer from '@/components/fields/customer'
import FFieldsCustom from '@/components/fields/custom'
import FFieldsUser from '@/components/fields/user'
import FOffer from '@/components/offer'
import FButtonWalletEl from '@/components/button-pay-wallet-el'
import FButtonCancelWrapper from '@/components/button/button-cancel-wrapper'
import { mapState } from '@/utils/store'

export default {
  components: {
    FPrice,
    FFieldsCustomer,
    FFieldsCustom,
    FFieldsUser,
    FOffer,
    FButtonWalletEl,
    FButtonCancelWrapper,
  },
  computed: {
    ...mapState('options', ['amount_readonly']),
  },
}
</script>
