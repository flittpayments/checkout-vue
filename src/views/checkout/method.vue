<template>
  <div>
    <f-header back />
    <div class="f-wrapper">
      <f-sidebar />
      <f-scrollbar-vertical class="f-center" wrap-class="f-center-wrap">
        <div v-if="full_screen" class="f-top">
          <div class="f-top-inner" />
        </div>
        <div :class="className">
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
import FSidebar from '@/components/sidebar'
import FScrollbarVertical from '@/components/scrollbar-vertical'
import FSecureMessageWrapper from '@/components/secure-message-wrapper'
import { mapState } from '@/utils/store'

export default {
  components: {
    FHeader,
    FSidebar,
    FScrollbarVertical,
    FSecureMessageWrapper,
  },
  computed: {
    ...mapState('options', ['full_screen']),
    className() {
      return ['f-method', `f-method-${this.$route.name}`]
    },
  },
}
</script>
