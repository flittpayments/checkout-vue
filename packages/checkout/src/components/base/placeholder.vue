<template>
  <div>
    <label
      v-if="maskedValue"
      :class="[$style.style, textClass || nameClass]"
      :for="id"
      :style="style"
    >
      <slot>{{ placeholderText }}</slot>
    </label>
    <span ref="hidden" :class="[$style.hidden, nameClass]">
      {{ maskedValue }}
    </span>
  </div>
</template>

<script>
import { mask } from '@/utils/mask'
import {
  PROP_TYPE_ARRAY,
  PROP_TYPE_NUMBER,
  PROP_TYPE_NUMBER_STRING,
  PROP_TYPE_STRING,
} from '@/constants/props'
import { makeProp } from '@/utils/props'
import { resizeMixin } from '@/mixins/resize'

export default {
  mixins: [resizeMixin],
  inheritAttrs: false,
  props: {
    id: makeProp(PROP_TYPE_STRING),
    value: makeProp(PROP_TYPE_NUMBER_STRING),
    placeholder: makeProp(PROP_TYPE_STRING),
    mask: makeProp(PROP_TYPE_STRING),
    offset: makeProp(PROP_TYPE_NUMBER, 0),
    nameClass: makeProp(PROP_TYPE_ARRAY),
    textClass: makeProp(PROP_TYPE_STRING),
  },
  data() {
    return {
      left: 0,
    }
  },
  computed: {
    maskedValue() {
      return mask(this.value, this.mask, true)
    },
    placeholderText() {
      return this.placeholder
        .slice(this.maskedValue.length)
        .replace(/ /g, '\xa0')
    },
    style() {
      return {
        left: `${this.left}px`,
      }
    },
  },
  watch: {
    maskedValue: 'setLeft',
  },
  mounted() {
    this.setLeft()
  },
  methods: {
    setLeft() {
      this.$nextTick().then(() => {
        this.left = this.$refs.hidden?.offsetWidth + this.offset
      })
    },
    resize() {
      this.setLeft()
    },
  },
}
</script>

<style lang="scss" module>
.style {
  position: absolute;
  top: 0;
  user-select: none;
}

:global(#f) .hidden {
  position: absolute;
  top: 0;
  z-index: -1;
  display: inline;
  width: auto;
  padding-right: 0;
  opacity: 0;
}
</style>
