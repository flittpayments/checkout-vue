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
      data-card-input
      :force-error="forceError.card_number"
      @input="inputCardNumber"
      @focus="onFocus('card_number')"
      @blur="onBlur"
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
      data-card-input
      :format="format"
      :force-error="forceError.expiry_date"
      @input="inputExpiryDate"
      @focus="onFocus('expiry_date')"
      @blur="onBlur"
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
      data-card-input
      :force-error="forceError.cvv2"
      @input="inputCvv"
      @focus="onFocus('cvv2')"
      @blur="onBlur"
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

const fields = ['card_number', 'expiry_date', 'cvv2']

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
      config: [9, 8, 7, 6, 1],
      readonlyExpiryDate: false,
      forceError: {
        card_number: false,
        expiry_date: false,
        cvv2: false,
      },
      focusCount: {
        card_number: 0,
        expiry_date: 0,
        cvv2: 0,
      },
    }
  },
  computed: {
    ...mapState([
      'ready',
      'read_only',
      'cards',
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

      return !this.hash ? 'required|ccard' : 'required'
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
      this.setError('card_number')
      if (value.length === 16 || value.length === 19) {
        this.focusFirstInvalid()
      } else {
        this.hash = ''
      }
    },
    inputExpiryDate() {
      this.setError('expiry_date')
      this.runIfValid('expiry_date', this.focusFirstInvalid)
    },
    inputCvv() {
      this.setError('cvv2')
      this.runIfValid('cvv2', this.focusFirstInvalid)
    },
    setError(name) {
      if (this.focusCount[name] < 2) return

      this.validate(name, valid => (this.forceError[name] = !valid))
    },
    focusFirstInvalid() {
      this.findFirstInvalid(name => this.$refs[name]?.focused())
    },
    findFirstInvalid(cb) {
      fields
        .reduce(
          (accum, name) =>
            accum.then(() =>
              this.validate(name, valid => {
                if (valid) return

                cb(name)
                return Promise.reject()
              })
            ),
          Promise.resolve()
        )
        .catch(errorHandler)
    },
    runIfValid(name, cb) {
      return this.validate(name, valid => {
        if (valid) return cb()
      })
    },
    validate(name, cb) {
      return this.$refs[name]?.validation
        .validate()
        .then(({ valid } = {}) => cb(valid))
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

      this.focusFirstInvalid()
    },
    onFocus(name) {
      this.focusCount[name]++

      if (this.focusCount[name] < 2) return

      this.validate(name, valid => {
        if (valid) return

        this.setOnlyError(name)
      })
    },
    onBlur({ relatedTarget }) {
      const ATTRS = ['data-card-input', 'data-menu-item', 'data-wallet-item']
      const shouldHideError = ATTRS.some(attr =>
        relatedTarget?.hasAttribute(attr)
      )

      if (shouldHideError) {
        this.clearAllErrors()
      } else {
        this.findFirstInvalid(name => this.setOnlyError(name))
      }
    },
    setOnlyError(field) {
      fields.forEach(k => {
        this.forceError[k] = k === field
      })
    },
    clearAllErrors() {
      fields.forEach(k => {
        this.forceError[k] = false
      })
    },
  },
}
</script>
