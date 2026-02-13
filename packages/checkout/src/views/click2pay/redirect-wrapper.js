import { loadClick2pay } from '@/import'
import { mapState } from '@/utils/store'
import { consoleInfo } from '@/utils/console'

export default {
  computed: {
    ...mapState('click2pay', ['ready']),
    ...mapState('info', ['click2pay']),
    ...mapState('order', ['ready_to_submit', 'need_verify_code']),
  },
  watch: {
    ready: 'init',
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      const text = 'Click to Pay redirect'
      if (!this.ready) return
      if (this.ready_to_submit) return
      if (this.need_verify_code) return
      if (!this.click2pay.priority) return
      console.time(text)

      loadClick2pay()
        .then(({ redirect }) => redirect())
        .then(([actionCode, name]) => {
          console.timeEnd(text)
          this.store.setClick2payActionCode(actionCode)
          this.$router.push({ name }).catch(() => {})
        })
        .catch(error => {
          consoleInfo(text, error)
        })
    },
  },
  render() {},
}
