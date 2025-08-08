<template>
  <f-tooltip-base v-bind="attrs" v-on="$listeners">
    <f-scrollbar-vertical
      :wrap-class="$uiClass('wrap', [size])"
      data-e2e-dropdown-wrap
    >
      <slot />
    </f-scrollbar-vertical>
  </f-tooltip-base>
</template>

<script>
import FTooltipBase from '@/components/tooltip/tooltip-base'
import FScrollbarVertical from '@/components/scrollbar-vertical'

import { makeProp } from '@/utils/props'
import { PROP_TYPE_BOOLEAN, PROP_TYPE_STRING } from '@/constants/props'

export default {
  components: {
    FTooltipBase,
    FScrollbarVertical,
  },
  inheritAttrs: false,
  props: {
    arrow: makeProp(PROP_TYPE_BOOLEAN, false),
    size: makeProp(PROP_TYPE_STRING, 'md', value =>
      ['md', 'lg', 'card'].includes(value)
    ),
  },
  computed: {
    attrs() {
      return {
        ...this.$attrs,
        ref: 'tooltip',
        boundary: 'window',
        triggers: 'click clickout',
        noArrow: !this.arrow,
        customClass: this.$uiClass('style', {
          no_arrow: !this.arrow,
        }),
        innerClass: this.$style.inner,
        matchTargetWidth: true,
      }
    },
  },
  methods: {
    hide() {
      this.$refs.tooltip.$emit('close')
    },
  },
}
</script>

<style lang="scss" module>
.style {
  --color: #{$grey_3};
  --bg: #{$white};
  --shadow: #{0 px-to-rem(8px) px-to-rem(32px) rgba(#b6b9bf, 0.5)};
  --opacity: 1;
  --padding: #{$border-radius 0};
  --max-width: #{px-to-rem(360px)};

  #{$prefix}scrollbar_thumb_bg: #{$ash_500};
}

.style.style_no_arrow {
  padding: px-to-rem(4px) 0;
}

.inner {
  display: block;
}

.wrap_md {
  padding: 0 px-to-rem(4px);
  max-height: px-to-rem(400px);
}

.wrap_lg {
  padding: 0 px-to-rem(20px);
  max-height: px-to-rem(400px);
}

.wrap_card {
  padding: 0;
  max-height: px-to-rem(316px);
}
</style>
