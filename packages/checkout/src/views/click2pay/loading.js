import { loadClick2pay } from '@/import'
import { mapState } from '@/utils/store'
import { makeProp } from '@/utils/props'
import { PROP_TYPE_BOOLEAN } from '@/constants/props'
import { consoleInfo } from '@/utils/console'

export default {
  props: {
    value: makeProp(PROP_TYPE_BOOLEAN, false),
  },
  computed: {
    ...mapState('click2pay', ['ready']),
    ...mapState('info', ['click2pay']),
    ...mapState('order', ['ready_to_submit']),
  },
  watch: {
    ready: 'init',
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      if (!this.ready) return
      if (this.ready_to_submit) return
      if (!this.click2pay.priority) return
      if (this.value) return
      this.$emit('input', true)

      loadClick2pay()
        .then(({ initializeGetCards }) => initializeGetCards())
        .finally(() => {
          this.$emit('input', false)
        })
        .catch(error => consoleInfo('Click to Pay loading', error))
    },
  },
  render() {},
}
