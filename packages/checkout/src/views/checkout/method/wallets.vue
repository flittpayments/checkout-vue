<template>
  <div class="f-container-sm">
    <template v-if="isBreakpointDownLg">
      <f-info v-if="isOnlyWallets" />
      <f-price />
    </template>
    <f-fields-customer />
    <f-fields-custom />
    <f-fields-user />
    <f-offer />
    <f-agree-to-data-processing-terms />
    <f-button-wallet-el />
    <f-button-cancel-wrapper />
  </div>
</template>

<script>
import FInfo from '@/components/info'
import FPrice from '@/components/price'
import FFieldsCustomer from '@/components/fields/customer'
import FFieldsCustom from '@/components/fields/custom'
import FFieldsUser from '@/components/fields/user'
import FOffer from '@/components/offer'
import FAgreeToDataProcessingTerms from '@/components/agree-to-data-processing-terms'
import FButtonWalletEl from '@/components/button-pay-wallet-el'
import FButtonCancelWrapper from '@/components/button/button-cancel-wrapper'
import { resizeMixin } from '@/mixins/resize'
import { mapState } from '@/utils/store'

export default {
  components: {
    FInfo,
    FPrice,
    FFieldsCustomer,
    FFieldsCustom,
    FFieldsUser,
    FOffer,
    FAgreeToDataProcessingTerms,
    FButtonWalletEl,
    FButtonCancelWrapper,
  },
  mixins: [resizeMixin],
  computed: {
    ...mapState(['isOnlyWallets']),
  },
}
</script>
