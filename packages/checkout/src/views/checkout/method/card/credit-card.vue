<template>
  <div class="f-card">
    <div class="f-card-shadow" />
    <f-card-bg />
    <transition name="f-fade">
      <f-icon-bin v-if="card_number" class="f-card-brand" :bin="card_number" />
    </transition>
    <f-form-group
      ref="card_number"
      v-model="card_number"
      class="f-form-group-card f-form-group-card-number"
      label-class="f-card_label"
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
      <template v-if="disabled" #label="{ label }">
        <label class="f-card_label">
          {{ label }} <f-svg class="f-ml-4" name="lock-alt" size="lg" />
        </label>
      </template>
      <template v-else-if="isCards" #label="{ label }">
        <f-card-list-wrapper class="f-card_label" :label="label" />
      </template>
    </f-form-group>

    <f-form-group
      ref="expiry_date"
      v-model="expiry_date"
      class="f-form-group-card"
      label-class="f-card_label"
      input-class="f-form-control-expiry-date"
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
      class="f-form-group-card"
      label-class="f-card_label"
      input-class="f-form-control-cvv2"
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
        <label class="f-card_label" :for="id">
          <span ref="label_cvv">{{ label }}</span>
        </label>

        <f-tooltip-default
          placement="top"
          :target="() => $refs.label_cvv"
          variant="secondary"
        >
          <f-svg name="info-circle" class="f-mr-8" size="md" />
          <span v-text="$t('cvv2_help', [digitsCvv])" />
        </f-tooltip-default>
      </template>
    </f-form-group>
    <f-loading v-if="loading" backdrop />
  </div>
</template>

<script>
import FCardBg from '@/components/card-bg'
import { FIconBin, FCardListWrapper, FLoading } from '@/import'
import FSvg from '@/components/svg'
import FTooltipDefault from '@/components/tooltip/tooltip-default'
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
    FTooltipDefault,
    FLoading,
  },
  props: {
    loading: makeProp(PROP_TYPE_BOOLEAN),
    disabled: makeProp(PROP_TYPE_BOOLEAN),
  },
  data() {
    return {
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
