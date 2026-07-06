<template>
  <div :class="$uiClass('style')">
    <template v-if="enableModal">
      <f-button-unstyled
        :class="$uiClass('title')"
        data-e2e-secure-message
        @click="$refs.modal.show()"
      >
        <f-svg :class="$uiClass('svg')" name="security" :size="24" />
        <span v-text="$t('security_title')" />
      </f-button-unstyled>
      <f-modal-wrapper ref="modal" v-slot="{ visible }">
        <div :class="$style.modal_title">
          <f-svg :class="$style.modal_svg" name="security" size="lg" />
          <span v-text="$t('security_title')" />
        </div>
        <div :class="$style.modal_content" v-html="$t('security_text')" />
        <f-secure-message-icons v-if="visible" />
      </f-modal-wrapper>
    </template>
    <template v-else>
      <f-button-unstyled
        ref="target"
        :class="$uiClass('title')"
        data-e2e-secure-message
      >
        <f-svg
          ref="reference"
          :class="$uiClass('svg')"
          name="security"
          :size="svgSize"
        />
        <span v-text="$t('security_title')" />
      </f-button-unstyled>
      <f-tooltip-default
        :reference="() => $refs.reference?.$el"
        :target="() => $refs.target?.$el"
        @shown="shown"
      >
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
import FModalWrapper from '@/components/modal/modal-wrapper'
import FTooltipDefault from '@/components/tooltip/tooltip-default'
import { FSecureMessageIcons } from '@/import'
import { resizeMixin } from '@/mixins/resize'
import { isPhone } from '@/utils/mobile'

export default {
  components: {
    FButtonUnstyled,
    FSvg,
    FModalWrapper,
    FTooltipDefault,
    FSecureMessageIcons,
  },
  mixins: [resizeMixin],
  data() {
    return {
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
  methods: {
    shown() {
      this.showTooltip = true
    },
  },
}
</script>

<style lang="scss" module>
.style {
  margin-top: px-to-rem(32px);
  text-align: center;
}

.style_adaptive {
  @include breakpoints.up(lg) {
    position: absolute;
    bottom: px-to-rem(32px);
    right: px-to-rem(32px);
    display: flex;
    justify-content: flex-end;
    margin-left: auto;
  }
}

.title {
  display: inline-flex;
  align-items: center;
  padding: px-to-rem(3px);
  font-size: px-to-rem(12px);
  color: var(--color);
  cursor: pointer;
  transition: color ease-in-out 0.15s;

  &:hover {
    color: var(--hover-color);
    text-decoration: none;
  }
}

.title_light {
  --color: #{$ash_800};
  --hover-color: #{$grey_3};
}

.title_dark {
  --color: #797c7e;
  --hover-color: #{$white_08};
}

.title_adaptive {
  @include breakpoints.up(lg) {
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

.svg {
  color: var(--color);
  vertical-align: middle;
  transition: color ease-in-out 0.15s;
  margin-right: px-to-rem(10px);

  .title:hover & {
    color: var(--hover-color);
  }
}

.svg_light {
  --color: #{$ash_700};
  --hover-color: #{$grey_2};
}

.svg_dark {
  --color: #797c7e;
  --hover-color: #{$white_08};
}

.svg_adaptive {
  @include breakpoints.up(lg) {
    min-width: px-to-rem(32px);
    margin-right: px-to-rem(2px);
  }
}

.modal_title {
  display: flex;
  align-items: center;
  margin-bottom: px-to-rem(32px);
  color: $grey_3;
}

.modal_svg {
  margin-right: px-to-rem(10px);
  color: $grey_1;
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
