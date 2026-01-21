<template>
  <div>
    <click2pay-user-exists-header-wrapper />
    <router-view v-slot="{ Component }">
      <transition name="f-fade-enter">
        <component :is="Component" />
      </transition>
    </router-view>
    <f-fields-customer />
    <f-fields-custom />
    <f-fields-user />
    <f-subscription-wrapper />
    <f-offer />
    <router-view name="button-pay" />
    <div v-if="isDemo" :class="$style.demo" v-text="$t('demo_desc')" />
    <f-button-cancel-wrapper />
  </div>
</template>

<script>
import FFieldsCustomer from '@/components/fields/customer'
import FFieldsCustom from '@/components/fields/custom'
import FFieldsUser from '@/components/fields/user'
import FSubscriptionWrapper from '@/components/subscription-wrapper'
import FOffer from '@/components/offer'
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

<style lang="scss" module>
.demo {
  margin-top: px-to-rem(16px);
  font-size: px-to-rem(14px);
  text-align: center;
}
</style>
