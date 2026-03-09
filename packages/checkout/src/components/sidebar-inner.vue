<template>
  <div class="f-method">
    <div v-if="full_screen" class="f-top"><div class="f-top-inner" /></div>
    <f-info />
    <f-price />
    <f-button-wallet-el :no-append="showWalletsTab" classname="f-mb-32" />
    <div
      v-if="showTitle"
      class="f-menu-title"
      v-text="$t('other_payment_method')"
    />
    <f-menu />
    <template v-if="!isBreakpointDownLg">
      <div class="f-flex-grow-1" />
      <f-processed-wrapper />
    </template>
  </div>
</template>

<script>
import FInfo from '@/components/info'
import FPrice from '@/components/price'
import FButtonWalletEl from '@/components/button-pay-wallet-el'
import FMenu from '@/components/menu'
import FProcessedWrapper from '@/components/processed-wrapper'
import { mapState } from '@/utils/store'
import { resizeMixin } from '@/mixins/resize'

export default {
  components: {
    FInfo,
    FPrice,
    FButtonWalletEl,
    FMenu,
    FProcessedWrapper,
  },
  mixins: [resizeMixin],
  computed: {
    ...mapState('options', ['full_screen']),
    ...mapState(['showWalletsTab', 'can_make_payment']),
    showTitle() {
      return !this.showWalletsTab && this.can_make_payment
    },
  },
}
</script>
