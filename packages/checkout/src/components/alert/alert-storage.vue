<template>
  <f-alert-base v-bind="attrs" v-on="fListeners">
    <div :class="$uiClass('row')">
      <div :class="$uiClass('content')">
        <slot />
      </div>
      <div :class="$uiClass('buttons')">
        <f-button-link
          :class="$uiClass('button')"
          variant="secondary"
          @click="close"
        >
          {{ $t('not_now') }}
        </f-button-link>
        <f-button
          :class="$uiClass('button')"
          variant="secondary"
          :text="$t('accept')"
          @click="ok"
        />
      </div>
    </div>
  </f-alert-base>
</template>

<script>
import FAlertBase from '@/components/alert/alert-base'
import FButtonLink from '@/components/button/button-link'
import FButton from '@/components/button/button'

import { localStorage, sessionStorage } from '@/utils/store'
import { attrsMixin } from '@/mixins/attrs'
import { listenersMixin } from '@/mixins/listeners'
import { makeProp } from '@/utils/props'
import { PROP_TYPE_STRING } from '@/constants/props'

export default {
  components: {
    FAlertBase,
    FButtonLink,
    FButton,
  },
  mixins: [attrsMixin, listenersMixin],
  props: {
    name: makeProp(PROP_TYPE_STRING),
  },
  data() {
    return {
      show: true,
    }
  },
  computed: {
    attrs() {
      return {
        ...this.fAttrs,
        show: this.show,
        class: this.$uiClass('wrapper'),
      }
    },
  },
  methods: {
    close() {
      sessionStorage.set(this.name, 1)
      this.show = false
    },
    ok() {
      localStorage.set(this.name, 1)
      this.show = false
      this.$emit('ok')
    },
  },
}
</script>

<style lang="scss" module>
.wrapper {
  #{$prefix}container_bg: fade($alert_info_bg, 90%);
  #{$prefix}outline_bg: $outline_secondary_bg;
  #{$prefix}outline_border: $outline_secondary_border;

  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: $zindex-fixed;
  padding-bottom: px-to-rem(32px);
  margin-bottom: 0;
  border-radius: $border-radius-lg $border-radius-lg px-to-rem(0) px-to-rem(0);
}

.wrapper_adaptive {
  @include media-breakpoint-up(md) {
    right: px-to-rem(32px);
    bottom: px-to-rem(32px);
    left: px-to-rem(32px);
    padding-bottom: px-to-rem(24px);
    border-radius: $border-radius-lg;
  }

  @include media-breakpoint-up(lg) {
    width: 100%;
    max-width: 940px;
    margin: 0 auto;
  }

  @include media-breakpoint-up(xl) {
    align-items: center;
  }
}

.row_adaptive {
  @include media-breakpoint-up(md) {
    display: flex;
    align-items: center;
  }
}

.content {
  line-height: px-to-rem(20px);
  margin-bottom: px-to-rem(16px);
}

.content_adaptive {
  @include media-breakpoint-up(md) {
    flex-grow: 1;
    margin-bottom: 0;
  }
}

.buttons {
  text-align: center;
}

.buttons_adaptive {
  @include media-breakpoint-up(md) {
    display: flex;
    flex-direction: column;
  }
}

.button_adaptive {
  @include media-breakpoint-up(md) {
    display: block;
    width: 100%;

    &:first-child {
      margin-top: px-to-rem(-10px);
      margin-bottom: px-to-rem(12px);
    }
  }
}
</style>
