<script>
import { Transition } from '@/utils/transition'
import { PROP_TYPE_STRING, PROP_TYPE_BOOLEAN } from '@/constants/props'
import { makeProp } from '@/utils/props'
import { h } from 'vue'

export default {
  props: {
    variant: makeProp(PROP_TYPE_STRING, 'info', value =>
      ['info', 'warning'].includes(value)
    ),
    show: makeProp(PROP_TYPE_BOOLEAN, false),
  },
  mounted() {
    console.log('mounted', this.show)
  },
  render() {
    return h(
      Transition,
      { appear: true },
      {
        default: () =>
          this.show
            ? h(
                'div',
                {
                  key: this._.uid,
                  class: [this.$style.style, this.$uiClass(this.variant)],
                  role: 'alert',
                  'aria-live': 'polite',
                  'aria-atomic': true,
                },
                this.$slots.default?.()
              )
            : null,
      }
    )
  },
}
</script>

<style lang="scss" module>
.style {
  color: var(--color);
  background: var(--bg);
  position: relative;
  padding: px-to-rem(24px) px-to-rem(20px);
  margin-bottom: px-to-rem(16px);
  border-radius: $border-radius-lg;
}

:global(#f) .style a {
  color: var(--color);
}

.info_light {
  #{$prefix}container_bg: #{rgba($grey_3, 0.9)};
  #{$prefix}outline_bg: #{$grey_3};
  #{$prefix}outline_border: #{$ash_800};
  --color: #{$white};
  --bg: #{rgba($grey_3, 0.9)};
}

.info_dark {
  #{$prefix}container_bg: #{$white};
  #{$prefix}outline_bg: #{$ash_300};
  #{$prefix}outline_border: #{$grey_1};
  --color: #{$grey_2};
  --bg: #{$white};
}

.warning_light {
  --color: #{$warning};
  --bg: #{$white};
}

.warning_dark {
  --color: #{$warning};
  --bg: #{$grey_9};
}
</style>
