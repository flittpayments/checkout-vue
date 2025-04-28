<template>
  <div class="f-without-sidebar">
    <f-header />
    <div class="f-wrapper">
      <f-scrollbar-vertical class="f-center" wrap-class="f-center-wrap">
        <div v-if="showTop" class="f-top">
          <div class="f-top-inner" />
        </div>
        <div class="f-method">
          <transition name="f-fade-enter">
            <router-view />
          </transition>
          <div class="f-flex-grow-1" />
          <f-secure-message-wrapper />
        </div>
      </f-scrollbar-vertical>
    </div>
  </div>
</template>

<script>
import FHeader from '@/components/header'
import FScrollbarVertical from '@/components/scrollbar-vertical'
import FSecureMessageWrapper from '@/components/secure-message-wrapper'
import { mapState } from '@/utils/store'

export default {
  components: {
    FHeader,
    FScrollbarVertical,
    FSecureMessageWrapper,
  },
  computed: {
    ...mapState('options', ['full_screen']),
    showTop() {
      return this.full_screen && !this.$route.meta.noTop
    },
  },
}
</script>
