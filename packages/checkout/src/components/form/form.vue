<template>
  <div>
    <slot :submit="submit" :state="state" />
  </div>
</template>

<script>
import { provide, reactive, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useForm } from 'vee-validate'
import { select, attemptFocus } from '@/utils/dom'
import { errorHandler } from '@/utils/helpers'

export default {
  emits: ['submit'],

  setup(props, { emit }) {
    const route = useRoute()
    const { errors, values, validate: formValidate, resetForm } = useForm()

    const state = reactive({
      hasSubmitted: false,
      isValidating: false,

      get disabled() {
        return state.hasSubmitted && Object.keys(errors.value).length > 0
      },
    })

    const submit = () => {
      state.hasSubmitted = true

      return validate()
        .then(() => emit('submit'))
        .catch(errorHandler)
    }

    const validate = () => {
      state.isValidating = true

      return nextTick()
        .then(() => formValidate())
        .then(({ valid, errors }) => {
          if (!valid) {
            autoFocus(errors)
            return Promise.reject()
          }
        })
        .finally(() => {
          state.isValidating = false
        })
    }

    const autoFocus = errors => {
      if (!errors) return

      const [name] = Object.keys(errors)

      if (!name) return

      const el = select(`[name="${name.replace(/\./g, '\\.')}"]`)

      if (!el) return

      el.scrollIntoView({
        block: 'center',
        behavior: 'smooth',
      })

      attemptFocus(el)
    }

    watch(
      () => route.fullPath,
      () => {
        resetForm()
        state.hasSubmitted = false
        state.isValidating = false
      }
    )

    provide('form', {
      state,
      submit,
      validate,
      values,
    })

    return {
      state,
      submit,
    }
  },
}
</script>
