<template>
  <div class="f-without-sidebar">
    <f-header />
    <div class="f-wrapper">
      <f-scrollbar-vertical class="f-center" wrap-class="f-center-wrap">
        <f-shadow v-if="showShadow" />
        <div class="f-method">
          <div v-if="isCentered" class="f-flex-grow-1" />
          <transition name="f-fade-enter">
            <router-view />
          </transition>
          <div class="f-flex-grow-1" />
          <f-processed-wrapper />
          <f-secure-message-wrapper />
        </div>
      </f-scrollbar-vertical>
    </div>
  </div>
</template>

<script>
import FHeader from '@/components/header'
import FScrollbarVertical from '@/components/scrollbar-vertical'
import FShadow from '@/components/base/shadow'
import FProcessedWrapper from '@/components/processed-wrapper'
import FSecureMessageWrapper from '@/components/secure-message-wrapper'
import { mapState } from '@/utils/store'

export default {
  components: {
    FHeader,
    FScrollbarVertical,
    FShadow,
    FProcessedWrapper,
    FSecureMessageWrapper,
  },
  computed: {
    ...mapState('options', ['full_screen']),
    showShadow() {
      return this.full_screen && !this.$meta.noShadow
    },
    isCentered() {
      return this.full_screen && this.$meta.isCentered
    },
  },
}
</script>
