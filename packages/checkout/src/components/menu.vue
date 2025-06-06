<template>
  <div>
    <f-menu-item
      v-for="method in list"
      :key="method"
      :method="method"
      :data-e2e-menu-item="method"
    />
  </div>
</template>

<script>
import FMenuItem from '@/components/menu-item'
import { mapState } from '@/utils/store'
import { removeWallets } from '@/utils/helpers'

export default {
  components: {
    FMenuItem,
  },
  computed: {
    ...mapState('options', ['methods']),
    ...mapState(['has_fields', 'can_make_payment']),
    list() {
      return this.has_fields && this.can_make_payment
        ? this.methods
        : this.methods.filter(removeWallets)
    },
  },
}
</script>
