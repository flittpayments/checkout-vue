<template>
  <div class="f-sepa">
    <div v-text="$t('sepa_t')" />

    <f-row
      v-model="params.sender_name"
      label="sender_name"
      rules="required|alpha"
    />
    <f-row
      v-model="params.sender_familyName"
      label="sender_familyname"
      rules="required|alpha"
    />
    <div class="f-row">
      <f-row v-model="params.bic" class="f-col" label="bic" rules="required" />
      <f-row
        v-model="params.iban"
        class="f-col"
        label="iban"
        rules="required"
      />
    </div>

    <f-offer />
    <f-button-pay />
    <f-button-cancel-wrapper />
  </div>
</template>

<script>
import FRow from '@/components/input/row'
import FOffer from '@/components/offer'
import FButtonPay from '@/components/button/button-pay'
import FButtonCancelWrapper from '@/components/button/button-cancel-wrapper'
import { mapState } from '@/utils/store'

export default {
  components: {
    FRow,
    FOffer,
    FButtonPay,
    FButtonCancelWrapper,
  },
  computed: {
    ...mapState(['params']),
  },
}
</script>
