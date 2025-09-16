<template>
  <div>
    <f-input v-bind="attrs" v-on="$listeners" />
    <slot :id="safeId()" :class-name="className" />
  </div>
</template>

<script>
import { FInput } from '@/components/input/helpers/input'
import { makeProp } from '@/utils/props'
import {
  PROP_TYPE_BOOLEAN,
  PROP_TYPE_STRING,
  PROP_TYPE_ARRAY_OBJECT_STRING,
  PROP_TYPE_NUMBER_STRING,
} from '@/constants/props'
import { idMixin, idProps } from '@/mixins/id'

export default {
  components: {
    FInput,
  },
  mixins: [idMixin],
  inheritAttrs: false,
  props: {
    ...idProps,
    // required for ValidationProvider
    value: makeProp(PROP_TYPE_NUMBER_STRING),
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
  },
  computed: {
    attrs() {
      return {
        ...this.$attrs,
        id: this.safeId(),
        // required for ValidationProvider
        value: this.value,
        ref: 'input',
        class: this.className,
        state: this.state,
      }
    },
    className() {
      return [
        this.style.input,
        this.style[this.variant],
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
    state() {
      return this.invalid ? false : null
    },
  },
  methods: {
    focus() {
      this.$refs.input.focus()
    },
  },
}
</script>

<style lang="scss" module="style">
@import '@/scss/core/input.module';
</style>

<style lang="scss" module>
.prepend_text {
  --padding-left: #{px-to-rem(60px)};
}
</style>
