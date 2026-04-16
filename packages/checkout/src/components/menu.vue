<template>
  <div>
    <div
      v-if="showTitle"
      class="f-menu-title"
      v-text="$t('other_payment_method')"
    />
    <f-menu-item
      v-for="tab in tabs"
      :key="tab"
      :method="tab"
      :data-e2e-menu-item="tab"
    />
  </div>
</template>

<script>
import FMenuItem from '@/components/menu-item'
import { mapState } from '@/utils/store'
import { removeWallets, removeQuickAccess } from '@/utils/method'

export default {
  components: {
    FMenuItem,
  },
  computed: {
    ...mapState('options', ['methods']),
    ...mapState(['has_fields', 'can_make_payment']),
    showWalletButtons() {
      return !this.has_fields && this.can_make_payment
    },
    showTitle() {
      return (
        (this.showWalletButtons || this.methods.includes('quick_access')) &&
        this.tabs.length
      )
    },
    tabs() {
      return this.showWalletsTab
        ? this.methods.filter(removeQuickAccess)
        : this.methods.filter(removeWallets).filter(removeQuickAccess)
    },
    showWalletsTab() {
      return this.has_fields && this.can_make_payment
    },
  },
}
</script>
