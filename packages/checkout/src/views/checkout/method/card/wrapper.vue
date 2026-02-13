<template>
  <div :data-e2e-layout="theme.layout">
    <f-credit-card-plain v-if="isLayoutPlain" :loading="loading" />
    <f-credit-card v-else :loading="loading" />
    <f-field-email />
    <click2pay-loading v-model="loading" />
    <click2pay-change-email-wrapper />
  </div>
</template>

<script>
import { FCreditCardPlain } from '@/import'
import FCreditCard from '@/views/checkout/method/card/credit-card'
import FFieldEmail from '@/components/fields/email'
import Click2payLoading from '@/views/click2pay/loading'
import Click2payChangeEmailWrapper from '@/views/click2pay/change-email-wrapper'
import { mapState } from '@/utils/store'

export default {
  components: {
    FCreditCardPlain,
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
    ...mapState('options', ['theme']),
    isLayoutPlain() {
      return this.theme.layout === 'plain'
    },
  },
}
</script>
