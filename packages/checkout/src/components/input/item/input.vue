<template>
  <div>
    <input v-bind="attrs" />
    <slot :id="safeId()" :class-name="className" />
  </div>
</template>

<script>
import { makeProp } from '@/utils/props'
import {
  PROP_TYPE_BOOLEAN,
  PROP_TYPE_STRING,
  PROP_TYPE_ARRAY_OBJECT_STRING,
  PROP_TYPE_NUMBER_STRING,
  PROP_TYPE_FUNCTION,
} from '@/constants/props'
import { idMixin, idProps } from '@/mixins/id'
import { toString } from '@/utils/string'
import { isFunction } from '@/utils/inspect'
import { stopEvent } from '@/utils/events'
import { attemptFocus } from '@/utils/dom'

export default {
  mixins: [idMixin],
  inheritAttrs: false,
  props: {
    ...idProps,
    modelValue: makeProp(PROP_TYPE_NUMBER_STRING),
    invalid: makeProp(PROP_TYPE_BOOLEAN),
    inputClass: makeProp(PROP_TYPE_ARRAY_OBJECT_STRING),
    inputErrorClass: makeProp(PROP_TYPE_STRING),
    size: makeProp(PROP_TYPE_STRING, '56', value =>
      ['44', '48', '56'].includes(value)
    ),
    variant: makeProp(PROP_TYPE_STRING, 'default', value =>
      ['default', 'secondary'].includes(value)
    ),
    floating: makeProp(PROP_TYPE_BOOLEAN, false),
    prepend: makeProp(PROP_TYPE_STRING),
    prependText: makeProp(PROP_TYPE_STRING),
    disabled: makeProp(PROP_TYPE_BOOLEAN, false),
    required: makeProp(PROP_TYPE_BOOLEAN, false),
    formatter: makeProp(PROP_TYPE_FUNCTION),
    type: makeProp(PROP_TYPE_STRING, 'text'),
  },
  emits: ['update:modelValue', 'input', 'change', 'blur'],
  data() {
    return {
      localValue: toString(this.modelValue),
      vModelValue: this.modifyValue(this.modelValue),
    }
  },
  computed: {
    attrs() {
      const { disabled, required, invalid, type } = this

      return {
        ...this.$attrs,
        id: this.safeId(),
        ref: 'input',
        value: this.localValue,
        class: this.className,
        disabled,
        required,
        type,
        'aria-required': required ? 'true' : null,
        'aria-invalid': invalid ? 'true' : null,
        onInput: this.onInput,
        onChange: this.onChange,
        onBlur: this.onBlur,
      }
    },
    className() {
      return [
        this.style.input,
        this.$uiClass(this.variant, {}, 'style'),
        this.style[`size_${this.size}`],
        this.inputClass,
        {
          [this.style.error]: this.invalid,
          [this.inputErrorClass]: this.inputErrorClass && this.invalid,
          [this.style[`floating_${this.size}`]]: this.floating,
          [this.style.prepend]: this.prepend,
          [this.$style.prepend_text]: this.prependText,
        },
      ]
    },
    hasFormatter() {
      return isFunction(this.formatter)
    },
  },
  watch: {
    modelValue(newValue) {
      const stringifyValue = toString(newValue)
      const modifiedValue = this.modifyValue(newValue)
      if (
        stringifyValue !== this.localValue ||
        modifiedValue !== this.vModelValue
      ) {
        this.localValue = stringifyValue
        this.vModelValue = modifiedValue
      }
    },
  },
  methods: {
    formatValue(value, event) {
      value = toString(value)
      if (this.hasFormatter) {
        value = this.formatter(value, event)
      }
      return value
    },
    modifyValue(value) {
      value = toString(value)
      return value
    },
    updateValue(value) {
      value = this.modifyValue(value)
      if (value !== this.vModelValue) {
        this.vModelValue = value
        this.$emit('update:modelValue', value)
      } else if (this.hasFormatter) {
        const $input = this.$refs.input
        if ($input && value !== $input.value) {
          $input.value = value
        }
      }
    },
    onInput(event) {
      if (event.target.composing) {
        return
      }
      const { value } = event.target
      const formattedValue = this.formatValue(value, event)
      if (formattedValue === false || event.defaultPrevented) {
        stopEvent(event, { propagation: false })
        return
      }
      this.localValue = formattedValue
      this.updateValue(formattedValue)
      this.$emit('input', formattedValue)
    },
    onChange(event) {
      const { value } = event.target
      const formattedValue = this.formatValue(value, event)
      if (formattedValue === false || event.defaultPrevented) {
        stopEvent(event, { propagation: false })
        return
      }
      this.localValue = formattedValue
      this.updateValue(formattedValue)
      this.$emit('change', formattedValue)
    },
    onBlur(event) {
      const { value } = event.target
      const formattedValue = this.formatValue(value, event)
      if (formattedValue !== false) {
        this.localValue = this.modifyValue(formattedValue)
        this.updateValue(formattedValue)
      }
      this.$emit('blur', event)
    },
    focus() {
      if (!this.disabled) {
        attemptFocus(this.$refs.input)
      }
    },
  },
}
</script>

<style lang="scss" module="style">
@use '@/scss/module/input.module';
</style>

<style lang="scss" module>
.prepend_text {
  --padding-left: #{px-to-rem(60px)};
}
</style>
