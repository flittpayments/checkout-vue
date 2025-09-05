<template>
  <f-button-unstyled v-if="disabled" :disabled="disabled">
    <slot name="text" />
  </f-button-unstyled>
  <f-button-unstyled
    v-else-if="enableModal"
    :id="id"
    @click="$refs.modal.show()"
    @focus="focus"
    @blur="blur"
  >
    <slot name="text" />
    <f-modal-wrapper
      ref="modal"
      no-body-padding
      :scrollable="scrollable"
      @show="show"
      @hide="onHide"
    >
      <component :is="component" v-bind="attrs">
        <slot />
      </component>
    </f-modal-wrapper>
  </f-button-unstyled>
  <f-button-unstyled v-else :id="id" @focus="focus" @blur="blur">
    <slot name="text" />
    <f-dropdown
      ref="dropdown"
      :reference="dropdownReference"
      :target="() => $el"
      :size="dropdownSize"
      :placement="dropdownPlacement"
      :arrow="dropdownArrow"
      @show="show"
      @hide="onHide"
    >
      <slot />
    </f-dropdown>
  </f-button-unstyled>
</template>

<script>
import FButtonUnstyled from '@/components/button/button-unstyled'
import FDropdown from '@/components/tooltip/dropdown'
import FModalWrapper from '@/components/modal/modal-wrapper'
import { resizeMixin } from '@/mixins/resize'
import { isPhone } from '@/utils/mobile'
import {
  PROP_TYPE_BOOLEAN,
  PROP_TYPE_FUNCTION,
  PROP_TYPE_STRING,
} from '@/constants/props'
import { makeProp } from '@/utils/props'
import FScrollbarVertical from '@/components/scrollbar-vertical'

export default {
  components: {
    FButtonUnstyled,
    FDropdown,
    FModalWrapper,
    FScrollbarVertical,
  },
  mixins: [resizeMixin],
  inheritAttrs: false,
  props: {
    id: makeProp(PROP_TYPE_STRING),
    disabled: makeProp(PROP_TYPE_BOOLEAN, false),
    scrollable: makeProp(PROP_TYPE_BOOLEAN, false),
    modalWrapperClass: makeProp(PROP_TYPE_STRING, 'f-pr-20 f-pl-20 f-pb-20'),
    dropdownSize: makeProp(PROP_TYPE_STRING),
    dropdownPlacement: makeProp(PROP_TYPE_STRING, 'bottomright'),
    dropdownArrow: makeProp(PROP_TYPE_BOOLEAN, false),
    dropdownReference: makeProp(PROP_TYPE_FUNCTION),
  },
  computed: {
    enableModal() {
      return isPhone || this.isWidthSm
    },
    component() {
      return this.scrollable ? 'f-scrollbar-vertical' : 'div'
    },
    attrs() {
      return this.scrollable
        ? {
            'wrap-class': this.modalWrapperClass,
          }
        : {
            class: this.modalWrapperClass,
          }
    },
  },
  methods: {
    hide() {
      this.$refs.modal?.hide()
      this.$refs.dropdown?.hide()
    },
    show() {
      this.$emit('show')
    },
    onHide() {
      this.$emit('hide')
    },
    focus() {
      this.$emit('focus')
    },
    blur() {
      this.$emit('blur')
    },
    resize() {
      this.hide()
    },
  },
}
</script>
