<template>
  <f-input-group v-if="showCurrencies">
    <f-form-group
      v-slot="scope"
      v-model="form[name]"
      v-bind="attrs"
      class="f-col"
    >
      <slot v-bind="scope" />
    </f-form-group>
    <f-form-group
      v-model="currency"
      component="select"
      :options="list"
      name="currencies"
      label=""
      rules="required"
      class="f-col-4 f-col-sm-3"
      :input-class="$style.pt_8"
      :disabled="disabled"
    />
  </f-input-group>
  <f-form-group v-else v-slot="scope" v-model="form[name]" v-bind="attrs">
    <slot v-bind="scope" />
    <span :class="$style.currency" v-text="$t(currency)" />
  </f-form-group>
</template>

<script>
import FInputGroup from '@/components/base/input-group'
import { mapState, mapStateGetSet } from '@/utils/store'
import {
  PROP_TYPE_STRING,
  PROP_TYPE_BOOLEAN,
  PROP_TYPE_NUMBER,
} from '@/constants/props'
import { makeProp } from '@/utils/props'
import { isNumber } from '@/utils/inspect'
import { parseSelect } from '@/utils/sort'
import { amountToCoins } from '@/utils/helpers'

export default {
  components: {
    FInputGroup,
  },
  inheritAttrs: false,
  props: {
    name: makeProp(PROP_TYPE_STRING, undefined, true),
    value: makeProp(PROP_TYPE_NUMBER, 0),
    subscription: makeProp(PROP_TYPE_BOOLEAN, false),
    disabled: makeProp(PROP_TYPE_BOOLEAN, false),
  },
  computed: {
    ...mapState(['params', 'currencies']),
    ...mapState('params', ['verification_type', 'recurring']),
    ...mapStateGetSet('params', ['currency']),
    attrs() {
      return {
        ...this.$attrs,
        name: this.name,
        value: this.value,
        rules: {
          required: true,
          decimal: 2,
          no_zero: !(this.verification_type || this.recurring === 'y'),
        },
        type: 'number',
        autocomplete: 'off',
        format: this.format,
        parse: this.parse,
        disabled: this.disabled,
        inputClass: this.$style.input,
      }
    },
    form() {
      return this.subscription ? this.params.recurring_data : this.params
    },
    showCurrencies() {
      return this.currencies.length > 1
    },
    list() {
      return this.currencies.map(parseSelect)
    },
  },
  watch: {
    currency: 'feeCalc',
  },
  created() {
    this.form[this.name] = this.form[this.name] || this.value
  },
  methods: {
    format(value) {
      if (/^(0|\d*\.0?)$/.test(this.last)) return this.last

      value = parseInt(value, 10)

      return isNumber(value) ? String(value / 100) : ''
    },
    parse(value) {
      this.last = value

      return amountToCoins(value)
    },
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
  color: $label_color;
  transition: all ease-in-out 0.15s;
  transform-origin: 0 0;
}

:global(#f) .pt_8 {
  padding-top: px-to-rem(8px);
}
</style>
