<template>
  <div :class="$style.wrapper">
    <f-input-group>
      <f-row
        ref="card_number"
        v-model="innerCardNumber"
        class="f-col"
        :label-class="$style.label"
        label="card_number"
        :rules="validCardNumber"
        :maxlength="23"
        :disabled="disabledCardNumber"
        type="tel"
        inputmode="numeric"
        autocomplete="cc-number"
        hide-error
        :formatter="formatterCardNumber"
        @input="inputCardNumber"
        @error="onError"
      />
      <f-row
        ref="expiry_date"
        v-model="expiry_date"
        class="f-col-3"
        :label-class="$style.label"
        label="expiry_date"
        :rules="validExpiryDate"
        :disabled="disabledExpiryDate"
        type="tel"
        inputmode="numeric"
        autocomplete="cc-exp"
        :formatter="formatterExpiryDate"
        hide-error
        @input="inputExpiryDate"
        @error="onError"
      />
      <f-row
        v-if="showCvv"
        ref="cvv2"
        v-model="cvv2"
        class="f-col-2"
        :label-class="$style.label"
        :input-class="$style.cvv2_input"
        label="CVV"
        :rules="validCvv"
        type="tel"
        inputmode="numeric"
        :disabled="disabled"
        :maxlength="digitsCvv"
        autocomplete="cc-csc"
        hide-error
        :formatter="formatterCvv"
        @error="onError"
      />
    </f-input-group>
    <f-error :show="!!error">{{ error }}</f-error>
    <f-loading v-if="loading" backdrop />
  </div>
</template>

<script>
import FInputGroup from '@/components/base/input-group'
import FRow from '@/components/input/row'
import FError from '@/components/base/error'
import { mapState, mapStateGetSet } from '@/utils/store'
import { createDate, format } from '@/utils/date'
import { errorHandler } from '@/utils/helpers'
import { makeProp } from '@/utils/props'
import { PROP_TYPE_BOOLEAN } from '@/constants/props'
import { FLoading } from '@/import'
import {
  formattersCardNumber,
  formatterExpiryDate,
  formatterCvv,
} from '@/utils/formatter'

export default {
  components: {
    FInputGroup,
    FRow,
    FError,
    FLoading,
  },
  props: {
    loading: makeProp(PROP_TYPE_BOOLEAN),
    disabled: makeProp(PROP_TYPE_BOOLEAN),
  },
  data() {
    return {
      config: [9, 8, 7, 6, 1],
      readonlyExpiryDate: false,
      error: '',
    }
  },
  computed: {
    ...mapState([
      'ready',
      'read_only',
      'submited',
      'need_validate_card',
      'cvv2_requirement',
    ]),
    ...mapState('options', {
      optionsCvv2Requirement: 'cvv2_requirement',
    }),
    ...mapStateGetSet('params', [
      'cvv2',
      'expiry_date',
      'card_number',
      'code',
      'hash',
    ]),
    innerCardNumber: {
      get() {
        return formattersCardNumber.format(this.card_number)
      },
      set(value) {
        this.card_number = formattersCardNumber.parse(value)
      },
    },
    disabledCardNumber() {
      return this.disabled || this.read_only
    },
    disabledExpiryDate() {
      return this.disabled || this.readonlyExpiryDate
    },
    validExpiryDate() {
      if (this.disabledExpiryDate) return
      if (!this.need_validate_card) return

      let minDate = this.store.state.validate_expdate
        ? format(createDate(), 'MM/YY')
        : '01/19'

      return `required|date_format:MM/yy|after:${minDate},true,MM/yy`
    },
    validCardNumber() {
      if (this.disabledCardNumber) return
      if (!this.need_validate_card) return

      let needValidCard =
        !this.hash &&
        ([16, 19].includes(this.card_number.length) || this.submited)

      return needValidCard ? 'required|ccard' : 'required'
    },
    validCvv() {
      if (this.disabled) return
      if (!this.need_validate_card) return

      return {
        required: this.isCvvMandatory,
        digits: this.digitsCvv,
      }
    },
    digitsCvv() {
      return this.card_number.match('^3(?:2|3|4|7)') ? 4 : 3
    },
    showCvv() {
      return !this.isCvvAbsent
    },
    isCvvAbsent() {
      return this.cvv2_requirement
        ? this.cvv2_requirement === 'absent'
        : this.optionsCvv2Requirement === 'absent'
    },
    isCvvMandatory() {
      return this.cvv2_requirement
        ? this.cvv2_requirement === 'mandatory'
        : this.optionsCvv2Requirement === 'mandatory'
    },
    isCvvOptional() {
      return this.cvv2_requirement
        ? this.cvv2_requirement === 'optional'
        : this.optionsCvv2Requirement === 'optional'
    },
  },
  watch: {
    card_number: {
      handler(value) {
        if (!this.ready) return

        this.store
          .feeCalc({
            card_bin: this.getCardBin(value),
          })
          .catch(errorHandler)
      },
      immediate: true,
    },
    read_only(value) {
      if (!value) return
      if (!this.expiry_date) return

      this.readonlyExpiryDate = true
    },
  },
  mounted() {
    this.focus()
  },
  methods: {
    formatterCardNumber: formattersCardNumber.input,
    formatterExpiryDate,
    formatterCvv,
    inputCardNumber() {
      if ([16, 19].includes(this.card_number.length)) {
        this.focus()
      } else {
        this.hash = ''
      }
    },
    inputExpiryDate() {
      this.focusInvalid(['expiry_date', 'cvv2'])
    },
    focusInvalid(fields) {
      fields
        .reduce((accum, name) => {
          return accum
            .then(() => this.$refs[name]?.validate())
            .then(response => {
              if (response?.valid) return

              this.$refs[name]?.focus()
              return Promise.reject()
            })
        }, Promise.resolve())
        .catch(errorHandler)
    },
    getCardBin(value) {
      let count = this.config.find(
        count => value.slice(0, count).length === count
      )
      return value.slice(0, count)
    },
    focus() {
      if (!this.ready) return

      this.focusInvalid(['card_number', 'expiry_date', 'cvv2'])
    },
    onError(error) {
      this.error = error
    },
  },
}
</script>

<style lang="scss" module>
$font-family-cvv: 'Cvv', sans-serif;

.wrapper {
  position: relative;
  margin-bottom: px-to-rem(16px);
}

.label.label {
  right: 0;
}

.cvv2_input.cvv2_input {
  font-family: $font-family-cvv;

  &:-webkit-autofill::first-line {
    font-family: $font-family-cvv;
  }
}
</style>
