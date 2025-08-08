<template>
  <div v-if="show" :class="$uiClass('style')">
    <f-scrollbar-vertical :wrap-class="$uiClass('wrap')">
      <f-sidebar-inner />
    </f-scrollbar-vertical>
  </div>
</template>

<script>
import FScrollbarVertical from '@/components/scrollbar-vertical'
import { FSidebarInner } from '@/import'
import { resizeMixin } from '@/mixins/resize'

export default {
  components: {
    FScrollbarVertical,
    FSidebarInner,
  },
  mixins: [resizeMixin],
  computed: {
    show() {
      return !this.isBreakpointDownLg
    },
  },
}
</script>

<style lang="scss" module>
.style_light {
  --border-color: #{$ash_400};
}

.style_dark {
  --border-color: #222528;
}

.style_adaptive {
  @include media-breakpoint-up(lg) {
    flex: 0 0 410px;
    max-width: 410px;
    height: 100%;
    background-color: $container_bg;
    border-right: px-to-rem(2px) solid var(--border-color);
  }

  @include media-breakpoint-up(xl) {
    border-radius: 0 0 0 $border-radius-lg;
  }

  @include media-breakpoint-up(xxl) {
    flex: 0 0 450px;
    max-width: 450px;
  }
}

.wrap_adaptive {
  @include media-breakpoint-up(lg) {
    display: flex;
    flex-direction: column;
    padding: 0 px-to-rem(40px);
  }

  @include media-breakpoint-up(xxl) {
    padding: 0 px-to-rem(60px);
  }
}
</style>
