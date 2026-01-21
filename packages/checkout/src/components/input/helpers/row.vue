<template>
  <div v-bind="$attrs">
    <slot v-bind="scope" />
  </div>
</template>

<script>
import { useField } from 'vee-validate'
import {
  PROP_TYPE_STRING,
  PROP_TYPE_OBJECT_STRING,
  PROP_TYPE_ANY,
} from '@/constants/props'
import { makeProp } from '@/utils/props'
import { mapState } from '@/utils/store'
import { watch } from 'vue'

export default {
  inheritAttrs: false,
  props: {
    modelValue: makeProp(PROP_TYPE_ANY),
    name: makeProp(PROP_TYPE_STRING),
    rules: makeProp(PROP_TYPE_OBJECT_STRING),
  },
  setup(props) {
    const { value, meta, errors, validate, handleBlur, setValue } = useField(
      props.name,
      props.rules,
      {
        initialValue: props.modelValue,
      }
    )

    watch(
      () => props.modelValue,
      val => {
        if (val !== value.value) setValue(val)
      }
    )

    return { meta, errors, validate, handleBlur }
  },
  computed: {
    ...mapState(['isSubmit']),
    invalid() {
      return this.errors.length > 0 && (this.meta.touched || this.isSubmit)
    },
    scope() {
      return {
        errors: this.errors,
        invalid: this.invalid,
        validate: this.validate,
        handleBlur: this.handleBlur,
      }
    },
  },
}
</script>
