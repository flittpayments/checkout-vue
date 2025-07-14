<template>
  <f-modal
    v-if="isShow"
    ref="modal"
    v-bind="$attrs"
    v-on="$listeners"
    @hidden="onHidden"
  >
    <template v-for="slot in Object.keys($scopedSlots)" #[slot]="scope">
      <slot :name="slot" v-bind="scope" />
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
