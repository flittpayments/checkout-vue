<template>
  <div :class="$style.wrapper">
    <div :class="$style.group">
      <f-form-group
        ref="card_number"
        v-model="card_number"
        :class="$style.card_number"
        :input-class="$style.card_number_input"
        :label-class="$style.card_number_label"
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
        :class="$style.expiry_date"
        :input-class="$style.expiry_date_input"
        :label-class="$style.expiry_date_label"
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
        :class="$style.cvv2"
        :input-class="$style.cvv2_input"
        :label-class="$style.cvv2_label"
        name="cvv2"
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
    <transition name="f-slide-fade">
      <div v-if="error" class="f-error">
        {{ error }}
      </div>
    </transition>
    <f-loading v-if="loading" backdrop />
  </div>
</template>

<script>
import { mapState, mapStateGetSet } from '@/utils/store'
import { createDate, format } from '@/utils/date'
import { errorHandler } from '@/utils/helpers'
import { makeProp } from '@/utils/props'
import { PROP_TYPE_BOOLEAN } from '@/constants/props'
import { FLoading } from '@/import'

export default {
  components: {
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
      return this.cvv2_requirement === 'absent'
    },
    isCvvMandatory() {
      return this.cvv2_requirement === 'mandatory'
    },
    isCvvOptional() {
      return this.cvv2_requirement === 'optional'
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
    ready: 'watchReady',
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
    watchReady() {
      if (this.isCards) return // TODO remove after new input
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

:global(#f) .card_number_input {
  border-radius: $border-radius $border-radius 0 0;
}

.expiry_date {
  width: 100%;
  flex: 0 0 calc(50% + #{px-to-rem(1px)});
  max-width: calc(50% + #{px-to-rem(1px)});
  margin-bottom: 0;
  margin-right: px-to-rem(-2px);
}

:global(#f) .expiry_date_input {
  border-radius: 0 0 0 $border-radius;
}

.cvv2 {
  width: 100%;
  flex: 0 0 calc(50% + #{px-to-rem(1px)});
  max-width: calc(50% + #{px-to-rem(1px)});
  margin-bottom: 0;
}

:global(#f) .cvv2_input {
  border-radius: 0 0 $border-radius 0;

  font-family: $font-family-cvv;

  &:-webkit-autofill::first-line {
    font-family: $font-family-cvv;
  }
}

:global(#f) .card_number_input,
:global(#f) .expiry_date_input,
:global(#f) .cvv2_input {
  position: relative;

  &:global(.f-control-error) {
    z-index: 1;
  }

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
