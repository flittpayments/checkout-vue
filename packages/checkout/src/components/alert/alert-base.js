import { Transition } from '@/utils/transition'
import { PROP_TYPE_STRING, PROP_TYPE_BOOLEAN } from '@/constants/props'
import { makeProp } from '@/utils/props'

export default {
  inheritAttrs: false,
  props: {
    variant: makeProp(PROP_TYPE_STRING, 'info'),
    show: makeProp(PROP_TYPE_BOOLEAN, false),
  },
  render(h) {
    let $alert // undefined
    if (this.show) {
      $alert = h(
        'div',
        {
          key: this._uid,
          staticClass: 'f-alert',
          class: [`f-alert-${this.variant}`],
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
