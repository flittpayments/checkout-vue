<template>
  <click2pay-checkout v-if="show" />
</template>

<script>
import { Click2payCheckout, loadClick2pay } from '@/import'
import { mapState } from '@/utils/store'
import { consoleInfo } from '@/utils/console'

export default {
  components: {
    Click2payCheckout,
  },
  data() {
    return {
      show: false,
    }
  },
  computed: {
    ...mapState('click2pay', ['ready']),
    ...mapState(['order']),
  },
  watch: {
    ready: 'init',
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      if (!this.ready) return

      this.isEnabled()
        .then(loadClick2pay)
        .then(({ allowedCheckout }) => allowedCheckout())
        .then(({ actionCode }) => {
          this.store.setClick2payActionCode(actionCode)
          this.show = true
        })
        .catch(error => {
          consoleInfo('Click to Pay new-user-success-page', error)
        })
    },
    isEnabled() {
      return this.order.click2pay_save_card
        ? Promise.resolve()
        : Promise.reject('not order.click2pay_save_card')
    },
  },
}
</script>
