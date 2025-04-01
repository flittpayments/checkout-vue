<template>
  <f-modal-error v-if="show" />
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
}
</script>
