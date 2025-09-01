<template>
  <div :class="className">
    <checkbox v-bind="attrs" v-on="$listeners" />
    <label :class="classLabel" :for="safeId()">
      <slot>{{ $t(label) }}</slot>
    </label>
  </div>
</template>

<script>
import Checkbox from '@/components/input/helpers/checkbox'
import { idMixin, idProps } from '@/mixins/id'
import { makeProp } from '@/utils/props'
import { PROP_TYPE_BOOLEAN, PROP_TYPE_STRING } from '@/constants/props'

export default {
  components: {
    Checkbox,
  },
  mixins: [idMixin],
  inheritAttrs: false,
  props: {
    ...idProps,
    // required for ValidationProvider
    value: makeProp(PROP_TYPE_BOOLEAN, false),
    invalid: makeProp(PROP_TYPE_BOOLEAN),
    variant: makeProp(PROP_TYPE_STRING, 'default', value =>
      ['default', 'secondary'].includes(value)
    ),
    size: makeProp(PROP_TYPE_STRING, undefined, value =>
      ['sm'].includes(value)
    ),
    label: makeProp(PROP_TYPE_STRING),
  },
  computed: {
    className() {
      return this.$style.wrapper
    },
    attrs() {
      return {
        ...this.$attrs,
        // required for ValidationProvider
        value: this.value,
        id: this.safeId(),
        ref: 'input',
        class: this.classInput,
      }
    },
    classInput() {
      return [
        this.$style.input,
        this.$style[this.variant],
        {
          [this.$style.error]: this.invalid,
        },
      ]
    },
    classLabel() {
      return [this.$style.label, this.$style[`label_${this.size}`]]
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
@mixin checkbox-variant(
  $bg,
  $border,
  $bg-hover,
  $border-hover,
  $color-hover,
  $bg-checked,
  $color-checked,
  $color-label
) {
  + .label {
    color: $color-label;

    &::before {
      background-color: $bg;
      border-color: $border;
    }

    &:hover {
      &::before {
        background-color: $bg-hover;
        border-color: $border-hover;
      }

      &::after {
        border-color: $color-hover;
      }
    }
  }

  &:checked + .label {
    &::before {
      background-color: $bg-checked;
    }

    &::after {
      border-color: $color-checked;
    }
  }

  &[disabled] + .label {
    cursor: default;

    &::before {
      background-color: $bg;
      border-color: $border;
    }

    &::after {
      opacity: 0;
    }
  }
}

.style {
  position: relative;
}

.input {
  position: absolute;
  z-index: 1;
  width: px-to-rem(20px);
  opacity: 0;

  &:checked + .label {
    &::before {
      border: none;
    }

    &::after {
      opacity: 1;
    }
  }

  &:focus-visible + .label {
    background-color: $outline_bg;
    box-shadow:
      0 0 0 px-to-rem(2px) $container_bg,
      0 0 0 px-to-rem(3.5px) $outline_border;
  }
}

.label {
  position: relative;
  display: block;
  padding: 0 0 0 px-to-rem(30px) + 0;
  font-size: px-to-rem(16px);
  line-height: px-to-rem(20px);
  word-wrap: break-word;
  cursor: pointer;
  transition:
    box-shadow ease-in-out 0.15s,
    background-color ease-in-out 0.15s;
  border-radius: $border-radius-sm;

  &::before {
    position: absolute;
    top: 0;
    left: 0;
    width: px-to-rem(20px);
    height: px-to-rem(20px);
    content: '';
    border-style: solid;
    border-width: px-to-rem(1.5px);
    border-radius: $border-radius-sm;
    transition: background-color ease-in-out 0.15s;
  }

  &::after {
    position: absolute;
    top: px-to-rem(5px);
    left: px-to-rem(5px);
    width: px-to-rem(10px);
    height: px-to-rem(7px);
    content: '';
    background: transparent;
    border-style: solid;
    border-width: px-to-rem(2px);
    border-top: none;
    border-right: none;
    opacity: 0;
    transition: opacity ease-in-out 0.15s;
    transform: rotate(-45deg);
  }

  &:hover {
    &::after {
      opacity: 1;
    }
  }
}

.label_sm {
  font-size: px-to-rem(12px);
  line-height: px-to-rem(22px);
}

.default {
  @include checkbox-variant(
    $input_bg,
    $checkbox_default_border,
    $checkbox_default_hover_bg,
    $checkbox_default_hover_border,
    $checkbox_default_hover_color,
    $checkbox_default_checked_bg,
    $checkbox_default_checked_color,
    $label_color
  );
}

.secondary {
  @include checkbox-variant(
    $white,
    $checkbox_secondary_border,
    $checkbox_secondary_hover_bg,
    $checkbox_secondary_hover_border,
    $checkbox_secondary_hover_color,
    $checkbox_secondary_checked_bg,
    $checkbox_secondary_checked_color,
    $checkbox_secondary_label_color
  );
}

.error + .label::before {
  border-color: $error;
}
</style>
