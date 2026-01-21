<template>
  <f-container>
    <template v-if="isBreakpointDownLg">
      <f-info v-if="isOnlyCard" />
      <f-price />
      <f-button-wallet-el classname="f-mb-24" />
      <f-quick-access v-if="showQuickAccess" class="f-mb-24" />
      <f-icons
        v-if="isOnlyCard"
        class="f-mb-16"
        :title="$t('pay_with_card')"
        :count="5"
      />
    </template>
    <router-view v-slot="{ Component }">
      <transition name="f-fade-enter">
        <component :is="Component" />
      </transition>
    </router-view>
    <click2pay-redirect-wrapper />
  </f-container>
</template>

<script>
import { mapState } from '@/utils/store'
import FContainer from '@/components/base/container'
import FInfo from '@/components/info'
import FPrice from '@/components/price'
import FIcons from '@/components/icons'
import FButtonWalletEl from '@/components/button-pay-wallet-el'
import { FQuickAccess } from '@/import'
import { resizeMixin } from '@/mixins/resize'
import Click2payRedirectWrapper from '@/views/click2pay/redirect-wrapper'

export default {
  components: {
    FContainer,
    FInfo,
    FPrice,
    FIcons,
    FButtonWalletEl,
    FQuickAccess,
    Click2payRedirectWrapper,
  },
  mixins: [resizeMixin],
  computed: {
    ...mapState('options', ['methods']),
    ...mapState(['isOnlyCard']),
    showQuickAccess() {
      return this.methods.includes('quick_access')
    },
  },
}
</script>
