<template>
  <f-main>
    <f-header without-sidebar />
    <f-content>
      <f-scrollbar-vertical
        :class="$uiClass('center')"
        :wrap-class="$uiClass('wrap')"
      >
        <f-shadow v-if="showShadow" />
        <div v-if="isCentered" :class="$style.flex_grow_1" />
        <router-view v-slot="{ Component }">
          <transition name="f-fade-enter">
            <component :is="Component" />
          </transition>
        </router-view>
        <div :class="$style.flex_grow_1" />
        <f-processed-wrapper />
        <f-secure-message-wrapper />
      </f-scrollbar-vertical>
    </f-content>
  </f-main>
</template>

<script>
import FMain from '@/components/base/main'
import FHeader from '@/components/header'
import FContent from '@/components/base/content'
import FScrollbarVertical from '@/components/scrollbar-vertical'
import FShadow from '@/components/base/shadow'
import FProcessedWrapper from '@/components/processed-wrapper'
import FSecureMessageWrapper from '@/components/secure-message-wrapper'
import { mapState } from '@/utils/store'

export default {
  components: {
    FMain,
    FHeader,
    FContent,
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

<style lang="scss" module>
.center_adaptive {
  @include breakpoints.up(lg) {
    flex: 1;
  }
}

.wrap {
  display: flex;
  flex-direction: column;
  padding: 0 px-to-rem(20px) px-to-rem(32px);
}

.wrap_adaptive {
  @include breakpoints.up(md) {
    padding: 0 px-to-rem(40px) px-to-rem(32px);
  }

  @include breakpoints.up(lg) {
    min-height: auto;
  }

  @include breakpoints.up(xxl) {
    padding: 0 px-to-rem(60px) px-to-rem(32px);
  }
}

.flex_grow_1 {
  flex-grow: 1;
}
</style>
