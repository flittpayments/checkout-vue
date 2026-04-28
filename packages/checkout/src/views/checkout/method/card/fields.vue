<template>
  <div>
    <click2pay-user-exists-header-wrapper />
    <transition name="f-fade-enter">
      <router-view />
    </transition>
    <f-fields-customer />
    <f-fields-custom />
    <f-fields-user />
    <f-subscription-wrapper />
    <f-offer />
    <f-agree-to-data-processing-terms />
    <router-view name="button-pay" />
    <div v-if="isDemo" class="f-demo-desc" v-text="$t('demo_desc')" />
    <f-button-cancel-wrapper />
  </div>
</template>

<script>
import FFieldsCustomer from '@/components/fields/customer'
import FFieldsCustom from '@/components/fields/custom'
import FFieldsUser from '@/components/fields/user'
import FSubscriptionWrapper from '@/components/subscription-wrapper'
import FOffer from '@/components/offer'
import FAgreeToDataProcessingTerms from '@/components/agree-to-data-processing-terms'
import FButtonCancelWrapper from '@/components/button/button-cancel-wrapper'
import Click2payUserExistsHeaderWrapper from '@/views/click2pay/user-exists-header-wrapper'
import { mapState } from '@/utils/store'

export default {
  components: {
    FFieldsCustomer,
    FFieldsCustom,
    FFieldsUser,
    FSubscriptionWrapper,
    FOffer,
    FAgreeToDataProcessingTerms,
    FButtonCancelWrapper,
    Click2payUserExistsHeaderWrapper,
  },
  computed: {
    ...mapState('options', ['disable_request']),
    isDemo() {
      return this.disable_request
    },
  },
}
</script>
