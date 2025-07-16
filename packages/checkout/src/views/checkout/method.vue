<template>
  <div>
    <f-header back />
    <div v-if="full_screen" class="f-wrapper">
      <f-sidebar />
      <f-scrollbar-vertical class="f-center" wrap-class="f-center-wrap">
        <f-shadow />
        <div :class="className">
          <transition name="f-fade-enter">
            <router-view />
          </transition>
          <div class="f-flex-grow-1" />
          <f-processed-wrapper v-if="isBreakpointDownLg" />
          <f-secure-message-wrapper />
        </div>
      </f-scrollbar-vertical>
    </div>
    <div v-else :class="className">
      <transition name="f-fade-enter">
        <router-view />
      </transition>
      <f-processed-wrapper v-if="isBreakpointDownLg" />
      <f-secure-message-wrapper />
    </div>
  </div>
</template>

<script>
import FHeader from '@/components/header'
import FSidebar from '@/components/sidebar'
import FScrollbarVertical from '@/components/scrollbar-vertical'
import FShadow from '@/components/base/shadow'
import FProcessedWrapper from '@/components/processed-wrapper'
import FSecureMessageWrapper from '@/components/secure-message-wrapper'
import { mapState } from '@/utils/store'
import { resizeMixin } from '@/mixins/resize'

export default {
  components: {
    FHeader,
    FSidebar,
    FScrollbarVertical,
    FShadow,
    FProcessedWrapper,
    FSecureMessageWrapper,
  },
  mixins: [resizeMixin],
  computed: {
    ...mapState('options', ['full_screen']),
    className() {
      return ['f-method', `f-method-${this.$route.name}`]
    },
  },
}
</script>
