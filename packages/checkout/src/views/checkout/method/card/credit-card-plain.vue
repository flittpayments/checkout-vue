<template>
  <div :class="$style.wrapper">
    <div :class="$style.group">
      <f-row
        ref="card_number"
        v-model="card_number"
        :class="$style.card_number"
        :input-class="$style.card_number_input"
        :input-error-class="$style.error"
        :label-class="$style.card_number_label"
        label="card_number"
        :rules="validCardNumber"
        mask="XXXX XXXX XXXX XXXX XXX"
        :maxlength="23"
        :disabled="disabledCardNumber"
        type="tel"
        inputmode="numeric"
        autocomplete="cc-number"
        hide-error
        @input="inputCardNumber"
        @error="onError"
      />
      <f-row
        ref="expiry_date"
        v-model="expiry_date"
        :class="classExpiryDateWrapper"
        :input-class="classExpiryDateInput"
        :input-error-class="$style.error"
        :label-class="$style.expiry_date_label"
        label="expiry_date"
        :rules="validExpiryDate"
        mask="##/##"
        masked
        :disabled="disabledExpiryDate"
        type="tel"
        inputmode="numeric"
        autocomplete="cc-exp"
        :formatter="formatter"
        hide-error
        @input="inputExpiryDate"
        @error="onError"
      />
      <f-row
        v-if="showCvv"
        ref="cvv2"
        v-model="cvv2"
        :class="$style.cvv2"
        :input-class="$style.cvv2_input"
        :input-error-class="$style.error"
        :label-class="$style.cvv2_label"
        label="cvv2"
        :rules="validCvv"
        type="tel"
        inputmode="numeric"
        mask="####"
        :disabled="disabled"
        :maxlength="digitsCvv"
        autocomplete="cc-csc"
        hide-error
        @error="onError"
      />
    </div>
    <f-error :show="!!error">{{ error }}</f-error>
    <f-loading v-if="loading" backdrop />
  </div>
</template>

<script>
import FRow from '@/components/input/row'
import FError from '@/components/base/error'
import { mapState, mapStateGetSet } from '@/utils/store'
import { createDate, format } from '@/utils/date'
import { errorHandler } from '@/utils/helpers'
import { makeProp } from '@/utils/props'
import { PROP_TYPE_BOOLEAN } from '@/constants/props'
import { FLoading } from '@/import'

export default {
  components: {
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
    classExpiryDateWrapper() {
      return this.$uiClass('expiry_date', {
        full: !this.showCvv,
      })
    },
    classExpiryDateInput() {
      return this.$uiClass('expiry_date_input', {
        full: !this.showCvv,
      })
    },
    disabledCardNumber() {
      return this.disabled || this.read_only
    },
    disabledExpiryDate() {
      return this.disabled || this.readonlyExpiryDate
    },
    validExpiryDate() {
      if (this.disabledExpiryDate) return
      if (!this.need_validate_card) return {}

      let minDate = this.store.state.validate_expdate
        ? format(createDate(), 'MM/YY')
        : '01/19'

      return `required|date_format:MM/yy|after:${minDate},true,MM/yy`
    },
    validCardNumber() {
      if (this.disabledCardNumber) return
      if (!this.need_validate_card) return {}

      let needValidCard =
        !this.hash &&
        (this.card_number.length === 16 ||
          this.card_number.length === 19 ||
          this.submited)

      return needValidCard ? 'required|ccard' : 'required'
    },
    validCvv() {
      if (this.disabled) return
      if (!this.need_validate_card) return {}

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
    card_number(value) {
      if (!this.ready) return

      this.store
        .feeCalc({
          card_bin: this.getCardBin(value),
        })
        .catch(errorHandler)
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
    inputCardNumber(value) {
      if (value.length === 16 || value.length === 19) {
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
    formatter(value) {
      value = value.replace(/[^\d]/, '/')
      let [month, year] = value.split('/')

      if (year && year.length === 4) {
        month = `0${month}`.slice(-2)
        year = year.slice(-2)
        value = `${month}/${year}`
      }

      return value
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
.wrapper {
  position: relative;
  margin-bottom: px-to-rem(16px);
}

.group {
  display: flex;
  flex-wrap: wrap;
}

.card_number {
  width: 100%;
  flex: 0 0 100%;
  max-width: 100%;
  margin-bottom: px-to-rem(-2px);
}

.card_number_input.card_number_input {
  border-radius: $border-radius $border-radius 0 0;
}

.expiry_date {
  width: 100%;
  flex: 1;
  max-width: calc(50% + #{px-to-rem(1px)});
  margin-bottom: 0;
  margin-right: px-to-rem(-2px);
}

.expiry_date_full {
  flex: 0 0 100%;
  max-width: 100%;
}

.expiry_date_input.expiry_date_input {
  border-radius: 0 0 0 $border-radius;
}

.expiry_date_input_full.expiry_date_input_full {
  border-radius: 0 0 $border-radius $border-radius;
}

.cvv2 {
  width: 100%;
  flex: 1;
  max-width: calc(50% + #{px-to-rem(1px)});
  margin-bottom: 0;
}

.cvv2_input.cvv2_input {
  border-radius: 0 0 $border-radius 0;

  font-family: $font-family-cvv;

  &:-webkit-autofill::first-line {
    font-family: $font-family-cvv;
  }
}

.error {
  z-index: 1;
}

.card_number_input.card_number_input,
.expiry_date_input.expiry_date_input,
.cvv2_input.cvv2_input {
  position: relative;

  &:focus {
    z-index: 2;
  }

  &:hover {
    z-index: 3;
  }
}

.card_number_label,
.expiry_date_label,
.cvv2_label {
  z-index: 4;
}
</style>
