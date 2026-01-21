<template>
  <f-form as="div">
    <slot />
  </f-form>
</template>

<script>
import { Form as FForm } from 'vee-validate'

export default {
  components: {
    FForm,
  },
  provide() {
    return {
      submit: this.submit,
    }
  },
  methods: {
    submit() {
      return Promise.resolve()
    },
  },
}
</script>
