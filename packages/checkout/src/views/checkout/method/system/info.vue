<template>
  <div>
    <div :class="$uiClass('title')" v-text="$t('enter_details_to_continue')" />
    <div class="f-bank-desc" v-text="$t('bank_desc', { name: info.name })" />
    <div class="f-container-sm">
      <f-fields-bank :fields="info.form?.fields" />
      <f-fields-customer />
      <f-fields-custom />
      <f-fields-user />
      <f-offer />
      <f-button-pay />
      <f-button-cancel-wrapper />
    </div>
  </div>
</template>

<script>
import FFieldsBank from '@/components/fields/bank'
import FFieldsCustomer from '@/components/fields/customer'
import FFieldsCustom from '@/components/fields/custom'
import FFieldsUser from '@/components/fields/user'
import FOffer from '@/components/offer'
import FButtonPay from '@/components/button/button-pay'
import FButtonCancelWrapper from '@/components/button/button-cancel-wrapper'
import { mapState } from '@/utils/store'
import { makeProp } from '@/utils/props'
import { PROP_TYPE_STRING } from '@/constants/props'
import { errorHandler } from '@/utils/helpers'

export default {
  components: {
    FFieldsBank,
    FFieldsCustomer,
    FFieldsCustom,
    FFieldsUser,
    FOffer,
    FButtonPay,
    FButtonCancelWrapper,
  },
  inject: ['formRequest'],
  props: {
    method: makeProp(PROP_TYPE_STRING),
    system: makeProp(PROP_TYPE_STRING),
  },
  computed: {
    ...mapState(['tabs']),
    info() {
      return this.tabs[this.method][this.system]
    },
  },
  created() {
    this.autoSubmit()
  },
  methods: {
    autoSubmit() {
      if (!this.store.isAutoSubmitAllowedByMethod(this.info)) return

      this.formRequest(this.store.formParams()).catch(errorHandler)
    },
  },
}
</script>

<style lang="scss" module>
.title {
  font-size: px-to-rem(20px);
  line-height: px-to-rem(29px);
  font-weight: 500;
  margin-bottom: px-to-rem(8px);
}

.title_light {
  color: #3d3d3d;
}

.title_dark {
  color: #fff;
}
</style>
