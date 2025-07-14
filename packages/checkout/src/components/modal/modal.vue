<template>
  <f-modal-base v-bind="attrs" v-on="$listeners">
    <template #header>
      <f-button-unstyled
        v-if="!$attrs.noHeaderClose"
        class="f-close"
        aria-label="Close"
        @click="hide"
      >
        &times;
      </f-button-unstyled>
      <slot name="image" />
      <h5 v-if="title" class="f-modal-title">{{ title }}</h5>
    </template>
    <template #default="scope">
      <slot name="default" v-bind="scope" />
    </template>
    <template #footer="scope">
      <slot name="footer" v-bind="scope" />
    </template>
  </f-modal-base>
</template>

<script>
import FModalBase from '@/components/modal/modal-base'
import FButtonUnstyled from '@/components/button/button-unstyled'
import { makeProp } from '@/utils/props'
import { PROP_TYPE_STRING } from '@/constants/props'

export default {
  components: {
    FModalBase,
    FButtonUnstyled,
  },
  inheritAttrs: false,
  props: {
    title: makeProp(PROP_TYPE_STRING),
  },
  computed: {
    attrs() {
      return {
        ...this.$attrs,
        ref: 'modal',
        visible: true,
        footer: !!this.$scopedSlots.footer,
        headerClass: this.headerClass,
      }
    },
    headerClass() {
      return {
        [this.$style.p_0]: !this.title && !this.$scopedSlots.image,
      }
    },
  },
  methods: {
    hide() {
      this.$refs.modal.hide()
    },
  },
}
</script>

<style lang="scss" module>
:global(#f) .p_0 {
  padding: 0;
}
</style>
