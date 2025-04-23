<template>
  <f-processed v-if="show_processed" v-bind="$attrs" />
</template>

<script>
import { mapState } from '@/utils/store'
import { FProcessed } from '@/import'

export default {
  components: {
    FProcessed,
  },
  inheritAttrs: false,
  computed: {
    ...mapState('options', ['show_processed']),
  },
}
</script>
