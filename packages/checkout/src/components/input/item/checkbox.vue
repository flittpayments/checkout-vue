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
      return [this.$style.wrapper, this.$uiClass(this.variant)]
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
.default_light {
  --bg: #{$white};
  --border-color: #{$ash_800};
  --hover-bg: #{$ash_300};
  --hover-color: #{$ash_500};
  --checked-bg: #{$grey_2};
  --checked-color: #{$white};
  --label-color: #{$grey_1};
}

.default_dark {
  --bg: #{$white_005};
  --border-color: #{$white_04};
  --hover-bg: #585b5f;
  --hover-color: #{$white_01};
  --checked-bg: #{$white};
  --checked-color: #{$grey_9};
  --label-color: #{$white_04};
}

.secondary_light {
  --bg: #{$white};
  --border-color: #{$ash_500};
  --hover-bg: #{$grey_2};
  --hover-color: #{$grey_1};
  --checked-bg: #{$white};
  --checked-color: #6a747e;
  --label-color: #{$white};
}

.secondary_dark {
  --bg: #{$white};
  --border-color: #{$ash_800};
  --hover-bg: #{$ash_300};
  --hover-color: #{$ash_500};
  --checked-bg: #{$grey_2};
  --checked-color: #{$white};
  --label-color: #{$grey_2};
}

.style {
  position: relative;
}

.input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;

  &:checked + .label {
    &::before {
      background: var(--checked-bg);
      border-color: transparent;
    }

    &::after {
      border-color: var(--checked-color);
      opacity: 1;
      transform: rotate(-45deg) scale(1);
    }
  }

  &:focus-visible + .label {
    background: $outline_bg;
    box-shadow:
      0 0 0 px-to-rem(2px) $container_bg,
      0 0 0 px-to-rem(3.5px) $outline_border;
  }

  &[disabled] + .label {
    cursor: default;

    &::before {
      background: var(--bg);
      border-color: var(--border-color);
    }

    &::after {
      opacity: 0;
    }
  }
}

.label {
  color: var(--label-color);
  position: relative;
  display: block;
  padding: 0 0 0 px-to-rem(30px);
  font-size: px-to-rem(16px);
  line-height: px-to-rem(20px);
  word-wrap: break-word;
  cursor: pointer;
  transition:
    box-shadow ease-in-out 0.15s,
    background ease-in-out 0.15s;
  border-radius: $border-radius-sm;

  &::before {
    background: var(--bg);
    border-color: var(--border-color);
    position: absolute;
    top: 0;
    left: 0;
    width: px-to-rem(20px);
    height: px-to-rem(20px);
    content: '';
    border-style: solid;
    border-width: px-to-rem(1.5px);
    border-radius: $border-radius-sm;
    transition:
      background ease-in-out 0.15s,
      border-color ease-in-out 0.15s;
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
    transition:
      opacity 0.15s ease-out,
      transform 0.2s ease-out;
    transform: rotate(-45deg) scale(0.6);
    will-change: opacity, transform;
  }

  &:hover {
    &::before {
      background: var(--hover-bg);
    }

    &::after {
      border-color: var(--hover-color);
      opacity: 1;
      transform: rotate(-45deg) scale(1);
    }
  }
}

.label_sm {
  font-size: px-to-rem(12px);
  line-height: px-to-rem(22px);
}

.error + .label::before {
  border-color: $error;
}
</style>
