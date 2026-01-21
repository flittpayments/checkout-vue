<template>
  <f-row v-slot="scope" v-bind="$attrs" :class="$style.wrapper">
    <template v-if="updateState(scope)">
      <slot v-bind="scope" />
      <f-error :show="showError">{{ errors[0] }}</f-error>
    </template>
  </f-row>
</template>

<script>
import FRow from '@/components/input/helpers/row'
import FError from '@/components/base/error'
import { makeProp } from '@/utils/props'
import { PROP_TYPE_BOOLEAN } from '@/constants/props'

export default {
  components: {
    FRow,
    FError,
  },
  inheritAttrs: false,
  props: {
    focused: makeProp(PROP_TYPE_BOOLEAN, false),
    hideError: makeProp(PROP_TYPE_BOOLEAN, false),
  },
  emits: ['error'],
  data() {
    return {
      errors: [],
      invalid: false,
    }
  },
  computed: {
    showError() {
      const showError = this.invalid && this.focused

      this.$emit('error', showError && this.errors[0])

      return showError && !this.hideError
    },
  },
  methods: {
    updateState({ errors, invalid }) {
      this.errors = errors
      this.invalid = invalid
      return true
    },
  },
}
</script>

<style lang="scss" module>
.wrapper {
  margin-bottom: px-to-rem(16px);
}
</style>
