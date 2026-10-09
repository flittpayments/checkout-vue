<template>
  <button v-bind="$attrs" :class="className" type="button">
    <slot />
  </button>
</template>

<script>
import { PROP_TYPE_STRING, PROP_TYPE_BOOLEAN } from '@/constants/props'
import { makeProp } from '@/utils/props'
import { arrayIncludes } from '@/utils/array'

export default {
  props: {
    block: makeProp(PROP_TYPE_BOOLEAN, false),
    variant: makeProp(PROP_TYPE_STRING, 'default', value =>
      arrayIncludes(['default', 'secondary'], value)
    ),
    size: makeProp(PROP_TYPE_STRING, undefined, value =>
      arrayIncludes(['56'], value)
    ),
  },
  computed: {
    className() {
      return [
        this.$style.style,
        this.$uiClass(this.variant),
        this.$style[`s_${this.size}`],
        {
          [this.$style.block]: this.block,
        },
      ]
    },
  },
}
</script>

<style lang="scss" module>
.style {
  color: var(--color);
  position: relative;
  display: inline-block;
  height: px-to-rem(44px);
  min-height: px-to-rem(44px);
  padding: px-to-rem(10px) px-to-rem(32px);
  font-size: px-to-rem(16px);
  font-weight: 500;
  line-height: px-to-rem(24px);
  text-align: center;
  background: none;
  border: none;
  border-radius: $border-radius;
  transition: all ease-in-out 0.15s;
  white-space: nowrap;

  &:hover,
  &:focus {
    color: var(--hover-color);
    text-decoration: none;
    transform: translateY(px-to-rem(-2px));
  }

  &:focus-visible {
    outline: 0;
    box-shadow: 0 0 0 px-to-rem(2px) $outline_border;
  }

  &:active {
    color: var(--active-color);
    transform: translateY(0);
  }

  &:not(:disabled) {
    cursor: pointer;
  }
}

.default_light {
  --color: #{$grey_2};
  --hover-color: #{$grey_4};
  --active-color: #{$ash_600};
}

.default_dark {
  --color: #{$white_04};
  --hover-color: #{$white};
  --active-color: #{$ash_800};
}

.secondary_light {
  --color: #{$ash_500};
  --hover-color: #{$white};
  --active-color: #{$ash_800};
}

.secondary_dark {
  --color: #{$grey_2};
  --hover-color: #{$grey_4};
  --active-color: #{$ash_600};
}

.s_56 {
  height: px-to-rem(56px);
  min-height: px-to-rem(56px);
  padding: px-to-rem(16px) px-to-rem(32px);
}

.block {
  display: block;
  width: 100%;
}
</style>
