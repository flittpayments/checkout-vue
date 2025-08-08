<template>
  <f-input-group v-if="showCurrencies">
    <f-row v-slot="scope" v-bind="attrs" v-model="value" class="f-col">
      <slot v-bind="scope" />
    </f-row>
    <f-row
      v-model="currency"
      type="select"
      :options="list"
      rules="required"
      class="f-col-4 f-col-sm-3"
      :disabled="disabled"
    />
  </f-input-group>
  <f-row v-else v-slot="scope" v-bind="attrs" v-model="value">
    <slot v-bind="scope" />
    <span :class="$uiClass('currency')" v-text="$t(currency)" />
  </f-row>
</template>

<script>
import FInputGroup from '@/components/base/input-group'
import FRow from '@/components/input/row'
import { mapState, mapStateGetSet } from '@/utils/store'
import { PROP_TYPE_BOOLEAN } from '@/constants/props'
import { makeProp } from '@/utils/props'
import { parseSelect, sort } from '@/utils/sort'
import { amountToCoins } from '@/utils/helpers'
import { formatterAmount } from '@/utils/formatter'

export default {
  components: {
    FInputGroup,
    FRow,
  },
  inheritAttrs: false,
  props: {
    subscription: makeProp(PROP_TYPE_BOOLEAN, false),
    disabled: makeProp(PROP_TYPE_BOOLEAN, false),
  },
  data() {
    return {
      name: 'amount',
    }
  },
  computed: {
    ...mapState(['params', 'currencies']),
    ...mapState('params', ['verification_type', 'recurring']),
    ...mapStateGetSet('params', ['currency']),
    value: {
      get() {
        return this.form[this.name] / 100
      },
      set(val) {
        this.form[this.name] = amountToCoins(val)
      },
    },
    attrs() {
      return {
        ...this.$attrs,
        name: this.name,
        rules: {
          required: true,
          no_zero: !(this.verification_type || this.recurring === 'y'),
        },
        type: 'number',
        autocomplete: 'off',
        disabled: this.disabled,
        inputClass: this.$style.input,
        formatter: formatterAmount,
      }
    },
    form() {
      return this.subscription ? this.params.recurring_data : this.params
    },
    showCurrencies() {
      return this.currencies.length > 1
    },
    list() {
      return this.currencies.map(parseSelect).sort(sort('text'))
    },
  },
  watch: {
    currency: 'feeCalc',
  },
  methods: {
    feeCalc() {
      this.store.feeCalc()
    },
  },
}
</script>

<style lang="scss" module>
.input {
  -moz-appearance: textfield;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    appearance: none;
    margin: 0;
  }
}

.currency {
  position: absolute;
  top: px-to-rem(17px);
  right: px-to-rem(12px);
  z-index: 1;
  font-size: px-to-rem(16px);
  font-weight: 500;
  color: var(--color);
  transition: all ease-in-out 0.15s;
  transform-origin: 0 0;
}

.currency_light {
  --color: #{$grey_1};
}

.currency_dark {
  --color: #{$white_04};
}
</style>
