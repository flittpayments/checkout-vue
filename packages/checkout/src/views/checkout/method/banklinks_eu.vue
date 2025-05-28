<template>
  <f-bank :config="config" enable-country />
</template>

<script>
import { mapState } from '@/utils/store'
import FBank from '@/views/checkout/method/bank'

export default {
  components: {
    FBank,
  },
  computed: {
    ...mapState('tabs', ['banklinks_eu']),
    config() {
      return this.banklinks_eu || {}
    },
  },
}
</script>
