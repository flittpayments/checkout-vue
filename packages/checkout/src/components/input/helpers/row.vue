<template>
  <ValidationProvider v-slot="scope" v-bind="attrs">
    <template v-if="updateState(scope)">
      <slot v-bind="scope" :invalid="invalid" />
    </template>
  </ValidationProvider>
</template>

<script>
import { ValidationProvider } from 'vee-validate'
import {
  PROP_TYPE_STRING,
  PROP_TYPE_BOOLEAN,
  PROP_TYPE_OBJECT_STRING,
} from '@/constants/props'
import { makeProp } from '@/utils/props'
import { mapState } from '@/utils/store'

export default {
  components: {
    ValidationProvider,
  },
  inheritAttrs: false,
  props: {
    name: makeProp(PROP_TYPE_STRING),
    rules: makeProp(PROP_TYPE_OBJECT_STRING),
    disabled: makeProp(PROP_TYPE_BOOLEAN),
  },
  data() {
    return {
      errors: [],
      touched: false,
    }
  },
  computed: {
    ...mapState(['isSubmit']),
    attrs() {
      return {
        // Identifier used for target/cross-field based rules.
        vid: this.name,
        // A string that will be used to replace {field} in error messages and for custom error messages.
        name: this.name,
        rules: this.rules,
        tag: 'div',
        disabled: this.disabled,
      }
    },
    invalid() {
      return this.errors.length > 0 && (this.touched || this.isSubmit)
    },
  },
  methods: {
    updateState({ errors, touched }) {
      this.errors = errors
      this.touched = touched
      return true
    },
  },
}
</script>
