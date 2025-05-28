<template>
  <div :class="$style.wrapper">
    <template v-if="enableModal">
      <f-button-unstyled :class="$style.title" @click="open">
        <f-svg :class="$style.svg" name="security" :size="24" />
        <span v-text="$t('security_title')" />
      </f-button-unstyled>
      <f-modal-base v-model="showModal">
        <div :class="$style.modal_title">
          <f-svg :class="$style.modal_svg" name="security" size="lg" />
          <span v-text="$t('security_title')" />
        </div>
        <div :class="$style.modal_content" v-html="$t('security_text')" />
        <f-secure-message-icons v-if="showModal" />
      </f-modal-base>
    </template>
    <template v-else>
      <f-button-unstyled ref="security" :class="$style.title">
        <f-svg
          ref="reference"
          :class="$style.svg"
          name="security"
          :size="svgSize"
        />
        <span v-text="$t('security_title')" />
      </f-button-unstyled>
      <f-tooltip-default :target="() => $refs.security?.$el" @shown="shown">
        <div>
          <f-secure-message-icons v-if="showTooltip" :class="$style.mb_16" />
          <div :class="$style.tooltip_content" v-html="$t('security_text')" />
        </div>
      </f-tooltip-default>
    </template>
  </div>
</template>

<script>
import FButtonUnstyled from '@/components/button/button-unstyled'
import FSvg from '@/components/svg'
import FModalBase from '@/components/modal/modal-base'
import FTooltipDefault from '@/components/tooltip/tooltip-default'
import { FSecureMessageIcons } from '@/import'
import { resizeMixin } from '@/mixins/resize'
import { isPhone } from '@/utils/mobile'

export default {
  components: {
    FButtonUnstyled,
    FSvg,
    FModalBase,
    FTooltipDefault,
    FSecureMessageIcons,
  },
  mixins: [resizeMixin],
  data() {
    return {
      showModal: false,
      showTooltip: false,
    }
  },
  computed: {
    enableModal() {
      return isPhone || this.isWidthSm
    },
    svgSize() {
      return this.isBreakpointDownLg ? 24 : 32
    },
  },
  watch: {
    enableModal: 'watchEnableModal',
  },
  mounted() {
    this.watchEnableModal(this.enableModal)
  },
  methods: {
    open() {
      this.showModal = true
    },
    shown() {
      this.showTooltip = true
    },
    watchEnableModal(value) {
      if (value) return

      this.$nextTick(() => {
        this.$refs.security.$el.reference = this.$refs.reference.$el
      })
    },
  },
}
</script>

<style lang="scss" module>
.wrapper {
  margin-top: px-to-rem(32px);
  text-align: center;

  :global(.f-no-embed) & {
    @include media-breakpoint-up(lg) {
      position: absolute;
      bottom: px-to-rem(32px);
      right: px-to-rem(32px);
      display: flex;
      justify-content: flex-end;
      margin-left: auto;
    }
  }
}

.title {
  display: inline-flex;
  align-items: center;
  padding: px-to-rem(3px);
  font-size: px-to-rem(12px);
  color: $security_color;
  cursor: pointer;
  transition: color ease-in-out 0.15s;

  &:hover {
    color: $security_hover_color;
    text-decoration: none;

    .svg {
      color: $security_icon_hover_color;
    }
  }

  :global(.f-no-embed) & {
    @include media-breakpoint-up(lg) {
      display: flex;
      width: 90px;
      padding: 0;
      font-size: px-to-rem(8px);
      font-weight: 500;
      line-height: px-to-rem(10px);
      text-align: left;
      background-color: $container_bg;

      span {
        padding-top: px-to-rem(1px);
      }
    }
  }
}

.svg {
  color: $security_icon_color;
  vertical-align: middle;
  transition: color ease-in-out 0.15s;
  margin-right: px-to-rem(10px);

  :global(.f-no-embed) & {
    @include media-breakpoint-up(lg) {
      min-width: px-to-rem(32px);
      margin-right: px-to-rem(2px);
    }
  }
}

.modal_title {
  display: flex;
  align-items: center;
  margin-bottom: px-to-rem(32px);
  color: $modal_security_title_color;
}

.modal_svg {
  margin-right: px-to-rem(10px);
  color: $modal_security_title_svg_color;
}

.modal_content {
  margin-bottom: px-to-rem(32px);
  font-weight: 300;
}

.tooltip_content {
  font-size: px-to-rem(14px);
  font-weight: 400;
}

.mb_16 {
  margin-bottom: px-to-rem(16px);
}
</style>
