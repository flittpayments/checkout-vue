<template>
  <component
    :is="componentRow"
    v-bind="attrsRow"
    v-slot="{ invalid, validate: slotValidate, handleBlur }"
    @focus="focus"
  >
    <template v-if="updateState(slotValidate)">
      <component
        :is="component"
        v-bind="attrs"
        :invalid="invalid"
        @focus="onFocus"
        @blur="blur(handleBlur)"
        @keyup.enter="onEnter"
      >
        <template v-for="slot in Object.keys($slots)" #[slot]="scope">
          <slot :name="slot" v-bind="scope" />
        </template>
      </component>
    </template>
  </component>
</template>

<script>
import { RowFloating, RowNoFloating, FDate, FSelect, FInput } from '@/import'
import { idMixin, idProps } from '@/mixins/id'
import { makeProp } from '@/utils/props'
import { PROP_TYPE_BOOLEAN, PROP_TYPE_STRING } from '@/constants/props'
import { errorHandler, omit } from '@/utils/helpers'
import FCheckbox from '@/components/input/item/checkbox.vue'

export default {
  components: { FCheckbox },
  mixins: [idMixin],
  inject: ['submit'],
  inheritAttrs: false,
  props: {
    ...idProps,
    type: makeProp(PROP_TYPE_STRING, 'text', value =>
      ['text', 'date', 'select', 'tel', 'email', 'number'].includes(value)
    ),
    name: makeProp(PROP_TYPE_STRING),
    label: makeProp(PROP_TYPE_STRING),
    placeholder: makeProp(PROP_TYPE_STRING),
    noFloating: makeProp(PROP_TYPE_BOOLEAN, false),
  },
  data() {
    let resolveValidateReady
    const validateReadyPromise = new Promise(resolve => {
      resolveValidateReady = resolve
    })
    return {
      validateFn: null,
      validateReadyPromise,
      resolveValidateReady,
      focused: false,
    }
  },
  computed: {
    componentRow() {
      return this.isNoFloating ? RowNoFloating : RowFloating
    },
    attrsRow() {
      return {
        ...this.$attrs,
        id: this.safeId(),
        name: this.name || this.safeId(),
        label: this.label,
        focused: this.focused,
      }
    },
    component() {
      return {
        date: FDate,
        select: FSelect,
        text: FInput,
        tel: FInput,
        email: FInput,
        number: FInput,
      }[this.type]
    },
    attrs() {
      return {
        ...omit(this.$attrs, ['rules', 'hide-error', 'label-class']),
        ref: 'input',
        id: this.safeId(),
        type: this.type,
        name: this.name || this.safeId(),
        placeholder: this.isNoFloating ? this.placeholder : undefined,
        floating: !this.isNoFloating,
      }
    },
    isNoFloating() {
      return this.noFloating || !this.label
    },
  },
  methods: {
    validate() {
      return this.validateReadyPromise.then(() => this.validateFn())
    },
    updateState(validateFn) {
      this.validateFn = validateFn
      if (this.resolveValidateReady) {
        this.resolveValidateReady()
        this.resolveValidateReady = null
      }
      return true
    },
    onFocus() {
      this.focused = true
    },
    blur(handleBlur) {
      handleBlur()
      this.focused = false
    },
    onEnter() {
      this.submit().catch(errorHandler)
    },
    focus() {
      this.$refs.input.focus()
    },
  },
}
</script>
