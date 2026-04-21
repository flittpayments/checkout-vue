<template>
  <component :is="tag" v-bind="attrs" v-on="$listeners">
    <slot />
  </component>
</template>

<script>
import FButtonUnstyled from '@/components/button/button-unstyled'
import { makeProp } from '@/utils/props'
import { PROP_TYPE_STRING } from '@/constants/props'

export default {
  components: {
    FButtonUnstyled,
  },
  props: {
    href: makeProp(PROP_TYPE_STRING),
    size: makeProp(PROP_TYPE_STRING, undefined, value =>
      ['14'].includes(value)
    ),
  },
  computed: {
    tag() {
      return this.href ? 'a' : 'f-button-unstyled'
    },
    attrs() {
      return {
        ...this.$attrs,
        href: this.href,
        target: this.href ? '_blank' : undefined,
        class: this.className,
        rel: this.href ? 'noopener noreferrer' : undefined,
      }
    },
    className() {
      return [this.$style.style, this.$style[`s_${this.size}`]]
    },
  },
}
</script>

<style lang="scss" module>
.style {
  font-weight: 400;
  color: #788fff;
  text-decoration: underline;

  &:hover {
    text-decoration: none;
  }
}

.s_14 {
  font-size: px-to-rem(14px);
  line-height: px-to-rem(20px);
}
</style>
