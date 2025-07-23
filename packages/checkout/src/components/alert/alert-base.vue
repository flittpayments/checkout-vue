<script>
import { Transition } from '@/utils/transition'
import { PROP_TYPE_STRING, PROP_TYPE_BOOLEAN } from '@/constants/props'
import { makeProp } from '@/utils/props'

export default {
  inheritAttrs: false,
  props: {
    variant: makeProp(PROP_TYPE_STRING, 'info', value =>
      ['info', 'warning'].includes(value)
    ),
    show: makeProp(PROP_TYPE_BOOLEAN, false),
  },
  render(h) {
    let $alert // undefined
    if (this.show) {
      $alert = h(
        'div',
        {
          key: this._uid,
          class: [this.$style.style, this.$style[this.variant]],
          attrs: {
            role: 'alert',
            'aria-live': 'polite',
            'aria-atomic': true,
          },
        },
        this.$scopedSlots.default()
      )
      $alert = [$alert]
    }
    return h(Transition, {}, $alert)
  },
}
</script>

<style lang="scss" module>
@mixin alert-variant($background, $color) {
  color: $color;
  background-color: $background;

  :global(#f) & a {
    color: $color;
  }
}

.style {
  position: relative;
  padding: px-to-rem(24px) px-to-rem(20px);
  margin-bottom: px-to-rem(16px);
  border-radius: $border-radius-lg;
}

.info {
  @include alert-variant(fade($alert_info_bg, 90%), $alert_info_color);
}

.warning {
  @include alert-variant($alert_warning_bg, $warning);
}
</style>
