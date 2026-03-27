<template>
  <div :class="$style.wrapper">
    <f-input-group>
      <f-form-group
        ref="card_number"
        v-model="card_number"
        class="f-col"
        name="card_number"
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
      <f-form-group
        ref="expiry_date"
        v-model="expiry_date"
        class="f-col-3"
        name="expiry_date"
        :rules="validExpiryDate"
        mask="##/##"
        masked
        :disabled="disabledExpiryDate"
        type="tel"
        inputmode="numeric"
        autocomplete="cc-exp"
        :format="format"
        hide-error
        @input="inputExpiryDate"
        @error="onError"
      />
      <f-form-group
        v-if="showCvv"
        ref="cvv2"
        v-model="cvv2"
        class="f-col-2"
        :input-class="$style.cvv2_input"
        name="cvv2"
        label="CVV"
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
    </f-input-group>
    <transition name="f-slide-fade">
      <div v-if="error" class="f-error">
        {{ error }}
      </div>
    </transition>
    <f-loading v-if="loading" backdrop />
  </div>
</template>

<script>
import FInputGroup from '@/components/base/input-group'
import { mapState, mapStateGetSet } from '@/utils/store'
import { createDate, format } from '@/utils/date'
import { errorHandler } from '@/utils/helpers'
import { makeProp } from '@/utils/props'
import { PROP_TYPE_BOOLEAN } from '@/constants/props'
import { FLoading } from '@/import'

export default {
  components: {
    FInputGroup,
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
  methods: {
    inputCardNumber(value) {
      if (value.length === 16 || value.length === 19) {
        this.focus(['card_number', 'expiry_date', 'cvv2'])
      } else {
        this.hash = ''
      }
    },
    inputExpiryDate() {
      this.focus(['expiry_date', 'cvv2'])
    },
    focus(fields) {
      fields
        .reduce((accum, name) => {
          return accum
            .then(() => this.$refs[name]?.validation.validate())
            .then(response => {
              if (response?.valid) return

              this.$refs[name]?.focused()
              return Promise.reject()
            })
        }, Promise.resolve())
        .catch(errorHandler)
    },
    format(value) {
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

:global(#f) .wrapper :global(.f-control-label-floating) {
  right: 0;
}

:global(#f) .cvv2_input {
  font-family: $font-family-cvv;

  &:-webkit-autofill::first-line {
    font-family: $font-family-cvv;
  }
}
</style>
