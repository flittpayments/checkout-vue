<template>
  <input v-bind="attrs" @change="change" />
</template>

<script>
import { PROP_TYPE_BOOLEAN } from '@/constants/props'
import { makeProp } from '@/utils/props'

export default {
  props: {
    modelValue: makeProp(PROP_TYPE_BOOLEAN, false),
    disabled: makeProp(PROP_TYPE_BOOLEAN, false),
  },
  emits: ['update:modelValue'],
  computed: {
    attrs() {
      return {
        ...this.$attrs,
        type: 'checkbox',
        checked: this.modelValue,
        disabled: this.disabled,
        'aria-checked': this.modelValue ? 'true' : 'false',
        'aria-disabled': this.disabled ? 'true' : 'false',
      }
    },
  },
  methods: {
    change($event) {
      this.$emit('update:modelValue', $event.target.checked)
    },
  },
}
</script>
