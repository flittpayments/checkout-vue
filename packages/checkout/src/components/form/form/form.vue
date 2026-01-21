<template>
  <f-form v-slot="{ errors, validate }" as="div">
    <slot :submit="submit(validate, errors)" :disabled="disabled(errors)" />
  </f-form>
</template>

<script>
import { Form as FForm } from 'vee-validate'
import { select, attemptFocus } from '@/utils/dom'

export default {
  components: {
    FForm,
  },
  provide() {
    return {
      submit: this.submit,
      isSubmit: () => this.isSubmit,
    }
  },
  emits: ['submit'],
  data() {
    return {
      isSubmit: false,
    }
  },
  computed: {
    disabled() {
      return errors => this.isSubmit && Object.keys(errors).length > 0
    },
  },
  methods: {
    submit(validate, errors) {
      return () => {
        this.isSubmit = true
        return validate().then(isValid => {
          if (isValid) {
            this.$emit('submit')
          } else {
            this.autoFocus(errors)
          }
        })
      }
    },
    autoFocus(errors) {
      if (!errors) return Promise.reject()

      const errorsArray = Object.keys(errors)

      if (!errorsArray.length) return Promise.reject()

      const el = select(`[name="${errorsArray[0]}"]`, this.$el)

      if (!el) return Promise.reject()

      attemptFocus(el)
    },
  },
}
</script>
