<template>
  <f-alert-base v-bind="attrs">
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
        <f-button-secondary
          :class="$uiClass('button')"
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
import FButtonSecondary from '@/components/button/button-secondary'

import { localStorage, sessionStorage } from '@/utils/store'
import { makeProp } from '@/utils/props'
import { PROP_TYPE_STRING } from '@/constants/props'

export default {
  components: {
    FAlertBase,
    FButtonLink,
    FButtonSecondary,
  },
  props: {
    name: makeProp(PROP_TYPE_STRING),
  },
  emits: ['ok'],
  data() {
    return {
      show: true,
    }
  },
  computed: {
    attrs() {
      return {
        ...this.$attrs,
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
  @include breakpoints.up(md) {
    right: px-to-rem(32px);
    bottom: px-to-rem(32px);
    left: px-to-rem(32px);
    padding-bottom: px-to-rem(24px);
    border-radius: $border-radius-lg;
  }

  @include breakpoints.up(lg) {
    width: 100%;
    max-width: 940px;
    margin: 0 auto;
  }

  @include breakpoints.up(xl) {
    align-items: center;
  }
}

.row_adaptive {
  @include breakpoints.up(md) {
    display: flex;
    align-items: center;
  }
}

.content {
  line-height: px-to-rem(20px);
  margin-bottom: px-to-rem(16px);
}

.content_adaptive {
  @include breakpoints.up(md) {
    flex-grow: 1;
    margin-bottom: 0;
  }
}

.buttons {
  text-align: center;
}

.buttons_adaptive {
  @include breakpoints.up(md) {
    display: flex;
    flex-direction: column;
  }
}

.button_adaptive {
  @include breakpoints.up(md) {
    display: block;
    width: 100%;

    &:first-child {
      margin-top: px-to-rem(-10px);
      margin-bottom: px-to-rem(12px);
    }
  }
}
</style>
