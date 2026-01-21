<template>
  <f-form v-bind="$attrs" ref="form" as="div" :class="[$attrs.class]">
    <slot />
  </f-form>
</template>

<script>
import { Form as FForm } from 'vee-validate'
import { mapStateGetSet } from '@/utils/store'
import { listenMixin } from '@/mixins/listen-on-root'
import { errorHandler } from '@/utils/helpers'
import { attemptFocus, select } from '@/utils/dom'

export default {
  components: {
    FForm,
  },
  mixins: [listenMixin],
  inject: ['formRequest'],
  provide() {
    return {
      submit: this.submit,
      validate: this.validate,
    }
  },
  computed: {
    ...mapStateGetSet(['submited', 'isSubmit']),
  },
  watch: {
    $route: 'watchRoute',
  },
  created() {
    this.listen('submit', () => {
      this.submit().catch(errorHandler)
    })
  },
  methods: {
    watchRoute() {
      this.$refs.form.resetForm()
      this.isSubmit = false
    },
    submit(data) {
      this.submited = true
      return this.$nextTick()
        .then(() => this.validate())
        .then(() => {
          return this.formRequest(this.store.formParams(data))
        })
        .finally(() => {
          this.submited = false
        })
    },
    validate() {
      if (!this.$refs.form) return Promise.reject()

      return this.$refs.form.validate().then(({ valid, errors }) => {
        this.isSubmit = true

        if (!valid) return this.autoFocus(errors)
      })
    },
    autoFocus(errors) {
      if (!errors) return Promise.reject()

      const errorsArray = Object.keys(errors)

      if (!errorsArray.length) return Promise.reject()

      const el = select(
        `[name="${errorsArray[0].replace(/\./g, '\\.')}"]`,
        this.$el
      )

      if (!el) return Promise.reject()

      el.scrollIntoView({
        block: 'center',
        behavior: 'smooth',
      })

      attemptFocus(el)

      return Promise.reject()
    },
  },
}
</script>
