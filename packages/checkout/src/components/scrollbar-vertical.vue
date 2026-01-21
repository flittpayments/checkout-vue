<template>
  <div :class="$style.style">
    <div
      ref="wrap"
      :class="[$style.wrap, wrapClass]"
      :style="styleWrap"
      @scroll="scroll"
    >
      <slot />
    </div>
    <div :class="$style.track">
      <div
        ref="thumb"
        :class="$style.thumb"
        :style="styleThumb"
        @mousedown="dragstart"
      />
    </div>
  </div>
</template>

<script>
import getScrollbarWidth from '@/utils/scrollbar-width'
import { resizeMixin } from '@/mixins/resize'
import { isMobile } from '@/utils/mobile'
import { contains } from '@/utils/dom'
import { PROP_TYPE_ARRAY_STRING } from '@/constants/props'
import { makeProp } from '@/utils/props'

export default {
  mixins: [resizeMixin],
  props: {
    wrapClass: makeProp(PROP_TYPE_ARRAY_STRING),
  },
  data() {
    return {
      scrollbarWidth: 0,
      thumbTop: '',
      thumbHeight: '',
    }
  },
  computed: {
    styleWrap() {
      return { marginRight: `-${this.scrollbarWidth}px` }
    },
    styleThumb() {
      return { height: this.thumbHeight, top: this.thumbTop }
    },
  },
  created() {
    this.scrollbarWidth = getScrollbarWidth()
    document.addEventListener('mouseup', this.dragend)
  },
  beforeUnmount() {
    document.addEventListener('mouseup', this.dragend)
  },
  mounted() {
    this.$nextTick().then(this.getThumbSize)
  },
  methods: {
    resize() {
      this.getThumbSize()
    },
    getThumbSize() {
      const { wrap } = this.$refs
      if (!wrap) return
      const { scrollHeight, clientHeight } = wrap
      const heightPercentage = (clientHeight * 100) / scrollHeight
      this.thumbHeight = heightPercentage < 100 ? `${heightPercentage}%` : ''
    },
    scroll(evt) {
      this.hideAutocomplete()
      this.getThumbSize()
      const el = evt.currentTarget
      const { scrollHeight, scrollTop } = el
      this.thumbTop = `${(scrollTop * 100) / scrollHeight}%`
    },
    dragstart(evt) {
      if (isMobile) return
      evt.stopImmediatePropagation()
      this._draggable = true
      const { offsetTop } = this.$refs.thumb
      this._prevY = evt.clientY - offsetTop
      document.addEventListener('mousemove', this.draging)
    },
    draging(evt) {
      if (!this._draggable) return

      const { clientY } = evt
      const { wrap } = this.$refs
      const { scrollHeight, clientHeight } = wrap
      const offsetY = clientY - this._prevY
      const top = (offsetY * scrollHeight) / clientHeight
      wrap.scrollTop = top
    },
    dragend() {
      if (!this._draggable) return

      this._draggable = false
      document.removeEventListener('mousemove', this.draging)
    },
    hideAutocomplete() {
      if (isMobile) return

      let activeElement = document.activeElement

      if (activeElement?.tagName !== 'INPUT') return

      if (!contains(this.$refs.wrap, activeElement)) return

      activeElement.blur()

      let rectWrapper = this.$refs.wrap.getBoundingClientRect()
      let rectActiveElement = activeElement.getBoundingClientRect()

      if (rectActiveElement.top < rectWrapper.top) return
      if (rectActiveElement.bottom > rectWrapper.bottom) return

      activeElement.focus()
    },
  },
}
</script>

<style lang="scss" module>
.style {
  height: 100%;
  min-height: inherit;
  position: relative;
  overflow: hidden;

  &:hover {
    .track {
      opacity: 1;
    }
  }
}

.wrap {
  height: 100%;
  min-height: inherit;
  overflow: hidden scroll;
}

.track {
  position: absolute;
  top: px-to-rem(2px);
  right: px-to-rem(2px);
  bottom: px-to-rem(2px);
  z-index: 1;
  width: px-to-rem(4px);
  border-radius: $border-radius-sm;
  opacity: 0;
  transition: opacity 0.25s ease-out;
}

.thumb {
  position: absolute;
  width: 100%;
  height: 0;
  cursor: pointer;
  user-select: none;
  background: var(#{$prefix}scrollbar_thumb_bg);
  border-radius: inherit;
}
</style>
