<template>
  <div :class="$style.wrapper">
    <f-shadow v-if="full_screen" />
    <f-info />
    <f-price />
    <f-button-wallet-el :no-append="showWalletsTab" :classname="$style.mb_32" />
    <f-quick-access v-if="showQuickAccess" :class="$style.mb_32" />
    <f-menu />
    <template v-if="!isBreakpointDownLg">
      <div :class="$style.flex_grow_1" />
      <f-processed-wrapper />
    </template>
  </div>
</template>

<script>
import FShadow from '@/components/base/shadow'
import FInfo from '@/components/info'
import FPrice from '@/components/price'
import FButtonWalletEl from '@/components/button-pay-wallet-el'
import { FQuickAccess } from '@/import'
import FMenu from '@/components/menu'
import FProcessedWrapper from '@/components/processed-wrapper'
import { mapState } from '@/utils/store'
import { resizeMixin } from '@/mixins/resize'

export default {
  components: {
    FShadow,
    FInfo,
    FPrice,
    FButtonWalletEl,
    FQuickAccess,
    FMenu,
    FProcessedWrapper,
  },
  mixins: [resizeMixin],
  computed: {
    ...mapState('options', ['full_screen', 'methods']),
    ...mapState(['showWalletsTab']),
    showQuickAccess() {
      return this.methods.includes('quick_access')
    },
  },
}
</script>

<style lang="scss" module>
.wrapper {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding-bottom: px-to-rem(32px);
}

.mb_32 {
  margin-bottom: px-to-rem(32px);
}

.title {
  margin-bottom: px-to-rem(16px);
  font-weight: 300;
}

.flex_grow_1 {
  flex-grow: 1;
}
</style>
