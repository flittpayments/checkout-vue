<template>
  <f-container>
    <template v-if="isBreakpointDownLg">
      <f-info v-if="isOnlyWallets" />
      <f-price />
    </template>
    <f-fields-customer />
    <f-fields-custom />
    <f-fields-user />
    <f-offer />
    <f-button-wallet-el />
    <f-button-cancel-wrapper />
  </f-container>
</template>

<script>
import FContainer from '@/components/base/container'
import FInfo from '@/components/info'
import FPrice from '@/components/price'
import FFieldsCustomer from '@/components/fields/customer'
import FFieldsCustom from '@/components/fields/custom'
import FFieldsUser from '@/components/fields/user'
import FOffer from '@/components/offer'
import FButtonWalletEl from '@/components/button-pay-wallet-el'
import FButtonCancelWrapper from '@/components/button/button-cancel-wrapper'
import { resizeMixin } from '@/mixins/resize'
import { mapState } from '@/utils/store'

export default {
  components: {
    FContainer,
    FInfo,
    FPrice,
    FFieldsCustomer,
    FFieldsCustom,
    FFieldsUser,
    FOffer,
    FButtonWalletEl,
    FButtonCancelWrapper,
  },
  mixins: [resizeMixin],
  computed: {
    ...mapState(['isOnlyWallets']),
  },
}
</script>
