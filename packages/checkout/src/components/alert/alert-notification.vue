<template>
  <f-alert-base v-bind="attrs" v-on="fListeners">
    <div :class="$uiClass('icon')">
      <f-svg name="warning" size="lg" />
    </div>
    <div :class="$style.text">{{ $t(notification) }}</div>
    <div :class="$style.buttons">
      <f-button-link :class="$style.button" @click="close">{{
        $t('close')
      }}</f-button-link>
    </div>
  </f-alert-base>
</template>

<script>
import { attrsMixin } from '@/mixins/attrs'
import { listenersMixin } from '@/mixins/listeners'
import { mapState } from '@/utils/store'
import FAlertBase from '@/components/alert/alert-base'
import FButtonLink from '@/components/button/button-link'
import FSvg from '@/components/svg'

export default {
  components: {
    FAlertBase,
    FButtonLink,
    FSvg,
  },
  mixins: [attrsMixin, listenersMixin],
  model: {
    prop: 'show',
    event: 'input',
  },
  computed: {
    ...mapState(['notification']),
    attrs() {
      return {
        ...this.fAttrs,
        class: this.$uiClass('style'),
        variant: 'warning',
      }
    },
  },
  methods: {
    close() {
      this.$emit('input', false)
    },
  },
}
</script>

<style lang="scss" module>
.style {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: $zindex-notification;
  display: flex;
  padding: 0;
  border-radius: 0 0 $border-radius-lg $border-radius-lg;
  box-shadow: 0 px-to-rem(14px) px-to-rem(25px) fade($container_box_shadow, 40%);
}

.style_adaptive {
  @include media-breakpoint-up(md) {
    position: absolute;
    top: px-to-rem(8px);
    right: px-to-rem(16px);
    left: px-to-rem(16px);
    border-radius: $border-radius-lg;
  }

  @include media-breakpoint-up(lg) {
    top: px-to-rem(8px);
    left: 50%;
    width: 100%;
    max-width: px-to-rem(815px);
    transform: translateX(-50%);
  }

  @include media-breakpoint-up(xl) {
    transform: translate(-50%, -50%);
  }

  @media (min-width: map-get($grid-breakpoints, xl)) and (height <= 750px) {
    transform: translate(-50%, 0);
  }
}

.icon {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: px-to-rem(52px);
  color: $alert_warning_bg;
  background-color: $warning;
  border-radius: 0 0 0 $border-radius-lg;
}

.icon_adaptive {
  @include media-breakpoint-up(md) {
    border-radius: $border-radius-lg 0 0 $border-radius-lg;
  }
}

.text {
  flex-grow: 1;
  padding: px-to-rem(16px) 0 px-to-rem(16px) px-to-rem(20px);
}

.buttons {
  display: flex;
  align-items: center;
}

.button {
  padding-right: px-to-rem(24px);
  padding-left: px-to-rem(24px);
}
</style>
