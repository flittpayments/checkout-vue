<template>
  <component
    :is="componentRow"
    v-slot="{ invalid, validate: _validate }"
    v-bind="attrsRow"
    v-on="listenersRow"
    @focus="focus"
  >
    <template v-if="updateState(_validate)">
      <component
        :is="component"
        v-bind="attrs"
        :invalid="invalid"
        v-on="listeners"
        @focus="onFocus"
        @blur="blur"
        @keyup.enter="onEnter"
      >
        <template v-for="slot in Object.keys($scopedSlots)" #[slot]="scope">
          <slot :name="slot" v-bind="scope" />
        </template>
      </component>
    </template>
  </component>
</template>

<script>
import { RowFloating, RowNoFloating, FDate, FSelect } from '@/import'
import { idMixin, idProps } from '@/mixins/id'
import { makeProp } from '@/utils/props'
import { PROP_TYPE_BOOLEAN, PROP_TYPE_STRING } from '@/constants/props'
import { errorHandler, pick, omit } from '@/utils/helpers'

export default {
  mixins: [idMixin],
  inject: ['submit'],
  inheritAttrs: false,
  props: {
    ...idProps,
    type: makeProp(PROP_TYPE_STRING, 'text', value =>
      ['date', 'select'].includes(value)
    ),
    name: makeProp(PROP_TYPE_STRING),
    label: makeProp(PROP_TYPE_STRING),
    placeholder: makeProp(PROP_TYPE_STRING),
    noFloating: makeProp(PROP_TYPE_BOOLEAN, false),
  },
  data() {
    return {
      validate: null,
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
    listenersRow() {
      return pick(this.$listeners, ['error'])
    },
    component() {
      return {
        date: FDate,
        select: FSelect,
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
    listeners() {
      return omit(this.$listeners, ['error'])
    },
    isNoFloating() {
      return this.noFloating || !this.label
    },
  },
  methods: {
    updateState(validate) {
      this.validate = validate
      return true
    },
    onFocus() {
      this.focused = true
    },
    blur() {
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
