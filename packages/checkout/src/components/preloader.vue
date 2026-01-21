<template>
  <transition name="f-fade-enter">
    <div v-if="showContent"><slot /></div>
    <f-progress v-else-if="showProgress" v-bind="$attrs" />
  </transition>
</template>

<script>
import FProgress from '@/components/base/progress'
import { mapState } from '@/utils/store'
import { PROP_TYPE_ANY } from '@/constants/props'
import { makeProp } from '@/utils/props'

export default {
  components: {
    FProgress,
  },
  inheritAttrs: false,
  props: {
    condition: makeProp(PROP_TYPE_ANY, undefined, true),
  },
  computed: {
    ...mapState(['ready']),
    showProgress() {
      return !this.ready
    },
    showContent() {
      return this.condition
    },
  },
}
</script>
