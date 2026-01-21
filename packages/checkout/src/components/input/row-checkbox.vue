<template>
  <f-row-error v-slot="{ invalid, handleBlur }" v-bind="attrsRow">
    <f-checkbox
      v-bind="attrs"
      :invalid="invalid"
      @focus="focus"
      @blur="blur(handleBlur)"
      @keyup.enter="onEnter"
    >
      <slot />
    </f-checkbox>
  </f-row-error>
</template>

<script>
import FRowError from '@/components/input/helpers/row-error'
import FCheckbox from '@/components/input/item/checkbox'
import { idMixin, idProps } from '@/mixins/id'
import { makeProp } from '@/utils/props'
import { PROP_TYPE_OBJECT, PROP_TYPE_STRING } from '@/constants/props'
import { errorHandler } from '@/utils/helpers'

export default {
  components: {
    FRowError,
    FCheckbox,
  },
  mixins: [idMixin],
  inject: ['submit'],
  inheritAttrs: false,
  props: {
    ...idProps,
    name: makeProp(PROP_TYPE_STRING),
    rules: makeProp(PROP_TYPE_OBJECT, {}),
  },
  data() {
    return {
      focused: false,
    }
  },
  computed: {
    attrsRow() {
      return {
        ...this.$attrs,
        id: this.safeId(),
        name: this.name || this.safeId(),
        focused: this.focused,
        rules: this.parseRules,
      }
    },
    attrs() {
      return {
        ...this.$attrs,
        id: this.safeId(),
        name: this.name || this.safeId(),
      }
    },
    parseRules() {
      const rules = { ...this.rules }
      if (rules.required) {
        rules.required = { allowFalsy: false }
      }
      return rules
    },
  },
  methods: {
    focus() {
      this.focused = true
    },
    blur(handleBlur) {
      handleBlur()
      this.focused = false
    },
    onEnter() {
      this.submit().catch(errorHandler)
    },
  },
}
</script>
