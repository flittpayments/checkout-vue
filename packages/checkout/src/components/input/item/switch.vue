<template>
  <div :class="className">
    <checkbox v-bind="attrs" />
    <label :class="$style.label" :for="safeId()">
      <slot>{{ $t(label) }}</slot>
    </label>
  </div>
</template>

<script>
import Checkbox from '@/components/input/helpers/checkbox'
import { idMixin, idProps } from '@/mixins/id'
import { makeProp } from '@/utils/props'
import { PROP_TYPE_STRING } from '@/constants/props'

export default {
  components: {
    Checkbox,
  },
  mixins: [idMixin],
  inheritAttrs: false,
  props: {
    ...idProps,
    label: makeProp(PROP_TYPE_STRING),
  },
  computed: {
    className() {
      return this.$uiClass('style')
    },
    attrs() {
      return {
        ...this.$attrs,
        id: this.safeId(),
        ref: 'input',
        class: this.$style.input,
      }
    },
  },
  methods: {
    focus() {
      this.$refs.input.focus()
    },
  },
}
</script>

<style lang="scss" module>
$switch-width: px-to-rem(40px);
$switch-height: px-to-rem(22px);
$switch-indicator-size: px-to-rem(16px);
$switch-indicator-transform: $switch-width - $switch-indicator-size -
  ($switch-height - $switch-indicator-size);

.style {
  position: relative;
}

.style_light {
  --bg: #{$ash_400};
  --indicator-bg: #{$white};
  --hover-bg: #{$ash_600};
  --checked-bg: #{$grey_2};
}

.style_dark {
  --bg: #{$white_02};
  --indicator-bg: #{$grey_9};
  --hover-bg: #{$white_03};
  --checked-bg: #{$white_08};
}

.input {
  position: absolute;
  left: 0;
  z-index: -1; // Put the input behind the label so it doesn't overlay text
  width: $switch-indicator-size;
  height: calc(
    ($font-size-base * $line-height-base + $switch-indicator-size) / 2
  );
  opacity: 0;

  &:checked + .label {
    &::before {
      background: var(--checked-bg);
    }

    &::after {
      box-shadow: 0 px-to-rem(2px) px-to-rem(4px) rgb(0 0 0 / 25%);
      transform: translateX($switch-indicator-transform);
    }
  }

  &:focus-visible + .label {
    background: $outline_bg;
    box-shadow:
      0 0 0 px-to-rem(2px) $container_bg,
      0 0 0 px-to-rem(3.5px) $outline_border;
  }
}

.label {
  $padding: px-to-rem(3px);

  position: relative;
  right: -$padding;
  display: block;
  min-height: $switch-height + $padding * 2;
  padding: $padding $switch-width + $padding $padding $padding;
  cursor: pointer;
  transition:
    box-shadow ease-in-out 0.15s,
    background ease-in-out 0.15s;
  border-radius: $border-radius-sm;

  &::before {
    position: absolute;
    top: calc(($font-size-base * $line-height-base - $switch-height) / 2) +
      $padding;
    right: $padding;
    display: block;
    width: $switch-width;
    height: $switch-height;
    pointer-events: all;
    content: '';
    background: var(--bg);
    border-radius: $border-radius-lg;
    transition: background ease-in-out 0.15s;
  }

  &::after {
    position: absolute;
    top: calc(
        ($font-size-base * $line-height-base - $switch-indicator-size) / 2
      ) +
      $padding;
    right: $switch-width -
      $switch-indicator-size - calc(
        ($switch-height - $switch-indicator-size) / 2
      ) +
      $padding;
    width: $switch-indicator-size;
    height: $switch-indicator-size;
    content: '';
    background: var(--indicator-bg);
    border-radius: $border-radius;
    box-shadow: 0 2px 4px rgb(0 0 0 / 25%);
    transition:
      transform ease-in-out 0.15s,
      box-shadow ease-in-out 0.15s;
  }

  &:hover {
    &::before {
      background: var(--hover-bg);
    }

    &::after {
      box-shadow: 0 px-to-rem(2px) px-to-rem(4px) rgb(0 0 0 / 25%);
    }
  }
}
</style>
