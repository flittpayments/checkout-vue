<template>
  <div :data-e2e-layout="theme.layout">
    <f-credit-card-plain v-if="isLayoutPlain" :loading="loading" />
    <f-credit-card-inline v-else-if="isLayoutInline" :loading="loading" />
    <f-credit-card v-else :loading="loading" />
    <f-field-email />
    <click2pay-loading v-model="loading" />
    <click2pay-change-email-wrapper />
  </div>
</template>

<script>
import { FCreditCardPlain, FCreditCardInline } from '@/import'
import FCreditCard from '@/views/checkout/method/card/credit-card'
import FFieldEmail from '@/components/fields/email'
import Click2payLoading from '@/views/click2pay/loading'
import Click2payChangeEmailWrapper from '@/views/click2pay/change-email-wrapper'
import { mapState } from '@/utils/store'
import { errorHandler } from '@/utils/helpers'

export default {
  components: {
    FCreditCardPlain,
    FCreditCardInline,
    FCreditCard,
    FFieldEmail,
    Click2payLoading,
    Click2payChangeEmailWrapper,
  },
  data() {
    return {
      loading: false,
    }
  },
  computed: {
    ...mapState(['ready']),
    ...mapState('options', ['theme']),
    ...mapState('params', ['card_number']),
    ...mapState('order', ['ready_to_submit']),
    isLayoutPlain() {
      return this.theme.layout === 'plain'
    },
    isLayoutInline() {
      return this.theme.layout === 'inline'
    },
  },
  watch: {
    card_number: 'feeCalc',
  },
  created() {
    this.feeCalc()
  },
  destroyed() {
    this.feeCalc()
  },
  methods: {
    feeCalc() {
      if (!this.ready) return
      if (this.ready_to_submit) return
      if (this.$meta.noFeeCalc) return

      this.store.feeCalc(this.$route.name).catch(errorHandler)
    },
  },
}
</script>
