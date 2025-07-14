<template>
  <f-modal-3ds v-if="isShow" v-bind="$attrs" @hidden="onHidden" />
</template>

<script>
import { FModal3ds } from '@/import'

export default {
  components: {
    FModal3ds,
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
    onHidden() {
      this.isShow = false
    },
  },
}
</script>
