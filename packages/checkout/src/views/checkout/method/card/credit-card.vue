<template>
  <div data-e2e-card :class="$style.wrapper">
    <div :class="$uiClass('shadow')" />
    <f-card-bg />
    <transition name="f-fade">
      <f-icon-bin v-if="card_number" :class="$style.brand" :bin="card_number" />
    </transition>
    <f-form-group
      ref="card_number"
      v-model="card_number"
      :class="[$style.wrapper_input, $style.wrapper_card_number]"
      :label-class="$style.label"
      :name-class="[$style.input, $style.placeholder]"
      name="card_number"
      placeholder="____ ____ ____ ____"
      :rules="validCardNumber"
      mask="XXXX XXXX XXXX XXXX XXX"
      :maxlength="23"
      :disabled="disabledCardNumber"
      type="tel"
      inputmode="numeric"
      tooltip
      no-label-floating
      dynamic-placeholder
      autocomplete="cc-number"
      @input="inputCardNumber"
    >
      <template v-if="disabledCardNumber" #label="{ label }">
        <span :class="$style.label">
          {{ label }} <f-svg :class="$style.ml_4" name="lock-alt" size="lg" />
        </span>
      </template>
      <template v-else-if="isCards" #label="{ label }">
        <f-card-list-wrapper :class="$style.label" :label="label" />
      </template>
    </f-form-group>

    <f-form-group
      ref="expiry_date"
      v-model="expiry_date"
      :class="$style.wrapper_input"
      :label-class="$style.label"
      :input-class="$style.expiry_date"
      :name-class="[$style.input, $style.placeholder]"
      name="expiry_date"
      placeholder="__/__"
      :rules="validExpiryDate"
      mask="##/##"
      masked
      :disabled="disabledExpiryDate"
      type="tel"
      inputmode="numeric"
      tooltip
      no-label-floating
      dynamic-placeholder
      autocomplete="cc-exp"
      :format="format"
      @input="inputExpiryDate"
    />
    <f-form-group
      v-if="showCvv"
      ref="cvv2"
      v-model="cvv2"
      :class="$style.wrapper_input"
      :label-class="$style.label"
      :input-class="$style.cvv2"
      :name-class="[$style.input, $style.placeholder]"
      name="cvv2"
      placeholder="___"
      :rules="validCvv"
      type="tel"
      inputmode="numeric"
      mask="####"
      :disabled="disabled"
      :maxlength="digitsCvv"
      tooltip
      no-label-floating
      dynamic-placeholder
      autocomplete="cc-csc"
    >
      <template v-if="!disabled" #label="{ id, label }">
        <label :class="$style.label" :for="id">
          <span ref="label_cvv">{{ label }}</span>
        </label>

        <f-tooltip-cvv2 :target="() => $refs.label_cvv">
          <f-svg name="info-circle" :class="$style.mr_8" size="md" />
          <span v-text="$t('cvv2_help', [digitsCvv])" />
        </f-tooltip-cvv2>
      </template>
    </f-form-group>
    <f-loading v-if="loading" backdrop />
  </div>
</template>

<script>
import FCardBg from '@/components/card-bg'
import { FIconBin, FCardListWrapper, FLoading } from '@/import'
import FSvg from '@/components/svg'
import FTooltipCvv2 from '@/components/tooltip/tooltip-cvv2'
import { errorHandler } from '@/utils/helpers'
import { mapState, mapStateGetSet } from '@/utils/store'
import { createDate, format } from '@/utils/date'
import { makeProp } from '@/utils/props'
import { PROP_TYPE_BOOLEAN } from '@/constants/props'

export default {
  components: {
    FCardBg,
    FIconBin,
    FCardListWrapper,
    FSvg,
    FTooltipCvv2,
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
    }
  },
  computed: {
    ...mapState([
      'ready',
      'read_only',
      'cards',
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
    isCards() {
      return this.cards.length
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
  },
}
</script>

<style lang="scss" module>
.wrapper {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  padding: px-to-rem(63px) 0 px-to-rem(16px) px-to-rem(16px);
  margin-bottom: px-to-rem(32px);

  @include media-breakpoint-up(ss) {
    padding: px-to-rem(94px) 0 px-to-rem(19px) px-to-rem(16px);
  }
}

.shadow {
  position: absolute;
  bottom: 0;
  left: 10%;
  width: 80%;
  height: px-to-rem(32px);
  content: '';
  border-radius: $border-radius-lg;
  box-shadow: 0 px-to-rem(10px) px-to-rem(25px) fade($card_shadow, 60%);
}

.shadow_dark {
  box-shadow: 0 px-to-rem(10px) px-to-rem(25px) rgb(0 0 0 / 60%);
}

.brand {
  position: absolute;
  top: px-to-rem(14px);
  right: px-to-rem(14px);
  width: px-to-rem(86px);
  height: px-to-rem(42px);
  border: px-to-rem(1px) solid $white;
  border-radius: $border-radius;
}

.wrapper_input {
  position: relative;
  margin: 0 px-to-rem(20px) 0 0;

  // WAL-436
  :global(.f-form-item-input) {
    z-index: 1;
    position: relative;
  }
}

.wrapper_card_number {
  width: 100%;
  margin: 0 0 px-to-rem(15px);
}

.input,
:global(#f) .wrapper_input :global(.f-form-control) {
  color: #{$card_input_color};

  padding: 0;
  font-weight: 400;
  text-shadow: px-to-rem(1px) px-to-rem(1px) px-to-rem(2px)
    fade($card_input_shadow, 15%);
  background-color: rgb(0 0 0 / 0%);
  border: none;
  border-radius: 0;

  &,
  &:-webkit-autofill::first-line,
  &::placeholder {
    font-family: $font-family-card-number;
    height: px-to-rem(18px);
    font-size: px-to-rem(15px);
    line-height: px-to-rem(18px);

    @include media-breakpoint-up(ss) {
      height: px-to-rem(25px);
      font-size: px-to-rem(20px);
      line-height: px-to-rem(25px);
    }
  }

  &:-webkit-autofill {
    -webkit-text-fill-color: $card_input_color;

    &::first-line {
      color: $card_input_color;
    }
  }

  &:hover {
    background-color: inherit;
  }

  &:focus {
    box-shadow: none;
  }

  &[disabled] {
    color: #{fade($card_input_color, 60%)};
  }

  &::placeholder {
    color: #{fade($card_input_color, 30%)};
  }
}

.placeholder {
  color: fade($card_input_color, 30%);
}

:global(#f) .expiry_date.expiry_date {
  width: px-to-rem(80px);
}

:global(#f) .cvv2.cvv2 {
  width: px-to-rem(75px);
  font-family: $font-family-cvv;

  &:-webkit-autofill::first-line {
    font-family: $font-family-cvv;
  }
}

:global(#f) .label.label {
  display: flex;
  margin-bottom: px-to-rem(6px);
  font-size: px-to-rem(10px);
  line-height: px-to-rem(12px);
  color: $card_label_color;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  opacity: 0.7;

  @include media-breakpoint-up(ss) {
    margin-bottom: px-to-rem(3px);
    font-size: px-to-rem(11px);
    line-height: px-to-rem(18px);
  }
}

.mr_8 {
  margin-right: px-to-rem(8px);
}

.ml_4 {
  margin-left: px-to-rem(4px);
}
</style>
