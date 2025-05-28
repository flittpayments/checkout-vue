<template>
  <f-secure-message v-if="show_secure_message" />
</template>

<script>
import { FSecureMessage } from '@/import'
import { mapState } from '@/utils/store'

export default {
  components: {
    FSecureMessage,
  },
  computed: {
    ...mapState('options', ['show_secure_message']),
  },
}
</script>
