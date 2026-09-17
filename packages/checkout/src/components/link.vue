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
  inheritAttrs: false,
  props: {
    href: makeProp(PROP_TYPE_STRING),
    target: makeProp(PROP_TYPE_STRING),
    variant: makeProp(PROP_TYPE_STRING, 'default', value =>
      ['default', 'secondary'].includes(value)
    ),
  },
  computed: {
    tag() {
      return this.href ? 'a' : 'f-button-unstyled'
    },
    attrs() {
      const { href, target } = this
      return {
        ...this.$attrs,
        href,
        target,
        class: [this.$style.style, this.$uiClass(this.variant)],
        ...(target === '_blank' ? { rel: 'noopener noreferrer' } : {}),
      }
    },
  },
}
</script>

<style lang="scss" module>
.style {
  font-weight: var(--font-weight);
  color: var(--color);
  text-decoration: var(--text-decoration);
  transition:
    box-shadow ease-in-out 0.15s,
    background-color ease-in-out 0.15s;
  border-radius: $border-radius-sm;

  &:hover {
    text-decoration: var(--hover-text-decoration);
  }

  &:focus-visible {
    outline: 0;
    background-color: $outline_bg;
    box-shadow:
      0 0 0 px-to-rem(2px) $container_bg,
      0 0 0 px-to-rem(3.5px) $outline_border;
  }
}

.default {
  --font-weight: inherit;
  --color: var(#{$prefix}main);
  --text-decoration: underline;
  --hover-text-decoration: none;
}

.secondary {
  --font-weight: 600;
  --text-decoration: none;
  --hover-text-decoration: underline;
}

.secondary_light {
  --color: #818c99;
}

.secondary_dark {
  --color: #989a9c;
}
</style>
