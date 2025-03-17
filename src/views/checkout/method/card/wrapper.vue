<template>
  <div :data-e2e-layout="theme.layout">
    <f-credit-card-plain v-if="isLayoutPlain" :loading="loading" />
    <f-credit-card v-else :loading="loading" />
    <f-field-email :disabled="disableEmail" />
    <click2pay-loading v-model="loading" />
    <click2pay-new-user-card-page-wrapper @enable="setDisableEmail" />
    <click2pay-user-exists-card-page-wrapper />
    <click2pay-user-exists-need-otp-card-page-wrapper />
  </div>
</template>

<script>
import { FCreditCardPlain } from '@/import'
import FCreditCard from '@/views/checkout/method/card/credit-card'
import FFieldEmail from '@/components/fields/email'
import Click2payLoading from '@/views/click2pay/loading'
import Click2payNewUserCardPageWrapper from '@/views/click2pay/new-user-card-page-wrapper'
import Click2payUserExistsCardPageWrapper from '@/views/click2pay/user-exists-card-page-wrapper'
import Click2payUserExistsNeedOtpCardPageWrapper from '@/views/click2pay/user-exists-need-otp-card-page-wrapper.vue'
import { mapState } from '@/utils/store'

export default {
  components: {
    FCreditCardPlain,
    FCreditCard,
    FFieldEmail,
    Click2payLoading,
    Click2payNewUserCardPageWrapper,
    Click2payUserExistsCardPageWrapper,
    Click2payUserExistsNeedOtpCardPageWrapper,
  },
  data() {
    return {
      disableEmail: false,
      loading: false,
    }
  },
  computed: {
    ...mapState('options', ['theme']),
    isLayoutPlain() {
      return this.theme.layout === 'plain'
    },
  },
  methods: {
    setDisableEmail(value) {
      this.disableEmail = value
    },
  },
}
</script>
