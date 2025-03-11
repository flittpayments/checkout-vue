<template>
  <div>
    <f-mode v-if="showMode" />
    <router-view />
  </div>
</template>

<script>
import { FMode } from '@/import'
import { mapState } from '@/utils/store'

export default {
  components: {
    FMode,
  },
  computed: {
    ...mapState(['mode_test']),
    ...mapState('options', ['disable_request', 'show_test_mode']),
    showMode() {
      return this.disable_request || (this.show_test_mode && this.mode_test)
    },
  },
}
</script>
