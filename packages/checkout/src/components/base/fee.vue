<template>
  <table>
    <tr>
      <td :class="$style.pr_16" v-text="$t('amount')" />
      <td><f-amount :value="amount" :currency="currency" no-bold /></td>
    </tr>
    <tr v-if="showDiscount">
      <td :class="$style.pr_16" v-text="$t('discount')" />
      <td>
        <f-percent v-if="discountPercent" :value="discountPercent" />
        <span v-if="discountPercent && discountAmount"> + </span>
        <f-amount
          v-if="discountAmount"
          :value="discountAmount"
          :currency="currency"
          no-bold
        />
      </td>
    </tr>
    <tr v-if="feeAmount">
      <td :class="$style.pr_16" v-text="$t('fee')" />
      <td><f-amount :value="feeAmount" :currency="currency" no-bold /></td>
    </tr>
    <tr>
      <td :class="$style.pr_16" v-text="$t('total_amount')" />
      <td><f-amount :value="totalAmount" :currency="currency" no-bold /></td>
    </tr>
  </table>
</template>

<script>
import FAmount from '@/components/base/amount.vue'
import FPercent from '@/components/base/percent.vue'
import { makeProp } from '@/utils/props'
import { PROP_TYPE_NUMBER } from '@/constants/props'
import { mapState } from '@/utils/store'

export default {
  components: {
    FAmount,
    FPercent,
  },
  props: {
    amount: makeProp(PROP_TYPE_NUMBER),
    discountPercent: makeProp(PROP_TYPE_NUMBER),
    discountAmount: makeProp(PROP_TYPE_NUMBER),
    feeAmount: makeProp(PROP_TYPE_NUMBER),
    totalAmount: makeProp(PROP_TYPE_NUMBER),
  },
  computed: {
    ...mapState('params', ['currency']),
    showDiscount() {
      return this.discountPercent || this.discountAmount
    },
  },
}
</script>

<style lang="scss" module>
.pr_16 {
  padding-right: px-to-rem(16px);
}
</style>
