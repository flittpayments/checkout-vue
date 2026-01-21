<template>
  <f-row
    v-slot="{ errors, invalid, validate: slotValidate, handleBlur }"
    v-bind="attrsRow"
  >
    <template v-if="updateState(slotValidate)">
      <slot
        :id="safeId()"
        name="label"
        :label="$t(label)"
        :class-name="$style.label"
      >
        <label :class="$style.label" :for="safeId()" @click="focus">
          {{ $t(label) }}
        </label>
      </slot>
      <div :class="$style.inner">
        <f-input v-bind="attrs" @keyup.enter="onEnter" @blur="handleBlur" />
        <f-placeholder v-bind="attrsPlaceholder" />
      </div>
      <f-tooltip-error v-if="invalid" :target="() => $refs.input?.$el">
        <f-svg class="f-mr-8" name="warning" size="md" />
        {{ errors[0] }}
      </f-tooltip-error>
    </template>
  </f-row>
</template>

<script>
import FRow from '@/components/input/helpers/row'
import FInput from '@/components/input/item/input'
import FPlaceholder from '@/components/base/placeholder'
import FTooltipError from '@/components/tooltip/tooltip-error'
import FSvg from '@/components/svg'
import { makeProp } from '@/utils/props'
import { idMixin, idProps } from '@/mixins/id'
import { PROP_TYPE_STRING } from '@/constants/props'
import { errorHandler, omit, pick } from '@/utils/helpers'

export default {
  components: {
    FRow,
    FInput,
    FPlaceholder,
    FTooltipError,
    FSvg,
  },
  mixins: [idMixin],
  inject: ['submit'],
  inheritAttrs: false,
  props: {
    ...idProps,
    name: makeProp(PROP_TYPE_STRING),
    label: makeProp(PROP_TYPE_STRING),
    inputClass: makeProp(PROP_TYPE_STRING),
  },
  data() {
    let resolveValidateReady
    const validateReadyPromise = new Promise(resolve => {
      resolveValidateReady = resolve
    })
    return {
      validateFn: null,
      validateReadyPromise,
      resolveValidateReady,
      focused: false,
    }
  },
  computed: {
    attrsRow() {
      return {
        ...pick(this.$attrs, ['modelValue', 'rules', 'disabled']),
        name: this.name || this.safeId(),
      }
    },
    attrs() {
      return {
        ...omit(this.$attrs, ['rules']),
        ref: 'input',
        id: this.safeId(),
        name: this.name || this.safeId(),
        type: 'tel',
        inputmode: 'numeric',
        inputClass: [this.$style.input, this.inputClass],
      }
    },
    attrsPlaceholder() {
      return {
        ...pick(this.attrs, ['id', 'modelValue', 'placeholder']),
        nameClass: [this.$style.input, this.$style.placeholder],
      }
    },
  },
  methods: {
    validate() {
      return this.validateReadyPromise.then(() => this.validateFn())
    },
    updateState(validateFn) {
      this.validateFn = validateFn
      if (this.resolveValidateReady) {
        this.resolveValidateReady()
        this.resolveValidateReady = null
      }
      return true
    },
    onEnter() {
      this.submit().catch(errorHandler)
    },
    focus() {
      this.$refs.input.focus()
    },
  },
}
</script>

<style lang="scss" module>
@use '@/scss/core/functions/functions';
$card_input_color: var(#{$prefix}card_input_color);
$font-family-card-number: 'Card Number', sans-serif;

.inner {
  position: relative;
}

.label {
  display: flex;
  margin-bottom: px-to-rem(6px);
  font-size: px-to-rem(10px);
  line-height: px-to-rem(12px);
  color: var(#{$prefix}card_label_color);
  text-transform: uppercase;
  letter-spacing: 0.03em;
  opacity: 0.7;

  @include breakpoints.up(ss) {
    margin-bottom: px-to-rem(3px);
    font-size: px-to-rem(11px);
    line-height: px-to-rem(18px);
  }
}

.input.input {
  --color: #{$card_input_color};
  --disabled-color: #{functions.fade($card_input_color, 60%)};
  --placeholder-color: #{functions.fade($card_input_color, 30%)};

  padding: 0;
  font-weight: 400;
  text-shadow: px-to-rem(1px) px-to-rem(1px) px-to-rem(2px)
    functions.fade(var(#{$prefix}card_input_shadow), 15%);
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

    @include breakpoints.up(ss) {
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
}

.placeholder.placeholder {
  color: functions.fade($card_input_color, 30%);
}
</style>
