<template>
  <component :is="tag" v-bind="attrs" v-on="$listeners">
    <slot>
      <span v-text="text" />
    </slot>
    <f-svg v-if="loading" :class="$style.spin" name="redo" size="20" spin />
  </component>
</template>

<script>
import FSvg from '@/components/svg'
import { PROP_TYPE_STRING, PROP_TYPE_BOOLEAN } from '@/constants/props'
import { makeProp } from '@/utils/props'
import { arrayIncludes } from '@/utils/array'

export default {
  components: {
    FSvg,
  },
  props: {
    block: makeProp(PROP_TYPE_BOOLEAN, false),
    disabled: makeProp(PROP_TYPE_BOOLEAN, false),
    loading: makeProp(PROP_TYPE_BOOLEAN, false),
    variant: makeProp(PROP_TYPE_STRING, 'default', value =>
      arrayIncludes(
        ['success', 'default', 'secondary', 'outline', 'light', 'dark'],
        value
      )
    ),
    size: makeProp(PROP_TYPE_STRING, undefined, value =>
      arrayIncludes(['sm', 'lg', 'icon'], value)
    ),
    text: makeProp(PROP_TYPE_STRING),
    type: makeProp(PROP_TYPE_STRING, 'button'),
  },
  computed: {
    tag() {
      return this.$attrs.href ? 'a' : 'button'
    },
    attrs() {
      return {
        ...this.$attrs,
        disabled: this.disabled,
        class: this.className,
        type: this.tag === 'button' ? this.type : undefined,
      }
    },
    className() {
      return [
        'f-btn',
        `f-btn-${this.variant}`,
        {
          'f-btn-block': this.block,
          [`f-btn-${this.size}`]: this.size,
        },
      ]
    },
  },
}
</script>

<style lang="scss" module>
.spin {
  position: relative;
  z-index: 1;
  margin-left: px-to-rem(4px);
}
</style>
