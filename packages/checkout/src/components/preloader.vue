<template>
  <transition name="f-fade-enter">
    <f-progress v-if="showProgress" key="1" v-bind="$attrs" />
    <div v-if="showContent" key="2"><slot /></div>
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
      return !this.condition && !this.ready
    },
    showContent() {
      return this.condition
    },
  },
}
</script>
