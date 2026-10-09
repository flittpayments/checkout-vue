<template>
  <div :class="$style.wrapper">
    <f-input-group>
      <f-row
        ref="card_number"
        v-model="cardNumberInner"
        class="f-col"
        :label-class="$style.label"
        label="card_number"
        :rules="cardNumberValid"
        :maxlength="cardConfig.cardNumberMaxLength"
        :disabled="cardNumberDisabled"
        type="tel"
        inputmode="numeric"
        autocomplete="cc-number"
        hide-error
        :formatter="cardNumberFormatter"
        @input="cardNumberInput"
        @error="onError"
      />
      <f-row
        ref="expiry_date"
        v-model="expiry_date"
        class="f-col-3"
        :label-class="$style.label"
        label="expiry_date"
        :rules="expiryDateValid"
        :disabled="expiryDateDisabled"
        type="tel"
        inputmode="numeric"
        autocomplete="cc-exp"
        :formatter="expiryDateFormatter"
        hide-error
        @input="expiryDateInput"
        @error="onError"
      />
      <f-row
        v-if="showCvv"
        ref="cvv2"
        v-model="cvv2"
        :class="cvvClass"
        :label-class="$style.label"
        :input-class="$style.cvv2_input"
        label="CVV"
        :rules="cvvValid"
        type="tel"
        inputmode="numeric"
        :disabled="disabled"
        :maxlength="cvvLength"
        autocomplete="cc-csc"
        hide-error
        :formatter="cvvFormatter"
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
import { getCardConfig } from '@/utils/get-bin-name'
import {
  formatter,
  normalizeAutofillExpiryDate,
  simpleFormatter,
} from '@/utils/formatter'
import { mask } from '@/utils/mask'

export default {
  components: {
    FInputGroup,
    FRow,
    FError,
    FLoading,
  },
  inject: ['form'],
  props: {
    loading: makeProp(PROP_TYPE_BOOLEAN),
    disabled: makeProp(PROP_TYPE_BOOLEAN),
  },
  data() {
    return {
      expiryDateReadonly: false,
      error: '',
    }
  },
  computed: {
    ...mapState([
      'ready',
      'read_only',
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
    cardConfig() {
      return getCardConfig(this.card_number)
    },
    cardNumberFormatter() {
      return formatter(this.cardConfig.cardNumberMask)
    },
    expiryDateFormatter() {
      return formatter(
        this.cardConfig.expiryDateMask,
        normalizeAutofillExpiryDate
      )
    },
    cvvFormatter() {
      return simpleFormatter(this.cardConfig.cvvMask)
    },
    cardNumberInner: {
      get() {
        return mask(
          this.card_number,
          this.cardConfig.cardNumberMask,
          true,
          true
        )
      },
      set(value) {
        this.card_number = mask(value, this.cardConfig.cardNumberMask, false)
      },
    },
    cardNumberDisabled() {
      return this.disabled || this.read_only
    },
    expiryDateDisabled() {
      return this.disabled || this.expiryDateReadonly
    },
    expiryDateValid() {
      if (this.expiryDateDisabled) return
      if (!this.need_validate_card) return

      let minDate = this.store.state.validate_expdate
        ? format(createDate(), 'MM/YY')
        : '01/19'

      return {
        required: true,
        date_format: 'MM/yy',
        after: [minDate, true, 'MM/yy'],
      }
    },
    cardNumberValid() {
      if (this.cardNumberDisabled) return
      if (!this.need_validate_card) return

      let needValidCard =
        !this.hash &&
        (this.cardConfig.cardNumberLengths.includes(this.card_number.length) ||
          this.form.state.isValidating)

      return needValidCard ? 'required|ccard' : 'required'
    },
    cvvValid() {
      if (this.disabled) return
      if (!this.need_validate_card) return

      return {
        required: this.isCvvMandatory,
        digits: this.cvvLength,
      }
    },
    cvvLength() {
      return this.cardConfig.cvvLength
    },
    cvvClass() {
      return { 3: 'f-col-2', 4: 'f-col-3' }[this.cvvLength]
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
    read_only(value) {
      if (!value) return
      if (!this.expiry_date) return

      this.expiryDateReadonly = true
    },
    ready: 'watchReady',
  },
  mounted() {
    this.focus()
  },
  methods: {
    cardNumberInput() {
      if (this.cardConfig.cardNumberLengths.includes(this.card_number.length)) {
        this.focus()
      } else {
        this.hash = ''
      }
    },
    expiryDateInput() {
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
    watchReady() {
      this.focus()
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
