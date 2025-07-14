<template>
  <f-modal-error v-if="show" @hidden="onHidden" />
</template>

<script>
import { FModalError } from '@/import'
import { mapState } from '@/utils/store'

export default {
  components: {
    FModalError,
  },
  computed: {
    ...mapState('error', ['show']),
  },
  methods: {
    onHidden() {
      this.store.hideError()
    },
  },
}
</script>
