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
    ...mapState('tabs', ['banks']),
    config() {
      return this.banks || {}
    },
  },
}
</script>
