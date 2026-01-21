<script>
import { stopEvent } from '@/utils/events'
import { isEvent } from '@/utils/inspect'
import { PROP_TYPE_STRING, PROP_TYPE_BOOLEAN } from '@/constants/props'
import { makeProp } from '@/utils/props'
import { h } from 'vue'

export default {
  inheritAttrs: false,
  props: {
    content: makeProp(PROP_TYPE_STRING, '&times;'),
    disabled: makeProp(PROP_TYPE_BOOLEAN, false),
    ariaLabel: makeProp(PROP_TYPE_STRING, 'Close'),
  },
  emits: ['click'],
  methods: {
    onClick(evt) {
      if (this.disabled && isEvent(evt)) {
        stopEvent(evt)
        return
      }
      this.$emit('click', evt)
    },
  },
  render() {
    return h(
      'button',
      {
        class: ['f-close', this.$style.style],
        type: 'button',
        disabled: this.disabled,
        innerHTML: this.$slots.default ? undefined : this.content,
        'aria-label': this.ariaLabel ? String(this.ariaLabel) : undefined,
        onClick: this.onClick,
      },
      this.$slots.default?.()
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
  color: $white;
  cursor: pointer;
  background-color: transparent;
  border: 0;
  border-radius: $border-radius;
  opacity: 1;

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
