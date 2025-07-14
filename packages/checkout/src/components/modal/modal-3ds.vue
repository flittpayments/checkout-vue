<template>
  <f-modal v-bind="attrs" v-on="$listeners" @shown="onShown" @hide="onHide">
    <span v-text="$t('submit3ds_text')" />
    <template #footer>
      <f-button
        variant="secondary"
        :text="$t('submit3ds_submit')"
        @click="click"
      />
      <div v-text="$t('submit3ds_wait', [second])" />
    </template>
  </f-modal>
</template>

<script>
import FModal from '@/components/modal/modal'
import FButton from '@/components/button/button'
import { timeoutMixin } from '@/mixins/timeout'
import { PROP_TYPE_NUMBER } from '@/constants/props'
import { makeProp } from '@/utils/props'

export default {
  components: {
    FModal,
    FButton,
  },
  mixins: [timeoutMixin],
  props: {
    duration: makeProp(PROP_TYPE_NUMBER, 0),
  },
  data() {
    return {
      second: 0,
    }
  },
  computed: {
    attrs() {
      return {
        ...this.$attrs,
        ref: 'modal',
        title: this.$t('submit3ds_title'),
      }
    },
  },
  methods: {
    onShown() {
      this.second = this.duration + 1

      this.tick()
    },
    onHide() {
      this.clearTimeout('tick')
    },
    tick() {
      this.second -= 1

      if (this.second) {
        this.timeout('tick', 1000)
      } else {
        this.click()
      }
    },
    click() {
      this.$emit('submit3ds')
      this.$refs.modal.hide()
    },
  },
}
</script>
