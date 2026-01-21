<template>
  <f-modal v-if="isShow" v-bind="$attrs" ref="modal" @hidden="onHidden">
    <template v-for="slot in Object.keys($slots)" #[slot]="scope">
      <slot v-bind="scope" :name="slot" />
    </template>
  </f-modal>
</template>

<script>
import { FModal } from '@/import'

export default {
  components: {
    FModal,
  },
  data() {
    return {
      isShow: false,
    }
  },
  methods: {
    show() {
      this.isShow = true
    },
    hide() {
      this.$refs.modal?.hide()
    },
    onHidden() {
      this.isShow = false
    },
  },
}
</script>
