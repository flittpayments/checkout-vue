<template>
  <div>
    <f-credit-card :loading="loading" />
    <f-field-email :disabled="disableEmail" />
    <click2pay-loading v-model="loading" />
    <click2pay-new-user-card-page-wrapper @enable="setDisableEmail" />
    <click2pay-user-exists-card-page-wrapper />
    <click2pay-user-exists-need-otp-card-page-wrapper />
  </div>
</template>

<script>
import FCreditCard from '@/views/checkout/method/card/card'
import FFieldEmail from '@/components/fields/email'
import Click2payLoading from '@/views/click2pay/loading'
import Click2payNewUserCardPageWrapper from '@/views/click2pay/new-user-card-page-wrapper'
import Click2payUserExistsCardPageWrapper from '@/views/click2pay/user-exists-card-page-wrapper'
import Click2payUserExistsNeedOtpCardPageWrapper from '@/views/click2pay/user-exists-need-otp-card-page-wrapper.vue'

export default {
  components: {
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
  methods: {
    setDisableEmail(value) {
      this.disableEmail = value
    },
  },
}
</script>
