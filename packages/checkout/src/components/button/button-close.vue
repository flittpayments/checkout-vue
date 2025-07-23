<script>
import { stopEvent } from '@/utils/events'
import { isEvent } from '@/utils/inspect'
import { normalizeSlot } from '@/utils/normalize-slot'
import { PROP_TYPE_STRING, PROP_TYPE_BOOLEAN } from '@/constants/props'
import { makeProp } from '@/utils/props'

export default {
  inheritAttrs: false,
  props: {
    content: makeProp(PROP_TYPE_STRING, '&times;'),
    disabled: makeProp(PROP_TYPE_BOOLEAN, false),
    ariaLabel: makeProp(PROP_TYPE_STRING, 'Close'),
  },
  methods: {
    onClick(evt) {
      // Ensure click on button HTML content is also disabled
      if (this.disabled && isEvent(evt)) {
        stopEvent(evt)
        return
      }
      this.$emit('click', evt)
    },
  },
  render(h) {
    return h(
      'button',
      {
        staticClass: 'f-close',
        domProps: {
          innerHTML: this.$scopedSlots.default ? undefined : this.content,
        },
        attrs: {
          type: 'button',
          'aria-label': this.ariaLabel ? String(this.ariaLabel) : null,
        },
        on: {
          click: this.onClick,
        },
      },
      normalizeSlot('default', {}, this.$scopedSlots)
    )
  },
}
</script>
