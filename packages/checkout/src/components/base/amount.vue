<template>
  <span>
    <component :is="tagAmount" :class="amountClass" data-e2e-amount
      >{{ integer }}<component :is="tagFractional">{{ fractional }}</component>
    </component>
    <span v-if="currency" :class="classCurrency" v-text="$t(currency)" />
  </span>
</template>

<script>
import {
  PROP_TYPE_NUMBER_STRING,
  PROP_TYPE_STRING,
  PROP_TYPE_BOOLEAN,
} from '@/constants/props'
import { makeProp } from '@/utils/props'
import { mapState } from '@/utils/store'

export default {
  props: {
    value: makeProp(PROP_TYPE_NUMBER_STRING, 0),
    currency: makeProp(PROP_TYPE_STRING),
    sup: makeProp(PROP_TYPE_BOOLEAN, false),
    amountClass: makeProp(PROP_TYPE_STRING),
    currencyClass: makeProp(PROP_TYPE_STRING),
    noBold: makeProp(PROP_TYPE_BOOLEAN, false),
  },
  computed: {
    ...mapState('params', ['lang']),
    format() {
      return new Intl.NumberFormat(this.lang, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    },
    amount() {
      const value = this.value / 100
      try {
        return this.format.format(value)
      } catch {
        return value.toFixed(2)
      }
    },
    integer() {
      return String(this.amount).slice(0, -2)
    },
    fractional() {
      return String(this.amount).slice(-2)
    },
    tagAmount() {
      return this.noBold ? 'span' : 'b'
    },
    tagFractional() {
      return this.sup ? 'sup' : 'span'
    },
    classCurrency() {
      return [this.currencyClass, this.$style.currency]
    },
  },
}
</script>

<style lang="scss" module>
.currency {
  margin-left: px-to-rem(4px);
}
</style>
