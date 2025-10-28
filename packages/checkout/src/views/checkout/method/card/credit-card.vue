<template>
  <div data-e2e-card :class="$style.wrapper">
    <div :class="$uiClass('shadow')" />
    <f-card-bg />
    <transition name="f-fade">
      <f-icon-bin v-if="card_number" :class="$style.brand" :bin="card_number" />
    </transition>
    <f-row-card
      ref="card_number"
      v-model="cardNumberInner"
      :class="[$style.wrapper_input, $style.wrapper_card_number]"
      label="card_number"
      :placeholder="cardConfig.cardNumberPlaceholder"
      :rules="cardNumberValid"
      :maxlength="cardConfig.cardNumberMaxLength"
      :disabled="cardNumberDisabled"
      autocomplete="cc-number"
      :formatter="cardNumberFormatter"
      @input="cardNumberInput"
    >
      <template #label="{ label, className }">
        <span v-if="cardNumberDisabled" :class="className">
          {{ label }} <f-svg :class="$style.ml_4" name="lock-alt" size="lg" />
        </span>
        <f-card-list-wrapper
          v-else-if="isCards"
          :class="className"
          :label="label"
          @input="focus"
        />
      </template>
    </f-row-card>
    <f-row-card
      ref="expiry_date"
      v-model="expiry_date"
      :class="$style.wrapper_input"
      :input-class="$style.expiry_date"
      label="expiry_date"
      :placeholder="cardConfig.expiryDatePlaceholder"
      :rules="expiryDateValid"
      :disabled="expiryDateDisabled"
      autocomplete="cc-exp"
      :formatter="expiryDateFormatter"
      @input="expiryDateInput"
    />
    <f-row-card
      v-if="showCvv"
      ref="cvv2"
      v-model="cvv2"
      :class="$style.wrapper_input"
      :input-class="$style.cvv2"
      label="cvv2"
      :placeholder="cardConfig.cvvPlaceholder"
      :rules="cvvValid"
      :disabled="disabled"
      :maxlength="cvvLength"
      autocomplete="cc-csc"
      :formatter="cvvFormatter"
    >
      <template
        v-if="!disabled"
        #label="{ id, label, className, focus: focusInput }"
      >
        <label :class="className" :for="id" @click="focusInput">
          <span ref="label_cvv">{{ label }}</span>
        </label>

        <f-tooltip-cvv2 :target="() => $refs.label_cvv">
          <f-svg name="info-circle" :class="$style.mr_8" size="md" />
          <span v-text="$t('cvv2_help', [cvvLength])" />
        </f-tooltip-cvv2>
      </template>
    </f-row-card>
    <f-loading v-if="loading" backdrop />
  </div>
</template>

<script>
import FCardBg from '@/components/card-bg'
import { FIconBin, FCardListWrapper, FLoading } from '@/import'
import FRowCard from '@/components/input/row-card'
import FSvg from '@/components/svg'
import FTooltipCvv2 from '@/components/tooltip/tooltip-cvv2'
import { errorHandler } from '@/utils/helpers'
import { mapState, mapStateGetSet } from '@/utils/store'
import { createDate, format } from '@/utils/date'
import { makeProp } from '@/utils/props'
import { PROP_TYPE_BOOLEAN } from '@/constants/props'
import { getCardConfig } from '@/utils/get-bin-name'
import {
  formatter,
  simpleFormatter,
  normalizeAutofillExpiryDate,
} from '@/utils/formatter'
import { mask } from '@/utils/mask'

export default {
  components: {
    FCardBg,
    FIconBin,
    FRowCard,
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
      expiryDateReadonly: false,
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

      return `required|date_format:MM/yy|after:${minDate},true,MM/yy`
    },
    cardNumberValid() {
      if (this.cardNumberDisabled) return
      if (!this.need_validate_card) return

      let needValidCard =
        !this.hash &&
        (this.cardConfig.cardNumberLengths.includes(this.card_number.length) ||
          this.submited)

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
      if (this.isCards) return
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
@use '@/scss/core/functions/functions';

$font-family-cvv: 'Cvv', sans-serif;

.wrapper {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  padding: px-to-rem(63px) 0 px-to-rem(16px) px-to-rem(16px);
  margin-bottom: px-to-rem(32px);

  @include breakpoints.up(ss) {
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
  box-shadow: 0 px-to-rem(10px) px-to-rem(25px)
    functions.fade(var(#{$prefix}card_shadow), 60%);
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
  margin: 0 px-to-rem(20px) 0 0;
}

.wrapper_card_number {
  width: 100%;
  margin: 0 0 px-to-rem(15px);
}

.expiry_date.expiry_date {
  width: px-to-rem(80px);
}

.cvv2.cvv2 {
  width: px-to-rem(75px);
  font-family: $font-family-cvv;

  &:-webkit-autofill::first-line {
    font-family: $font-family-cvv;
  }
}

.mr_8 {
  margin-right: px-to-rem(8px);
}

.ml_4 {
  margin-left: px-to-rem(4px);
}
</style>
