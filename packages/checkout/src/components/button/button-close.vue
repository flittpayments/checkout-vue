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
        class: this.$style.style,
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

<style lang="scss" module>
.style {
  padding: 0;
  font-size: px-to-rem(24px);
  font-weight: 600;
  line-height: 1;
  color: $close_color;
  cursor: pointer;
  background-color: transparent;
  border: 0;
  border-radius: $border-radius;
  opacity: 1;

  // Override <a>'s hover style
  &:hover {
    text-decoration: none;
  }

  &:hover,
  &:focus {
    opacity: 0.75;
  }

  &:focus-visible {
    outline: 0;
    box-shadow: 0 0 0 px-to-rem(2px) $outline_border;
  }

  &:disabled {
    pointer-events: none;
  }
}
</style>
