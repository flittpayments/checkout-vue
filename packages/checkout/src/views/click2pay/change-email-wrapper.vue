<template>
  <transition name="f-fade-enter">
    <click2pay-change-email v-if="show" />
  </transition>
</template>

<script>
import { Click2payChangeEmail, loadClick2pay } from '@/import'
import { mapState, mapStateGetSet } from '@/utils/store'
import { timeoutMixin } from '@/mixins/timeout'
import { consoleInfo } from '@/utils/console'

export default {
  components: {
    Click2payChangeEmail,
  },
  mixins: [timeoutMixin],
  data() {
    return {
      show: false,
    }
  },
  computed: {
    ...mapState('click2pay', ['ready']),
    ...mapState('order', ['ready_to_submit']),
    ...mapState('params', ['email']),
    ...mapStateGetSet(['params']),
  },
  watch: {
    ready: 'init',
    email: 'watchEmail',
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      if (!this.ready) return
      if (this.ready_to_submit) return

      loadClick2pay()
        .then(({ initialize, validateEmail }) =>
          initialize().then(() => validateEmail(this.email))
        )
        .then(() => {
          this.show = true
        })
        .catch(error => {
          consoleInfo('Click to Pay', error)
          this.show = false
        })
    },
    watchEmail() {
      this.timeout('init', 300)
    },
  },
}
</script>
