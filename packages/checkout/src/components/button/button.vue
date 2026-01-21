<template>
  <component :is="tag" v-bind="attrs">
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
    size: makeProp(PROP_TYPE_STRING, undefined, value =>
      arrayIncludes(['lg', 'icon'], value)
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
        this.$uiClass('style'),
        {
          [this.$style.block]: this.block,
          [this.$style[this.size]]: this.size,
        },
      ]
    },
  },
}
</script>

<style lang="scss" module>
.style {
  --_color: initial;
  --_shadow-color: initial;
  --_bg: initial;
  --_border-color: initial;

  --color: initial;
  --shadow-color: transparent;
  --bg: transparent;
  --border-color: transparent;
  --border-width: 0;

  --hover-color: initial;
  --hover-shadow-color: initial;
  --hover-bg: initial;
  --hover-border-color: initial;

  --active-color: initial;
  --active-shadow-color: initial;
  --active-bg: initial;
  --active-border-color: initial;

  color: var(--_color, var(--color));
  position: relative;
  display: inline-block;
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

  span {
    position: relative;
    z-index: 1;
  }

  &::before {
    box-shadow: 0 px-to-rem(10px) px-to-rem(25px)
      var(--_shadow-color, var(--shadow-color));
    position: absolute;
    bottom: px-to-rem(2px);
    left: 5%;
    z-index: 0;
    width: 90%;
    height: px-to-rem(32px);
    opacity: 0.6;
    content: '';
    border-radius: $border-radius-lg;
    transition: all ease-in-out 0.15s;
  }

  &::after {
    background: var(--_bg, var(--bg));
    border: var(--border-width) solid var(--_border-color, var(--border-color));
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 0;
    width: 100%;
    height: 100%;
    content: '';
    border-radius: $border-radius;
    transition: all ease-in-out 0.15s;
  }

  &:hover,
  &:focus {
    --_color: var(--hover-color);
    --_shadow-color: var(--hover-shadow-color);
    --_bg: var(--hover-bg);
    --_border-color: var(--hover-border-color);

    text-decoration: none;
    transform: translateY(px-to-rem(-2px));
  }

  &:focus-visible {
    outline: 0;
    box-shadow:
      0 0 0 px-to-rem(2px) $container_bg,
      0 0 0 px-to-rem(4px) $outline_border;
  }

  &:active {
    --_color: var(--active-color, var(--hover-color));
    --_shadow-color: var(--active-shadow-color, var(--hover-shadow-color));
    --_bg: var(--active-bg, var(--hover-bg));
    --_border-color: var(--active-border-color, var(--hover-border-color));

    transform: translateY(0);
  }

  &:disabled {
    --_shadow-color: transparent;
    --_border-color: transparent;
  }

  &:not(:disabled) {
    cursor: pointer;
  }
}

.style_light:disabled {
  --_color: #{$ash_700};
  --_bg: #{$ash_300};
}

.style_dark:disabled {
  --_color: #{$grey_9};
  --_bg: #{$white_02};
}

.block {
  display: block;
  width: 100%;
}

.lg {
  min-height: px-to-rem(56px);
  padding: px-to-rem(16px) px-to-rem(32px);
  font-size: px-to-rem(18px);
}

.icon {
  width: px-to-rem(48px);
  height: px-to-rem(48px);
  padding-right: 0;
  padding-left: 0;
}

.spin {
  position: relative;
  z-index: 1;
  margin-left: px-to-rem(4px);
}
</style>
