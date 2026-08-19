<template>
  <div>
    <click2pay-user-exists-header v-if="show" />
  </div>
</template>

<script>
import { Click2payUserExistsHeader } from '@/import'
import { mapState } from '@/utils/store'

export default {
  components: {
    Click2payUserExistsHeader,
  },
  data() {
    return {
      show: false,
    }
  },
  computed: {
    ...mapState('click2pay', ['actionCode']),
    ...mapState('order', ['ready_to_submit']),
  },
  watch: {
    actionCode: 'init',
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      if (this.ready_to_submit) return
      if (this.actionCode !== 'SUCCESS') return

      this.show = true
    },
  },
}
</script>
