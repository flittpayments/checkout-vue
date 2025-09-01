<template>
  <input
    v-bind="attrs"
    @change="change"
    @focus="focus"
    @blur="blur"
    @keyup="keyup"
  />
</template>

<script>
import { PROP_TYPE_BOOLEAN } from '@/constants/props'
import { makeProp } from '@/utils/props'

export default {
  props: {
    value: makeProp(PROP_TYPE_BOOLEAN, false),
    disabled: makeProp(PROP_TYPE_BOOLEAN, false),
  },
  computed: {
    attrs() {
      return {
        ...this.$attrs,
        type: 'checkbox',
        checked: this.value,
        disabled: this.disabled,
        'aria-checked': this.value ? 'true' : 'false',
        'aria-disabled': this.disabled ? 'true' : 'false',
      }
    },
  },
  methods: {
    change($event) {
      this.$emit('input', $event.target.checked)
    },
    focus($event) {
      this.$emit('focus', $event)
    },
    blur($event) {
      this.$emit('blur', $event)
    },
    keyup($event) {
      this.$emit('keyup', $event)
    },
  },
}
</script>
